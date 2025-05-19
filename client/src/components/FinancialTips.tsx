import { Card, CardContent } from "@/components/ui/card";

export default function FinancialTips() {
  return (
    <Card className="mt-10 bg-white rounded-lg shadow-md">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4 text-[#5E81AC]">Финансовые рекомендации</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <h3 className="font-medium text-[#3B4252]">Низкий DTI (0-20%)</h3>
            <p className="text-sm text-[#4C566A]">
              Вы находитесь в хорошем финансовом положении. Можете рассмотреть возможности для инвестирования и роста капитала.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium text-[#3B4252]">Умеренный DTI (21-35%)</h3>
            <p className="text-sm text-[#4C566A]">
              Контролируйте расходы и избегайте новых крупных займов. Рассмотрите возможность реструктуризации существующих долгов.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium text-[#3B4252]">Высокий DTI (36%+)</h3>
            <p className="text-sm text-[#4C566A]">
              Сосредоточьтесь на уменьшении долговой нагрузки. Создайте план погашения долгов и сократите необязательные расходы.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
