import CalculatorForm from "@/components/CalculatorForm";
import ResultsDisplay from "@/components/ResultsDisplay";
import FinancialTips from "@/components/FinancialTips";
import { useState } from "react";
import { DtiResult, DebtCategory } from "@/types";

export default function Home() {
  const [dtiResult, setDtiResult] = useState<DtiResult | null>(null);

  const handleCalculate = (income: number, debts: number, debtCategories: DebtCategory[]) => {
    const dti = (debts / income) * 100;
    const roundedDti = Math.round(dti * 10) / 10;
    
    let riskLevel: "low" | "moderate" | "high";
    if (roundedDti <= 20) {
      riskLevel = "low";
    } else if (roundedDti <= 35) {
      riskLevel = "moderate";
    } else {
      riskLevel = "high";
    }

    setDtiResult({
      percentage: roundedDti,
      riskLevel,
      income,
      debts,
      debtCategories: debtCategories.length > 0 ? debtCategories : undefined
    });
  };

  return (
    <main className="bg-[#ECEFF4] text-[#2E3440] min-h-screen">
      <div className="container mx-auto px-4 py-6 sm:py-8 max-w-4xl">
        <header className="text-center mb-6 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl font-semibold text-[#2E3440] mb-2">Калькулятор DTI</h1>
          <p className="text-[#4C566A] max-w-2xl mx-auto text-sm sm:text-base">
            Оцените свой коэффициент отношения долга к доходу (Debt-to-Income Ratio) для определения финансового риска
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          <CalculatorForm onCalculate={handleCalculate} />
          <ResultsDisplay result={dtiResult} />
        </div>
        
        <FinancialTips />
      </div>
    </main>
  );
}
