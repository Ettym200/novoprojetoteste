import MetricChart from "../dashboard/MetricChart";

export default function MetricChartExample() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
      <MetricChart
        title="Receitas e Saques"
        data={[]}
        type="area"
        dataKeys={[
          { key: "deposits", color: "hsl(var(--chart-3))", name: "Depósitos" },
          { key: "withdrawals", color: "hsl(var(--destructive))", name: "Saques" },
          { key: "ggr", color: "hsl(var(--chart-1))", name: "GGR" },
        ]}
      />
      <MetricChart
        title="Conversões"
        data={[]}
        type="bar"
        dataKeys={[
          { key: "registrations", color: "hsl(var(--chart-2))", name: "Cadastros" },
          { key: "ftds", color: "hsl(var(--chart-1))", name: "FTDs" },
        ]}
      />
    </div>
  );
}
