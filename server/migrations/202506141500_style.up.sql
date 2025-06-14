CREATE TABLE "style"
(
    "id"            varchar(255) UNIQUE NOT NULL DEFAULT gen_random_uuid(),
    "price_roubles" int NOT NULL,
    "title"         varchar(255) NOT NULL,
    "style"         jsonb,
    "type"          varchar(255) NOT NULL,
    "created_at"    timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id")
);

CREATE TABLE "user_style"
(
    "user_id"     varchar(255) NOT NULL,
    "style_id"   varchar(255) NOT NULL,
    "created_at"  timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("user_id", "style_id"),
    FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE,
    FOREIGN KEY ("style_id") REFERENCES "style"("id") ON DELETE CASCADE
);

ALTER TABLE "user"
ADD COLUMN IF NOT EXISTS "styles" jsonb NOT NULL DEFAULT '{}'::jsonb;

ALTER TABLE "user"
DROP COLUMN IF EXISTS "avatar";

ALTER TABLE "user"
DROP COLUMN IF EXISTS "background";
