import KpiCard from "../dashboard/KpiCard";
import { DollarSign, Users, Target, TrendingUp, Wallet, BarChart3, PiggyBank, ArrowDownCircle } from "lucide-react";

export default function KpiCardExample() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
      <KpiCard
        title="Total Investido"
        value="R$ 9.240,61"
        change={-56.48}
        icon={<DollarSign className="w-5 h-5 text-primary" />}
        iconBgClass="bg-primary/10"
      />
      <KpiCard
        title="Total de FTD"
        value="R$ 9.359,64"
        change={-81.84}
        icon={<Target className="w-5 h-5 text-emerald-500" />}
        iconBgClass="bg-emerald-500/10"
      />
      <KpiCard
        title="Total de Depósitos"
        value="R$ 14.722,95"
        change={-82.89}
        icon={<ArrowDownCircle className="w-5 h-5 text-blue-500" />}
        iconBgClass="bg-blue-500/10"
      />
      <KpiCard
        title="Total de Saques"
        value="R$ 2.077,01"
        change={-97.19}
        icon={<Wallet className="w-5 h-5 text-amber-500" />}
        iconBgClass="bg-amber-500/10"
      />
      <KpiCard
        title="GGR"
        value="R$ 12.645,94"
        change={256.82}
        icon={<TrendingUp className="w-5 h-5 text-emerald-500" />}
        iconBgClass="bg-emerald-500/10"
      />
      <KpiCard
        title="NGR"
        value="R$ 10.413,05"
        change={-199.57}
        icon={<BarChart3 className="w-5 h-5 text-purple-500" />}
        iconBgClass="bg-purple-500/10"
      />
      <KpiCard
        title="Lucro Líquido"
        value="R$ 1.172,44"
        change={-103.70}
        icon={<PiggyBank className="w-5 h-5 text-cyan-500" />}
        iconBgClass="bg-cyan-500/10"
      />
      <KpiCard
        title="ROI de FTD"
        value="0,01%"
        change={-99.09}
        icon={<Users className="w-5 h-5 text-rose-500" />}
        iconBgClass="bg-rose-500/10"
      />
    </div>
  );
}
