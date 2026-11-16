export function formatLkr(n: number): string {
  return "LKR " + Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
