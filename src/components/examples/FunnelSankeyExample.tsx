import FunnelSankey from "../dashboard/FunnelSankey";

const mockStages = [
  { id: "1", name: "Facebook", value: 25500, color: "#1877F2" },
  { id: "2", name: "Página", value: 17850, color: "#6366F1" },
  { id: "3", name: "WhatsApp", value: 10500, color: "#25D366" },
  { id: "4", name: "Corretora", value: 4200, color: "#F59E0B" },
  { id: "5", name: "Cadastro", value: 378, color: "#8B5CF6" },
  { id: "6", name: "FTD", value: 79, color: "#10B981" },
  { id: "7", name: "Redepósito", value: 35, color: "#06B6D4" },
];

export default function FunnelSankeyExample() {
  return (
    <div className="p-4">
      <FunnelSankey stages={mockStages} title="Funil de Conversão" />
    </div>
  );
}
