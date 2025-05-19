import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface CalculatorFormProps {
  onCalculate: (income: number, debts: number) => void;
}

export default function CalculatorForm({ onCalculate }: CalculatorFormProps) {
  const [income, setIncome] = useState<string>("");
  const [debts, setDebts] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const incomeValue = parseFloat(income);
    const debtsValue = parseFloat(debts);
    
    // Validate inputs
    if (!income || isNaN(incomeValue) || incomeValue <= 0) {
      setError("Пожалуйста, введите корректное значение дохода");
      return;
    }
    
    if (!debts || isNaN(debtsValue) || debtsValue < 0) {
      setError("Пожалуйста, введите корректное значение долговых обязательств");
      return;
    }
    
    // Clear error if validation passes
    setError(null);
    onCalculate(incomeValue, debtsValue);
  };

  return (
    <Card className="bg-white rounded-lg shadow-md">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-6 text-[#5E81AC]">Введите данные</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Income Input Group */}
          <div className="space-y-2">
            <label htmlFor="monthlyIncome" className="block text-sm font-medium text-[#434C5E]">
              Ежемесячный доход (₸)
            </label>
            <div className="relative">
              <Input
                type="number"
                id="monthlyIncome"
                placeholder="500000"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                className="w-full px-4 py-3 border border-[#D8DEE9] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5E81AC] focus:border-transparent transition"
              />
              <span className="absolute right-3 top-3 text-[#4C566A]">₸</span>
            </div>
            <p className="text-sm text-[#4C566A]">Укажите общий доход до вычета налогов</p>
          </div>
          
          {/* Debts Input Group */}
          <div className="space-y-2">
            <label htmlFor="monthlyDebts" className="block text-sm font-medium text-[#434C5E]">
              Ежемесячные долговые обязательства (₸)
            </label>
            <div className="relative">
              <Input
                type="number"
                id="monthlyDebts"
                placeholder="150000"
                value={debts}
                onChange={(e) => setDebts(e.target.value)}
                className="w-full px-4 py-3 border border-[#D8DEE9] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5E81AC] focus:border-transparent transition"
              />
              <span className="absolute right-3 top-3 text-[#4C566A]">₸</span>
            </div>
            <p className="text-sm text-[#4C566A]">Сумма всех ежемесячных платежей по кредитам</p>
          </div>
          
          {/* Error Message */}
          {error && (
            <div className="p-3 bg-[#BF616A] bg-opacity-10 text-[#BF616A] rounded-md text-sm">
              {error}
            </div>
          )}
          
          {/* Calculate Button */}
          <Button 
            type="submit"
            className="w-full bg-[#5E81AC] text-white py-3 px-6 rounded-md hover:bg-[#81A1C1] transition duration-200 font-medium"
          >
            Рассчитать DTI
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
