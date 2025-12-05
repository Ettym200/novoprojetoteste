import MetricChart, { type ChartDataPoint } from "../dashboard/MetricChart";

// todo: remove mock functionality
const revenueData: ChartDataPoint[] = [
  { name: "01/11", deposits: 12500, withdrawals: 3200, ggr: 9300 },
  { name: "05/11", deposits: 15800, withdrawals: 4100, ggr: 11700 },
  { name: "10/11", deposits: 18200, withdrawals: 5500, ggr: 12700 },
  { name: "15/11", deposits: 14300, withdrawals: 3800, ggr: 10500 },
  { name: "20/11", deposits: 22100, withdrawals: 6200, ggr: 15900 },
  { name: "25/11", deposits: 19500, withdrawals: 4800, ggr: 14700 },
  { name: "27/11", deposits: 14722, withdrawals: 2077, ggr: 12645 },
];

const conversionData: ChartDataPoint[] = [
  { name: "01/11", ftds: 12, registrations: 85 },
  { name: "05/11", ftds: 18, registrations: 120 },
  { name: "10/11", ftds: 15, registrations: 95 },
  { name: "15/11", ftds: 22, registrations: 140 },
  { name: "20/11", ftds: 28, registrations: 175 },
  { name: "25/11", ftds: 19, registrations: 110 },
  { name: "27/11", ftds: 79, registrations: 378 },
];

export default function MetricChartExample() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
      <MetricChart
        title="Receitas e Saques"
        data={revenueData}
        type="area"
        dataKeys={[
          { key: "deposits", color: "hsl(var(--chart-3))", name: "Depósitos" },
          { key: "withdrawals", color: "hsl(var(--destructive))", name: "Saques" },
          { key: "ggr", color: "hsl(var(--chart-1))", name: "GGR" },
        ]}
      />
      <MetricChart
        title="Conversões"
        data={conversionData}
        type="bar"
        dataKeys={[
          { key: "registrations", color: "hsl(var(--chart-2))", name: "Cadastros" },
          { key: "ftds", color: "hsl(var(--chart-1))", name: "FTDs" },
        ]}
      />
    </div>
  );
}
