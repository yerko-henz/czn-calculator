export type Rule = {
  key: string;
  label: string;
  value: number;
  calculateValue?: (count: number) => number;
};

const calculateValue = (count: number) => {
  const first = 10;
  const step = 20;
  if (count <= 1) return 0;
  const k = count - 1;
  return (k / 2) * (2 * first + (k - 1) * step);
};

export const rules: Rule[] = [
  { key: "neutral", label: "Neutral", value: 20 },
  { key: "neutralEpiphany", label: "Neutral + Epiphany", value: 30 },
  { key: "forbidden", label: "Forbidden", value: 20 },
  { key: "monster", label: "Monster", value: 80 },
  {
    key: "cardCopy",
    label: "Card Copy",
    calculateValue,
    value: 0,
  },
  {
    key: "cardRemoval",
    label: "Card Removal",
    calculateValue,
    value: 0,
  },
  { key: "divine", label: "Divine", value: 20 },
  { key: "conversion", label: "Conversion", value: 10 },
];
