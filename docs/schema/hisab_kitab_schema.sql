-- Hisab Kitab - Database Schema v1.0
-- Database: PostgreSQL

-- Enable pgcrypto extension if you plan to use UUIDs for IDs instead of SERIAL
-- CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Function to automatically update 'updated_at' timestamps
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- 1. "User" Table: Stores authentication and profile data
CREATE TABLE "user" (
    "user_id" SERIAL PRIMARY KEY,
    "username" VARCHAR(100) NOT NULL UNIQUE,
    "email" VARCHAR(255) NOT NULL UNIQUE,
    "password_hash" VARCHAR(255) NOT NULL,
    "first_name" VARCHAR(100) NOT NULL,
    "last_name" VARCHAR(100) NOT NULL,
    "phone_number" VARCHAR(20) UNIQUE,
    "address" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create trigger for "user" table
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON "user"
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();


-- 2. "Entity" Table: The core table. Represents all items in the chat list.
CREATE TABLE "entity" (
    "entity_id" SERIAL PRIMARY KEY,
    "owner_user_id" INTEGER NOT NULL REFERENCES "user"("user_id") ON DELETE CASCADE,
    "name" VARCHAR(255) NOT NULL,
    "type" VARCHAR(50) NOT NULL CHECK ("type" IN ('ACCOUNT', 'EXTERNAL_PAYEE', 'CATEGORY', 'SYSTEM')),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create trigger for "entity" table
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON "entity"
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

-- Index for fast lookup of a user's entities
CREATE INDEX idx_entity_owner_user_id ON "entity" ("owner_user_id");


-- 3. "Payment_Mode" Table: Stores the "tools" (apps, cards) a user links to their accounts.
CREATE TABLE "payment_mode" (
    "mode_id" SERIAL PRIMARY KEY,
    "owner_user_id" INTEGER NOT NULL REFERENCES "user"("user_id") ON DELETE CASCADE,
    "name" VARCHAR(255) NOT NULL,
    "app_key" VARCHAR(100) NOT NULL,
    "linked_entity_id" INTEGER NOT NULL REFERENCES "entity"("entity_id") ON DELETE RESTRICT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for fast lookup of a user's payment modes
CREATE INDEX idx_payment_mode_owner_user_id ON "payment_mode" ("owner_user_id");


-- 4. "Transaction" Table: The master ledger of all money movement.
CREATE TABLE "transaction" (
    "transaction_id" BIGSERIAL PRIMARY KEY,
    "payer_entity_id" INTEGER NOT NULL REFERENCES "entity"("entity_id") ON DELETE RESTRICT,
    "payee_entity_id" INTEGER NOT NULL REFERENCES "entity"("entity_id") ON DELETE RESTRICT,
    "amount" DECIMAL(19, 4) NOT NULL CHECK ("amount" > 0),
    "mode_type" VARCHAR(50) NOT NULL,
    "status" VARCHAR(20) NOT NULL CHECK ("status" IN ('pending', 'confirmed', 'rejected')),
    "description" TEXT,
    "transaction_date" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "category_id" INTEGER REFERENCES "entity"("entity_id") ON DELETE SET NULL,
    "receipt_image_url" VARCHAR(1024),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create trigger for "transaction" table
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON "transaction"
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

-- Indexes for fast querying of chat histories and lists
CREATE INDEX idx_transaction_payer_entity_id ON "transaction" ("payer_entity_id");
CREATE INDEX idx_transaction_payee_entity_id ON "transaction" ("payee_entity_id");
CREATE INDEX idx_transaction_category_id ON "transaction" ("category_id");
CREATE INDEX idx_transaction_transaction_date ON "transaction" ("transaction_date" DESC);
CREATE INDEX idx_transaction_status ON "transaction" ("status");


-- 5. "User_Connection" Table: The "Friends List" or social graph.
CREATE TABLE "user_connection" (
    "connection_id" SERIAL PRIMARY KEY,
    "user_a_id" INTEGER NOT NULL REFERENCES "user"("user_id") ON DELETE CASCADE,
    "user_b_id" INTEGER NOT NULL REFERENCES "user"("user_id") ON DELETE CASCADE,
    "status" VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK ("status" IN ('pending', 'accepted', 'blocked')),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    -- Ensures a connection request can only be sent once in one direction
    UNIQUE("user_a_id", "user_b_id")
);

-- Create trigger for "user_connection" table
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON "user_connection"
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

-- Index for finding a user's connections
CREATE INDEX idx_user_connection_user_b_id ON "user_connection" ("user_b_id");


-- 6. "Connection_Permission" Table: Stores payment rules and defaults for each friend.
CREATE TABLE "connection_permission" (
    "permission_id" SERIAL PRIMARY KEY,
    "payer_user_id" INTEGER NOT NULL REFERENCES "user"("user_id") ON DELETE CASCADE,
    "payee_user_id" INTEGER NOT NULL REFERENCES "user"("user_id") ON DELETE CASCADE,
    "is_allowed" BOOLEAN NOT NULL DEFAULT true,
    "is_auto_approve_on" BOOLEAN NOT NULL DEFAULT false,
    "default_entity_id" INTEGER REFERENCES "entity"("entity_id") ON DELETE SET NULL,
    -- Ensures only one rule exists for each user/payee/mode combination
    UNIQUE("payer_user_id", "payee_user_id", "mode_type")
);

-- Index for fast lookup of permissions
CREATE INDEX idx_connection_permission_lookup ON "connection_permission" ("payer_user_id", "payee_user_id");