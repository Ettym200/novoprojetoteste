import { useState } from "react";
import AffiliateTable, { type Affiliate } from "../dashboard/AffiliateTable";
import AffiliateDetailModal from "../dashboard/AffiliateDetailModal";

// todo: remove mock functionality
const mockAffiliates: Affiliate[] = [
  {
    id: "1",
    name: "Raman",
    email: "raman@veloc.com",
    totalInvestment: 2908.50,
    registrations: 191,
    ftds: 29,
    deposits: 3074.22,
    ggr: 2534.61,
    ngr: 2100.45,
    roi: 12.87,
    conversionRate: 15.18,
    ranking: 1,
    status: "top",
  },
  {
    id: "2",
    name: "Cordeiro",
    email: "cordeiro@veloc.com",
    totalInvestment: 3210.61,
    registrations: 65,
    ftds: 20,
    deposits: 5849.27,
    ggr: 4816.56,
    ngr: 4200.33,
    roi: 49.99,
    conversionRate: 30.77,
    ranking: 2,
    status: "top",
  },
  {
    id: "3",
    name: "Naor",
    email: "naor@veloc.com",
    totalInvestment: 2650.14,
    registrations: 97,
    ftds: 26,
    deposits: 3248.33,
    ggr: 2671.40,
    ngr: 2300.10,
    roi: 0.80,
    conversionRate: 26.80,
    ranking: 3,
    status: "top",
  },
  {
    id: "4",
    name: "Bruno",
    email: "bruno@veloc.com",
    totalInvestment: 120.05,
    registrations: 4,
    ftds: 0,
    deposits: 0,
    ggr: 0,
    ngr: 0,
    roi: -100.00,
    conversionRate: 0,
    status: "below",
  },
  {
    id: "5",
    name: "Valter",
    email: "valter@veloc.com",
    totalInvestment: 366.55,
    registrations: 19,
    ftds: 3,
    deposits: 350.00,
    ggr: 290.50,
    ngr: 250.00,
    roi: -20.76,
    conversionRate: 15.79,
    status: "average",
  },
];

export default function AffiliateTableExample() {
  const [selectedAffiliate, setSelectedAffiliate] = useState<Affiliate | null>(null);

  return (
    <div className="p-4">
      <AffiliateTable
        affiliates={mockAffiliates}
        onViewDetails={(affiliate) => {
          setSelectedAffiliate(affiliate);
          console.log("View affiliate details:", affiliate.name);
        }}
      />
      <AffiliateDetailModal
        affiliate={selectedAffiliate}
        open={!!selectedAffiliate}
        onClose={() => setSelectedAffiliate(null)}
      />
    </div>
  );
}
