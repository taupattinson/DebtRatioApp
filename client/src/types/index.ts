export interface DtiResult {
  percentage: number;
  riskLevel: "low" | "moderate" | "high";
  income: number;
  debts: number;
}
