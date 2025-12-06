// Tipos para respostas reais da API de métricas

/**
 * Resposta de /metrics/gerais
 */
export interface MetricsGeraisResponse {
  success: boolean;
  message: string;
  data: Array<{
    affiliate: string;
    metrics: {
      // Cadastros e Clientes
      totalCadastrosAtual: number;
      totalCadastrosAnterior: number;
      totalClientesAtual: number;
      totalClientesAnterior: number;
      
      // Depósitos
      totalDepositosAtual: number;
      totalDepositosAnterior: number;
      totalValorDepositosAtual: number;
      totalValorDepositosAnterior: number;
      uniquePlayersWithDepositsAtual: number;
      uniquePlayersWithDepositsAnterior: number;
      depositosPorPlayerAtual: number;
      depositosPorPlayerAnterior: number;
      valorMedioDepositoAtual: number;
      valorMedioDepositoAnterior: number;
      valorMedioDepositoPorPlayerAtual: number;
      valorMedioDepositoPorPlayerAnterior: number;
      
      // FTDs
      totalFTDsAtual: number;
      totalFTDsAnterior: number;
      totalValorFTDsAtual: number;
      totalValorFTDsAnterior: number;
      valorMedioFTDAtual: number;
      valorMedioFTDAnterior: number;
      
      // Saques
      totalSaquesAtual: number;
      totalSaquesAnterior: number;
      totalValorSaquesAtual: number;
      totalValorSaquesAnterior: number;
      uniquePlayersWithWithdrawsAtual: number;
      uniquePlayersWithWithdrawsAnterior: number;
      saquesPorPlayerAtual: number;
      saquesPorPlayerAnterior: number;
      valorMedioSaqueAtual: number;
      valorMedioSaqueAnterior: number;
      valorMedioSaquePorPlayerAtual: number;
      valorMedioSaquePorPlayerAnterior: number;
      
      // Investimento e Custos
      totalInvestidoAtual: number;
      totalInvestidoAnterior: number;
      custoCadastroAtual: number;
      custoCadastroAnterior: number;
      custoDepositoAtual: number;
      custoDepositoAnterior: number;
      custoFTDAtual: number;
      custoFTDAnterior: number;
      custoLeadWhatsappAtual: number | null;
      custoLeadWhatsappAnterior: number | null;
      
      // ROI e Performance
      roiFTDAtual: number | null;
      roiFTDAnterior: number | null;
      
      // Receitas
      ggrAtual: number;
      ggrAnterior: number;
      taxaDepositoAtual: number;
      taxaDepositoAnterior: number;
      taxaSaqueAtual: number;
      taxaSaqueAnterior: number;
      taxaPlataformaAtual: number;
      taxaPlataformaAnterior: number;
      custosFixosAtual: number;
      custosFixosAnterior: number;
      ngrAtual: number;
      ngrAnterior: number;
      lucroLiquidoAtual: number;
      lucroLiquidoAnterior: number;
      
      // Marketing
      cpmTotalAtual: number;
      cpmTotalAnterior: number;
      custoPClickLinkAtual: number;
      custoPClickLinkAnterior: number;
      ctrUnicoAtual: number;
      ctrUnicoAnterior: number;
    };
  }>;
}

/**
 * Resposta de /metrics/engajamento
 */
export interface MetricsEngajamentoResponse {
  success: boolean;
  message: string;
  data: Array<{
    affiliate: string;
    facebook: {
      impressoes: number;
      cliques: number;
      ctrUnico: number;
      cpc: number;
      cpm: number;
      frequencia: number;
      cliquesCadastro: number;
      cliquesFtd: number;
    };
    whatsapp: {
      assinaturas: number;
      iniciaramConversa: number;
      perdaAssinaturaWpp: number;
      percentualResponderam1Msg: number;
      abandono: number;
      cadastro: number;
      conversaoWppCadastro: number;
      ftd: number;
      conversaoCadastroFtd: number;
      conversaoWppFtd: number;
      custoPorDeposit: number;
    };
    vturb: {
      playsUnicos: number;
      retencaoMedia: number;
      cliquesUnicos: number;
      percentualCliques: number;
    };
  }>;
}

/**
 * Resposta de /metrics/campanhas
 */
export interface MetricsCampanhasResponse {
  success: boolean;
  message: string;
  data: Record<string, {
    campaign_name: string;
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
}

