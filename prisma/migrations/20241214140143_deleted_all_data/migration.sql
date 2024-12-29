-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('SUPERADMIN', 'ADMIN', 'VENDOR', 'CUSTOMER');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'DELETED');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ProductType" AS ENUM ('CLOTHING', 'ELECTRONICS', 'OTHERS');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED', 'DECLINED', 'EXPIRED_CARD', 'REFUNDED', 'PARTIALLY_REFUNDED', 'CHARGEBACK_PENDING', 'CHARGEBACK_RESOLVED', 'VERIFIED', 'UNVERIFIED');

-- CreateEnum
CREATE TYPE "FlashSaleStatus" AS ENUM ('SCHEDULED', 'ACTIVE', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "LoginType" AS ENUM ('WEB', 'MOBILE', 'API');

-- CreateEnum
CREATE TYPE "PasswordResetStatus" AS ENUM ('PENDING', 'USED', 'EXPIRED');

-- CreateTable
CREATE TABLE "PasswordResetToken" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "status" "PasswordResetStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PasswordResetToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "needPasswordChange" BOOLEAN NOT NULL DEFAULT true,
    "lastPasswordChange" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "passwordAttempts" INTEGER NOT NULL DEFAULT 0,
    "isLocked" BOOLEAN NOT NULL DEFAULT false,
    "lockoutEnd" TIMESTAMP(3),
    "role" "UserRole" NOT NULL,
    "name" TEXT NOT NULL,
    "profilePicture" TEXT,
    "phoneNumber" TEXT,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zipCode" TEXT,
    "country" TEXT,
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "suspensionReason" TEXT,
    "suspendedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),
    "lastLogin" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "passwordHistory" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "hashedPassword" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "passwordHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vendors" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "shopName" TEXT NOT NULL,
    "shopLogo" TEXT,
    "description" TEXT,
    "isBlacklisted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vendors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "vendorEmail" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "categoryId" TEXT NOT NULL,
    "type" "ProductType" NOT NULL,
    "inventory" INTEGER NOT NULL,
    "images" TEXT[],
    "discount" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clothingProduct" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "material" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "gender" TEXT,

    CONSTRAINT "clothingProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "electronicsProduct" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "specifications" JSONB NOT NULL,

    CONSTRAINT "electronicsProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flashSales" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "status" "FlashSaleStatus" NOT NULL DEFAULT 'SCHEDULED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "flashSales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flashSaleProducts" (
    "id" TEXT NOT NULL,
    "flashSaleId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "specialPrice" DOUBLE PRECISION NOT NULL,
    "discountPercentage" DOUBLE PRECISION NOT NULL,
    "stockLimit" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "flashSaleProducts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT NOT NULL DEFAULT 'No Icon',
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cartItems" (
    "customerEmail" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cartItems_pkey" PRIMARY KEY ("customerEmail","productId")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "paymentMethod" TEXT,
    "shoppingAddress" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orderItems" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "orderItems_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentHistory" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "transactionId" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaymentHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "follows" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "follows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recentViews" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "recentViews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "userLoginHistory" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "loginAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ipAddress" TEXT NOT NULL,
    "deviceInfo" JSONB NOT NULL,
    "location" TEXT,
    "isSuccessful" BOOLEAN NOT NULL DEFAULT true,
    "loginType" "LoginType" NOT NULL,

    CONSTRAINT "userLoginHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "suspensionRecords" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "suspendedBy" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "suspensionRecords_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetToken_token_key" ON "PasswordResetToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "vendors_email_key" ON "vendors"("email");

-- CreateIndex
CREATE UNIQUE INDEX "products_name_key" ON "products"("name");

-- CreateIndex
CREATE UNIQUE INDEX "clothingProduct_productId_key" ON "clothingProduct"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "electronicsProduct_productId_key" ON "electronicsProduct"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "categories_name_key" ON "categories"("name");

-- AddForeignKey
ALTER TABLE "passwordHistory" ADD CONSTRAINT "passwordHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendors" ADD CONSTRAINT "vendors_email_fkey" FOREIGN KEY ("email") REFERENCES "users"("email") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_vendorEmail_fkey" FOREIGN KEY ("vendorEmail") REFERENCES "vendors"("email") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clothingProduct" ADD CONSTRAINT "clothingProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "electronicsProduct" ADD CONSTRAINT "electronicsProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flashSaleProducts" ADD CONSTRAINT "flashSaleProducts_flashSaleId_fkey" FOREIGN KEY ("flashSaleId") REFERENCES "flashSales"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flashSaleProducts" ADD CONSTRAINT "flashSaleProducts_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cartItems" ADD CONSTRAINT "cartItems_customerEmail_fkey" FOREIGN KEY ("customerEmail") REFERENCES "users"("email") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cartItems" ADD CONSTRAINT "cartItems_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_customerEmail_fkey" FOREIGN KEY ("customerEmail") REFERENCES "users"("email") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orderItems" ADD CONSTRAINT "orderItems_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orderItems" ADD CONSTRAINT "orderItems_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentHistory" ADD CONSTRAINT "PaymentHistory_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "follows" ADD CONSTRAINT "follows_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "follows" ADD CONSTRAINT "follows_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "vendors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recentViews" ADD CONSTRAINT "recentViews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userLoginHistory" ADD CONSTRAINT "userLoginHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "suspensionRecords" ADD CONSTRAINT "suspensionRecords_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
