import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DebtCategory } from "@/types";
import { PlusCircle, Trash2 } from "lucide-react";

interface CalculatorFormProps {
  onCalculate: (income: number, debts: number, debtCategories: DebtCategory[]) => void;
}

const defaultDebtCategories = [
  { type: "Ипотека", amount: 0 },
  { type: "Потребительский кредит", amount: 0 },
];

export default function CalculatorForm({ onCalculate }: CalculatorFormProps) {
  const [income, setIncome] = useState<string>("");
  const [debts, setDebts] = useState<string>("");
  const [debtCategories, setDebtCategories] = useState<DebtCategory[]>(defaultDebtCategories);
  const [error, setError] = useState<string | null>(null);
  const [showDebtBreakdown, setShowDebtBreakdown] = useState<boolean>(false);

 
  useEffect(() => {
    if (showDebtBreakdown) {
      const totalCategorizedDebt = debtCategories.reduce((sum, category) => sum + category.amount, 0);
      setDebts(totalCategorizedDebt.toString());
    }
  }, [debtCategories, showDebtBreakdown]);

  const handleDebtsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!showDebtBreakdown) {
      setDebts(e.target.value);
    }
  };

  const handleCategoryAmountChange = (index: number, amount: string) => {
    const newAmount = amount === "" ? 0 : parseFloat(amount);
    
    if (isNaN(newAmount) || newAmount < 0) return;
    
    const updatedCategories = [...debtCategories];
    updatedCategories[index].amount = newAmount;
    setDebtCategories(updatedCategories);
  };

  const addDebtCategory = () => {
    setDebtCategories([...debtCategories, { type: "", amount: 0 }]);
  };

  const removeDebtCategory = (index: number) => {
    const updatedCategories = debtCategories.filter((_, i) => i !== index);
    setDebtCategories(updatedCategories);
  };

  const handleCategoryTypeChange = (index: number, type: string) => {
    const updatedCategories = [...debtCategories];
    updatedCategories[index].type = type;
    setDebtCategories(updatedCategories);
  };

  const toggleDebtBreakdown = () => {
    setShowDebtBreakdown(!showDebtBreakdown);
    
 
    if (!showDebtBreakdown) {
 
      const currentDebt = parseFloat(debts) || 0;
      if (debtCategories.length === defaultDebtCategories.length && 
          debtCategories.every(cat => cat.amount === 0)) {
 
        const perCategory = Math.floor(currentDebt / debtCategories.length);
        const updatedCategories = debtCategories.map(cat => ({
          ...cat,
          amount: perCategory
        }));
        setDebtCategories(updatedCategories);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const incomeValue = parseFloat(income);
    const debtsValue = parseFloat(debts);
    
 
    if (!income || isNaN(incomeValue) || incomeValue <= 0) {
      setError("Пожалуйста, введите корректное значение дохода");
      return;
    }
    
    if (!debts || isNaN(debtsValue) || debtsValue < 0) {
      setError("Пожалуйста, введите корректное значение долговых обязательств");
      return;
    }

    if (showDebtBreakdown) {
      const hasEmptyCategory = debtCategories.some(category => category.type.trim() === "");
      if (hasEmptyCategory) {
        setError("Пожалуйста, заполните названия всех категорий долгов");
        return;
      }
    }
    
 
    setError(null);
    onCalculate(incomeValue, debtsValue, showDebtBreakdown ? debtCategories : []);
  };

  return (
    <Card className="bg-white rounded-lg shadow-md">
      <CardContent className="p-4 sm:p-6">
        <h2 className="text-xl font-semibold mb-4 sm:mb-6 text-[#5E81AC]">Введите данные</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
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
            <div className="flex justify-between items-center">
              <label htmlFor="monthlyDebts" className="block text-sm font-medium text-[#434C5E]">
                Ежемесячные долговые обязательства (₸)
              </label>
              <Button 
                type="button" 
                variant="ghost" 
                className="text-xs px-2 py-1 h-auto text-[#5E81AC] hover:text-[#81A1C1]"
                onClick={toggleDebtBreakdown}
              >
                {showDebtBreakdown ? "Скрыть категории" : "Детализировать долги"}
              </Button>
            </div>
            
            {/* Total Debts Input (visible when not showing breakdown) */}
            {!showDebtBreakdown && (
              <div className="relative">
                <Input
                  type="number"
                  id="monthlyDebts"
                  placeholder="150000"
                  value={debts}
                  onChange={handleDebtsChange}
                  className="w-full px-4 py-3 border border-[#D8DEE9] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5E81AC] focus:border-transparent transition"
                />
                <span className="absolute right-3 top-3 text-[#4C566A]">₸</span>
              </div>
            )}
            
            {/* Debt Categories (visible when showing breakdown) */}
            {showDebtBreakdown && (
              <div className="space-y-3 mt-2 p-3 bg-[#E5E9F0] rounded-md">
                {debtCategories.map((category, index) => (
                  <div key={index} className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <div className="w-full sm:w-1/2">
                      <Input
                        type="text"
                        placeholder="Название кредита"
                        value={category.type}
                        onChange={(e) => handleCategoryTypeChange(index, e.target.value)}
                        className="w-full px-3 py-2 text-sm border-[#D8DEE9] focus:ring-1"
                      />
                    </div>
                    <div className="w-full sm:w-1/2 flex items-center">
                      <div className="relative flex-grow">
                        <Input
                          type="number"
                          placeholder="0"
                          value={category.amount || ""}
                          onChange={(e) => handleCategoryAmountChange(index, e.target.value)}
                          className="w-full px-3 py-2 text-sm border-[#D8DEE9] focus:ring-1"
                        />
                        <span className="absolute right-3 top-2 text-[#4C566A] text-sm">₸</span>
                      </div>
                      {debtCategories.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="ml-1 h-8 w-8 text-[#BF616A]"
                          onClick={() => removeDebtCategory(index)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                
                <div className="pt-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full text-xs border-dashed border-[#5E81AC] text-[#5E81AC] hover:bg-[#E5E9F0]"
                    onClick={addDebtCategory}
                  >
                    <PlusCircle size={14} className="mr-1" /> Добавить категорию
                  </Button>
                </div>
                
                <div className="pt-1 flex justify-between text-sm font-medium text-[#3B4252]">
                  <span>Итого:</span>
                  <span>{parseFloat(debts) > 0 ? parseFloat(debts).toLocaleString('ru-KZ') : 0} ₸</span>
                </div>
              </div>
            )}
            
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
