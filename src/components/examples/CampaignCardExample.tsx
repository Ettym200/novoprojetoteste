import CampaignCard from "../dashboard/CampaignCard";
import type { Campaign } from "@/types/campaign";

export default function CampaignCardExample() {
  const campaigns: Campaign[] = [];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {campaigns.map((campaign) => (
        <CampaignCard
          key={campaign.id}
          campaign={campaign}
          onClick={() => {
            // Exemplo: ação ao clicar na campanha
          }}
        />
      ))}
    </div>
  );
}
