import InsightCard, { type Insight } from "../dashboard/InsightCard";

// todo: remove mock functionality
const mockInsights: Insight[] = [
  {
    id: "1",
    type: "danger",
    title: "Queda abrupta no ROI",
    description: "O ROI geral caiu 45% em comparação com o período anterior. Verifique as campanhas ativas.",
    metric: "ROI Atual",
    metricValue: "-15.3%",
  },
  {
    id: "2",
    type: "warning",
    title: "Alta taxa de churn",
    description: "32% dos jogadores abandonaram o funil na etapa de WhatsApp nos últimos 7 dias.",
    metric: "Taxa de Churn",
    metricValue: "32%",
  },
  {
    id: "3",
    type: "success",
    title: "Afiliado em destaque",
    description: "Cordeiro atingiu 150% da meta mensal com ROI de 49.99%. Considere aumentar o budget.",
    metric: "Meta Atingida",
    metricValue: "150%",
  },
  {
    id: "4",
    type: "tip",
    title: "Oportunidade identificada",
    description: "Campanhas de remarketing têm 3x mais conversão. Considere alocar mais budget.",
    metric: "Conversão Extra",
    metricValue: "+200%",
  },
  {
    id: "5",
    type: "info",
    title: "Período de análise",
    description: "Os dados exibidos correspondem aos últimos 30 dias. Ajuste o filtro para outras análises.",
  },
];

export default function InsightCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      {mockInsights.map((insight) => (
        <InsightCard
          key={insight.id}
          insight={insight}
          onClick={(i) => console.log("Insight clicked:", i.title)}
        />
      ))}
    </div>
  );
}
