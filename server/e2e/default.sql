INSERT INTO "taskpoint" ("id", "title", "description", "task", "location", "score", "created_at")
VALUES
  ('taskpoint-1-id', 'Taskpoint 1', 'Description for Taskpoint 1', 'Task 1', ST_SetSRID(ST_MakePoint(40, 30), 4326), 100, CURRENT_TIMESTAMP),
  ('taskpoint-2-id', 'Taskpoint 2', 'Description for Taskpoint 2', 'Task 2', ST_SetSRID(ST_MakePoint(50, 40), 4326), 150, CURRENT_TIMESTAMP),
  ('taskpoint-3-id', 'Taskpoint 3', 'Description for Taskpoint 3', 'Task 3', ST_SetSRID(ST_MakePoint(60, 50), 4326), 200, CURRENT_TIMESTAMP);

INSERT INTO "route" ("id", "title", "description", "price_roubles", "created_at")
VALUES
  ('route-1-id', 'Route 1', 'Description for Route 1', 0, CURRENT_TIMESTAMP);

INSERT INTO "route_taskpoint" ("route_id", "taskpoint_id", "order_index", "created_at")
VALUES
  ('route-1-id', 'taskpoint-1-id', 1, CURRENT_TIMESTAMP),
  ('route-1-id', 'taskpoint-2-id', 2, CURRENT_TIMESTAMP),
  ('route-1-id', 'taskpoint-3-id', 3, CURRENT_TIMESTAMP);
