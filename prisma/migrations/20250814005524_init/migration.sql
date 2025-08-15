-- CreateTable
CREATE TABLE "public"."Item" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "quantityUnits" TEXT,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);
