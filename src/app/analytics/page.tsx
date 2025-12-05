"use client"

import KpiCard from "@/components/dashboard/KpiCard";
import MetricChart from "@/components/dashboard/MetricChart";
import DashboardHeader from "@/components/layout/DashboardHeader";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Clock, TrendingDown, Users, BarChart3, Percent } from "lucide-react";

// todo: remove mock functionality
const churnByStage = [
  { name: "Facebook", churn: 30, retained: 70 },
  { name: "Página", churn: 41, retained: 59 },
  { name: "WhatsApp", churn: 60, retained: 40 },
  { name: "Corretora", churn: 91, retained: 9 },
  { name: "Cadastro", churn: 79, retained: 21 },
  { name: "FTD", churn: 56, retained: 44 },
];

// todo: remove mock functionality
const timeByStage = [
  { stage: "Facebook → Página", avgTime: "2.3 dias", median: "1.8 dias", dropoff: "30%" },
  { stage: "Página → WhatsApp", avgTime: "1.5 dias", median: "1.2 dias", dropoff: "41%" },
  { stage: "WhatsApp → Corretora", avgTime: "3.2 dias", median: "2.5 dias", dropoff: "60%" },
  { stage: "Corretora → Cadastro", avgTime: "1.1 dias", median: "0.8 dias", dropoff: "91%" },
  { stage: "Cadastro → FTD", avgTime: "2.8 dias", median: "2.1 dias", dropoff: "79%" },
  { stage: "FTD → Redepósito", avgTime: "5.5 dias", median: "4.2 dias", dropoff: "56%" },
];

// todo: remove mock functionality
const affiliateChurn = [
  { name: "Raman", churnRate: 12.5, players: 191, churned: 24 },
  { name: "Cordeiro", churnRate: 8.3, players: 65, churned: 5 },
  { name: "Naor", churnRate: 15.2, players: 97, churned: 15 },
  { name: "Bruno", churnRate: 45.0, players: 4, churned: 2 },
  { name: "Valter", churnRate: 22.1, players: 19, churned: 4 },
];

// todo: remove mock functionality
const retentionData = [
  { name: "Sem 1", d1: 85, d7: 62, d30: 45 },
  { name: "Sem 2", d1: 88, d7: 65, d30: 48 },
  { name: "Sem 3", d1: 82, d7: 58, d30: 42 },
  { name: "Sem 4", d1: 90, d7: 70, d30: 52 },
];

export default function Analytics() {
  const avgChurnRate = (
    affiliateChurn.reduce((sum, a) => sum + a.churnRate, 0) / affiliateChurn.length
  ).toFixed(1);

  const totalChurned = affiliateChurn.reduce((sum, a) => sum + a.churned, 0);

  return (
    <div className="flex flex-col h-full">
      <DashboardHeader
        title="Análises"
        subtitle="Análise de engajamento e retenção"
      />

      <div className="flex-1 overflow-auto p-6 space-y-6">
        <section>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <KpiCard
              title="Tempo Médio no Funil"
              value="16.4 dias"
              change={-12.5}
              icon={<Clock className="w-5 h-5 text-primary" />}
              iconBgClass="bg-primary/10"
            />
            <KpiCard
              title="Taxa de Churn Geral"
              value={avgChurnRate + "%"}
              change={-8.2}
              icon={<TrendingDown className="w-5 h-5 text-red-500" />}
              iconBgClass="bg-red-500/10"
            />
            <KpiCard
              title="Total Churned"
              value={totalChurned.toString()}
              icon={<Users className="w-5 h-5 text-amber-500" />}
              iconBgClass="bg-amber-500/10"
            />
            <KpiCard
              title="Retenção D30"
              value="47%"
              change={5.3}
              icon={<Percent className="w-5 h-5 text-emerald-500" />}
              iconBgClass="bg-emerald-500/10"
            />
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MetricChart
            title="Churn por Etapa do Funil"
            data={churnByStage}
            type="bar"
            dataKeys={[
              { key: "churn", color: "hsl(var(--destructive))", name: "Churn %" },
              { key: "retained", color: "hsl(var(--chart-3))", name: "Retidos %" },
            ]}
            height={280}
          />
          <MetricChart
            title="Retenção por Cohort"
            data={retentionData}
            type="line"
            dataKeys={[
              { key: "d1", color: "hsl(var(--chart-1))", name: "D1" },
              { key: "d7", color: "hsl(var(--chart-2))", name: "D7" },
              { key: "d30", color: "hsl(var(--chart-3))", name: "D30" },
            ]}
            height={280}
          />
        </section>

        <section>
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">Tempo Médio por Etapa</h3>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transição</TableHead>
                  <TableHead>Tempo Médio</TableHead>
                  <TableHead>Mediana</TableHead>
                  <TableHead>Taxa de Abandono</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {timeByStage.map((row) => (
                  <TableRow key={row.stage}>
                    <TableCell className="font-medium">{row.stage}</TableCell>
                    <TableCell className="tabular-nums">{row.avgTime}</TableCell>
                    <TableCell className="tabular-nums">{row.median}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          parseFloat(row.dropoff) > 50 ? "destructive" : "secondary"
                        }
                      >
                        {row.dropoff}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </section>

        <section>
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">Churn por Afiliado</h3>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Afiliado</TableHead>
                  <TableHead>Total Players</TableHead>
                  <TableHead>Churned</TableHead>
                  <TableHead>Taxa de Churn</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {affiliateChurn
                  .sort((a, b) => b.churnRate - a.churnRate)
                  .map((row) => (
                    <TableRow key={row.name}>
                      <TableCell className="font-medium">{row.name}</TableCell>
                      <TableCell className="tabular-nums">{row.players}</TableCell>
                      <TableCell className="tabular-nums">{row.churned}</TableCell>
                      <TableCell>
                        <Badge
                          variant={row.churnRate > 20 ? "destructive" : "secondary"}
                        >
                          {row.churnRate.toFixed(1)}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </Card>
        </section>
      </div>
    </div>
  );
}
