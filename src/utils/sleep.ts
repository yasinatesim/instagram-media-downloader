const MS = 2000;
export function sleep() {
  return new Promise((resolve) => setTimeout(resolve, MS));
}
