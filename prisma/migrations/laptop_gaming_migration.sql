-- Migration untuk Laptop Gaming Feature
-- Run: npx prisma migrate dev --name add_laptop_gaming_models

-- GPU Table
CREATE TABLE "GPU" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "vram" INTEGER NOT NULL,
    "timeSpyScore" INTEGER,
    "gta5Ultra1080p" TEXT,
    "cyberpunkMedium1080p" TEXT,
    "hogwartsMedium1080p" TEXT,
    "gta6Ready" TEXT NOT NULL,
    "dlssVersion" TEXT,
    "architecture" TEXT,
    "tdp" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- LaptopTier Table
CREATE TABLE "LaptopTier" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL UNIQUE,
    "minBudget" INTEGER NOT NULL,
    "maxBudget" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- LaptopGaming Table
CREATE TABLE "LaptopGaming" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "series" TEXT,
    "year" INTEGER NOT NULL,
    "cpuBrand" TEXT NOT NULL,
    "cpuModel" TEXT NOT NULL,
    "cpuCores" INTEGER,
    "cpuThreads" INTEGER,
    "gpuId" TEXT NOT NULL,
    "gpuWattage" INTEGER,
    "ramSize" INTEGER NOT NULL,
    "ramType" TEXT,
    "storageSize" INTEGER NOT NULL,
    "storageType" TEXT,
    "screenSize" REAL,
    "screenResolution" TEXT,
    "refreshRate" INTEGER,
    "screenBrightness" INTEGER,
    "panelType" TEXT,
    "weight" REAL,
    "buildMaterial" TEXT,
    "priceNewMin" INTEGER,
    "priceNewMax" INTEGER,
    "priceUsedMin" INTEGER,
    "priceUsedMax" INTEGER,
    "depreciationPercent" INTEGER,
    "tierId" TEXT NOT NULL,
    "ranking" INTEGER,
    "isRecommended" BOOLEAN NOT NULL DEFAULT false,
    "isValueKing" BOOLEAN NOT NULL DEFAULT false,
    "badge" TEXT,
    "gta5Rating" INTEGER,
    "gta6Readiness" INTEGER,
    "valueScore" INTEGER,
    "hasDlss" BOOLEAN NOT NULL DEFAULT false,
    "hasAdvancedOptimus" BOOLEAN NOT NULL DEFAULT false,
    "hasMuxSwitch" BOOLEAN NOT NULL DEFAULT false,
    "coolingSolution" TEXT,
    "specialFeatures" TEXT,
    "serviceCenterCountJakarta" INTEGER,
    "sparePartAvailability" TEXT,
    "commonIssues" TEXT,
    "description" TEXT,
    "pros" TEXT,
    "cons" TEXT,
    "verdict" TEXT,
    "dataSource" TEXT,
    "lastVerified" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    FOREIGN KEY ("gpuId") REFERENCES "GPU"("id"),
    FOREIGN KEY ("tierId") REFERENCES "LaptopTier"("id")
);

-- GameRequirement Table
CREATE TABLE "GameRequirement" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL UNIQUE,
    "releaseYear" INTEGER,
    "description" TEXT,
    "minCpu" TEXT,
    "minGpu" TEXT,
    "minRam" INTEGER,
    "minStorage" INTEGER,
    "minStorageType" TEXT,
    "recCpu" TEXT,
    "recGpu" TEXT,
    "recRam" INTEGER,
    "recStorage" INTEGER,
    "recStorageType" TEXT,
    "targetResolution" TEXT,
    "targetFps" INTEGER,
    "importantNotes" TEXT,
    "dlssSupported" BOOLEAN NOT NULL DEFAULT false,
    "fsrSupported" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- ShopLaptopInventory
CREATE TABLE "ShopLaptopInventory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shopId" TEXT NOT NULL,
    "laptopId" TEXT NOT NULL,
    "condition" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "warrantyMonths" INTEGER,
    "stock" INTEGER NOT NULL DEFAULT 1,
    "notes" TEXT,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "listingUrl" TEXT,
    "lastUpdated" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    FOREIGN KEY ("shopId") REFERENCES "Shop"("id"),
    FOREIGN KEY ("laptopId") REFERENCES "LaptopGaming"("id"),
    UNIQUE("shopId", "laptopId", "condition")
);

-- WhereToBuy Table
CREATE TABLE "WhereToBuy" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "platform" TEXT,
    "url" TEXT,
    "address" TEXT,
    "district" TEXT,
    "area" TEXT,
    "phone" TEXT,
    "instagram" TEXT,
    "rating" REAL,
    "reviewCount" INTEGER,
    "isTrusted" BOOLEAN NOT NULL DEFAULT false,
    "specialization" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- Indexes
CREATE INDEX "idx_laptop_gpuId" ON "LaptopGaming"("gpuId");
CREATE INDEX "idx_laptop_tierId" ON "LaptopGaming"("tierId");
CREATE INDEX "idx_laptop_brand" ON "LaptopGaming"("brand");
CREATE INDEX "idx_laptop_year" ON "LaptopGaming"("year");
CREATE INDEX "idx_laptop_priceUsed" ON "LaptopGaming"("priceUsedMin", "priceUsedMax");
CREATE INDEX "idx_laptop_gta6Ready" ON "LaptopGaming"("gta6Readiness");
CREATE INDEX "idx_inventory_shopId" ON "ShopLaptopInventory"("shopId");
CREATE INDEX "idx_inventory_laptopId" ON "ShopLaptopInventory"("laptopId");
