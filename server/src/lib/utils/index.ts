export function filterUndefined(data: Record<any, any>) {
  const filtered: any = {};

  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) {
      filtered[key] = value;
    }
  }
  return filtered;
}
