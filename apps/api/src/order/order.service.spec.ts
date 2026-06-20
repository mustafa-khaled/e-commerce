import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { getQueueToken } from '@nestjs/bullmq';
import { OrderService } from './order.service';
import { PricingService } from '@/pricing/pricing.service';
import { InventoryService } from '@/inventory/inventory.service';
import { NotificationService } from '@/notification/notification.service';
import { PaymentMethod } from '@ee/shared-types';

describe('OrderService inventory flow', () => {
  let service: OrderService;
  const orderId = 'order123';
  const mockOrder = {
    _id: orderId,
    orderNumber: 'EG-2026-123456',
    save: jest.fn().mockResolvedValue(true),
  };

  const orderModel = {
    findOne: jest.fn(),
    create: jest.fn().mockResolvedValue(mockOrder),
    findById: jest.fn(),
    findByIdAndDelete: jest.fn(),
  };

  const inventoryService = {
    reserve: jest.fn().mockResolvedValue({}),
    commitReservations: jest.fn().mockResolvedValue(undefined),
    releaseReservations: jest.fn().mockResolvedValue(undefined),
  };

  const pricingService = {
    calculate: jest.fn().mockResolvedValue({
      subtotal: 100,
      discount: 0,
      tax: 0,
      shipping: 10,
      total: 110,
      currency: 'EGP',
    }),
  };

  const orderQueue = {
    add: jest.fn().mockResolvedValue({}),
    getJob: jest.fn().mockResolvedValue(null),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        { provide: getModelToken('Order'), useValue: orderModel },
        { provide: PricingService, useValue: pricingService },
        { provide: InventoryService, useValue: inventoryService },
        { provide: NotificationService, useValue: { sendOrderConfirmation: jest.fn() } },
        { provide: getQueueToken('order'), useValue: orderQueue },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
  });

  it('reserves inventory with real orderId after order creation', async () => {
    const dto = {
      items: [{ productId: 'prod1', quantity: 2, unitPrice: 50 }],
      shippingAddress: { fullName: 'A', phone: '1', country: 'EG', city: 'Cairo', street: 'St' },
      paymentMethod: PaymentMethod.COD,
      shippingMethodId: 'ship1',
      currency: 'EGP',
      guestEmail: 'a@test.com',
    };

    await service.create(dto as never);

    expect(inventoryService.reserve).toHaveBeenCalledWith(
      'prod1',
      2,
      undefined,
      { orderId },
    );
    expect(inventoryService.commitReservations).toHaveBeenCalledWith(orderId);
  });

  it('schedules payment timeout for kashier orders', async () => {
    const dto = {
      items: [{ productId: 'prod1', quantity: 1, unitPrice: 50 }],
      shippingAddress: { fullName: 'A', phone: '1', country: 'EG', city: 'Cairo', street: 'St' },
      paymentMethod: PaymentMethod.KASHIER,
      shippingMethodId: 'ship1',
      currency: 'EGP',
      guestEmail: 'a@test.com',
    };

    await service.create(dto as never);

    expect(orderQueue.add).toHaveBeenCalledWith(
      'release-reservation',
      { orderId },
      expect.objectContaining({ jobId: `payment-timeout-${orderId}` }),
    );
    expect(inventoryService.commitReservations).not.toHaveBeenCalled();
  });
});
