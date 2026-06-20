# E-Commerce Application Architecture

## Entity Relationship Diagram

```mermaid
erDiagram
    %% ========================
    %% USER & AUTH DOMAIN
    %% ========================
    User {
        ObjectId _id PK
        string name
        string email UK
        string password
        enum   role "customer | admin | support | marketing | inventory"
        string avatar
        string phoneNumber
        string address
        array  addresses "UserAddress[] embedded"
        object preferences "UserPreferences embedded"
        array  fcmTokens "FcmToken[] embedded"
        boolean active
        string verificationCode
        date   passwordResetVerifiedAt
        enum   gender "male | female"
    }

    RefreshToken {
        ObjectId _id PK
        ObjectId userId FK
        string tokenHash UK
        date   expiresAt TTL
        boolean revoked
    }

    %% ========================
    %% CATALOG DOMAIN
    %% ========================
    Category {
        ObjectId _id PK
        string name UK
        string image
        ObjectId taxRule FK "optional"
    }

    SubCategory {
        ObjectId _id PK
        string name UK
        ObjectId category FK
    }

    Brand {
        ObjectId _id PK
        string name UK
        string image
    }

    Product {
        ObjectId _id PK
        string title UK
        string slug UK
        string description
        map    translations "Record<locale, {title, description}>"
        number quantity
        string imageCover
        array  images
        number sold
        number price
        number priceAfterDiscount "optional"
        array  colors
        array  variants "ProductVariant[] embedded"
        string sku
        boolean trackInventory
        number lowStockThreshold
        string baseCurrency
        boolean isActive
        ObjectId category FK
        ObjectId subCategory FK "optional"
        ObjectId brand FK "optional"
        number ratingsAverage
        number ratingsQuantity
    }

    InventoryLedger {
        ObjectId _id PK
        ObjectId productId FK
        string variantSku "optional"
        number delta "can be negative"
        string reason
        string referenceType "sale | adjustment | return"
        string referenceId
        number balanceAfter
    }

    InventoryReservation {
        ObjectId _id PK
        string reservationId UK
        ObjectId productId FK
        string variantSku "optional"
        number quantity
        string cartId "optional"
        string orderId "optional"
        date   expiresAt TTL
        enum   status "active | committed | released"
    }

    %% ========================
    %% REVIEW DOMAIN
    %% ========================
    Review {
        ObjectId _id PK
        ObjectId product FK
        ObjectId user FK
        number rating "1-5"
        string comment
        boolean isActive
    }

    %% ========================
    %% CART DOMAIN
    %% ========================
    Cart {
        ObjectId _id PK
        string cartId UK "UUID"
        string userId "optional, for auth users"
        string guestId "optional, for guests"
        array  items "CartItem[] embedded"
        string currency
        string locale
        date   expiresAt "30-day TTL for guest carts"
    }

    %% ========================
    %% ORDER DOMAIN
    %% ========================
    Order {
        ObjectId _id PK
        string orderNumber UK "EG-YYYY-XXXXXX"
        ObjectId userId FK "optional"
        string guestEmail "optional"
        string guestPhone "optional"
        enum   status "pending_payment | confirmed | processing | shipped | delivered | return_requested | refunded | cancelled"
        array  items "OrderLineItem[] embedded"
        object pricing "OrderPricing embedded"
        object shippingAddress "Address embedded"
        object billingAddress "Address embedded, optional"
        enum   paymentMethod "cod | kashier"
        enum   paymentStatus "pending | paid | failed | refunded | partial_refund"
        object shipping "{zoneId, methodId, cost, estimatedDelivery}"
        string couponCode "optional"
        string notes "optional"
        array  timeline "OrderTimelineEntry[] embedded"
        string idempotencyKey
    }

    Payment {
        ObjectId _id PK
        ObjectId orderId FK
        string provider "kashier | cod"
        string providerRef "optional"
        number amount
        string currency
        enum   status "pending | paid | failed | refunded | partial_refund"
        string idempotencyKey UK "sparse"
        object rawWebhookPayload
        date   paidAt "optional"
    }

    ReturnRequest {
        ObjectId _id PK
        string returnNumber UK "RMA-{timestamp}"
        ObjectId orderId FK
        ObjectId userId FK "optional"
        string guestEmail "optional"
        array  items "ReturnItem[] embedded"
        enum   status "requested | approved | rejected | received | refunded"
        object refund "{amount, method, providerRef}"
    }

    %% ========================
    %% SHIPPING & TAX DOMAIN
    %% ========================
    ShippingZone {
        ObjectId _id PK
        string name
        array  countries
        boolean isActive
    }

    ShippingMethod {
        ObjectId _id PK
        ObjectId zoneId FK
        string name
        enum   type "flat | weight_based | free_over_threshold"
        object rules "{minOrder, maxWeight, rate, freeShippingThreshold, cities}"
        number estimatedDaysMin
        number estimatedDaysMax
        boolean isActive
    }

    TaxRule {
        ObjectId _id PK
        string name
        enum   taxClass "standard | exempt" UK
        number rate "0-100"
        boolean appliesToShipping
        boolean isActive
    }

    %% ========================
    %% PRICING & COUPONS
    %% ========================
    Coupon {
        ObjectId _id PK
        string name UK
        date   expiryDate
        number discount "0-100 percentage"
    }

    Currency {
        ObjectId _id PK
        string code UK "EGP, USD, EUR"
        string symbol
        number decimals
        boolean isDefault
        boolean isActive
    }

    ExchangeRate {
        ObjectId _id PK
        string base "EGP"
        string quote FK
        number rate
        string source "manual"
        date   effectiveAt
    }

    %% ========================
    %% SUPPLIER & REQUESTS
    %% ========================
    Supplier {
        ObjectId _id PK
        string name UK
        string website
    }

    RequestProduct {
        ObjectId _id PK
        string titleNeed
        string details
        number quantity
        string category "optional"
        ObjectId user FK
    }

    %% ========================
    %% MARKETING
    %% ========================
    Campaign {
        ObjectId _id PK
        string name
        string subject
        string templateId
        object segmentQuery "optional"
        enum   status "draft | scheduled | sending | sent"
        date   scheduledAt "optional"
        object stats "{sent, opened, clicked, failed}"
    }

    CampaignRecipient {
        ObjectId _id PK
        string campaignId
        string email
        string userId "optional"
        string status "pending"
        date   sentAt "optional"
        date   openedAt "optional"
    }

    Notification {
        ObjectId _id PK
        ObjectId userId FK "optional"
        string guestId "optional"
        enum   channel "email | push"
        string template
        object payload
        string status "pending"
        date   sentAt "optional"
    }

    %% ========================
    %% REPORTING
    %% ========================
    DailySalesSummary {
        ObjectId _id PK
        string date
        string country "EG"
        string currency "EGP"
        number ordersCount
        number grossRevenue
        number netRevenue
        number refunds
        number avgOrderValue
    }
```

## Model Relationships (Foreign Keys & References)

```mermaid
erDiagram
    %% ────────────────────────────────────────────
    %% RELATIONSHIPS - SECTION 1: USER & AUTH
    %% ────────────────────────────────────────────
    User ||--o{ RefreshToken : "userId (1:N)"
    User ||--o{ Review : "user (1:N)"
    User ||--o{ Order : "userId (1:N)"
    User ||--o{ RequestProduct : "user (1:N)"
    User ||--o{ Notification : "userId (1:N)"
    User ||--o{ Cart : "userId (1:N)"
    User ||--o{ ReturnRequest : "userId (1:N)"

    %% ────────────────────────────────────────────
    %% RELATIONSHIPS - SECTION 2: CATALOG
    %% ────────────────────────────────────────────
    Category ||--o{ Product : "category (1:N)"
    Category ||--o{ SubCategory : "category (1:N)"
    Category }o--o| TaxRule : "taxRule (N:1, optional)"

    SubCategory ||--o{ Product : "subCategory (1:N, optional)"
    Brand ||--o{ Product : "brand (1:N, optional)"

    Product ||--o{ Review : "product (1:N)"
    Product ||--o{ InventoryLedger : "productId (1:N)"
    Product ||--o{ InventoryReservation : "productId (1:N)"

    %% ────────────────────────────────────────────
    %% RELATIONSHIPS - SECTION 3: ORDER & PAYMENT
    %% ────────────────────────────────────────────
    Order ||--o{ Payment : "orderId (1:N)"
    Order ||--o{ ReturnRequest : "orderId (1:N)"

    %% ────────────────────────────────────────────
    %% RELATIONSHIPS - SECTION 4: SHIPPING
    %% ────────────────────────────────────────────
    ShippingZone ||--o{ ShippingMethod : "zoneId (1:N)"

    %% ────────────────────────────────────────────
    %% RELATIONSHIPS - SECTION 5: CURRENCY
    %% ────────────────────────────────────────────
    Currency ||--o{ ExchangeRate : "quote (1:N)"

    %% ────────────────────────────────────────────
    %% RELATIONSHIPS - SECTION 6: CAMPAIGN
    %% ────────────────────────────────────────────
    Campaign ||--o{ CampaignRecipient : "campaignId (1:N)"
```

## Core Shopping Flow

```mermaid
flowchart TD
    %% ── Users ──
    U[User] -->|browses| Catalog[Catalog API<br/>GET /catalog/products]
    U -->|views| PDP[Product Detail<br/>GET /catalog/products/:slug]

    %% ── Cart ──
    U -->|adds to cart| Cart[Cart API]
    Cart -->|guest| GuestCart[POST /cart/guest<br/>→ guest_id cookie]
    Cart -->|authenticated| AuthCart[POST /cart/items<br/>with JWT]

    %% ── Checkout ──
    U -->|proceeds to| Checkout[Checkout Preview<br/>POST /checkout/preview]
    Checkout -->|calculates| Pricing{PricingService}
    Pricing -->|subtotal| S[Subtotal]
    Pricing -->|discount| Coupon[Coupon Engine]
    Pricing -->|tax| Tax[Tax Engine<br/>category-linked tax rules]
    Pricing -->|shipping| Ship[Shipping Engine<br/>zone + method]

    %% ── Place Order ──
    U -->|places order| PlaceOrder[POST /orders]
    PlaceOrder -->|reserve inventory| Inv[InventoryService]
    PlaceOrder -->|create order| OrderDB[(Order created)]

    %% ── Payment ──
    OrderDB -->|COD| COD[Status: confirmed<br/>Inventory committed]
    OrderDB -->|Kashier| Kashier[POST /payments/kashier/session]
    Kashier -->|redirect| PaymentPage[Kashier Payment Page]
    PaymentPage -->|success| Webhook[Kashier Webhook]
    Webhook -->|verify| Confirm[Confirm Payment<br/>→ Status: confirmed<br/>→ Inventory committed]
    PaymentPage -->|fail| Fail[Order: cancelled<br/>BullMQ releases reservation<br/>after 15 min TTL]

    %% ── Post-Order ──
    Confirm -->|admin updates| ShipProcess[Processing → Shipped → Delivered]
    Delivered -->|customer requests| Return[POST /returns]
    Return -->|admin approves| ReturnProcess[Approved → Received → Refunded]
    ReturnProcess -->|auto| Restock[Inventory Restocked]

    style Catalog fill:#e6f3ff
    style Pricing fill:#fff3e6
    style Inv fill:#ffe6e6
    style Confirm fill:#e6ffe6
    style Webhook fill:#ffe6ff
```

## Admin Operations Flow

```mermaid
flowchart TD
    Admin[Admin User] --> Dashboard[Dashboard<br/>Overview Metrics]

    Admin --> ProductMgmt[Product Management]
    ProductMgmt -->|CRUD| ProductAPI[POST/PATCH/DELETE /product]
    ProductMgmt -->|Categories| CatAPI[POST/PATCH/DELETE /category]
    ProductMgmt -->|Brands| BrandAPI[POST/PATCH/DELETE /brand]

    Admin --> OrderMgmt[Order Management]
    OrderMgmt -->|list/filter| ListOrders[GET /admin/orders]
    OrderMgmt -->|update status| UpdateStatus[PATCH /admin/orders/:id/status]
    UpdateStatus --> Timeline[Status Flow:<br/>confirmed→processing→shipped→delivered]

    Admin --> InventoryMgmt[Inventory Management]
    InventoryMgmt -->|view stock| Stock[GET /admin/inventory/products/:id]
    InventoryMgmt -->|low stock alerts| LowStock[GET /admin/inventory/low-stock]
    InventoryMgmt -->|adjust stock| Adjust[POST /admin/inventory/adjustments<br/>audited in InventoryLedger]

    Admin --> ReturnMgmt[Return Management]
    ReturnMgmt -->|list returns| ListReturns[GET /admin/returns]
    ReturnMgmt -->|approve/reject| ReturnStatus[PATCH /admin/returns/:id/status]
    ReturnStatus -->|refunded| Restock[Auto restock inventory]

    Admin --> TaxMgmt[Tax Management]
    TaxMgmt -->|CRUD tax rules| TaxAPI[POST/PATCH/DELETE /tax]

    Admin --> CampaignMgmt[Campaign Management]
    CampaignMgmt -->|create| CreateCamp[POST /admin/campaigns]
    CampaignMgmt -->|send| SendCamp[POST /admin/campaigns/:id/send]
    SendCamp -->|queues emails| BullMQ[BullMQ → Email Queue]
    CampaignMgmt -->|stats| Stats[GET /admin/campaigns/:id/stats]

    Admin --> Reports[Reports & Analytics]
    Reports -->|overview| Overview[GET /admin/reports/overview]
    Reports -->|sales breakdown| Sales[GET /admin/reports/sales]

    style Admin fill:#ffe6e6
    style ProductMgmt fill:#e6f3ff
    style OrderMgmt fill:#e6ffe6
    style InventoryMgmt fill:#fff3e6
    style Reports fill:#f0e6ff
```

## Background Job Queues (BullMQ)

```mermaid
flowchart LR
    subgraph Queues["BullMQ Queues (Redis)"]
        Q1[email Queue]
        Q2[order Queue]
        Q3[payment Queue]
        Q4[push Queue]
        Q5[reporting Queue]
        Q6[inventory Queue]
    end

    subgraph Processors["Job Processors"]
        P1[EmailProcessor]
        P2[OrderProcessor<br/>Payment timeout→cancel order]
        P3[PaymentProcessor]
        P4[PushProcessor<br/>Firebase FCM]
        P5[ReportingProcessor<br/>Daily sales aggregation]
        P6[InventoryProcessor<br/>Release expired reservations]
    end

    Q1 --> P1
    Q2 --> P2
    Q3 --> P3
    Q4 --> P4
    Q5 --> P5
    Q6 --> P6

    subgraph Cron["Cron Schedules"]
        C1[Every 5 min<br/>inventory:release-expired]
        C2[Every 24h<br/>reporting:aggregate-daily]
    end

    C1 --> Q6
    C2 --> Q5

    P6 -->|release stock| Product[(Product Stock)]
    P5 -->|write| Summary[(DailySalesSummary)]
    P2 -->|cancel order| Order[(Order)]
    P2 -->|release| P6
```

## Complete API Map

```mermaid
flowchart LR
    subgraph Auth["Auth Module"]
        A1[POST /auth/sign-up]
        A2[POST /auth/sign-in]
        A3[POST /auth/logout]
        A4[POST /auth/refresh]
        A5[GET /auth/me]
        A6[POST /auth/reset-password]
        A7[POST /auth/verify-code]
        A8[POST /auth/change-password]
    end

    subgraph Users["Users Module"]
        U1[GET /users]
        U2[POST /users]
        U3[GET /users/:id]
        U4[PATCH /users/:id]
        U5[DELETE /users/:id]
        U6[GET /user/me]
        U7[PATCH /user/me]
        U8[DELETE /user/me]
    end

    subgraph Catalog["Catalog Module"]
        C1[GET /catalog/products]
        C2[GET /catalog/products/:slug]
    end

    subgraph Products["Product Module"]
        P1[GET /product]
        P2[GET /product/:id]
        P3[POST /product]
        P4[PATCH /product/:id]
        P5[DELETE /product/:id]
    end

    subgraph Cart["Cart Module"]
        CT1[POST /cart/guest]
        CT2[GET /cart]
        CT3[POST /cart/items]
        CT4[POST /cart/merge]
    end

    subgraph Checkout["Checkout Module"]
        CH1[POST /checkout/preview]
    end

    subgraph Orders["Order Module"]
        O1[POST /orders]
        O2[GET /orders]
        O3[GET /orders/track]
        O4[GET /orders/:id]
        O5[GET /admin/orders]
        O6[PATCH /admin/orders/:id/status]
    end

    subgraph Payments["Payment Module"]
        PM1[POST /payments/kashier/session]
        PM2[POST /payments/kashier/webhook]
        PM3[GET /payments/kashier/callback]
        PM4[POST /payments/cod/confirm]
    end

    subgraph Reviews["Review Module"]
        R1[GET /review/product/:id]
        R2[GET /review/user/:id]
        R3[POST /review]
        R4[PATCH /review/:id]
        R5[DELETE /review/:id]
    end

    subgraph Returns["Return Module"]
        RT1[POST /returns]
        RT2[GET /returns/order/:orderId]
        RT3[GET /admin/returns]
        RT4[PATCH /admin/returns/:id/status]
    end

    subgraph Inventory["Inventory Module - Admin"]
        I1[GET /admin/inventory/products/:id]
        I2[GET /admin/inventory/low-stock]
        I3[POST /admin/inventory/adjustments]
    end

    subgraph Campaigns["Campaign Module - Admin"]
        CA1[POST /admin/campaigns]
        CA2[GET /admin/campaigns]
        CA3[GET /admin/campaigns/:id]
        CA4[PATCH /admin/campaigns/:id]
        CA5[DELETE /admin/campaigns/:id]
        CA6[POST /admin/campaigns/:id/send]
        CA7[GET /admin/campaigns/:id/stats]
    end

    subgraph Reports["Report Module - Admin"]
        RP1[GET /admin/reports/overview]
        RP2[GET /admin/reports/sales]
    end

    subgraph Misc["Other"]
        M1[POST /notifications/devices]
        M2[GET /health]
        M3[GET /category]
        M4[POST /category]
        M5[PATCH /category/:id]
        M6[DELETE /category/:id]
        M7[GET /brand]
        M8[POST /brand]
        M9[PATCH /brand/:id]
        M10[DELETE /brand/:id]
        M11[GET /currencies]
    end
```

## Technology Stack

```mermaid
flowchart TD
    subgraph Frontend["Frontend - apps/web"]
        Next[Next.js 15<br/>Turbopack]
        React[React 19]
        Redux[Redux Toolkit<br/>+ Redux Persist]
        RQ[TanStack React Query]
        TW[Tailwind CSS]
        Radix[Radix UI]
        i18n[next-intl<br/>ar/en]
    end

    subgraph Backend["Backend - apps/api"]
        Nest[NestJS 11]
        Mongoose[Mongoose 9<br/>ODM]
        JWT[JWT Auth<br/>Access + Refresh Rotation]
        Bull[BullMQ<br/>Job Queues]
        Cache[Redis Cache<br/>cache-manager]
    end

    subgraph Infrastructure["Infrastructure"]
        Mongo[(MongoDB 7)]
        Redis[(Redis 7)]
        Firebase[Firebase Admin<br/>Push Notifications]
        MailHog[MailHog<br/>Dev Email]
        Kashier[Kashier<br/>Payment Gateway]
    end

    subgraph Monorepo["Monorepo Tooling"]
        PNPM[pnpm 9]
        Turbo[Turborepo]
        Swagger[Swagger / OpenAPI]
    end

    Frontend <-->|HTTP/REST| Backend
    Backend <--> Mongo
    Backend <--> Redis
    Backend --> Firebase
    Backend --> Kashier
    Backend --> MailHog
    Bull <--> Redis

    style Frontend fill:#e6f3ff
    style Backend fill:#f0e6ff
    style Infrastructure fill:#fff3e6
    style Monorepo fill:#e6ffe6
```
