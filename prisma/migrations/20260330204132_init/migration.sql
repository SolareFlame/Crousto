-- CreateTable
CREATE TABLE "Restaurant" (
    "id" TEXT NOT NULL,
    "sourceId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "zone" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "thumbnailUrl" TEXT,
    "shortDesc" TEXT,
    "contact" TEXT,
    "infos" TEXT,
    "json" JSONB,
    "jsonHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Restaurant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Planning" (
    "id" TEXT NOT NULL,
    "restaurantId" TEXT NOT NULL,
    "weekday" INTEGER NOT NULL,
    "isOpen" BOOLEAN NOT NULL,
    "label" TEXT,

    CONSTRAINT "Planning_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Menu" (
    "id" TEXT NOT NULL,
    "sourceId" INTEGER NOT NULL,
    "restaurantId" TEXT NOT NULL,
    "restaurantSourceId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "fetchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "json" JSONB,
    "jsonHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Menu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Meal" (
    "id" TEXT NOT NULL,
    "menuId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Meal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "mealId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dish" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Dish_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Guild" (
    "guildId" TEXT NOT NULL,
    "name" TEXT,
    "ownerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Guild_pkey" PRIMARY KEY ("guildId")
);

-- CreateTable
CREATE TABLE "User" (
    "userId" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "MenuRating" (
    "id" TEXT NOT NULL,
    "menuId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MenuRating_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RestaurantRating" (
    "id" TEXT NOT NULL,
    "restaurantId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RestaurantRating_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,
    "restaurantId" TEXT NOT NULL,
    "mealName" TEXT NOT NULL DEFAULT 'midi',
    "roleId" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "cron" TEXT NOT NULL DEFAULT '0 10 * * 1-5',
    "lastRunAt" TIMESTAMP(3),
    "lastMessageId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Restaurant_sourceId_key" ON "Restaurant"("sourceId");

-- CreateIndex
CREATE INDEX "Restaurant_title_idx" ON "Restaurant"("title");

-- CreateIndex
CREATE INDEX "Restaurant_zone_idx" ON "Restaurant"("zone");

-- CreateIndex
CREATE INDEX "Restaurant_latitude_longitude_idx" ON "Restaurant"("latitude", "longitude");

-- CreateIndex
CREATE INDEX "Planning_restaurantId_weekday_idx" ON "Planning"("restaurantId", "weekday");

-- CreateIndex
CREATE UNIQUE INDEX "Planning_restaurantId_weekday_key" ON "Planning"("restaurantId", "weekday");

-- CreateIndex
CREATE UNIQUE INDEX "Menu_sourceId_key" ON "Menu"("sourceId");

-- CreateIndex
CREATE INDEX "Menu_date_idx" ON "Menu"("date");

-- CreateIndex
CREATE INDEX "Menu_restaurantId_date_idx" ON "Menu"("restaurantId", "date");

-- CreateIndex
CREATE INDEX "Menu_restaurantId_date_fetchedAt_idx" ON "Menu"("restaurantId", "date", "fetchedAt");

-- CreateIndex
CREATE INDEX "Menu_restaurantId_date_sourceId_idx" ON "Menu"("restaurantId", "date", "sourceId");

-- CreateIndex
CREATE UNIQUE INDEX "Menu_restaurantId_date_jsonHash_key" ON "Menu"("restaurantId", "date", "jsonHash");

-- CreateIndex
CREATE INDEX "Meal_menuId_idx" ON "Meal"("menuId");

-- CreateIndex
CREATE UNIQUE INDEX "Meal_menuId_name_key" ON "Meal"("menuId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Meal_menuId_position_key" ON "Meal"("menuId", "position");

-- CreateIndex
CREATE INDEX "Category_label_idx" ON "Category"("label");

-- CreateIndex
CREATE INDEX "Category_mealId_idx" ON "Category"("mealId");

-- CreateIndex
CREATE UNIQUE INDEX "Category_mealId_position_key" ON "Category"("mealId", "position");

-- CreateIndex
CREATE INDEX "Dish_label_idx" ON "Dish"("label");

-- CreateIndex
CREATE INDEX "Dish_categoryId_idx" ON "Dish"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "Dish_categoryId_position_key" ON "Dish"("categoryId", "position");

-- CreateIndex
CREATE INDEX "MenuRating_menuId_rating_idx" ON "MenuRating"("menuId", "rating");

-- CreateIndex
CREATE UNIQUE INDEX "MenuRating_userId_menuId_key" ON "MenuRating"("userId", "menuId");

-- CreateIndex
CREATE INDEX "RestaurantRating_restaurantId_rating_idx" ON "RestaurantRating"("restaurantId", "rating");

-- CreateIndex
CREATE UNIQUE INDEX "RestaurantRating_userId_restaurantId_key" ON "RestaurantRating"("userId", "restaurantId");

-- CreateIndex
CREATE INDEX "Subscription_active_cron_idx" ON "Subscription"("active", "cron");

-- CreateIndex
CREATE INDEX "Subscription_guildId_active_idx" ON "Subscription"("guildId", "active");

-- AddForeignKey
ALTER TABLE "Planning" ADD CONSTRAINT "Planning_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Menu" ADD CONSTRAINT "Menu_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Meal" ADD CONSTRAINT "Meal_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "Menu"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_mealId_fkey" FOREIGN KEY ("mealId") REFERENCES "Meal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dish" ADD CONSTRAINT "Dish_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenuRating" ADD CONSTRAINT "MenuRating_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenuRating" ADD CONSTRAINT "MenuRating_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "Menu"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RestaurantRating" ADD CONSTRAINT "RestaurantRating_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RestaurantRating" ADD CONSTRAINT "RestaurantRating_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild"("guildId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
