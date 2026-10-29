import {
  Utilizador,
  Embarcacao,
  AgenciaMaritima,
  Armador,
  PortoTerminal,
  Atracacao,
  Factura,
  TransacaoTesouraria,
  Inspeccao,
  CertificadoMaritimo,
  LicencaNavegacao,
  MultaInfracao,
  ParamentroTaxaPortuaria,
  RubricaReceita,
  LogAcessoAutenticacao,
  ConfiguraçãoServidor,
  FaturaIMP,
  ReciboIMP,
  CaixaMov,
  AuditoriaLog
} from '../types';

export const mockUtilizadores: Utilizador[] = [
  {
    id: 'USR-SA',
    nome: 'Eng. SuperAdministrador',
    firstName: 'Super',
    lastName: 'Administrador',
    email: 'superadmin@imp.gw',
    cargo: 'Engenheiro de Sistemas / Desenvolvedor',
    funcao: 'superadmin',
    role: 'superadmin',
    departamento: 'Tecnologias de Informação & Auditoria',
    status: 'Ativo',
    active: true,
    failedAttempts: 0,
    lockUntil: null,
    gender: 'M',
    birthDate: '1988-04-12',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    fotoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    telefone: '+245 95 777 0001',
    senha: 'superadmin123',
    ultimoAcesso: '2026-10-23 09:00'
  },
  {
    id: 'USR-001',
    nome: 'Dr. Gualdino Afonso Té',
    firstName: 'Gualdino',
    lastName: 'Afonso Té',
    email: 'admin@imp.gw',
    cargo: 'Presidente do Conselho (PCA / Admin)',
    funcao: 'admin',
    role: 'admin',
    departamento: 'Direcção Geral (IMP)',
    status: 'Ativo',
    active: true,
    failedAttempts: 0,
    lockUntil: null,
    gender: 'M',
    birthDate: '1972-11-20',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    fotoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    telefone: '+245 95 512 3456',
    senha: 'admin123',
    ultimoAcesso: '2026-10-23 08:30'
  },
  {
    id: 'USR-FAT',
    nome: 'Sr. António Okica de Sá',
    firstName: 'António',
    lastName: 'Okica de Sá',
    email: 'faturacao@imp.gw',
    cargo: 'Operador de Faturação',
    funcao: 'faturacao',
    role: 'faturacao',
    departamento: 'Secção de Faturação & Tarifas Portuárias',
    status: 'Ativo',
    active: true,
    failedAttempts: 0,
    lockUntil: null,
    gender: 'M',
    birthDate: '1985-06-15',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    fotoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    telefone: '+245 95 333 4455',
    senha: 'faturacao123',
    ultimoAcesso: '2026-10-23 08:15'
  },
  {
    id: 'USR-CX',
    nome: 'Dr. Álvaro Luís Da Silva',
    firstName: 'Álvaro',
    lastName: 'Luís Da Silva',
    email: 'caixa@imp.gw',
    cargo: 'Operador de Caixa / Tesouraria',
    funcao: 'caixa',
    role: 'caixa',
    departamento: 'Tesouraria & Controlo de Valores',
    status: 'Ativo',
    active: true,
    failedAttempts: 0,
    lockUntil: null,
    gender: 'M',
    birthDate: '1984-03-24',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
    fotoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
    telefone: '+245 96 333 4455',
    senha: 'caixa123',
    ultimoAcesso: '2026-10-23 08:45'
  },
  {
    id: 'USR-002',
    nome: 'Eng. Adama Baldé',
    firstName: 'Adama',
    lastName: 'Baldé',
    email: 'adama.balde@imp.gb',
    cargo: 'Inspector Chefe de Segurança',
    funcao: 'INSPECTOR',
    departamento: 'Inspecção e Segurança Marítima',
    status: 'Ativo',
    active: true,
    failedAttempts: 0,
    lockUntil: null,
    gender: 'M',
    birthDate: '1982-08-10',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    fotoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    telefone: '+245 96 678 9012',
    senha: 'InspectorPass2026!',
    ultimoAcesso: '2026-10-22 10:15'
  },
  {
    id: 'USR-003',
    nome: 'Capitão Bacar Camará',
    firstName: 'Bacar',
    lastName: 'Camará',
    email: 'bacar.camara@imp.gb',
    cargo: 'Capitão do Porto de Bissau',
    funcao: 'CAPITANIA',
    departamento: 'Capitania dos Portos',
    status: 'Ativo',
    active: true,
    failedAttempts: 0,
    lockUntil: null,
    gender: 'M',
    birthDate: '1975-02-14',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=256&q=80',
    fotoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=256&q=80',
    telefone: '+245 95 888 1122',
    senha: 'Capitania2026!',
    ultimoAcesso: '2026-10-22 09:45'
  }
];

export const mockArmadores: Armador[] = [
  {
    id: 'ARM-101',
    nomeRazaoSocial: 'CMA CGM Shipping Lines Africa',
    paisOrigem: 'França',
    tipoEntidade: 'Estrangeiro',
    contactoOficial: '+33 4 88 91 00 00',
    email: 'ops.westafrica@cmacgm.com',
    frotaContada: 12
  },
  {
    id: 'ARM-102',
    nomeRazaoSocial: 'Companhia de Navegação Fluvial das Bijagós (CNFB)',
    paisOrigem: 'Guiné-Bissau',
    tipoEntidade: 'Nacional',
    contactoOficial: '+245 95 512 34 56',
    email: 'frota@cnfb.gw',
    frotaContada: 5
  },
  {
    id: 'ARM-103',
    nomeRazaoSocial: 'Maersk Line West Africa B.V.',
    paisOrigem: 'Dinamarca',
    tipoEntidade: 'Estrangeiro',
    contactoOficial: '+45 33 63 33 63',
    email: 'bissau.ops@maersk.com',
    frotaContada: 18
  }
];

export const mockAgencias: AgenciaMaritima[] = [
  {
    id: 'AGE-201',
    nomeComercial: 'Agência Marítima e Portuária da Guiné (AMPG)',
    nif: '500123489',
    licencaAtividade: 'LIC-AMP-2025/04',
    responsavelLegal: 'Sr. Malam Sambú',
    telefone: '+245 96 610 20 30',
    email: 'atendimento@ampg.gw',
    endereco: 'Avenida Amílcar Cabral, nº 42, Bissau',
    embarcacoesRepresentadas: 8,
    status: 'Ativa'
  },
  {
    id: 'AGE-202',
    nomeComercial: 'Sociedade de Agenciamento Marítimo do Geba (SAMG)',
    nif: '500987654',
    licencaAtividade: 'LIC-AMP-2024/11',
    responsavelLegal: 'Sra. Aissatu Mane',
    telefone: '+245 95 588 44 11',
    email: 'operacoes@samg.gw',
    endereco: 'Rua do Porto, Cais de Bissau',
    embarcacoesRepresentadas: 14,
    status: 'Ativa'
  }
];

export const mockPortos: PortoTerminal[] = [
  {
    id: 'POR-01',
    nomePorto: 'Porto Comercial de Bissau',
    codigoUNLOCODE: 'GWOXB',
    localizacao: 'Rio Geba, Bissau',
    numCaisDisponiveis: 4,
    caladoMaximoPermitido: 9.5,
    capacidadeOperacional: 'Navios Porta-Contentores, Carga Geral e Petroleiros',
    autoridadePortuaria: 'APGB / IMP Guiné-Bissau'
  },
  {
    id: 'POR-02',
    nomePorto: 'Porto Fluvial de Buba',
    codigoUNLOCODE: 'GWBUB',
    localizacao: 'Rio Grande de Buba, Região de Quinara',
    numCaisDisponiveis: 2,
    caladoMaximoPermitido: 6.0,
    capacidadeOperacional: 'Cabotagem Nacional e Bauxite (Projecto)',
    autoridadePortuaria: 'IMP Guiné-Bissau'
  },
  {
    id: 'POR-03',
    nomePorto: 'Porto de Cacheu',
    codigoUNLOCODE: 'GWCCE',
    localizacao: 'Rio Cacheu, Região de Cacheu',
    numCaisDisponiveis: 2,
    caladoMaximoPermitido: 5.2,
    capacidadeOperacional: 'Cabotagem e Pesca Nacional',
    autoridadePortuaria: 'IMP Guiné-Bissau'
  }
];

export const mockEmbarcacoes: Embarcacao[] = [
  {
    id: 'EMB-001',
    nome: 'MV Rio Geba Express',
    numeroIMO: 'IMO9874512',
    indicativoChamada: 'J5GA1',
    bandeira: 'Guiné-Bissau',
    portoRegisto: 'Porto de Bissau',
    tipo: 'Passageiros / Ferry',
    tonelagemBruta: 1250,
    comprimentoForaFora: 62.5,
    caladoMaximo: 3.8,
    anoConstrucao: 2018,
    armadorId: 'ARM-102',
    armadorNome: 'Companhia de Navegação Fluvial das Bijagós (CNFB)',
    agenciaId: 'AGE-201',
    agenciaNome: 'Agência Marítima e Portuária da Guiné (AMPG)',
    statusCertificacao: 'Válida'
  },
  {
    id: 'EMB-002',
    nome: 'CMA CGM Atlantic Star',
    numeroIMO: 'IMO9432188',
    indicativoChamada: 'FMAA9',
    bandeira: 'França',
    portoRegisto: 'Marseille',
    tipo: 'Porta-Contentores',
    tonelagemBruta: 18400,
    comprimentoForaFora: 175.0,
    caladoMaximo: 8.9,
    anoConstrucao: 2021,
    armadorId: 'ARM-101',
    armadorNome: 'CMA CGM Shipping Lines Africa',
    agenciaId: 'AGE-202',
    agenciaNome: 'Sociedade de Agenciamento Marítimo do Geba (SAMG)',
    statusCertificacao: 'Válida'
  },
  {
    id: 'EMB-003',
    nome: 'MT Bissau Trader',
    numeroIMO: 'IMO9120984',
    indicativoChamada: 'J5BT3',
    bandeira: 'Panamá',
    portoRegisto: 'Panama City',
    tipo: 'Petroleiro',
    tonelagemBruta: 8900,
    comprimentoForaFora: 128.0,
    caladoMaximo: 7.2,
    anoConstrucao: 2014,
    armadorId: 'ARM-103',
    armadorNome: 'Maersk Line West Africa B.V.',
    agenciaId: 'AGE-201',
    agenciaNome: 'Agência Marítima e Portuária da Guiné (AMPG)',
    statusCertificacao: 'Pendente'
  },
  {
    id: 'EMB-004',
    nome: 'Pesqueiro Bijagós nº 4',
    numeroIMO: 'IMO8832011',
    indicativoChamada: 'J5P44',
    bandeira: 'Guiné-Bissau',
    portoRegisto: 'Porto de Bissau',
    tipo: 'Pesqueiro',
    tonelagemBruta: 480,
    comprimentoForaFora: 38.0,
    caladoMaximo: 3.2,
    anoConstrucao: 2009,
    armadorId: 'ARM-102',
    armadorNome: 'Companhia de Navegação Fluvial das Bijagós (CNFB)',
    agenciaId: 'AGE-201',
    agenciaNome: 'Agência Marítima e Portuária da Guiné (AMPG)',
    statusCertificacao: 'Expirada'
  }
];

export const mockAtracacoes: Atracacao[] = [
  {
    id: 'ATR-2026-081',
    codigoEscala: 'ESC-2026-0042',
    embarcacaoId: 'EMB-002',
    embarcacaoNome: 'CMA CGM Atlantic Star',
    agenciaNome: 'Sociedade de Agenciamento Marítimo do Geba (SAMG)',
    portoNome: 'Porto Comercial de Bissau',
    caisDesignado: 'Cais Principal - Posto 01',
    dataChegadaPrevista: '2026-08-07 14:00',
    dataAtracacaoEfetiva: '2026-08-07 14:30',
    dataSaidaPrevista: '2026-08-09 18:00',
    status: 'Em Operação',
    servicosSolicitados: ['Pilotagem', 'Rebocador', 'Amarraçao', 'Lixo/Resíduos'],
    manifestoCarga: {
      tipoCarga: 'Contentores Variados & Mercadoria Geral',
      quantidadeToneladas: 12400,
      contentoresTEU: 450,
      operacao: 'Ambas'
    }
  },
  {
    id: 'ATR-2026-082',
    codigoEscala: 'ESC-2026-0043',
    embarcacaoId: 'EMB-001',
    embarcacaoNome: 'MV Rio Geba Express',
    agenciaNome: 'Agência Marítima e Portuária da Guiné (AMPG)',
    portoNome: 'Porto Comercial de Bissau',
    caisDesignado: 'Cais de Cabotagem - Posto 03',
    dataChegadaPrevista: '2026-08-08 08:00',
    dataSaidaPrevista: '2026-08-08 17:00',
    status: 'Anunciada',
    servicosSolicitados: ['Amarraçao', 'Abastecimento de Água'],
    manifestoCarga: {
      tipoCarga: 'Passageiros & Carga Ligeira para Bubaque',
      quantidadeToneladas: 180,
      operacao: 'Ambas'
    }
  },
  {
    id: 'ATR-2026-080',
    codigoEscala: 'ESC-2026-0040',
    embarcacaoId: 'EMB-003',
    embarcacaoNome: 'MT Bissau Trader',
    agenciaNome: 'Agência Marítima e Portuária da Guiné (AMPG)',
    portoNome: 'Porto Comercial de Bissau',
    caisDesignado: 'Terminal Petrolífero de Bandim',
    dataChegadaPrevista: '2026-08-05 10:00',
    dataAtracacaoEfetiva: '2026-08-05 11:15',
    dataSaidaPrevista: '2026-08-06 20:00',
    status: 'Desatracada',
    servicosSolicitados: ['Pilotagem', 'Rebocador', 'Amarraçao'],
    manifestoCarga: {
      tipoCarga: 'Gasóleo & Gasolina',
      quantidadeToneladas: 6500,
      operacao: 'Descarga'
    }
  }
];

export const mockFacturas: Factura[] = [
  {
    id: 'FAC-2026-0019',
    numeroFactura: 'FAC/IMP/2026/0019',
    atracacaoId: 'ATR-2026-081',
    embarcacaoNome: 'CMA CGM Atlantic Star',
    agenciaNome: 'Sociedade de Agenciamento Marítimo do Geba (SAMG)',
    dataEmissao: '2026-08-07',
    dataVencimento: '2026-08-21',
    itens: [
      { descricao: 'Taxa de Pilotagem de Entrada e Saída (18.400 GT)', quantidade: 1, precoUnitarioXOF: 1850000, subtotalXOF: 1850000 },
      { descricao: 'Taxa de Permanência em Cais (2 Dias)', quantidade: 2, precoUnitarioXOF: 950000, subtotalXOF: 1900000 },
      { descricao: 'Serviço de Rebocador Portuário (Entrada/Saída)', quantidade: 2, precoUnitarioXOF: 1200000, subtotalXOF: 2400000 },
      { descricao: 'Taxa de Faróis e Balizamento Marítimo', quantidade: 1, precoUnitarioXOF: 450000, subtotalXOF: 450000 }
    ],
    totalXOF: 6600000,
    statusPagamento: 'Pendente'
  },
  {
    id: 'FAC-2026-0018',
    numeroFactura: 'FAC/IMP/2026/0018',
    atracacaoId: 'ATR-2026-080',
    embarcacaoNome: 'MT Bissau Trader',
    agenciaNome: 'Agência Marítima e Portuária da Guiné (AMPG)',
    dataEmissao: '2026-08-05',
    dataVencimento: '2026-08-19',
    itens: [
      { descricao: 'Taxa de Pilotagem Especial de Navio Petroleiro', quantidade: 1, precoUnitarioXOF: 2100000, subtotalXOF: 2100000 },
      { descricao: 'Taxa de Segurança e Prevenção de Poluição', quantidade: 1, precoUnitarioXOF: 1100000, subtotalXOF: 1100000 }
    ],
    totalXOF: 3200000,
    statusPagamento: 'Pago',
    metodoPagamento: 'Transferência Bancária'
  }
];

export const mockTransacoesTesouraria: TransacaoTesouraria[] = [
  {
    id: 'TES-2026-0301',
    dataHora: '2026-08-06 14:10',
    tipoTransacao: 'Recebimento Factura',
    referencia: 'FAC/IMP/2026/0018',
    entidadePagadora: 'Agência Marítima e Portuária da Guiné (AMPG)',
    valorXOF: 3200000,
    operadorTesouraria: 'Sra. Fatumata Cassamá',
    caixaNumero: 'Caixa 01 - Sede IMP',
    comprovativoBancario: 'COMP-BAO-994821'
  },
  {
    id: 'TES-2026-0302',
    dataHora: '2026-08-07 10:30',
    tipoTransacao: 'Taxa Emissão Certificado',
    referencia: 'CERT-NAV-2026/09',
    entidadePagadora: 'CNFB - Navegação Fluvial',
    valorXOF: 250000,
    operadorTesouraria: 'Sra. Fatumata Cassamá',
    caixaNumero: 'Caixa 01 - Sede IMP',
    comprovativoBancario: 'DEP-BGFI-001182'
  }
];

export const mockInspeccoes: Inspeccao[] = [
  {
    id: 'INSP-2026-011',
    codigoInspeccao: 'VIS-2026/044',
    embarcacaoId: 'EMB-001',
    embarcacaoNome: 'MV Rio Geba Express',
    dataInspeccao: '2026-08-01',
    inspectorNome: 'Eng. Adama Baldé',
    tipoVistoria: 'Segurança da Navegação',
    resultado: 'Aprovado',
    observacoes: 'Coletes de salvação e botes de emergência inspecionados e operacionais. Certificado renovado.',
    validadeMeses: 12
  },
  {
    id: 'INSP-2026-012',
    codigoInspeccao: 'VIS-2026/045',
    embarcacaoId: 'EMB-004',
    embarcacaoNome: 'Pesqueiro Bijagós nº 4',
    dataInspeccao: '2026-08-03',
    inspectorNome: 'Eng. Adama Baldé',
    tipoVistoria: 'Prevenção da Poluição (MARPOL)',
    resultado: 'Retido / Impedido',
    observacoes: 'Vazamento de óleo no porão de máquinas. Equipamento de separação de água/óleo inoperante.',
    validadeMeses: 0
  }
];

export const mockCertificados: CertificadoMaritimo[] = [
  {
    id: 'CERT-001',
    numeroCertificado: 'CERT-NAV-2026/09',
    tipoCertificado: 'Navegabilidade',
    embarcacaoNome: 'MV Rio Geba Express',
    dataEmissao: '2026-08-01',
    dataExpiracao: '2027-08-01',
    emitoPor: 'Instituto Marítimo Portuário (IMP)',
    status: 'Ativo'
  },
  {
    id: 'CERT-002',
    numeroCertificado: 'CERT-LOT-2025/11',
    tipoCertificado: 'Lotação Mínima',
    embarcacaoNome: 'MV Rio Geba Express',
    dataEmissao: '2025-05-10',
    dataExpiracao: '2027-05-10',
    emitoPor: 'Instituto Marítimo Portuário (IMP)',
    status: 'Ativo'
  }
];

export const mockLicencas: LicencaNavegacao[] = [
  {
    id: 'LIC-001',
    numeroLicenca: 'LIC-NAV-2026/001',
    titular: 'Companhia de Navegação Fluvial das Bijagós (CNFB)',
    tipoActividade: 'Transporte de Passageiros',
    dataConcessao: '2026-01-01',
    dataValidade: '2026-12-31',
    status: 'Válida'
  },
  {
    id: 'LIC-002',
    numeroLicenca: 'LIC-PESC-2025/088',
    titular: 'Empresa de Pesca Nacional Lda',
    tipoActividade: 'Pesca Comercial',
    dataConcessao: '2025-06-01',
    dataValidade: '2026-06-01',
    status: 'Pendente Renovação'
  }
];

export const mockMultas: MultaInfracao[] = [
  {
    id: 'MUL-001',
    numeroAutoInfracao: 'AUTO-IMP-2026/003',
    embarcacaoOuEntidade: 'Pesqueiro Bijagós nº 4',
    dataOcorrencia: '2026-08-03',
    artigoViolado: 'Art. 42º do Código Marítimo de Bissau - Poluição das Águas Portuárias',
    descricaoInfracao: 'Descarga não autorizada de efluente oleoso na zona do porto comercial',
    valorMultaXOF: 5000000,
    statusMulta: 'Notificado'
  }
];

export const mockTaxas: ParamentroTaxaPortuaria[] = [
  // 1. Pilotagem & Praticagem
  { id: 'TAX-01', codigoServico: 'PIL-01', descricaoServico: 'Serviço de Pilotagem por Manobra', unidadeMedida: 'Por Hora de Pilotagem', valorUnitarioXOF: 1850000, categoria: 'Pilotagem' },
  { id: 'TAX-02', codigoServico: 'PIL-02', descricaoServico: 'Pilotagem Especial de Navio Petroleiro / Gás', unidadeMedida: 'Taxa Fixa', valorUnitarioXOF: 2100000, categoria: 'Pilotagem' },
  { id: 'TAX-03', codigoServico: 'PIL-03', descricaoServico: 'Pilotagem no Canal de Acesso do Rio Geba', unidadeMedida: 'Por Manobra', valorUnitarioXOF: 1500000, categoria: 'Pilotagem' },

  // 2. Cais & Permanência
  { id: 'TAX-04', codigoServico: 'ATR-01', descricaoServico: 'Permanência em Cais de Carga Geral', unidadeMedida: 'Por GT/Dia', valorUnitarioXOF: 950000, categoria: 'Cais & Permanência' },
  { id: 'TAX-05', codigoServico: 'ATR-02', descricaoServico: 'Taxa de Atracação Cais Comercial Bissau', unidadeMedida: 'Por Dia', valorUnitarioXOF: 400000, categoria: 'Cais & Permanência' },
  { id: 'TAX-06', codigoServico: 'ATR-03', descricaoServico: 'Permanência no Terminal Petrolífero de Bandim', unidadeMedida: 'Por Manobra/Dia', valorUnitarioXOF: 1500000, categoria: 'Cais & Permanência' },
  { id: 'TAX-07', codigoServico: 'ATR-04', descricaoServico: 'Taxa de Fundeadouro e Estadia em Rada', unidadeMedida: 'Por Dia', valorUnitarioXOF: 750000, categoria: 'Cais & Permanência' },

  // 3. Faróis & Balizamento
  { id: 'TAX-08', codigoServico: 'FAR-01', descricaoServico: 'Sinalização Marítima, Faróis e Balizamento', unidadeMedida: 'Taxa Fixa', valorUnitarioXOF: 450000, categoria: 'Faróis e Balizamento' },
  { id: 'TAX-09', codigoServico: 'FAR-02', descricaoServico: 'Faróis, Balizamento e Segurança de Navegação', unidadeMedida: 'Taxa Anual/Escala', valorUnitarioXOF: 500000, categoria: 'Faróis e Balizamento' },

  // 4. Rebocadores & Assistência
  { id: 'TAX-10', codigoServico: 'REB-01', descricaoServico: 'Apoio de Rebocador Portuário por Hora', unidadeMedida: 'Taxa Fixa', valorUnitarioXOF: 1200000, categoria: 'Rebocadores & Manobra' },
  { id: 'TAX-11', codigoServico: 'REB-02', descricaoServico: 'Serviço de Rebocador e Assistência de Manobra', unidadeMedida: 'Por Operação', valorUnitarioXOF: 500000, categoria: 'Rebocadores & Manobra' },
  { id: 'TAX-12', codigoServico: 'REB-03', descricaoServico: 'Reboque Especial de Segurança e Escolta', unidadeMedida: 'Por Manobra', valorUnitarioXOF: 3000000, categoria: 'Rebocadores & Manobra' },

  // 5. Movimentação & Tráfego
  { id: 'TAX-13', codigoServico: 'MOV-01', descricaoServico: 'Taxa de Movimentação Portuária e Desestivação', unidadeMedida: 'Por Lote TEU', valorUnitarioXOF: 750000, categoria: 'Movimentação & Cargas' },
  { id: 'TAX-14', codigoServico: 'MOV-02', descricaoServico: 'Direitos de Cais e Tráfego Fluvial de Passageiros', unidadeMedida: 'Taxa Fixa de Escala', valorUnitarioXOF: 3500000, categoria: 'Movimentação & Cargas' },

  // 6. Licenciamento
  { id: 'TAX-15', codigoServico: 'LIC-01', descricaoServico: 'Emissão e Renovação de Licença de Cabotagem', unidadeMedida: 'Taxa Anual', valorUnitarioXOF: 1200000, categoria: 'Licenciamento' },
  { id: 'TAX-16', codigoServico: 'LIC-02', descricaoServico: 'Licença de Tráfego e Navegação Fluvial Nacional', unidadeMedida: 'Taxa Anual', valorUnitarioXOF: 800000, categoria: 'Licenciamento' },

  // 7. Inspecções & Certificados
  { id: 'TAX-17', codigoServico: 'VIS-01', descricaoServico: 'Taxa de Vistoria e Inspecção Marítima Ordinária', unidadeMedida: 'Por Vistoria', valorUnitarioXOF: 650000, categoria: 'Inspecções & Certificados' },
  { id: 'TAX-18', codigoServico: 'VIS-02', descricaoServico: 'Inspecção Extraordinária de Segurança MARPOL', unidadeMedida: 'Por Inspecção', valorUnitarioXOF: 1100000, categoria: 'Inspecções & Certificados' },
  { id: 'TAX-19', codigoServico: 'CER-01', descricaoServico: 'Emissão de Certificado de Navegabilidade', unidadeMedida: 'Por Certificado', valorUnitarioXOF: 450000, categoria: 'Inspecções & Certificados' },
  { id: 'TAX-20', codigoServico: 'CER-02', descricaoServico: 'Certificado de Lotação e Despacho de Saída', unidadeMedida: 'Por Despacho', valorUnitarioXOF: 2275700, categoria: 'Inspecções & Certificados' },

  // 8. Serviços Ambientais & Abastecimento
  { id: 'TAX-21', codigoServico: 'RES-01', descricaoServico: 'Recolha e Tratamento de Resíduos e Lixo Portuário', unidadeMedida: 'Por Escala', valorUnitarioXOF: 350000, categoria: 'Serviços Portuários' },
  { id: 'TAX-22', codigoServico: 'AGU-01', descricaoServico: 'Abastecimento de Água Potável a Bordo', unidadeMedida: 'Por Metro Cúbico', valorUnitarioXOF: 250000, categoria: 'Serviços Portuários' },

  // 9. Penalidades & Multas
  { id: 'TAX-23', codigoServico: 'MUL-01', descricaoServico: 'Coima por Poluição das Águas Portuárias (Art. 42º)', unidadeMedida: 'Por Infração', valorUnitarioXOF: 5000000, categoria: 'Multas & Penalidades' },
  { id: 'TAX-24', codigoServico: 'MUL-02', descricaoServico: 'Auto de Infração por Falta de Documentação / Despacho', unidadeMedida: 'Por Infração', valorUnitarioXOF: 2500000, categoria: 'Multas & Penalidades' }
];

export const mockRubricasReceitas: RubricaReceita[] = [
  // 1. Pilotagem & Praticagem
  {
    id: 'RUB-01',
    codigoRubrica: 'PIL-01',
    nomeRubrica: 'Serviço de Pilotagem por Manobra',
    categoria: 'Pilotagem',
    precoUnitarioXOF: 1850000,
    unidadeMedida: 'Por Hora de Pilotagem',
    arrecadadoMesAtualXOF: 14500000,
    metaAnualXOF: 180000000,
    percentualExecucao: 72.4,
    portoOrigem: 'Porto Comercial de Bissau'
  },
  {
    id: 'RUB-02',
    codigoRubrica: 'PIL-02',
    nomeRubrica: 'Pilotagem Especial de Navio Petroleiro / Gás',
    categoria: 'Pilotagem',
    precoUnitarioXOF: 2100000,
    unidadeMedida: 'Taxa Fixa',
    arrecadadoMesAtualXOF: 8400000,
    metaAnualXOF: 95000000,
    percentualExecucao: 65.0,
    portoOrigem: 'Canal de Geba / Bandim'
  },
  {
    id: 'RUB-03',
    codigoRubrica: 'PIL-03',
    nomeRubrica: 'Pilotagem no Canal de Acesso do Rio Geba',
    categoria: 'Pilotagem',
    precoUnitarioXOF: 1500000,
    unidadeMedida: 'Por Manobra',
    arrecadadoMesAtualXOF: 9000000,
    metaAnualXOF: 120000000,
    percentualExecucao: 75.0,
    portoOrigem: 'Canal de Geba'
  },

  // 2. Cais & Permanência
  {
    id: 'RUB-04',
    codigoRubrica: 'ATR-01',
    nomeRubrica: 'Permanência em Cais de Carga Geral',
    categoria: 'Cais & Permanência',
    precoUnitarioXOF: 950000,
    unidadeMedida: 'Por GT/Dia',
    arrecadadoMesAtualXOF: 28400000,
    metaAnualXOF: 320000000,
    percentualExecucao: 81.2,
    portoOrigem: 'Porto Comercial de Bissau'
  },
  {
    id: 'RUB-05',
    codigoRubrica: 'ATR-02',
    nomeRubrica: 'Taxa de Atracação Cais Comercial Bissau',
    categoria: 'Cais & Permanência',
    precoUnitarioXOF: 400000,
    unidadeMedida: 'Por Dia',
    arrecadadoMesAtualXOF: 12000000,
    metaAnualXOF: 150000000,
    percentualExecucao: 80.0,
    portoOrigem: 'Cais Comercial Bissau'
  },
  {
    id: 'RUB-06',
    codigoRubrica: 'ATR-03',
    nomeRubrica: 'Permanência no Terminal Petrolífero de Bandim',
    categoria: 'Cais & Permanência',
    precoUnitarioXOF: 1500000,
    unidadeMedida: 'Por Manobra/Dia',
    arrecadadoMesAtualXOF: 15000000,
    metaAnualXOF: 180000000,
    percentualExecucao: 83.3,
    portoOrigem: 'Terminal de Bandim'
  },
  {
    id: 'RUB-07',
    codigoRubrica: 'ATR-04',
    nomeRubrica: 'Taxa de Fundeadouro e Estadia em Rada',
    categoria: 'Cais & Permanência',
    precoUnitarioXOF: 750000,
    unidadeMedida: 'Por Dia',
    arrecadadoMesAtualXOF: 6750000,
    metaAnualXOF: 85000000,
    percentualExecucao: 79.4,
    portoOrigem: 'Rada Exterior de Bissau'
  },

  // 3. Faróis & Balizamento
  {
    id: 'RUB-08',
    codigoRubrica: 'FAR-01',
    nomeRubrica: 'Sinalização Marítima, Faróis e Balizamento',
    categoria: 'Faróis e Balizamento',
    precoUnitarioXOF: 450000,
    unidadeMedida: 'Taxa Fixa',
    arrecadadoMesAtualXOF: 6200000,
    metaAnualXOF: 75000000,
    percentualExecucao: 68.0,
    portoOrigem: 'Arquipélago dos Bijagós / Bissau'
  },
  {
    id: 'RUB-09',
    codigoRubrica: 'FAR-02',
    nomeRubrica: 'Faróis, Balizamento e Segurança de Navegação',
    categoria: 'Faróis e Balizamento',
    precoUnitarioXOF: 500000,
    unidadeMedida: 'Taxa Anual/Escala',
    arrecadadoMesAtualXOF: 5500000,
    metaAnualXOF: 65000000,
    percentualExecucao: 84.6,
    portoOrigem: 'Costa Marítima Nacional'
  },

  // 4. Rebocadores & Manobra
  {
    id: 'RUB-10',
    codigoRubrica: 'REB-01',
    nomeRubrica: 'Apoio de Rebocador Portuário por Hora',
    categoria: 'Rebocadores & Manobra',
    precoUnitarioXOF: 1200000,
    unidadeMedida: 'Taxa Fixa',
    arrecadadoMesAtualXOF: 7200000,
    metaAnualXOF: 90000000,
    percentualExecucao: 80.0,
    portoOrigem: 'Porto de Bissau'
  },
  {
    id: 'RUB-11',
    codigoRubrica: 'REB-02',
    nomeRubrica: 'Serviço de Rebocador e Assistência de Manobra',
    categoria: 'Rebocadores & Manobra',
    precoUnitarioXOF: 500000,
    unidadeMedida: 'Por Operação',
    arrecadadoMesAtualXOF: 3500000,
    metaAnualXOF: 45000000,
    percentualExecucao: 77.8,
    portoOrigem: 'Porto de Bissau'
  },
  {
    id: 'RUB-12',
    codigoRubrica: 'REB-03',
    nomeRubrica: 'Reboque Especial de Segurança e Escolta',
    categoria: 'Rebocadores & Manobra',
    precoUnitarioXOF: 3000000,
    unidadeMedida: 'Por Manobra',
    arrecadadoMesAtualXOF: 6000000,
    metaAnualXOF: 70000000,
    percentualExecucao: 85.7,
    portoOrigem: 'Águas Territoriais'
  },

  // 5. Movimentação & Cargas
  {
    id: 'RUB-13',
    codigoRubrica: 'MOV-01',
    nomeRubrica: 'Taxa de Movimentação Portuária e Desestivação',
    categoria: 'Movimentação & Cargas',
    precoUnitarioXOF: 750000,
    unidadeMedida: 'Por Lote TEU',
    arrecadadoMesAtualXOF: 11250000,
    metaAnualXOF: 140000000,
    percentualExecucao: 80.4,
    portoOrigem: 'Terminal de Contentores'
  },
  {
    id: 'RUB-14',
    codigoRubrica: 'MOV-02',
    nomeRubrica: 'Direitos de Cais e Tráfego Fluvial de Passageiros',
    categoria: 'Movimentação & Cargas',
    precoUnitarioXOF: 3500000,
    unidadeMedida: 'Taxa Fixa de Escala',
    arrecadadoMesAtualXOF: 17500000,
    metaAnualXOF: 210000000,
    percentualExecucao: 83.3,
    portoOrigem: 'Cais de Pidjiguiti'
  },

  // 6. Licenciamento
  {
    id: 'RUB-15',
    codigoRubrica: 'LIC-01',
    nomeRubrica: 'Emissão e Renovação de Licença de Cabotagem',
    categoria: 'Licenciamento',
    precoUnitarioXOF: 1200000,
    unidadeMedida: 'Taxa Anual',
    arrecadadoMesAtualXOF: 9800000,
    metaAnualXOF: 110000000,
    percentualExecucao: 88.5,
    portoOrigem: 'Sede IMP Bissau'
  },
  {
    id: 'RUB-16',
    codigoRubrica: 'LIC-02',
    nomeRubrica: 'Licença de Tráfego e Navegação Fluvial Nacional',
    categoria: 'Licenciamento',
    precoUnitarioXOF: 800000,
    unidadeMedida: 'Taxa Anual',
    arrecadadoMesAtualXOF: 6400000,
    metaAnualXOF: 80000000,
    percentualExecucao: 80.0,
    portoOrigem: 'Sede IMP Bissau'
  },

  // 7. Inspecções & Certificados
  {
    id: 'RUB-17',
    codigoRubrica: 'VIS-01',
    nomeRubrica: 'Taxa de Vistoria e Inspecção Marítima Ordinária',
    categoria: 'Inspecções & Certificados',
    precoUnitarioXOF: 650000,
    unidadeMedida: 'Por Vistoria',
    arrecadadoMesAtualXOF: 4550000,
    metaAnualXOF: 55000000,
    percentualExecucao: 82.7,
    portoOrigem: 'Inspecção IMP'
  },
  {
    id: 'RUB-18',
    codigoRubrica: 'VIS-02',
    nomeRubrica: 'Inspecção Extraordinária de Segurança MARPOL',
    categoria: 'Inspecções & Certificados',
    precoUnitarioXOF: 1100000,
    unidadeMedida: 'Por Inspecção',
    arrecadadoMesAtualXOF: 5500000,
    metaAnualXOF: 65000000,
    percentualExecucao: 84.6,
    portoOrigem: 'Inspecção IMP'
  },
  {
    id: 'RUB-19',
    codigoRubrica: 'CER-01',
    nomeRubrica: 'Emissão de Certificado de Navegabilidade',
    categoria: 'Inspecções & Certificados',
    precoUnitarioXOF: 450000,
    unidadeMedida: 'Por Certificado',
    arrecadadoMesAtualXOF: 4050000,
    metaAnualXOF: 50000000,
    percentualExecucao: 81.0,
    portoOrigem: 'Capitania Bissau'
  },
  {
    id: 'RUB-20',
    codigoRubrica: 'CER-02',
    nomeRubrica: 'Certificado de Lotação e Despacho de Saída',
    categoria: 'Inspecções & Certificados',
    precoUnitarioXOF: 2275700,
    unidadeMedida: 'Por Despacho',
    arrecadadoMesAtualXOF: 6827100,
    metaAnualXOF: 85000000,
    percentualExecucao: 80.3,
    portoOrigem: 'Capitania Bissau'
  },

  // 8. Serviços Portuários & Ambientais
  {
    id: 'RUB-21',
    codigoRubrica: 'RES-01',
    nomeRubrica: 'Recolha e Tratamento de Resíduos e Lixo Portuário',
    categoria: 'Serviços Portuários',
    precoUnitarioXOF: 350000,
    unidadeMedida: 'Por Escala',
    arrecadadoMesAtualXOF: 2800000,
    metaAnualXOF: 35000000,
    percentualExecucao: 80.0,
    portoOrigem: 'Porto de Bissau'
  },
  {
    id: 'RUB-22',
    codigoRubrica: 'AGU-01',
    nomeRubrica: 'Abastecimento de Água Potável a Bordo',
    categoria: 'Serviços Portuários',
    precoUnitarioXOF: 250000,
    unidadeMedida: 'Por Metro Cúbico',
    arrecadadoMesAtualXOF: 3000000,
    metaAnualXOF: 40000000,
    percentualExecucao: 75.0,
    portoOrigem: 'Porto de Bissau'
  },

  // 9. Penalidades & Multas
  {
    id: 'RUB-23',
    codigoRubrica: 'MUL-01',
    nomeRubrica: 'Coimas por Poluição das Águas Portuárias (Art. 42º)',
    categoria: 'Penalidades & Coimas',
    precoUnitarioXOF: 5000000,
    unidadeMedida: 'Por Infração',
    arrecadadoMesAtualXOF: 5000000,
    metaAnualXOF: 40000000,
    percentualExecucao: 52.0,
    portoOrigem: 'Inspecção Marítima IMP'
  },
  {
    id: 'RUB-24',
    codigoRubrica: 'MUL-02',
    nomeRubrica: 'Auto de Infração por Falta de Documentação / Despacho',
    categoria: 'Penalidades & Coimas',
    precoUnitarioXOF: 2500000,
    unidadeMedida: 'Por Infração',
    arrecadadoMesAtualXOF: 5000000,
    metaAnualXOF: 50000000,
    percentualExecucao: 60.0,
    portoOrigem: 'Capitania Bissau'
  }
];

export const mockLogsAutenticacao: LogAcessoAutenticacao[] = [
  {
    id: 'LOG-001',
    utilizadorNome: 'Dr. Mamadu Djalo',
    email: 'mamadu.djalo@imp.gb',
    ipOrigem: '192.168.1.102',
    dataHora: '2026-08-07 11:30',
    acao: 'Login Sucesso',
    dispositivo: 'Windows 11 • Chrome Bissau'
  },
  {
    id: 'LOG-002',
    utilizadorNome: 'Sra. Fatumata Cassamá',
    email: 'fatumata.cassama@imp.gb',
    ipOrigem: '192.168.1.108',
    dataHora: '2026-08-07 12:00',
    acao: 'Login Sucesso',
    dispositivo: 'Windows 10 • Firefox Tesouraria'
  },
  {
    id: 'LOG-003',
    utilizadorNome: 'Eng. Adama Baldé',
    email: 'adama.balde@imp.gb',
    ipOrigem: '192.168.1.115',
    dataHora: '2026-08-07 10:15',
    acao: 'Troca de Perfil',
    dispositivo: 'Tablet Android • Inspecção Porto'
  }
];

export const mockConfiguracaoServidor: ConfiguraçãoServidor = {
  nomeServidor: 'IMP-BISSAU-PROD-SRV01',
  ambiente: 'On-Premises Local Host (Bissau)',
  versaoApp: 'NHOMINCA v3.0.0-IMP',
  bdEngine: 'PostgreSQL 16.2 (Linux x86_64)',
  ipLocalServer: '192.168.1.10:3000',
  diretorioBackup: '/var/backups/nhominca/postgresql',
  ultimoBackupAuto: '2026-10-23 03:00:00 (Concluído)',
  statusConexao: 'Ativo'
};

export const mockFaturasIMP: FaturaIMP[] = [
  {
    id: 'FAT-2026-0001',
    ano: 2026,
    seq: 1,
    nFatura: 'FAT-2026-0001',
    data: '2026-10-20',
    cliente: 'Sociedade de Agenciamento Marítimo do Geba (SAMG)',
    nif: '910005508',
    navio: 'CMA CGM Atlantic Star',
    tipo: 'Porta-Contentores',
    gross_tonnage: 18400,
    itens: [
      { descricao: 'Taxa de Pilotagem e Entrada no Canal de Geba', quantidade: 1, precoUnitario: 1500000, subtotal: 1500000 },
      { descricao: 'Taxa de Atracação Cais Comercial de Bissau (3 Dias)', quantidade: 3, precoUnitario: 400000, subtotal: 1200000 },
      { descricao: 'Faróis, Balizamento e Segurança de Navegação', quantidade: 1, precoUnitario: 500000, subtotal: 500000 }
    ],
    subtotal: 3200000,
    iva: 0,
    total: 3200000,
    saldo_pago: 0,
    saldo_pendente: 3200000,
    recibos: [],
    estado: 'confirmada',
    criado_por: 'Sr. António Okica de Sá'
  },
  {
    id: 'FAT-2026-0005',
    ano: 2026,
    seq: 5,
    nFatura: 'FAT-2026-0005',
    data: '2026-10-22',
    cliente: 'Guiné Marítima Logística & Cabotagem',
    nif: '910077332',
    navio: 'MT Geba Star',
    tipo: 'Petroleiro',
    gross_tonnage: 14200,
    itens: [
      { descricao: 'Taxa de Pilotagem e Reboque Especial de Segurança', quantidade: 1, precoUnitario: 3000000, subtotal: 3000000 },
      { descricao: 'Taxa de Permanência no Terminal de Combustíveis', quantidade: 1, precoUnitario: 1500000, subtotal: 1500000 }
    ],
    subtotal: 4500000,
    iva: 0,
    total: 4500000,
    saldo_pago: 2000000,
    saldo_pendente: 2500000,
    recibos: ['REC-2026-0002'],
    estado: 'parcial',
    criado_por: 'Sr. António Okica de Sá'
  },
  {
    id: 'FAT-2026-0002',
    ano: 2026,
    seq: 2,
    nFatura: 'FAT-2026-0002',
    data: '2026-10-21',
    cliente: 'Transbissau Navegação & Trânsitos',
    nif: '910088219',
    navio: 'Bijagós Express',
    tipo: 'Passageiros / Ferry',
    gross_tonnage: 3400,
    itens: [
      { descricao: 'Direitos de Cais e Tráfego Fluvial de Passageiros', quantidade: 1, precoUnitario: 3500000, subtotal: 3500000 },
      { descricao: 'Certificado de Lotação e Despacho de Saída', quantidade: 1, precoUnitario: 2275700, subtotal: 2275700 }
    ],
    subtotal: 5775700,
    iva: 0,
    total: 5775700,
    saldo_pago: 5775700,
    saldo_pendente: 0,
    recibos: ['REC-2026-0001'],
    estado: 'paga',
    criado_por: 'Sr. António Okica de Sá'
  },
  {
    id: 'FAT-2026-0003',
    ano: 2026,
    seq: 3,
    nFatura: 'FAT-2026-0003',
    data: '2026-10-22',
    cliente: 'Bissau Container Logistics SARL',
    nif: '910044567',
    navio: 'Corubal Star',
    tipo: 'Porta-Contentores',
    gross_tonnage: 21500,
    itens: [
      { descricao: 'Taxa de Movimentação Portuária e Desestivação', quantidade: 1, precoUnitario: 750000, subtotal: 750000 },
      { descricao: 'Serviço de Rebocador e Assistência de Manobra', quantidade: 1, precoUnitario: 500000, subtotal: 500000 }
    ],
    subtotal: 1250000,
    iva: 0,
    total: 1250000,
    saldo_pago: 0,
    saldo_pendente: 1250000,
    recibos: [],
    estado: 'rascunho',
    criado_por: 'Sr. António Okica de Sá'
  },
  {
    id: 'FAT-2026-0004',
    ano: 2026,
    seq: 4,
    nFatura: 'FAT-2026-0004',
    data: '2026-10-19',
    cliente: 'Agência Marítima Guiné-Bissau',
    nif: '910023411',
    navio: 'Atlantic Voyager',
    tipo: 'Carga Geral',
    gross_tonnage: 12000,
    itens: [
      { descricao: 'Taxa de Permanência Adicional em Fundeadouro', quantidade: 1, precoUnitario: 1450000, subtotal: 1450000 }
    ],
    subtotal: 1450000,
    iva: 0,
    total: 1450000,
    saldo_pago: 0,
    saldo_pendente: 1450000,
    recibos: [],
    estado: 'anulada',
    criado_por: 'Sr. António Okica de Sá',
    justificativaAnulacao: 'Duplicação de escala retificada pelo armador e autorizada pela Direção Geral.',
    anulado_por: 'Dr. Mamadu Djaló (Diretor Geral)',
    data_anulacao: '2026-10-20 15:40'
  }
];

export const mockRecibosIMP: ReciboIMP[] = [
  {
    id: 'REC-2026-0001',
    nRecibo: 'REC-2026-0001',
    fatura_id: 'FAT-2026-0002',
    nFatura: 'FAT-2026-0002',
    totalFatura: 5775700,
    valorAnteriorPago: 0,
    valor: 5775700,
    saldoRestante: 0,
    isLiquidacaoTotal: true,
    banco: 'BAO',
    talao: 'TAL-BAO-883190',
    data: '2026-10-21',
    hora: '14:25',
    emissor: 'Sra. Fatumata Cassamá',
    cliente: 'Transbissau Navegação & Trânsitos',
    navio: 'Bijagós Express',
    observacoes: 'Liquidado integralmente via depósito em conta BAO nº 0012384-IMP.'
  },
  {
    id: 'REC-2026-0002',
    nRecibo: 'REC-2026-0002',
    fatura_id: 'FAT-2026-0005',
    nFatura: 'FAT-2026-0005',
    totalFatura: 4500000,
    valorAnteriorPago: 0,
    valor: 2000000,
    saldoRestante: 2500000,
    isLiquidacaoTotal: false,
    banco: 'CORIS BANK',
    talao: 'TAL-CORIS-449102',
    data: '2026-10-22',
    hora: '11:30',
    emissor: 'Sra. Fatumata Cassamá',
    cliente: 'Guiné Marítima Logística & Cabotagem',
    navio: 'MT Geba Star',
    observacoes: '1ª Amortização (parcial) de 2.000.000 XOF sobre o total faturado de 4.500.000 XOF. Resta 2.500.000 XOF a liquidar.'
  }
];

export const mockCaixaMovs: CaixaMov[] = [
  {
    id: 'MOV-001',
    data: '2026-10-21',
    hora: '08:30',
    descricao: 'Saldo de Abertura do Período - Tesouraria Central IMP',
    tipo: 'entrada',
    valor: 1500000,
    saldoApos: 1500000,
    criado_por: 'Sra. Fatumata Cassamá',
    categoria: 'Suprimento Caixa'
  },
  {
    id: 'MOV-002',
    data: '2026-10-21',
    hora: '14:25',
    descricao: 'Recebimento Fatura FAT-2026-0002 (Bijagós Express) - Talão BAO-883190',
    tipo: 'entrada',
    valor: 5775700,
    saldoApos: 7275700,
    criado_por: 'Sra. Fatumata Cassamá',
    categoria: 'Recibo Faturação',
    talao: 'TAL-BAO-883190',
    banco: 'BAO'
  },
  {
    id: 'MOV-003',
    data: '2026-10-22',
    hora: '10:00',
    descricao: 'Combustível para Lancha de Praticagem Geba-01',
    tipo: 'saida',
    valor: 350000,
    saldoApos: 6925700,
    criado_por: 'Sra. Fatumata Cassamá',
    categoria: 'Combustível Embarcações',
    documentoComprovativo: 'FAT-FORN-2026-0819',
    beneficiario: 'Petroguine SARL (Posto Cais Bissau)',
    autorizado_por: 'Dr. Mamadu Djaló (Diretor Geral / PCA)',
    justificativa: 'Abastecimento urgente de 450L gasóleo para manobra de assistência ao navio CMA CGM.'
  },
  {
    id: 'MOV-004',
    data: '2026-10-22',
    hora: '11:30',
    descricao: 'Recebimento Parcial Fatura FAT-2026-0005 (MT Geba Star) - Talão CORIS-449102',
    tipo: 'entrada',
    valor: 2000000,
    saldoApos: 8925700,
    criado_por: 'Sra. Fatumata Cassamá',
    categoria: 'Recibo Faturação',
    talao: 'TAL-CORIS-449102',
    banco: 'CORIS BANK'
  },
  {
    id: 'MOV-005',
    data: '2026-10-23',
    hora: '09:15',
    descricao: 'Taxa de Despacho de Embarcação Pesqueira',
    tipo: 'entrada',
    valor: 380000,
    saldoApos: 9305700,
    criado_por: 'Sra. Fatumata Cassamá',
    categoria: 'Taxa Portuária',
    talao: 'TAL-CORIS-1192',
    banco: 'CORIS BANK'
  }
];

export const mockAuditoriaLogs: AuditoriaLog[] = [
  {
    id: 'AUD-001',
    timestamp: '2026-10-20 09:00:15',
    user_id: 'USR-SA',
    user_email: 'superadmin@imp.gw',
    acao: 'INICIALIZACAO_SISTEMA',
    tabela: 'CONFIGURACOES',
    item_id: 'SYS-INIT',
    payload_json: '{"versao":"3.0.0","ambiente":"Bissau Production"}',
    prev_hash: '0000000000000000000000000000000000000000000000000000000000000000',
    hash_sha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08'
  },
  {
    id: 'AUD-002',
    timestamp: '2026-10-20 11:15:30',
    user_id: 'USR-FAT',
    user_email: 'faturacao@imp.gw',
    acao: 'CRIAR_FATURA',
    tabela: 'FATURAS',
    item_id: 'FAT-2026-0001',
    payload_json: '{"cliente":"Agência Marítima Guiné-Bissau","total":2850000,"estado":"confirmada"}',
    prev_hash: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    hash_sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
  },
  {
    id: 'AUD-003',
    timestamp: '2026-10-21 14:25:00',
    user_id: 'USR-CX',
    user_email: 'caixa@imp.gw',
    acao: 'REGISTAR_RECEBIMENTO',
    tabela: 'RECIBOS',
    item_id: 'REC-2026-0001',
    payload_json: '{"fatura":"FAT-2026-0002","valor":1650000,"banco":"BAO","talao":"TAL-BAO-883190"}',
    prev_hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    hash_sha256: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8'
  },
  {
    id: 'AUD-004',
    timestamp: '2026-10-21 16:30:12',
    user_id: 'USR-001',
    user_email: 'admin@imp.gw',
    acao: 'ANULAR_FATURA',
    tabela: 'FATURAS',
    item_id: 'FAT-2026-0005',
    payload_json: '{"justificativa":"Duplicação de escala retificada pelo armador","autorizado":"Direcao Geral"}',
    prev_hash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
    hash_sha256: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a'
  }
];
