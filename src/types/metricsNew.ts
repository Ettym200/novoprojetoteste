// Tipos para a nova estrutura da API (Find Métricas Gerais New)

/**
 * Resposta de /metrics/gerais (nova estrutura)
 */
export interface MetricsGeraisNewResponse {
  success: boolean;
  message: string;
  data: {
    metricasGerais: {
      resumo: {
        atual: {
          totalInvestido: number;
          totalFTD: number;
          totalDepositos: number;
          totalSaques: number;
          GGR: number;
          NGR: number;
          lucroLiquido: number;
          roiFTD: number;
        };
        anterior: {
          totalInvestido: number;
          totalFTD: number;
          totalDepositos: number;
          totalSaques: number;
          GGR: number;
          NGR: number;
          lucroLiquido: number;
          roiFTD: number;
        };
      };
      eficaciaDeCaptacao: {
        atual: {
          custoLeadWhatsapp: number;
          custoCadastro: number;
          custoDeposito: number;
          custoFTD: number;
        };
        anterior: {
          custoLeadWhatsapp: number;
          custoCadastro: number;
          custoDeposito: number;
          custoFTD: number;
        };
      };
      funilDeConversao: {
        totalImpressions: number;
        funil: {
          pagina: {
            total: number;
            taxaConversaoTotal: number;
            taxaConversoes: number;
            taxaPerda: number;
          };
          whatsapp: {
            total: number;
            taxaConversaoTotal: number;
            taxaConversoes: number;
            taxaPerda: number;
          };
          cadastro: {
            total: number;
            taxaConversaoTotal: number;
            taxaConversoes: number;
            taxaPerda: number;
          };
          FTD: {
            total: number;
            taxaConversaoTotal: number;
            taxaConversoes: number;
            taxaPerda: number;
          };
          redeposito: {
            total: number;
            taxaConversaoTotal: number;
            taxaConversoes: number;
            taxaPerda: number;
          };
        };
      };
    };
  };
}

/**
 * Resposta de /metrics/afiliados (nova estrutura)
 */
export interface MetricsAfiliadosNewResponse {
  success: boolean;
  message: string;
  data: {
    metricasAfiliados: {
      resumo: {
        totalAfiliados: number;
        topPerformers: number;
        totalFTD: number;
        GGR: number;
        NGR: number;
        lucroLiquido: number;
      };
      afiliados: Array<{
        affiliate: string;
        topPerformer: boolean;
        metrics: {
          atual: {
            totalCadastros: number;
            totalClientes: number;
            totalDepositos: number;
            totalFTDs: number;
            totalValorDepositos: number;
            totalValorFTDs: number;
            uniquePlayersWithDeposits: number;
            depositosPorPlayer: number;
            valorMedioDeposito: number;
            valorMedioFTD: number;
            valorMedioDepositoPorPlayer: number;
            totalSaques: number;
            totalValorSaques: number;
            uniquePlayersWithWithdraws: number;
            saquesPorPlayer: number;
            valorMedioSaque: number;
            valorMedioSaquePorPlayer: number;
            totalInvestido: number;
            custoCadastro: number;
            custoDeposito: number;
            custoFTD: number;
            custoLeadWhatsapp: number;
            roiFTD: number;
            ggr: number;
            taxaDeposito: number;
            taxaSaque: number;
            taxaPlataforma: number;
            custosFixos: number;
            ngr: number;
            lucroLiquido: number;
            cpmTotal: number;
            custoPClickLink: number;
            ctrUnico: number;
          };
          anterior: {
            totalCadastros: number;
            totalClientes: number;
            totalDepositos: number;
            totalFTDs: number;
            totalValorDepositos: number;
            totalValorFTDs: number;
            uniquePlayersWithDeposits: number;
            depositosPorPlayer: number;
            valorMedioDeposito: number;
            valorMedioFTD: number;
            valorMedioDepositoPorPlayer: number;
            totalSaques: number;
            totalValorSaques: number;
            uniquePlayersWithWithdraws: number;
            saquesPorPlayer: number;
            valorMedioSaque: number;
            valorMedioSaquePorPlayer: number;
            totalInvestido: number;
            custoCadastro: number;
            custoDeposito: number;
            custoFTD: number;
            custoLeadWhatsapp: number | null;
            roiFTD: number | null;
            ggr: number;
            taxaDeposito: number;
            taxaSaque: number;
            taxaPlataforma: number;
            custosFixos: number;
            ngr: number;
            lucroLiquido: number;
            cpmTotal: number;
            custoPClickLink: number;
            ctrUnico: number;
          };
        };
      }>;
    };
  };
}

/**
 * Resposta de /metrics/campanhas (nova estrutura)
 */
export interface MetricsCampanhasNewResponse {
  success: boolean;
  message: string;
  data: {
    metricasCampanhas: {
      resumo: {
        campanhasAtivas: number;
        impressoes: number;
        CTRMedio: number;
        totalInvestido: number;
        totalFTD: number;
        custoMedioFTD: number;
      };
      campanhas: Record<string, {
        campaignName: string;
        spend: number;
        impressions: number;
        clicks: number;
        cpm: number;
        ftdCount: number;
        ftdAmount: number;
        registeredCount: number;
        depositCount: number;
        depositAmount: number;
        messageCount: number;
        costPerFtd: number;
        costPerRegistered: number;
        costPerDeposit: number;
        costPerMessage: number;
      }>;
    };
  };
}

