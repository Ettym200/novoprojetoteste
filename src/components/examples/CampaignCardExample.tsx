import CampaignCard, { type Campaign } from "../dashboard/CampaignCard";

// todo: remove mock functionality
const mockCampaigns: Campaign[] = [
  {
    id: "1",
    name: "Black Friday 2025",
    platform: "Facebook Ads",
    status: "active",
    impressions: 125000,
    clicks: 4500,
    ctr: 3.60,
    cpc: 0.85,
    cpm: 12.50,
    spend: 3825.00,
    ftds: 45,
    costPerFtd: 85.00,
    revenue: 6750.00,
    roi: 76.47,
  },
  {
    id: "2",
    name: "Natal Especial",
    platform: "Facebook Ads",
    status: "active",
    impressions: 85000,
    clicks: 2800,
    ctr: 3.29,
    cpc: 0.92,
    cpm: 14.20,
    spend: 2576.00,
    ftds: 28,
    costPerFtd: 92.00,
    revenue: 3920.00,
    roi: 52.17,
  },
  {
    id: "3",
    name: "Leads Premium",
    platform: "Instagram Ads",
    status: "paused",
    impressions: 45000,
    clicks: 1200,
    ctr: 2.67,
    cpc: 1.25,
    cpm: 18.50,
    spend: 1500.00,
    ftds: 12,
    costPerFtd: 125.00,
    revenue: 1440.00,
    roi: -4.00,
  },
  {
    id: "4",
    name: "Tráfego Direto",
    platform: "Google Ads",
    status: "ended",
    impressions: 32000,
    clicks: 800,
    ctr: 2.50,
    cpc: 1.50,
    cpm: 22.00,
    spend: 1200.00,
    ftds: 8,
    costPerFtd: 150.00,
    revenue: 960.00,
    roi: -20.00,
  },
];

export default function CampaignCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {mockCampaigns.map((campaign) => (
        <CampaignCard
          key={campaign.id}
          campaign={campaign}
          onClick={(c) => console.log("Campaign clicked:", c.name)}
        />
      ))}
    </div>
  );
}
