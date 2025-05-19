import { Card, CardContent } from "@/components/ui/card";
import { Shield, ArrowUpRight, AlertTriangle } from "lucide-react";

export default function FinancialTips() {
  return (
    <Card className="mt-6 sm:mt-10 bg-white rounded-lg shadow-md">
      <CardContent className="p-4 sm:p-6">
        <h2 className="text-xl font-semibold mb-4 text-[#5E81AC]">Финансовые рекомендации</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <div className="space-y-2 p-3 rounded-md bg-[#A3BE8C] bg-opacity-5 border border-[#A3BE8C] border-opacity-20">
            <div className="flex items-center gap-2">
              <Shield size={18} className="text-[#A3BE8C]" />
              <h3 className="font-medium text-[#3B4252]">Низкий DTI (0-20%)</h3>
            </div>
            <p className="text-sm text-[#4C566A]">
              Вы находитесь в хорошем финансовом положении. Можете рассмотреть возможности для инвестирования и роста капитала.
            </p>
          </div>
          <div className="space-y-2 p-3 rounded-md bg-[#EBCB8B] bg-opacity-5 border border-[#EBCB8B] border-opacity-20">
            <div className="flex items-center gap-2">
              <ArrowUpRight size={18} className="text-[#EBCB8B]" />
              <h3 className="font-medium text-[#3B4252]">Умеренный DTI (21-35%)</h3>
            </div>
            <p className="text-sm text-[#4C566A]">
              Контролируйте расходы и избегайте новых крупных займов. Рассмотрите возможность реструктуризации существующих долгов.
            </p>
          </div>
          <div className="space-y-2 p-3 rounded-md bg-[#BF616A] bg-opacity-5 border border-[#BF616A] border-opacity-20">
            <div className="flex items-center gap-2">
              <AlertTriangle size={18} className="text-[#BF616A]" />
              <h3 className="font-medium text-[#3B4252]">Высокий DTI (36%+)</h3>
            </div>
            <p className="text-sm text-[#4C566A]">
              Сосредоточьтесь на уменьшении долговой нагрузки. Создайте план погашения долгов и сократите необязательные расходы.
            </p>
          </div>
        </div>

        <div className="mt-6 p-3 sm:p-4 rounded-md bg-[#ECEFF4] text-sm">
          <h3 className="font-medium text-[#3B4252] mb-2">Общие советы по управлению долгами:</h3>
          <ul className="list-disc pl-5 text-[#4C566A] space-y-1">
            <li>Приоритизируйте погашение займов с наивысшими процентными ставками</li>
            <li>Создайте бюджет и отслеживайте все расходы, чтобы выявить возможности для экономии</li>
            <li>Рассмотрите возможность консолидации долгов для снижения общей процентной ставки</li>
            <li>Избегайте использования кредитных карт для повседневных расходов, если не можете погасить баланс полностью</li>
            <li>Накопите резервный фонд для непредвиденных расходов, чтобы избежать новых займов в чрезвычайных ситуациях</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
