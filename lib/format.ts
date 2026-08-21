export function formatCurrency(value: number): string {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

export function formatAddress(p: { address: string; city: string; state: string; zip: string }): string {
  return `${p.address}, ${p.city}, ${p.state} ${p.zip}`;
}
