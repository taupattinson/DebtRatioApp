export interface DebtCategory {
  type: string;
  amount: number;
}

export interface DtiResult {
  percentage: number;
  riskLevel: "low" | "moderate" | "high";
  income: number;
  debts: number;
  debtCategories?: DebtCategory[];
}
