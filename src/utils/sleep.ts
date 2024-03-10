const MS = 5000;
export function sleep() {
  return new Promise((resolve) => setTimeout(resolve, MS));
}
