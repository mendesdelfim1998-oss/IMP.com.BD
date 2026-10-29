export type UserRole =
  | 'superadmin'
  | 'admin'
  | 'faturacao'
  | 'caixa'
  | 'ADMIN_IMP'
  | 'INSPECTOR'
  | 'CAPITANIA'
  | 'TESOURARIA'
  | 'AGENTE_MARITIMO';

export interface Utilizador {
  id: string;
  nome: string;
  email: string;
  cargo: string;
  funcao: UserRole;
  role?: 'superadmin' | 'admin' | 'faturacao' | 'caixa';
  departamento: string;
  status: 'Ativo' | 'Inativo';
  active?: boolean;
  failedAttempts?: number;
  lockUntil?: number | null; // Timestamp in ms
  firstName?: string;
  lastName?: string;
  gender?: 'M' | 'F' | 'Outro';
  birthDate?: string; // YYYY-MM-DD
  avatar?: string;
  ultimoAcesso: string;
  fotoUrl?: string;
  telefone?: string;
  senha?: string;
}

export const IMP_INSTITUTIONAL = {
  entity: 'Instituto Marítimo Portuário da Guiné-Bissau (IMP)',
  republic: 'República da Guiné-Bissau',
  nif: '910005508',
  certDgci: '000035C/2022',
  currency: 'XOF',
  officialBanks: ['CORIS BANK', 'BANQUE ATLANTIQUE', 'BAO'] as const,
};

export interface FaturaIMP {
  id: string;
  ano: number;
  seq: number;
  nFatura: string; // FAT-2026-0001
  data: string;
  cliente: string; // Agência
  nif: string;
  navio: string; // Embarcação
  tipo: string;
  gross_tonnage: number;
  itens: {
    codigoRubrica?: string;
    rubricaId?: string;
    descricao: string;
    quantidade: number;
    precoUnitario: number;
    subtotal: number;
  }[];
  subtotal: number;
  iva: number;
  total: number;
  saldo_pago: number; // Montante cumulativo já pago
  saldo_pendente: number; // Saldo devedor restante (total - saldo_pago)
  recibos?: string[]; // IDs dos recibos emitidos para esta fatura
  estado: 'rascunho' | 'confirmada' | 'parcial' | 'paga' | 'anulada';
  criado_por: string;
  justificativaAnulacao?: string;
  anulado_por?: string;
  data_anulacao?: string;
}

export interface ReciboIMP {
  id: string;
  nRecibo: string; // REC-2026-0001
  fatura_id: string;
  nFatura: string;
  totalFatura: number; // X: Valor total emitido na fatura
  valorAnteriorPago: number; // A: Valor amortizado em recibos anteriores
  valor: number; // Y: Valor pago no presente recibo
  saldoRestante: number; // Z: Saldo devedor restante = X - (A + Y)
  isLiquidacaoTotal: boolean; // True se saldoRestante === 0
  banco: 'CORIS BANK' | 'BANQUE ATLANTIQUE' | 'BAO';
  talao: string;
  data: string;
  hora: string;
  emissor: string;
  cliente: string;
  navio?: string;
  observacoes?: string;
}

export interface CaixaMov {
  id: string;
  data: string; // YYYY-MM-DD
  hora: string; // HH:mm
  descricao: string;
  tipo: 'entrada' | 'saida';
  valor: number;
  saldoApos: number;
  criado_por: string;
  categoria:
    | 'Recibo Faturação'
    | 'Taxa Portuária'
    | 'Despesa Operacional'
    | 'Suprimento Caixa'
    | 'Ajuste'
    | 'Combustível Embarcações'
    | 'Manutenção & Faróis'
    | 'Sangria Bancária'
    | 'Expediente & Material';
  talao?: string;
  banco?: string;
  // Campos institucionais para saídas de caixa profissionais e auditoria:
  documentoComprovativo?: string; // Nº da Fatura de Fornecedor / Ordem de Saída
  beneficiario?: string; // Entidade / Pessoa que recebeu o pagamento
  autorizado_por?: string; // Direção / Chefia que homologou a saída
  justificativa?: string; // Detalhes da necessidade da despesa
  comprovativoAnexo?: string; // Base64 da imagem/documento ou referência digital
}

export interface AuditoriaLog {
  id: string;
  timestamp: string;
  user_id: string;
  user_email: string;
  acao: string;
  tabela: string;
  item_id: string;
  payload_json: string;
  hash_sha256: string;
  prev_hash: string;
}

export type TipoEmbarcacao = 'Carga Geral' | 'Porta-Contentores' | 'Petroleiro' | 'Pesqueiro' | 'Passageiros / Ferry' | 'Rebocador' | 'Lancha de Serviço';

export interface Embarcacao {
  id: string;
  nome: string;
  numeroIMO: string;
  indicativoChamada: string; // Call Sign
  bandeira: string;
  portoRegisto: string;
  tipo: TipoEmbarcacao;
  tonelagemBruta: number; // GT (Gross Tonnage)
  comprimentoForaFora: number; // LOA (Meters)
  caladoMaximo: number; // Meters
  anoConstrucao: number;
  armadorId: string;
  armadorNome: string;
  agenciaId: string;
  agenciaNome: string;
  statusCertificacao: 'Válida' | 'Pendente' | 'Expirada';
}

export interface AgenciaMaritima {
  id: string;
  nomeComercial: string;
  nif: string;
  licencaAtividade: string;
  responsavelLegal: string;
  telefone: string;
  email: string;
  endereco: string;
  embarcacoesRepresentadas: number;
  status: 'Ativa' | 'Suspensa';
}

export interface Armador {
  id: string;
  nomeRazaoSocial: string;
  paisOrigem: string;
  tipoEntidade: 'Nacional' | 'Estrangeiro';
  contactoOficial: string;
  email: string;
  frotaContada: number;
}

export interface PortoTerminal {
  id: string;
  nomePorto: string;
  codigoUNLOCODE: string; // e.g. GWOXB para Bissau
  localizacao: string;
  numCaisDisponiveis: number;
  caladoMaximoPermitido: number;
  capacidadeOperacional: string;
  autoridadePortuaria: string;
}

export type StatusAtracacao = 'Anunciada' | 'Ao Largo' | 'Atracada' | 'Em Operação' | 'Desatracada' | 'Cancelada';

export interface Atracacao {
  id: string;
  codigoEscala: string;
  embarcacaoId: string;
  embarcacaoNome: string;
  agenciaNome: string;
  portoNome: string;
  caisDesignado: string;
  dataChegadaPrevista: string; // ETA
  dataAtracacaoEfetiva?: string;
  dataSaidaPrevista: string; // ETD
  status: StatusAtracacao;
  servicosSolicitados: ('Pilotagem' | 'Rebocador' | 'Amarraçao' | 'Abastecimento de Água' | 'Lixo/Resíduos')[];
  manifestoCarga: {
    tipoCarga: string;
    quantidadeToneladas: number;
    contentoresTEU?: number;
    operacao: 'Carga' | 'Descarga' | 'Ambas';
  };
}

export interface Factura {
  id: string;
  numeroFactura: string;
  atracacaoId?: string;
  embarcacaoNome: string;
  agenciaNome: string;
  dataEmissao: string;
  dataVencimento: string;
  itens: {
    descricao: string;
    quantidade: number;
    precoUnitarioXOF: number;
    subtotalXOF: number;
  }[];
  totalXOF: number;
  statusPagamento: 'Pendente' | 'Pago' | 'Cancelado' | 'Vencido';
  metodoPagamento?: 'Transferência Bancária' | 'Depósito Tesouraria' | 'Cheque Visado';
}

export interface TransacaoTesouraria {
  id: string;
  dataHora: string;
  tipoTransacao: 'Recebimento Factura' | 'Taxa Emissão Certificado' | 'Recebimento Multa' | 'Outro';
  referencia: string;
  entidadePagadora: string;
  valorXOF: number;
  operadorTesouraria: string;
  caixaNumero: string;
  comprovativoBancario: string;
}

export interface Inspeccao {
  id: string;
  codigoInspeccao: string;
  embarcacaoId: string;
  embarcacaoNome: string;
  dataInspeccao: string;
  inspectorNome: string;
  tipoVistoria: 'Segurança da Navegação' | 'Prevenção da Poluição (MARPOL)' | 'Condições de Habitabilidade' | 'Estrutural / Casco';
  resultado: 'Aprovado' | 'Aprovado com Recomendações' | 'Retido / Impedido';
  observacoes: string;
  validadeMeses: number;
}

export interface CertificadoMaritimo {
  id: string;
  numeroCertificado: string;
  tipoCertificado: 'Navegabilidade' | 'Lotação Mínima' | 'Segurança Rádio' | 'Prevenção de Poluição' | 'Matrícula Marítima';
  embarcacaoNome: string;
  dataEmissao: string;
  dataExpiracao: string;
  emitoPor: string;
  status: 'Ativo' | 'Expirado' | 'Revogado';
}

export interface LicencaNavegacao {
  id: string;
  numeroLicenca: string;
  titular: string;
  tipoActividade: 'Pesca Comercial' | 'Transporte de Passageiros' | 'Tráfego Local / Cabotagem' | 'Serviços Portuários';
  dataConcessao: string;
  dataValidade: string;
  status: 'Válida' | 'Pendente Renovação' | 'Suspensa';
}

export interface MultaInfracao {
  id: string;
  numeroAutoInfracao: string;
  embarcacaoOuEntidade: string;
  dataOcorrencia: string;
  artigoViolado: string;
  descricaoInfracao: string;
  valorMultaXOF: number;
  statusMulta: 'Notificado' | 'Pago' | 'Em Recurso' | 'Execução Fiscal';
}

export interface ParamentroTaxaPortuaria {
  id: string;
  codigoServico: string;
  descricaoServico: string;
  unidadeMedida: string;
  valorUnitarioXOF: number;
  categoria: string;
}

export interface RubricaReceita {
  id: string;
  codigoRubrica: string;
  nomeRubrica: string;
  categoria: string;
  arrecadadoMesAtualXOF: number;
  metaAnualXOF: number;
  percentualExecucao: number;
  portoOrigem: string;
  precoUnitarioXOF?: number;
  unidadeMedida?: string;
  descricao?: string;
}

export interface LogAcessoAutenticacao {
  id: string;
  utilizadorNome: string;
  email: string;
  ipOrigem: string;
  dataHora: string;
  acao: 'Login Sucesso' | 'Logout' | 'Tentativa Falhada' | 'Troca de Perfil';
  dispositivo: string;
}

export interface ConfiguraçãoServidor {
  nomeServidor: string;
  ambiente: string;
  versaoApp: string;
  bdEngine: string;
  ipLocalServer: string;
  diretorioBackup: string;
  ultimoBackupAuto: string;
  statusConexao: 'Ativo' | 'Manutenção';
}
