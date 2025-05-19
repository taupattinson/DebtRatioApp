import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { DtiResult, DebtCategory } from "@/types";
import Chart from "chart.js/auto";
import { formatCurrency } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ResultsDisplayProps {
  result: DtiResult | null;
}

export default function ResultsDisplay({ result }: ResultsDisplayProps) {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);
  const breakdownChartRef = useRef<HTMLCanvasElement | null>(null);
  const breakdownChartInstance = useRef<Chart | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  // Main DTI Chart
  useEffect(() => {
    if (result && chartRef.current) {
      // Destroy existing chart if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext("2d");
      if (ctx) {
        // Determine color based on DTI value
        let color;
        if (result.percentage <= 20) {
          color = "#A3BE8C"; // Nord green
        } else if (result.percentage <= 35) {
          color = "#EBCB8B"; // Nord yellow
        } else {
          color = "#BF616A"; // Nord red
        }

        // Create new chart
        chartInstance.current = new Chart(ctx, {
          type: "doughnut",
          data: {
            datasets: [{
              data: [result.percentage, 100 - result.percentage],
              backgroundColor: [
                color,
                "#ECEFF4" // Nord background color
              ],
              borderWidth: 0
            }]
          },
          options: {
            cutout: "75%",
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false
              },
              tooltip: {
                enabled: false
              }
            }
          }
        });
      }
    }
  }, [result]);

  // Debt Breakdown Chart
  useEffect(() => {
    if (result?.debtCategories && result.debtCategories.length > 0 && breakdownChartRef.current) {
      // Destroy existing chart if it exists
      if (breakdownChartInstance.current) {
        breakdownChartInstance.current.destroy();
      }

      const ctx = breakdownChartRef.current.getContext("2d");
      if (ctx) {
        // Generate colors based on Nord palette
        const colors = [
          "#5E81AC", // Primary Nord blue
          "#81A1C1", // Lighter blue
          "#88C0D0", // Cyan
          "#8FBCBB", // Teal
          "#A3BE8C", // Green
          "#EBCB8B", // Yellow
          "#D08770", // Orange
          "#BF616A", // Red
          "#B48EAD"  // Purple
        ];

        const data = result.debtCategories.map(category => category.amount);
        const labels = result.debtCategories.map(category => category.type);
        
        // Create new chart
        breakdownChartInstance.current = new Chart(ctx, {
          type: "pie",
          data: {
            labels: labels,
            datasets: [{
              data: data,
              backgroundColor: result.debtCategories.map((_, index) => colors[index % colors.length]),
              borderWidth: 0
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'right',
                labels: {
                  color: "#4C566A",
                  font: {
                    size: 11
                  },
                  boxWidth: 12,
                  padding: 10
                }
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    const value = context.raw as number;
                    const total = context.chart.data.datasets[0].data.reduce((acc: number, curr: any) => acc + (typeof curr === 'number' ? curr : 0), 0) as number;
                    const percentage = Math.round((value / total) * 100);
                    return `${formatCurrency(value)} (${percentage}%)`;
                  }
                }
              }
            }
          }
        });
      }
    }
  }, [result?.debtCategories, activeTab]);

  // Get risk assessment data based on result
  const getRiskData = () => {
    if (!result) return null;
    
    if (result.riskLevel === "low") {
      return {
        colorClass: "bg-[#A3BE8C] bg-opacity-10 text-[#A3BE8C]",
        title: "Низкий риск",
        description: "У вас здоровое соотношение долга к доходу. Вы находитесь в хорошем финансовом положении и являетесь привлекательным заемщиком для кредиторов."
      };
    } else if (result.riskLevel === "moderate") {
      return {
        colorClass: "bg-[#EBCB8B] bg-opacity-10 text-[#EBCB8B]",
        title: "Умеренный риск",
        description: "Ваше соотношение долга к доходу находится на умеренном уровне. Рекомендуется контролировать долговую нагрузку и избегать новых крупных займов."
      };
    } else {
      return {
        colorClass: "bg-[#BF616A] bg-opacity-10 text-[#BF616A]",
        title: "Высокий риск",
        description: "Ваше соотношение долга к доходу высокое. Кредиторы могут считать вас рискованным заемщиком. Рекомендуется сосредоточиться на уменьшении долговой нагрузки."
      };
    }
  };

  const riskData = getRiskData();

  // Determine if we can show debt breakdown
  const hasDebtBreakdown = result?.debtCategories && result.debtCategories.length > 0;

  return (
    <Card className="bg-white rounded-lg shadow-md">
      <CardContent className="p-4 sm:p-6">
        <h2 className="text-xl font-semibold mb-4 sm:mb-6 text-[#5E81AC]">Результат</h2>
        
        {!result ? (
          // Initial State Message
          <div className="py-10 sm:py-16 text-center text-[#4C566A]">
            <p>Заполните форму и нажмите "Рассчитать DTI" для получения результата</p>
          </div>
        ) : (
          // Results Container
          <div>
            {/* DTI Percentage */}
            <div className="text-center mb-4 sm:mb-6">
              <span className="text-4xl font-bold">{result.percentage}</span>
              <span className="text-2xl">%</span>
              <p className="text-[#4C566A] mt-1">Коэффициент DTI</p>
            </div>
            
            {/* Tabs for different views */}
            {hasDebtBreakdown ? (
              <Tabs
                defaultValue="overview"
                className="w-full mb-4"
                onValueChange={(value) => setActiveTab(value)}
              >
                <TabsList className="grid grid-cols-2 mb-4">
                  <TabsTrigger value="overview">Общий обзор</TabsTrigger>
                  <TabsTrigger value="breakdown">Структура долгов</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="mt-0">
                  <div className="h-48 sm:h-60 mb-6">
                    <canvas ref={chartRef} id="dtiChart"></canvas>
                  </div>
                </TabsContent>
                <TabsContent value="breakdown" className="mt-0">
                  <div className="h-56 sm:h-72 mb-6">
                    <canvas ref={breakdownChartRef} id="breakdownChart"></canvas>
                  </div>
                </TabsContent>
              </Tabs>
            ) : (
              <div className="h-48 sm:h-60 mb-6">
                <canvas ref={chartRef} id="dtiChart"></canvas>
              </div>
            )}
            
            {/* Risk Assessment */}
            {riskData && (
              <div className={`p-3 sm:p-4 rounded-md mb-4 sm:mb-6 ${riskData.colorClass}`}>
                <h3 className="font-semibold mb-1">{riskData.title}</h3>
                <p className="text-xs sm:text-sm">{riskData.description}</p>
              </div>
            )}
            
            {/* Debt and Income Summary */}
            <div className="bg-[#ECEFF4] bg-opacity-50 p-3 sm:p-4 rounded-md mb-4 sm:mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-[#4C566A]">Ежемесячный доход:</span>
                <span className="font-medium text-[#2E3440]">{formatCurrency(result.income)}</span>
              </div>
              <div className="flex justify-between text-sm mt-2">
                <span className="text-[#4C566A]">Ежемесячные обязательства:</span>
                <span className="font-medium text-[#2E3440]">{formatCurrency(result.debts)}</span>
              </div>
            </div>
            
            {/* Explanation */}
            <div className="text-xs sm:text-sm text-[#4C566A] space-y-2 sm:space-y-3">
              <p>
                <span className="font-medium">DTI (Debt-to-Income)</span> — это отношение всех ежемесячных долговых обязательств к вашему ежемесячному доходу до вычета налогов.
              </p>
              <div className="grid grid-cols-3 gap-1 sm:gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-[#A3BE8C]"></div>
                  <p>0-20%: низкий</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-[#EBCB8B]"></div>
                  <p>21-35%: средний</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-[#BF616A]"></div>
                  <p>36%+: высокий</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
