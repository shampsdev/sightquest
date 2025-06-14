ALTER TABLE "game" ADD COLUMN "route_id" varchar(255) NULL;

ALTER TABLE "game"
ADD CONSTRAINT fk_route
FOREIGN KEY ("route_id") REFERENCES route("id");
