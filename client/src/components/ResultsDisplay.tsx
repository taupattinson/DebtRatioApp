import { useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { DtiResult } from "@/types";
import Chart from "chart.js/auto";

interface ResultsDisplayProps {
  result: DtiResult | null;
}

export default function ResultsDisplay({ result }: ResultsDisplayProps) {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);

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

  return (
    <Card className="bg-white rounded-lg shadow-md">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-6 text-[#5E81AC]">Результат</h2>
        
        {!result ? (
          // Initial State Message
          <div className="py-16 text-center text-[#4C566A]">
            <p>Заполните форму и нажмите "Рассчитать DTI" для получения результата</p>
          </div>
        ) : (
          // Results Container
          <div>
            {/* DTI Percentage */}
            <div className="text-center mb-6">
              <span className="text-4xl font-bold">{result.percentage}</span>
              <span className="text-2xl">%</span>
              <p className="text-[#4C566A] mt-1">Коэффициент DTI</p>
            </div>
            
            {/* Chart Container */}
            <div className="mb-8 h-60">
              <canvas ref={chartRef} id="dtiChart"></canvas>
            </div>
            
            {/* Risk Assessment */}
            {riskData && (
              <div className={`p-4 rounded-md mb-6 ${riskData.colorClass}`}>
                <h3 className="font-semibold mb-1">{riskData.title}</h3>
                <p className="text-sm">{riskData.description}</p>
              </div>
            )}
            
            {/* Explanation */}
            <div className="text-sm text-[#4C566A] space-y-3">
              <p>
                <span className="font-medium">DTI (Debt-to-Income)</span> — это отношение всех ежемесячных долговых обязательств к вашему ежемесячному доходу до вычета налогов.
              </p>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-[#A3BE8C]"></div>
                <p>Низкий риск: 0-20%</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-[#EBCB8B]"></div>
                <p>Умеренный риск: 21-35%</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-[#BF616A]"></div>
                <p>Высокий риск: 36% и выше</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
