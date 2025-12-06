import { useState } from "react";
import AffiliateTable from "../dashboard/AffiliateTable";
import type { Affiliate } from "@/types/affiliate";
import AffiliateDetailModal from "../dashboard/AffiliateDetailModal";

export default function AffiliateTableExample() {
  const [selectedAffiliate, setSelectedAffiliate] = useState<Affiliate | null>(null);

  return (
    <div className="p-4">
      <AffiliateTable
        affiliates={[]}
        onViewDetails={(affiliate) => {
          setSelectedAffiliate(affiliate);
          // Exemplo: ação ao visualizar detalhes do afiliado
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
