import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { Cart } from './cart.schema';
import { Product, ProductDocument } from '@/product/product.schema';
import { InventoryService } from '@/inventory/inventory.service';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<Cart>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    private inventoryService: InventoryService,
  ) {}

  async getOrCreateGuestCart(guestId?: string) {
    const id = guestId || uuidv4();
    let cart = await this.cartModel.findOne({ guestId: id });
    if (!cart) {
      cart = await this.cartModel.create({
        cartId: uuidv4(),
        guestId: id,
        items: [],
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      });
    }
    return { cart, guestId: id };
  }

  async getCart(userId?: string, guestId?: string) {
    if (userId) {
      let cart = await this.cartModel.findOne({ userId });
      if (!cart) {
        cart = await this.cartModel.create({ cartId: uuidv4(), userId, items: [] });
      }
      return cart;
    }
    const { cart } = await this.getOrCreateGuestCart(guestId);
    return cart;
  }

  async addItem(
    cartId: string,
    productId: string,
    quantity: number,
    variantSku?: string,
  ) {
    const product = await this.productModel.findById(productId);
    if (!product || !product.isActive) {
      throw new Error('Product not found');
    }

    const cart = await this.cartModel.findOne({ cartId });
    if (!cart) throw new Error('Cart not found');

    const existing = cart.items.find(
      (i) => i.productId === productId && i.variantSku === variantSku,
    );
    const newQty = (existing?.quantity ?? 0) + quantity;

    if (newQty <= 0) {
      cart.items = cart.items.filter(
        (i) => !(i.productId === productId && i.variantSku === variantSku),
      );
      await cart.save();
      return cart;
    }

    const available = await this.inventoryService.getAvailable(productId, variantSku);
    if (available < newQty) {
      throw new Error('Insufficient stock');
    }

    let unitPrice = product.priceAfterDiscount || product.price;
    if (variantSku && product.variants?.length) {
      const variant = product.variants.find((v) => v.sku === variantSku);
      unitPrice = variant?.priceAfterDiscount || variant?.price || unitPrice;
    }

    if (existing) {
      existing.quantity = newQty;
    } else {
      cart.items.push({
        productId,
        variantSku,
        quantity: newQty,
        unitPrice,
        title: product.title,
        image: product.imageCover,
      });
    }
    await cart.save();
    return cart;
  }

  async mergeGuestToUser(guestId: string, userId: string) {
    const guestCart = await this.cartModel.findOne({ guestId });
    if (!guestCart || guestCart.items.length === 0) return this.getCart(userId);

    let userCart = await this.cartModel.findOne({ userId });
    if (!userCart) {
      guestCart.userId = userId;
      guestCart.guestId = undefined;
      await guestCart.save();
      return guestCart;
    }

    for (const item of guestCart.items) {
      const existing = userCart.items.find(
        (i) => i.productId === item.productId && i.variantSku === item.variantSku,
      );
      if (existing) existing.quantity += item.quantity;
      else userCart.items.push(item);
    }
    await userCart.save();
    await guestCart.deleteOne();
    return userCart;
  }
}
