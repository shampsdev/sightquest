export type LogType = "info" | "warning" | "error";
const severity: Record<LogType, number> = { info: 1, warning: 2, error: 3 };

export function createLogger<const B extends readonly string[]>(
  buckets: B,
  settings?: { level?: LogType; filter?: B[number][] }
) {
  type Bucket = B[number];
  type LogEntry = {
    ts: number;
    type: LogType;
    bucket: Bucket;
    payload: unknown[];
  };

  const entries: LogEntry[] = [];
  const minLevel: LogType = settings?.level ?? "info";
  const isAllowedBucket = (b: Bucket) =>
    !settings?.filter || settings.filter.includes(b);

  const onEntry = (entry: LogEntry) => {
    if (!isAllowedBucket(entry.bucket)) return;
    if (severity[entry.type] < severity[minLevel]) return;

    const tag = `[${entry.bucket}]`;
    switch (entry.type) {
      case "error":
        console.error(tag, ...entry.payload);
        break;
      case "warning":
        console.warn(tag, ...entry.payload);
        break;
      default:
        console.info(tag, ...entry.payload);
    }
  };

  const log = (bucket: Bucket, ...payload: unknown[]) => {
    const entry: LogEntry = { ts: Date.now(), type: "info", bucket, payload };
    entries.push(entry);
    onEntry(entry);
  };

  const warn = (bucket: Bucket, ...payload: unknown[]) => {
    const entry: LogEntry = {
      ts: Date.now(),
      type: "warning",
      bucket,
      payload,
    };
    entries.push(entry);
    onEntry(entry);
  };

  const error = (bucket: Bucket, ...payload: unknown[]) => {
    const entry: LogEntry = { ts: Date.now(), type: "error", bucket, payload };
    entries.push(entry);
    onEntry(entry);
  };

  return { log, warn, error } as const;
}
