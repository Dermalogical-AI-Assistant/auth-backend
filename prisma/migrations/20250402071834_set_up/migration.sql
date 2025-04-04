-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "RoleType" AS ENUM ('USER', 'ADMIN');

-- CreateTable
CREATE TABLE "token" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "device_id" TEXT NOT NULL,
    "user_id" UUID NOT NULL,
    "refresh_token" VARCHAR(255) NOT NULL,

    CONSTRAINT "pk_token" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" VARCHAR(255) NOT NULL,
    "avatar" VARCHAR(255),
    "phone" VARCHAR(15),
    "email" VARCHAR(255) NOT NULL,
    "location" VARCHAR(255),
    "date_of_birth" TIMESTAMPTZ(6),
    "gender" "Gender" NOT NULL DEFAULT 'FEMALE',
    "password" VARCHAR(255) NOT NULL,
    "role" "RoleType" NOT NULL DEFAULT 'USER',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pk_user" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ixuq_token_user_device" ON "token"("device_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- AddForeignKey
ALTER TABLE "token" ADD CONSTRAINT "fk_token_user" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
