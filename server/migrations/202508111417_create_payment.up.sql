CREATE TABLE "payment"
(
    "id"               varchar(255) UNIQUE NOT NULL DEFAULT gen_random_uuid(),
    "user_id"          varchar(255) NOT NULL,
    "yookassa_id"      varchar(255) UNIQUE NOT NULL,
    "type"             varchar(255) NOT NULL,
    "item_id"          varchar(255) NOT NULL,
    "amount_roubles"   int NOT NULL,
    "status"           varchar(255) NOT NULL DEFAULT 'pending',
    "confirmation_url" text,
    "created_at"       timestamp NOT NULL DEFAULT (now() at time zone 'utc'),
    
    PRIMARY KEY ("id"),
    FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE
);

CREATE INDEX "idx_payment_user_id" ON "payment"("user_id");
CREATE INDEX "idx_payment_yookassa_id" ON "payment"("yookassa_id");
CREATE INDEX "idx_payment_status" ON "payment"("status");
CREATE INDEX "idx_payment_type_item" ON "payment"("type", "item_id");
