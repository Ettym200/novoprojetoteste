import InsightCard, { type Insight } from "../dashboard/InsightCard";

export default function InsightCardExample() {
  const insights: Insight[] = [];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      {insights.map((insight) => (
        <InsightCard
          key={insight.id}
          insight={insight}
          onClick={() => {
            // Exemplo: ação ao clicar no insight
          }}
        />
      ))}
    </div>
  );
}
