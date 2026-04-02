export function formatNPR(amount) {
  return `Rs. ${Number(amount).toLocaleString('en-NP', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

export const CUSTOM_COMBO_TIERS = [
  { min: 2, discount: 5 },
  { min: 3, discount: 10 },
  { min: 4, discount: 15 },
  { min: 5, discount: 20 },
];

export function getCustomComboDiscount(itemCount) {
  for (let i = CUSTOM_COMBO_TIERS.length - 1; i >= 0; i--) {
    if (itemCount >= CUSTOM_COMBO_TIERS[i].min) return CUSTOM_COMBO_TIERS[i].discount;
  }
  return 0;
}

export function generateOrderNumber() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `CS-${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${rand}`;
}
