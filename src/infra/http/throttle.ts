let lastRun = 0;

export async function withThrottle<T>(
  run: () => Promise<T>,
  minDelayMs = 250
): Promise<T> {
  const now = Date.now();
  const waitMs = Math.max(0, minDelayMs - (now - lastRun));

  if (waitMs > 0) {
    await new Promise((resolve) => setTimeout(resolve, waitMs));
  }

  lastRun = Date.now();
  return run();
}
