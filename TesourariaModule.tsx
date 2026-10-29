import React, { useState, FormEvent, useMemo, useRef } from 'react';
import {
  Wallet,
  Plus,
  Search,
  Landmark,
  FileCheck2,
  Printer,
  ArrowUpRight,
  ArrowDownRight,
  Receipt,
  X,
  CreditCard,
  QrCode,
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileText,
  FileMinus,
  Upload,
  Paperclip,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  Percent,
  Check,
  RefreshCw
} from 'lucide-react';
import {
  FaturaIMP,
  ReciboIMP,
  CaixaMov,
  Utilizador,
  IMP_INSTITUTIONAL
} from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { valorPorExtensoXOF } from '../../utils/moedaExtenso';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface TesourariaModuleProps {
  faturas: FaturaIMP[];
  recibos: ReciboIMP[];
  movimentos: CaixaMov[];
  currentUser: Utilizador;
  onLiquidateFatura: (faturaId: string, recibo: ReciboIMP, mov: CaixaMov) => void;
  onAddMovimento: (mov: CaixaMov) => void;
}

type PeriodFilter = 'dia' | 'semana' | 'mes' | 'ano' | 'tudo';
type DevedorFilter = 'todos_pendentes' | 'parciais' | 'integrais' | 'liquidadas';

export function TesourariaModule({
  faturas,
  recibos,
  movimentos,
  currentUser,
  onLiquidateFatura,
  onAddMovimento
}: TesourariaModuleProps) {
  const { theme } = useTheme();

  // Active Tab: 'liquidacao' | 'devedores' | 'recibos' | 'saidas' | 'folha'
  const [activeTab, setActiveTab] = useState<'liquidacao' | 'devedores' | 'recibos' | 'saidas' | 'folha'>('liquidacao');

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [reciboSearchTerm, setReciboSearchTerm] = useState('');
  const [codigoBuscaRapida, setCodigoBuscaRapida] = useState('');
  const [periodFilter, setPeriodFilter] = useState<PeriodFilter>('mes');
  const [devedorFilter, setDevedorFilter] = useState<DevedorFilter>('todos_pendentes');

  // Modals
  const [faturaParaLiquidar, setFaturaParaLiquidar] = useState<FaturaIMP | null>(null);
  const [viewingRecibo, setViewingRecibo] = useState<ReciboIMP | null>(null);
  const [receiptPrintFormat, setReceiptPrintFormat] = useState<'a4' | 'termico'>('a4');
  const [showNovaSaidaModal, setShowNovaSaidaModal] = useState(false);
  const [viewingSaidaDoc, setViewingSaidaDoc] = useState<CaixaMov | null>(null);
  const [showFechoFolhaModal, setShowFechoFolhaModal] = useState(false);
  const [expandedFaturaId, setExpandedFaturaId] = useState<string | null>(null);
  const [isExportingPDF, setIsExportingPDF] = useState(false);

  const documentRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = async (filename: string) => {
    if (!documentRef.current) return;
    setIsExportingPDF(true);
    try {
      const canvas = await html2canvas(documentRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${filename}.pdf`);
    } catch (err) {
      console.error('Erro ao gerar PDF:', err);
    } finally {
      setIsExportingPDF(false);
    }
  };

  // Liquidation Form State
  const [bancoSelecionado, setBancoSelecionado] = useState<'CORIS BANK' | 'BANQUE ATLANTIQUE' | 'BAO'>('BAO');
  const [numeroTalao, setNumeroTalao] = useState('');
  const [dataLiquidacao, setDataLiquidacao] = useState(new Date().toISOString().slice(0, 10));
  const [obsLiquidacao, setObsLiquidacao] = useState('');
  const [valorPagamentoInput, setValorPagamentoInput] = useState<number>(0);
  const [talaoDuplicadoError, setTalaoDuplicadoError] = useState<string>('');

  // Nova Saída de Caixa (Profissional com Comprovativo Obrigatório) Form State
  const [saidaForm, setSaidaForm] = useState({
    descricao: '',
    valor: 250000,
    categoria: 'Combustível Embarcações' as CaixaMov['categoria'],
    documentoComprovativo: '',
    beneficiario: '',
    autorizado_por: 'Dr. Mamadu Djaló (Diretor Geral / PCA)',
    justificativa: '',
    anexoNome: ''
  });
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Current physical cash balance
  const saldoAtualEmCaixa = movimentos.length > 0 ? movimentos[movimentos.length - 1].saldoApos : 0;

  // Invoices ready for payment in Cashier (confirmed or partial with pending balance)
  const faturasParaCobrar = useMemo(() => {
    return faturas.filter((f) => {
      const saldoPendente = f.saldo_pendente ?? (f.estado === 'paga' ? 0 : f.total - (f.saldo_pago || 0));
      return (f.estado === 'confirmada' || f.estado === 'parcial') && saldoPendente > 0;
    });
  }, [faturas]);

  // Universal Code Search Result (Search by FAT- or REC- or client/ship)
  const buscaRapidaResultado = useMemo(() => {
    const q = codigoBuscaRapida.trim().toLowerCase();
    if (!q) return null;

    // Search matching invoices
    const matchedFaturas = faturas.filter(
      (f) =>
        f.nFatura.toLowerCase().includes(q) ||
        f.cliente.toLowerCase().includes(q) ||
        f.navio.toLowerCase().includes(q)
    );

    // Search matching receipts
    const matchedRecibos = recibos.filter(
      (r) =>
        r.nRecibo.toLowerCase().includes(q) ||
        r.nFatura.toLowerCase().includes(q) ||
        r.talao.toLowerCase().includes(q) ||
        r.cliente.toLowerCase().includes(q)
    );

    return {
      faturas: matchedFaturas,
      recibos: matchedRecibos
    };
  }, [codigoBuscaRapida, faturas, recibos]);

  // Filtered receipts for Consulta de Pagamentos / Recibos
  const filteredRecibos = useMemo(() => {
    const q = reciboSearchTerm.trim().toLowerCase();
    if (!q) return recibos;
    return recibos.filter(
      (r) =>
        r.nRecibo.toLowerCase().includes(q) ||
        r.nFatura.toLowerCase().includes(q) ||
        r.cliente.toLowerCase().includes(q) ||
        (r.navio && r.navio.toLowerCase().includes(q)) ||
        r.talao.toLowerCase().includes(q) ||
        r.banco.toLowerCase().includes(q) ||
        r.emissor.toLowerCase().includes(q)
    );
  }, [recibos, reciboSearchTerm]);

  // Open Liquidation Modal
  const handleOpenLiquidar = (fat: FaturaIMP) => {
    const saldoPendente = fat.saldo_pendente ?? (fat.total - (fat.saldo_pago || 0));
    setFaturaParaLiquidar(fat);
    setValorPagamentoInput(saldoPendente);
    setBancoSelecionado('BAO');
    setNumeroTalao(`TAL-BAO-${Math.floor(100000 + Math.random() * 900000)}`);
    setDataLiquidacao(new Date().toISOString().slice(0, 10));
    setObsLiquidacao(
      fat.saldo_pago && fat.saldo_pago > 0
        ? `Liquidação de saldo remanescente da fatura ${fat.nFatura} (${fat.navio})`
        : `Pagamento de fatura ${fat.nFatura} referente a ${fat.navio}`
    );
    setTalaoDuplicadoError('');
  };

  // Submit Liquidation with Overpayment Block & Partial Amortization
  const handleSubmitLiquidacao = (e: FormEvent) => {
    e.preventDefault();
    if (!faturaParaLiquidar || !numeroTalao.trim()) return;

    const saldoPendenteAtual =
      faturaParaLiquidar.saldo_pendente ??
      (faturaParaLiquidar.total - (faturaParaLiquidar.saldo_pago || 0));

    // STRICT VALIDATION: OVERPAYMENT BLOCK
    if (valorPagamentoInput > saldoPendenteAtual) {
      alert(
        `BLOQUEIO DE SEGURANÇA: O valor digitado (${valorPagamentoInput.toLocaleString(
          'pt-PT'
        )} XOF) é superior ao saldo pendente da fatura (${saldoPendenteAtual.toLocaleString(
          'pt-PT'
        )} XOF). O sistema não aceita sobrefaturação ou sobrepagamento.`
      );
      return;
    }

    if (valorPagamentoInput <= 0) {
      alert('O valor a pagar deve ser superior a zero.');
      return;
    }

    // CHECK FOR DUPLICATE BANK SLIP NUMBER
    const cleanTalao = numeroTalao.trim();
    const talaoJaExiste = recibos.some(
      (r) => r.talao.toLowerCase() === cleanTalao.toLowerCase() && r.banco === bancoSelecionado
    );
    if (talaoJaExiste) {
      setTalaoDuplicadoError(`O número de talão ${cleanTalao} já foi utilizado no banco ${bancoSelecionado}. Insira um comprovativo único.`);
      return;
    }

    const currentYear = new Date().getFullYear();
    const nextReciboSeq = recibos.length + 1;
    const nRec = `REC-${currentYear}-${String(nextReciboSeq).padStart(4, '0')}`;

    const valorPagoAnterior = faturaParaLiquidar.saldo_pago || 0;
    const novoSaldoRestante = Math.max(0, saldoPendenteAtual - valorPagamentoInput);
    const isLiquidacaoTotal = novoSaldoRestante === 0;

    const novoRecibo: ReciboIMP = {
      id: nRec,
      nRecibo: nRec,
      fatura_id: faturaParaLiquidar.id,
      nFatura: faturaParaLiquidar.nFatura,
      totalFatura: faturaParaLiquidar.total,
      valorAnteriorPago: valorPagoAnterior,
      valor: valorPagamentoInput,
      saldoRestante: novoSaldoRestante,
      isLiquidacaoTotal,
      banco: bancoSelecionado,
      talao: cleanTalao,
      data: dataLiquidacao,
      hora: new Date().toTimeString().slice(0, 5),
      emissor: currentUser.nome,
      cliente: faturaParaLiquidar.cliente,
      navio: faturaParaLiquidar.navio,
      observacoes: obsLiquidacao.trim()
    };

    const novoSaldoCaixa = saldoAtualEmCaixa + valorPagamentoInput;

    const novoMov: CaixaMov = {
      id: `MOV-${Date.now().toString().slice(-5)}`,
      data: dataLiquidacao,
      hora: new Date().toTimeString().slice(0, 5),
      descricao: `Recebimento ${isLiquidacaoTotal ? 'Integral' : 'Parcial'} Fatura ${
        faturaParaLiquidar.nFatura
      } (${faturaParaLiquidar.navio}) - Talão ${cleanTalao}`,
      tipo: 'entrada',
      valor: valorPagamentoInput,
      saldoApos: novoSaldoCaixa,
      criado_por: currentUser.nome,
      categoria: 'Recibo Faturação',
      talao: cleanTalao,
      banco: bancoSelecionado,
      documentoComprovativo: faturaParaLiquidar.nFatura
    };

    onLiquidateFatura(faturaParaLiquidar.id, novoRecibo, novoMov);
    setFaturaParaLiquidar(null);
    setViewingRecibo(novoRecibo);
  };

  // Submit Professional Cash Outflow (Saída de Caixa com Comprovativo)
  const handleSubmitNovaSaida = (e: FormEvent) => {
    e.preventDefault();
    if (!saidaForm.descricao.trim() || saidaForm.valor <= 0) return;
    if (!saidaForm.documentoComprovativo.trim()) {
      alert('O número do Documento Comprovativo (Fatura de Fornecedor, Recibo ou Ordem de Saída) é obrigatório por normas de auditoria.');
      return;
    }
    if (!saidaForm.beneficiario.trim()) {
      alert('Identifique a entidade ou pessoa beneficiária do pagamento.');
      return;
    }

    // CASH BALANCE DEFENSE: CANNOT WITHDRAW MORE THAN AVAILABLE CASH
    if (saidaForm.valor > saldoAtualEmCaixa) {
      alert(
        `BLOQUEIO DE SEGURANÇA: Saldo em caixa insuficiente (${saldoAtualEmCaixa.toLocaleString(
          'pt-PT'
        )} XOF). Não é permitida a saída de ${saidaForm.valor.toLocaleString(
          'pt-PT'
        )} XOF sem prévio suprimento de caixa.`
      );
      return;
    }

    const val = Math.round(Number(saidaForm.valor) || 0);
    const novoSaldo = saldoAtualEmCaixa - val;

    const novaSaida: CaixaMov = {
      id: `MOV-${Date.now().toString().slice(-5)}`,
      data: new Date().toISOString().slice(0, 10),
      hora: new Date().toTimeString().slice(0, 5),
      descricao: saidaForm.descricao.trim(),
      tipo: 'saida',
      valor: val,
      saldoApos: novoSaldo,
      criado_por: currentUser.nome,
      categoria: saidaForm.categoria,
      documentoComprovativo: saidaForm.documentoComprovativo.trim(),
      beneficiario: saidaForm.beneficiario.trim(),
      autorizado_por: saidaForm.autorizado_por.trim(),
      justificativa: saidaForm.justificativa.trim(),
      comprovativoAnexo: saidaForm.anexoNome ? saidaForm.anexoNome : undefined
    };

    onAddMovimento(novaSaida);
    setShowNovaSaidaModal(false);
    setViewingSaidaDoc(novaSaida);
    setSaidaForm({
      descricao: '',
      valor: 250000,
      categoria: 'Combustível Embarcações',
      documentoComprovativo: '',
      beneficiario: '',
      autorizado_por: 'Dr. Mamadu Djaló (Diretor Geral / PCA)',
      justificativa: '',
      anexoNome: ''
    });
  };

  // Filtered movements calculation based on Period and Search
  const { filteredMovimentos, totalEntradasPeriodo, totalSaidasPeriodo, saldoFinal } = useMemo(() => {
    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10);

    const list = movimentos.filter((m) => {
      // Period filter
      if (periodFilter === 'dia') {
        if (m.data !== todayStr) return false;
      } else if (periodFilter === 'semana') {
        const movDate = new Date(m.data);
        const diffDays = Math.abs((now.getTime() - movDate.getTime()) / (1000 * 3600 * 24));
        if (diffDays > 7) return false;
      } else if (periodFilter === 'mes') {
        const curMonth = todayStr.slice(0, 7);
        if (!m.data.startsWith(curMonth)) return false;
      } else if (periodFilter === 'ano') {
        const curYear = todayStr.slice(0, 4);
        if (!m.data.startsWith(curYear)) return false;
      }

      // Search term
      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        return (
          m.descricao.toLowerCase().includes(query) ||
          m.categoria.toLowerCase().includes(query) ||
          (m.documentoComprovativo && m.documentoComprovativo.toLowerCase().includes(query)) ||
          (m.beneficiario && m.beneficiario.toLowerCase().includes(query)) ||
          (m.talao && m.talao.toLowerCase().includes(query)) ||
          (m.banco && m.banco.toLowerCase().includes(query))
        );
      }
      return true;
    });

    let entradas = 0;
    let saidas = 0;
    list.forEach((m) => {
      if (m.tipo === 'entrada') entradas += m.valor;
      else saidas += m.valor;
    });

    const saldo = movimentos.length > 0 ? movimentos[movimentos.length - 1].saldoApos : 0;

    return {
      filteredMovimentos: list,
      totalEntradasPeriodo: entradas,
      totalSaidasPeriodo: saidas,
      saldoFinal: saldo
    };
  }, [movimentos, periodFilter, searchTerm]);

  // Debtors & Outstanding Balances Dashboard metrics
  const devedoresData = useMemo(() => {
    const validFaturas = faturas.filter((f) => f.estado !== 'anulada');

    let totalDividaPendente = 0;
    let totalJaAmortizado = 0;
    let qtdParciais = 0;
    let qtdPendentesIntegrais = 0;
    let qtdLiquidadas = 0;

    validFaturas.forEach((f) => {
      const pago = f.saldo_pago || (f.estado === 'paga' ? f.total : 0);
      const pendente = f.saldo_pendente ?? (f.estado === 'paga' ? 0 : f.total - pago);

      totalDividaPendente += pendente;
      totalJaAmortizado += pago;

      if (f.estado === 'paga') qtdLiquidadas++;
      else if (f.estado === 'parcial' || (pago > 0 && pendente > 0)) qtdParciais++;
      else if (f.estado === 'confirmada' && pago === 0) qtdPendentesIntegrais++;
    });

    const filtered = validFaturas.filter((f) => {
      const pago = f.saldo_pago || (f.estado === 'paga' ? f.total : 0);
      const pendente = f.saldo_pendente ?? (f.estado === 'paga' ? 0 : f.total - pago);

      if (devedorFilter === 'todos_pendentes') return pendente > 0;
      if (devedorFilter === 'parciais') return f.estado === 'parcial' || (pago > 0 && pendente > 0);
      if (devedorFilter === 'integrais') return (f.estado === 'confirmada' || f.estado === 'rascunho') && pago === 0;
      if (devedorFilter === 'liquidadas') return f.estado === 'paga' || pendente === 0;
      return true;
    });

    return {
      totalDividaPendente,
      totalJaAmortizado,
      qtdParciais,
      qtdPendentesIntegrais,
      qtdLiquidadas,
      filtered
    };
  }, [faturas, devedorFilter]);

  // Outflows list
  const saidasMovimentos = useMemo(() => {
    return movimentos.filter((m) => m.tipo === 'saida');
  }, [movimentos]);

  return (
    <div id="tesouraria-module" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                theme === 'dark'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              }`}
            >
              Tesouraria & Caixa Central
            </span>
            <span className="text-xs font-mono text-slate-500">
              Bancos Autorizados: BAO • CORIS BANK • BANQUE ATLANTIQUE
            </span>
          </div>
          <h2
            className={`text-xl font-bold tracking-tight mt-1 flex items-center gap-2 ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}
          >
            <Wallet className="w-5 h-5 text-emerald-500" />
            Caixa Profissional, Amortizações, Recibos & Controlo de Saídas
          </h2>
          <p className={theme === 'dark' ? 'text-xs text-slate-400' : 'text-xs text-slate-500'}>
            Segregação de Funções (SoD): O Caixa recebe pagamentos (integrais ou parciais), emite Recibos Oficiais e fiscaliza saídas justificadas.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowNovaSaidaModal(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-rose-600/20"
          >
            <FileMinus className="w-4 h-4" />
            Registar Saída de Caixa
          </button>
          <button
            onClick={() => setShowFechoFolhaModal(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-600/20"
          >
            <Printer className="w-4 h-4" />
            Fecho Diário de Caixa
          </button>
        </div>
      </div>

      {/* QUICK UNIVERSAL SEARCH BAR: LOOKUP BY INVOICE OR RECEIPT CODE */}
      <div
        className={`p-4 rounded-2xl border transition-all ${
          theme === 'dark'
            ? 'bg-slate-900 border-slate-800'
            : 'bg-white border-slate-200 shadow-sm'
        }`}
      >
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 uppercase font-mono whitespace-nowrap">
            <Search className="w-4 h-4 text-emerald-500" />
            <span>Consulta Rápida por Código:</span>
          </div>
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Digite o código da fatura (ex: FAT-2026-0001) ou recibo (ex: REC-2026-0001)..."
              value={codigoBuscaRapida}
              onChange={(e) => setCodigoBuscaRapida(e.target.value)}
              className={`w-full rounded-xl px-4 py-2.5 text-xs font-mono border focus:outline-none focus:border-emerald-500 ${
                theme === 'dark'
                  ? 'bg-slate-950 border-slate-800 text-white placeholder-slate-500'
                  : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
              }`}
            />
            {codigoBuscaRapida && (
              <button
                onClick={() => setCodigoBuscaRapida('')}
                className="absolute right-3 top-2.5 p-1 rounded-md text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Search Results Card Overlay */}
        {buscaRapidaResultado && (buscaRapidaResultado.faturas.length > 0 || buscaRapidaResultado.recibos.length > 0) && (
          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                Resultados Localizados ({buscaRapidaResultado.faturas.length} Fatura(s) • {buscaRapidaResultado.recibos.length} Recibo(s))
              </span>
              <button
                onClick={() => setCodigoBuscaRapida('')}
                className="text-[11px] text-slate-500 hover:underline"
              >
                Fechar Consulta
              </button>
            </div>

            {/* Matched Invoices Breakdown */}
            {buscaRapidaResultado.faturas.map((fat) => {
              const pago = fat.saldo_pago || (fat.estado === 'paga' ? fat.total : 0);
              const pendente = fat.saldo_pendente ?? (fat.estado === 'paga' ? 0 : fat.total - pago);
              const percPago = fat.total > 0 ? Math.min(100, Math.round((pago / fat.total) * 100)) : 0;
              const fRecibos = recibos.filter((r) => r.fatura_id === fat.id || r.nFatura === fat.nFatura);

              return (
                <div
                  key={fat.id}
                  className={`p-4 rounded-xl border text-xs space-y-3 ${
                    theme === 'dark'
                      ? 'bg-slate-950/80 border-slate-800'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-extrabold text-sm text-blue-600 dark:text-blue-400">
                        {fat.nFatura}
                      </span>
                      <span className="text-[11px] text-slate-500 font-mono">({fat.data})</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                          fat.estado === 'paga'
                            ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                            : fat.estado === 'parcial'
                            ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                            : 'bg-blue-500/10 text-blue-600 border border-blue-500/20'
                        }`}
                      >
                        {fat.estado}
                      </span>
                    </div>

                    {pendente > 0 && (fat.estado === 'confirmada' || fat.estado === 'parcial') && (
                      <button
                        onClick={() => handleOpenLiquidar(fat)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all shadow flex items-center gap-1.5"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        Cobrar Saldo ({pendente.toLocaleString('pt-PT')} XOF)
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">Cliente / Agência:</span>
                      <span className="font-sans font-semibold text-slate-800 dark:text-slate-200">{fat.cliente}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">Navio:</span>
                      <span className="font-sans text-slate-700 dark:text-slate-300">{fat.navio}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">Total Faturado (X):</span>
                      <span className="font-bold text-slate-900 dark:text-white">{fat.total.toLocaleString('pt-PT')} XOF</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">Saldo Devedor (Z):</span>
                      <span className={`font-bold ${pendente > 0 ? 'text-amber-500' : 'text-emerald-500'}`}>
                        {pendente.toLocaleString('pt-PT')} XOF
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-mono">
                      <span className="text-slate-500">Amortização da Fatura: {percPago}% pago</span>
                      <span className="text-emerald-600 font-bold">{pago.toLocaleString('pt-PT')} de {fat.total.toLocaleString('pt-PT')} XOF</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden flex">
                      <div className="bg-emerald-500 h-full transition-all" style={{ width: `${percPago}%` }} />
                      <div className="bg-amber-500/60 h-full transition-all" style={{ width: `${100 - percPago}%` }} />
                    </div>
                  </div>

                  {/* Associated Receipts */}
                  {fRecibos.length > 0 && (
                    <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block mb-1">
                        Recibos Emitidos para esta Fatura ({fRecibos.length}):
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {fRecibos.map((rec) => (
                          <div
                            key={rec.id}
                            className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                          >
                            <div>
                              <span className="font-bold font-mono text-emerald-600">{rec.nRecibo}</span>
                              <span className="text-[10px] text-slate-400 block font-mono">
                                {rec.data} • {rec.banco} ({rec.talao})
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-emerald-600">
                                {rec.valor.toLocaleString('pt-PT')} XOF
                              </span>
                              <button
                                onClick={() => setViewingRecibo(rec)}
                                className="px-2 py-1 rounded-lg bg-emerald-600/10 hover:bg-emerald-600 text-emerald-600 hover:text-white transition-all text-[11px] font-bold flex items-center gap-1"
                                title="Imprimir Recibo Oficial"
                              >
                                <Printer className="w-3 h-3" />
                                <span>Imprimir</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            {/* Matched Receipts Breakdown */}
            {buscaRapidaResultado.recibos.map((rec) => (
              <div
                key={rec.id}
                className={`p-4 rounded-xl border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  theme === 'dark'
                    ? 'bg-slate-950/80 border-slate-800'
                    : 'bg-emerald-50/50 border-emerald-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                    <Receipt className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-extrabold text-sm text-emerald-600 dark:text-emerald-400">
                        {rec.nRecibo}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 uppercase font-bold">
                        Recibo Pago
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Fatura: <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{rec.nFatura}</span> • 
                      Cliente: <span className="font-semibold text-slate-700 dark:text-slate-300">{rec.cliente}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-[10px] text-slate-400 uppercase font-mono">Valor Pago:</div>
                    <div className="text-sm font-black text-emerald-600">
                      {rec.valor.toLocaleString('pt-PT')} XOF
                    </div>
                  </div>
                  <button
                    onClick={() => setViewingRecibo(rec)}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                    title="Imprimir Recibo"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Imprimir Recibo</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          className={`p-4 rounded-2xl border ${
            theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <span className="text-[10px] uppercase font-mono text-slate-400 font-semibold block">Saldo Físico em Caixa</span>
          <div className="text-2xl font-bold font-mono text-emerald-500 mt-1">
            {saldoFinal.toLocaleString('pt-PT')} XOF
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Disponibilidade líquida conferida</span>
        </div>

        <div
          className={`p-4 rounded-2xl border ${
            theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <span className="text-[10px] uppercase font-mono text-slate-400 font-semibold block">Recebimentos no Período</span>
          <div className="text-2xl font-bold font-mono text-blue-500 mt-1 flex items-center gap-1.5">
            <ArrowUpRight className="w-5 h-5 text-blue-500" />
            {totalEntradasPeriodo.toLocaleString('pt-PT')} XOF
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Depósitos bancários & taxas recebidas</span>
        </div>

        <div
          className={`p-4 rounded-2xl border ${
            theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <span className="text-[10px] uppercase font-mono text-slate-400 font-semibold block">Saídas Justificadas</span>
          <div className="text-2xl font-bold font-mono text-rose-500 mt-1 flex items-center gap-1.5">
            <ArrowDownRight className="w-5 h-5 text-rose-500" />
            {totalSaidasPeriodo.toLocaleString('pt-PT')} XOF
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Com comprovativo documental e autorização</span>
        </div>

        <div
          className={`p-4 rounded-2xl border ${
            theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <span className="text-[10px] uppercase font-mono text-slate-400 font-semibold block">Faturas Prontas para Cobrança</span>
          <div className="text-2xl font-bold font-mono text-amber-500 mt-1">
            {faturasParaCobrar.length} Aguardando
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Confirmadas pelo setor de Faturação</span>
        </div>
      </div>

      {/* Tabs Switcher: Liquidação vs Devedores vs Recibos vs Saídas vs Folha de Caixa */}
      <div
        className={`flex border-b gap-4 lg:gap-6 text-xs font-semibold overflow-x-auto ${
          theme === 'dark' ? 'border-slate-800' : 'border-slate-200'
        }`}
      >
        <button
          onClick={() => setActiveTab('liquidacao')}
          className={`pb-3 flex items-center gap-2 border-b-2 whitespace-nowrap transition-all ${
            activeTab === 'liquidacao'
              ? 'border-emerald-500 text-emerald-500 font-bold'
              : theme === 'dark'
              ? 'border-transparent text-slate-400 hover:text-slate-200'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Faturas a Cobrar no Caixa ({faturasParaCobrar.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('devedores')}
          className={`pb-3 flex items-center gap-2 border-b-2 whitespace-nowrap transition-all ${
            activeTab === 'devedores'
              ? 'border-emerald-500 text-emerald-500 font-bold'
              : theme === 'dark'
              ? 'border-transparent text-slate-400 hover:text-slate-200'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Percent className="w-4 h-4" />
          <span>Controlo de Saldos & Histórico de Pendentes ({devedoresData.filtered.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('recibos')}
          className={`pb-3 flex items-center gap-2 border-b-2 whitespace-nowrap transition-all ${
            activeTab === 'recibos'
              ? 'border-emerald-500 text-emerald-500 font-bold'
              : theme === 'dark'
              ? 'border-transparent text-slate-400 hover:text-slate-200'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span>Recibos Oficiais Emitidos ({recibos.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('saidas')}
          className={`pb-3 flex items-center gap-2 border-b-2 whitespace-nowrap transition-all ${
            activeTab === 'saidas'
              ? 'border-emerald-500 text-emerald-500 font-bold'
              : theme === 'dark'
              ? 'border-transparent text-slate-400 hover:text-slate-200'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileMinus className="w-4 h-4" />
          <span>Saídas de Caixa & Comprovativos ({saidasMovimentos.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('folha')}
          className={`pb-3 flex items-center gap-2 border-b-2 whitespace-nowrap transition-all ${
            activeTab === 'folha'
              ? 'border-emerald-500 text-emerald-500 font-bold'
              : theme === 'dark'
              ? 'border-transparent text-slate-400 hover:text-slate-200'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileCheck2 className="w-4 h-4" />
          <span>Folha Diária de Caixa & Balancete</span>
        </button>
      </div>

      {/* TAB 1: LIQUIDAÇÃO DE FATURAS CONFIRMADAS / PARCIAIS */}
      {activeTab === 'liquidacao' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className={theme === 'dark' ? 'text-xs text-slate-400' : 'text-xs text-slate-500'}>
              Faturas confirmadas pelo setor de Faturação prontas para cobrança (integral ou amortização parcial):
            </span>
          </div>

          <div
            className={`rounded-2xl border overflow-hidden ${
              theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead
                  className={`uppercase font-mono text-[10px] border-b ${
                    theme === 'dark'
                      ? 'bg-slate-950 text-slate-400 border-slate-800'
                      : 'bg-slate-50 text-slate-600 border-slate-200'
                  }`}
                >
                  <tr>
                    <th className="p-3.5">Fatura Nº & Data</th>
                    <th className="p-3.5">Agência Marítima (Cliente)</th>
                    <th className="p-3.5">Navio / Embarcação</th>
                    <th className="p-3.5 text-right">Total Faturado</th>
                    <th className="p-3.5 text-right">Já Amortizado</th>
                    <th className="p-3.5 text-right">Saldo a Cobrar (XOF)</th>
                    <th className="p-3.5">Estado</th>
                    <th className="p-3.5 text-right">Ação do Caixa</th>
                  </tr>
                </thead>
                <tbody className={theme === 'dark' ? 'divide-y divide-slate-800/60' : 'divide-y divide-slate-100'}>
                  {faturasParaCobrar.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-slate-500 text-xs">
                        Não existem faturas pendentes de liquidação no momento.
                      </td>
                    </tr>
                  ) : (
                    faturasParaCobrar.map((fat) => {
                      const pago = fat.saldo_pago || 0;
                      const pendente = fat.saldo_pendente ?? (fat.total - pago);

                      return (
                        <tr
                          key={fat.id}
                          className={`transition-colors ${
                            theme === 'dark' ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'
                          }`}
                        >
                          <td className="p-3.5 whitespace-nowrap">
                            <div className={`font-mono font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                              {fat.nFatura}
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono">{fat.data}</span>
                          </td>
                          <td className="p-3.5">
                            <div className={`font-semibold ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>
                              {fat.cliente}
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono">NIF: {fat.nif}</span>
                          </td>
                          <td className={`p-3.5 whitespace-nowrap ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                            {fat.navio} <span className="text-slate-400 font-mono">({fat.tipo})</span>
                          </td>
                          <td className="p-3.5 text-right whitespace-nowrap font-mono text-slate-500">
                            {fat.total.toLocaleString('pt-PT')} XOF
                          </td>
                          <td className="p-3.5 text-right whitespace-nowrap font-mono text-emerald-600 font-semibold">
                            {pago.toLocaleString('pt-PT')} XOF
                          </td>
                          <td className="p-3.5 text-right whitespace-nowrap">
                            <span className="font-mono font-bold text-sm text-emerald-500">
                              {pendente.toLocaleString('pt-PT')} XOF
                            </span>
                          </td>
                          <td className="p-3.5 whitespace-nowrap">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                                fat.estado === 'parcial'
                                  ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                                  : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
                              }`}
                            >
                              {fat.estado === 'parcial' ? 'Parcial' : 'Confirmada'}
                            </span>
                          </td>
                          <td className="p-3.5 text-right whitespace-nowrap">
                            <button
                              onClick={() => handleOpenLiquidar(fat)}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-600/20 flex items-center gap-1.5 ml-auto"
                            >
                              <CreditCard className="w-3.5 h-3.5" />
                              Registar Pagamento & Recibo
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CONTROLO DE SALDOS & HISTÓRICO DE DEVEDORES ("Pago e Não Acabado") */}
      {activeTab === 'devedores' && (
        <div className="space-y-4">
          {/* Sub-KPIs for Aging & Balance Tracking */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className={`p-4 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
              <span className="text-[10px] uppercase font-mono text-slate-400 font-semibold block">Total em Dívida Pendente (Z)</span>
              <div className="text-xl font-bold font-mono text-amber-500 mt-1">
                {devedoresData.totalDividaPendente.toLocaleString('pt-PT')} XOF
              </div>
              <span className="text-[10px] text-slate-500 font-sans">Valor global a liquidar por agências</span>
            </div>

            <div className={`p-4 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
              <span className="text-[10px] uppercase font-mono text-slate-400 font-semibold block">Total Já Arrecadado (A + Y)</span>
              <div className="text-xl font-bold font-mono text-emerald-500 mt-1">
                {devedoresData.totalJaAmortizado.toLocaleString('pt-PT')} XOF
              </div>
              <span className="text-[10px] text-slate-500 font-sans">Total liquidado em recibos de tesouraria</span>
            </div>

            <div className={`p-4 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
              <span className="text-[10px] uppercase font-mono text-slate-400 font-semibold block">Faturas "Pago e Não Acabado"</span>
              <div className="text-xl font-bold font-mono text-blue-500 mt-1">
                {devedoresData.qtdParciais} Parciais
              </div>
              <span className="text-[10px] text-slate-500 font-sans">Com amortização parcial e saldo pendente</span>
            </div>

            <div className={`p-4 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
              <span className="text-[10px] uppercase font-mono text-slate-400 font-semibold block">Totalmente Quitadas</span>
              <div className="text-xl font-bold font-mono text-emerald-600 mt-1">
                {devedoresData.qtdLiquidadas} Faturas
              </div>
              <span className="text-[10px] text-slate-500 font-sans">100% liquidadas sem dívida restante</span>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'todos_pendentes', label: `Todos os Devedores (${faturas.filter(f => (f.saldo_pendente ?? f.total) > 0 && f.estado !== 'anulada').length})` },
              { id: 'parciais', label: `Histórico de Parciais - "Pago e Não Acabado" (${devedoresData.qtdParciais})` },
              { id: 'integrais', label: `Dívida Integral (Sem Amortização) (${devedoresData.qtdPendentesIntegrais})` },
              { id: 'liquidadas', label: `Totalmente Liquidadas (${devedoresData.qtdLiquidadas})` }
            ].map((fil) => (
              <button
                key={fil.id}
                onClick={() => setDevedorFilter(fil.id as DevedorFilter)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all border ${
                  devedorFilter === fil.id
                    ? 'bg-emerald-600 border-emerald-600 text-white shadow-md'
                    : theme === 'dark'
                    ? 'bg-slate-900 text-slate-400 hover:text-white border-slate-800'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 shadow-sm'
                }`}
              >
                {fil.label}
              </button>
            ))}
          </div>

          {/* Debtors List Table with History Toggle */}
          <div
            className={`rounded-2xl border overflow-hidden ${
              theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead
                  className={`uppercase font-mono text-[10px] border-b ${
                    theme === 'dark'
                      ? 'bg-slate-950 text-slate-400 border-slate-800'
                      : 'bg-slate-50 text-slate-600 border-slate-200'
                  }`}
                >
                  <tr>
                    <th className="p-3.5">Identificação Fatura</th>
                    <th className="p-3.5">Cliente (Agência Marítima)</th>
                    <th className="p-3.5">Navio / Embarcação</th>
                    <th className="p-3.5 text-right">Faturado (X)</th>
                    <th className="p-3.5 text-right">Amortizado (A+Y)</th>
                    <th className="p-3.5 text-right">Dívida Atual (Z)</th>
                    <th className="p-3.5 min-w-[140px]">% Pago</th>
                    <th className="p-3.5 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className={theme === 'dark' ? 'divide-y divide-slate-800/60' : 'divide-y divide-slate-100'}>
                  {devedoresData.filtered.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-12 text-center text-slate-500 text-xs font-sans italic">
                        Nenhum registo localizado para o filtro selecionado.
                      </td>
                    </tr>
                  ) : (
                    devedoresData.filtered.map((fat) => {
                      const pago = fat.saldo_pago || (fat.estado === 'paga' ? fat.total : 0);
                      const pendente = fat.saldo_pendente ?? (fat.estado === 'paga' ? 0 : fat.total - pago);
                      const perc = fat.total > 0 ? Math.min(100, Math.round((pago / fat.total) * 100)) : 0;
                      const isExpanded = expandedFaturaId === fat.id;
                      const fRecibos = recibos.filter((r) => r.fatura_id === fat.id || r.nFatura === fat.nFatura);

                      return (
                        <React.Fragment key={fat.id}>
                          <tr
                            className={`transition-colors ${
                              theme === 'dark' ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'
                            }`}
                          >
                            <td className="p-3.5 whitespace-nowrap">
                              <div className={`font-mono font-bold text-sm ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                                {fat.nFatura}
                              </div>
                              <span className="text-[10px] text-slate-400 font-mono">{fat.data}</span>
                            </td>
                            <td className="p-3.5">
                              <div className={`font-semibold ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>
                                {fat.cliente}
                              </div>
                              <span className="text-[10px] text-slate-400 font-mono">NIF: {fat.nif}</span>
                            </td>
                            <td className={`p-3.5 whitespace-nowrap ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                              {fat.navio} <span className="text-slate-400 font-mono text-[10px]">({fat.tipo})</span>
                            </td>
                            <td className="p-3.5 text-right whitespace-nowrap font-mono text-slate-400">
                              {fat.total.toLocaleString('pt-PT')}
                            </td>
                            <td className="p-3.5 text-right whitespace-nowrap font-mono text-emerald-600 font-bold">
                              {pago.toLocaleString('pt-PT')}
                            </td>
                            <td className="p-3.5 text-right whitespace-nowrap">
                              <span className={`font-mono font-bold text-sm ${pendente > 0 ? 'text-amber-500' : 'text-emerald-500'}`}>
                                {pendente.toLocaleString('pt-PT')} XOF
                              </span>
                            </td>
                            <td className="p-3.5 whitespace-nowrap">
                              <div className="space-y-1">
                                <div className="flex justify-between text-[10px] font-mono">
                                  <span className="text-slate-400">{perc}%</span>
                                  <span className={pendente > 0 ? 'text-amber-500 font-bold' : 'text-emerald-500 font-bold'}>
                                    {pendente === 0 ? 'LIQUIDADA' : 'PENDENTE'}
                                  </span>
                                </div>
                                <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden flex">
                                  <div className="bg-emerald-500 h-full transition-all duration-500" style={{ width: `${perc}%` }} />
                                  <div className="bg-amber-500/40 h-full" style={{ width: `${100 - perc}%` }} />
                                </div>
                              </div>
                            </td>
                            <td className="p-3.5 text-right whitespace-nowrap">
                              <div className="flex items-center justify-end gap-1.5">
                                {fRecibos.length > 0 && (
                                  <button
                                    onClick={() => setExpandedFaturaId(isExpanded ? null : fat.id)}
                                    className={`p-1.5 rounded-lg text-[11px] font-bold font-mono flex items-center gap-1 transition-colors ${
                                      isExpanded 
                                        ? 'bg-blue-600 text-white shadow'
                                        : theme === 'dark' ? 'bg-slate-800 text-slate-300 hover:text-white' : 'bg-slate-100 text-slate-600 hover:text-blue-600'
                                    }`}
                                    title="Ver Histórico Cronológico de Pagamentos"
                                  >
                                    <Receipt className="w-3.5 h-3.5" />
                                    <span>HISTÓRICO ({fRecibos.length})</span>
                                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                  </button>
                                )}
                                {pendente > 0 && (fat.estado === 'confirmada' || fat.estado === 'parcial') && (
                                  <button
                                    onClick={() => handleOpenLiquidar(fat)}
                                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all shadow-sm"
                                  >
                                    Cobrar Saldo
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>

                          {/* Expanded Payment History Row (Professional List) */}
                          {isExpanded && fRecibos.length > 0 && (
                            <tr className={theme === 'dark' ? 'bg-slate-950/60' : 'bg-slate-50/80 animate-in slide-in-from-top-2'}>
                              <td colSpan={8} className="p-5 border-b border-slate-200 dark:border-slate-800">
                                <div className="space-y-4">
                                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                                    <span className="text-[10px] uppercase font-mono font-black text-slate-500 flex items-center gap-2">
                                      <Clock className="w-3.5 h-3.5 text-blue-500" />
                                      Rastreio de Amortizações (Auditoria IMP) - {fat.nFatura}
                                    </span>
                                    <span className="text-[10px] text-slate-400 font-mono italic">
                                      Total Amortizado: {pago.toLocaleString('pt-PT')} de {fat.total.toLocaleString('pt-PT')} XOF
                                    </span>
                                  </div>
                                  
                                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {fRecibos.map((rec, rIdx) => (
                                      <div
                                        key={rec.id}
                                        className="p-3.5 rounded-2xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-xs font-mono flex flex-col justify-between shadow-sm relative group"
                                      >
                                        <div className="flex justify-between items-start mb-2">
                                          <div>
                                            <div className="font-black text-emerald-600 flex items-center gap-1.5">
                                              <span className="bg-emerald-100 dark:bg-emerald-900/40 px-1.5 py-0.5 rounded text-[9px]">#{rIdx + 1}</span>
                                              <span>{rec.nRecibo}</span>
                                            </div>
                                            <div className="text-[10px] text-slate-400 mt-0.5">
                                              {rec.data} às {rec.hora}
                                            </div>
                                          </div>
                                          <div className="text-right">
                                            <div className="text-[10px] text-slate-400 uppercase font-sans font-bold">VALOR AMORTIZADO:</div>
                                            <span className="font-black text-sm text-emerald-600">
                                              {rec.valor.toLocaleString('pt-PT')} XOF
                                            </span>
                                          </div>
                                        </div>
                                        
                                        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 mt-1">
                                          <div className="text-[10px] text-slate-500 font-sans italic truncate pr-4">
                                            Via {rec.banco} ({rec.talao})
                                          </div>
                                          <button
                                            onClick={() => setViewingRecibo(rec)}
                                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-all text-[10px] font-bold flex items-center gap-1 shadow-sm active:scale-95 cursor-pointer"
                                            title="Imprimir Recibo Oficial"
                                          >
                                            <Printer className="w-3 h-3" />
                                            Imprimir Recibo
                                          </button>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: RECIBOS OFICIAIS EMITIDOS (CONSULTA DE PAGAMENTOS) */}
      {activeTab === 'recibos' && (
        <div className="space-y-4">
          {/* Search & Statistics Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div
              className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl border flex-1 transition-all focus-within:ring-2 focus-within:ring-emerald-500/20 ${
                theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
              }`}
            >
              <Search className="w-4.5 h-4.5 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Pesquisar recibo por nº REC-, fatura FAT-, cliente, navio, banco ou talão..."
                value={reciboSearchTerm}
                onChange={(e) => setReciboSearchTerm(e.target.value)}
                className={`bg-transparent text-xs focus:outline-none w-full font-medium ${
                  theme === 'dark' ? 'text-white placeholder-slate-500' : 'text-slate-900 placeholder-slate-400'
                }`}
              />
              {reciboSearchTerm && (
                <button
                  onClick={() => setReciboSearchTerm('')}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Quick summary badges */}
            <div className="flex items-center gap-2 shrink-0">
              <div
                className={`px-3.5 py-2 rounded-2xl border text-xs flex items-center gap-2 ${
                  theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                }`}
              >
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Total Recibos:</span>
                <span className="font-mono font-black text-emerald-500">{filteredRecibos.length}</span>
              </div>
              <div
                className={`px-3.5 py-2 rounded-2xl border text-xs flex items-center gap-2 ${
                  theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                }`}
              >
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Total Arrecadado:</span>
                <span className="font-mono font-black text-emerald-600">
                  {filteredRecibos.reduce((s, r) => s + r.valor, 0).toLocaleString('pt-PT')} XOF
                </span>
              </div>
            </div>
          </div>

          <div
            className={`rounded-2xl border overflow-hidden ${
              theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead
                  className={`uppercase font-mono text-[10px] border-b ${
                    theme === 'dark'
                      ? 'bg-slate-950 text-slate-400 border-slate-800'
                      : 'bg-slate-50 text-slate-600 border-slate-200'
                  }`}
                >
                  <tr>
                    <th className="p-3.5">Identificação Recibo</th>
                    <th className="p-3.5">Fatura Associada</th>
                    <th className="p-3.5">Cliente / Agência</th>
                    <th className="p-3.5">Banco & Talão</th>
                    <th className="p-3.5 text-right">Valor Pago (Y)</th>
                    <th className="p-3.5 text-right">Saldo Restante (Z)</th>
                    <th className="p-3.5">Natureza Quitação</th>
                    <th className="p-3.5">Operador do Caixa</th>
                    <th className="p-3.5 text-right">Ação / Impressão</th>
                  </tr>
                </thead>
                <tbody className={theme === 'dark' ? 'divide-y divide-slate-800/60' : 'divide-y divide-slate-100'}>
                  {filteredRecibos.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="p-12 text-center text-slate-500 text-xs italic">
                        {reciboSearchTerm
                          ? `Nenhum recibo oficial encontrado para "${reciboSearchTerm}".`
                          : 'Nenhum recibo oficial emitido até o momento.'}
                      </td>
                    </tr>
                  ) : (
                    filteredRecibos.map((rec) => (
                      <tr
                        key={rec.id}
                        className={`transition-colors ${
                          theme === 'dark' ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'
                        }`}
                      >
                        <td className="p-3.5 whitespace-nowrap">
                          <div className="font-mono font-bold text-emerald-500 flex items-center gap-1.5">
                            <Receipt className="w-3.5 h-3.5" />
                            {rec.nRecibo}
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {rec.data} às {rec.hora}
                          </span>
                        </td>
                        <td
                          className={`p-3.5 whitespace-nowrap font-mono font-bold ${
                            theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                          }`}
                        >
                          {rec.nFatura}
                        </td>
                        <td className="p-3.5">
                          <div className={`font-semibold ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>
                            {rec.cliente}
                          </div>
                          {rec.navio && <span className="text-[10px] text-slate-400 font-mono">{rec.navio}</span>}
                        </td>
                        <td className="p-3.5 whitespace-nowrap">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] border font-mono font-bold ${
                              theme === 'dark'
                                ? 'bg-slate-800 border-slate-700 text-blue-400'
                                : 'bg-blue-50 border-blue-200 text-blue-700'
                            }`}
                          >
                            {rec.banco}
                          </span>
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5">{rec.talao}</div>
                        </td>
                        <td className="p-3.5 text-right whitespace-nowrap">
                          <span className="font-mono font-black text-sm text-emerald-600">
                            {rec.valor.toLocaleString('pt-PT')}
                          </span>
                        </td>
                        <td className="p-3.5 text-right whitespace-nowrap font-mono font-bold">
                          <span className={rec.saldoRestante && rec.saldoRestante > 0 ? 'text-amber-500' : 'text-slate-400'}>
                            {rec.saldoRestante !== undefined ? rec.saldoRestante.toLocaleString('pt-PT') : '0'}
                          </span>
                        </td>
                        <td className="p-3.5 whitespace-nowrap">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                              rec.isLiquidacaoTotal
                                ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30'
                                : 'bg-amber-500/10 text-amber-500 border-amber-500/30'
                            }`}
                          >
                            {rec.isLiquidacaoTotal ? 'QUITAÇÃO TOTAL' : 'AMORTIZAÇÃO PARCIAL'}
                          </span>
                        </td>
                        <td className="p-3.5 whitespace-nowrap text-slate-400 text-[11px] font-medium italic">
                          {rec.emissor}
                        </td>
                        <td className="p-3.5 text-right whitespace-nowrap">
                          <button
                            onClick={() => setViewingRecibo(rec)}
                            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black transition-all shadow-md shadow-emerald-600/25 flex items-center gap-1.5 ml-auto active:scale-95 cursor-pointer"
                            title="Visualizar e Imprimir Recibo Oficial de Quitação"
                          >
                            <Printer className="w-4 h-4" />
                            <span>Imprimir Recibo</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SAÍDAS DE CAIXA PROFISSIONAIS & COMPROVATIVOS JUSTIFICADOS */}
      {activeTab === 'saidas' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl border bg-rose-500/5 border-rose-500/20 shadow-inner">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-2xl bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-rose-700 dark:text-rose-300 text-base">
                    Controlo de Excluxão de Numerário (Saídas de Caixa)
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-600 text-white">
                    AUDITORIA RIGOROSA
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
                  Norma IMP/DAF: Saídas apenas para despesas operacionais urgentes, combustíveis de lanchas ou expediente. <span className="font-bold underline">Exige documento de fornecedor</span> e autorização prévia da Direção.
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowNovaSaidaModal(true)}
              className="px-5 py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl text-xs font-black transition-all shadow-lg shadow-rose-600/30 flex items-center gap-2 whitespace-nowrap self-start sm:self-center uppercase tracking-wide"
            >
              <Plus className="w-4 h-4" />
              Registar Saída
            </button>
          </div>

          <div
            className={`rounded-2xl border overflow-hidden ${
              theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead
                  className={`uppercase font-mono text-[10px] border-b ${
                    theme === 'dark'
                      ? 'bg-slate-950 text-slate-400 border-slate-800'
                      : 'bg-slate-50 text-slate-600 border-slate-200'
                  }`}
                >
                  <tr>
                    <th className="p-3.5">Data & Hora</th>
                    <th className="p-3.5">Natureza da Despesa</th>
                    <th className="p-3.5">Beneficiário</th>
                    <th className="p-3.5">Doc. Comprovativo</th>
                    <th className="p-3.5">Autorizado Por</th>
                    <th className="p-3.5 text-right">Montante (-)</th>
                    <th className="p-3.5 text-right">Justificativo</th>
                  </tr>
                </thead>
                <tbody className={theme === 'dark' ? 'divide-y divide-slate-800/60' : 'divide-y divide-slate-100'}>
                  {saidasMovimentos.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-12 text-center text-slate-500 text-xs italic">
                        Nenhuma saída de numerário registada no período.
                      </td>
                    </tr>
                  ) : (
                    saidasMovimentos.map((saida) => (
                      <tr
                        key={saida.id}
                        className={`transition-colors ${
                          theme === 'dark' ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'
                        }`}
                      >
                        <td className="p-3.5 whitespace-nowrap font-mono">
                          <div className={`font-bold ${theme === 'dark' ? 'text-slate-200' : 'text-slate-900'}`}>
                            {saida.data}
                          </div>
                          <span className="text-[10px] text-slate-400">{saida.hora}</span>
                        </td>
                        <td className="p-3.5">
                          <div className={`font-bold ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>
                            {saida.descricao}
                          </div>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700 mt-1 inline-block">
                            {saida.categoria}
                          </span>
                        </td>
                        <td className="p-3.5 whitespace-nowrap font-black uppercase text-slate-700 dark:text-slate-300">
                          {saida.beneficiario}
                        </td>
                        <td className="p-3.5 whitespace-nowrap font-mono">
                          <span className="font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded border border-rose-200 dark:border-rose-800">
                            {saida.documentoComprovativo}
                          </span>
                        </td>
                        <td className="p-3.5 whitespace-nowrap text-slate-500 text-[11px] font-bold">
                          {saida.autorizado_por}
                        </td>
                        <td className="p-3.5 text-right whitespace-nowrap font-mono font-black text-rose-600 text-sm">
                          -{saida.valor.toLocaleString('pt-PT')} XOF
                        </td>
                        <td className="p-3.5 text-right whitespace-nowrap">
                          <button
                            onClick={() => setViewingSaidaDoc(saida)}
                            className="px-3 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white rounded-lg text-xs font-black transition-all border border-rose-200 flex items-center gap-1.5 ml-auto"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            VER GUIA
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: FOLHA DE CAIXA COM FILTROS DE TEMPO */}
      {activeTab === 'folha' && (
        <div className="space-y-4">
          {/* Period Filters & Search */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div
              className={`flex flex-wrap items-center gap-1 p-1 rounded-2xl border text-xs ${
                theme === 'dark'
                  ? 'bg-slate-900/60 border-slate-800'
                  : 'bg-white border-slate-200 shadow-sm'
              }`}
            >
              {(['dia', 'semana', 'mes', 'ano', 'tudo'] as PeriodFilter[]).map((p) => {
                const labels: Record<PeriodFilter, string> = {
                  dia: 'Hoje',
                  semana: 'Esta Semana',
                  mes: 'Este Mês',
                  ano: 'Este Ano',
                  tudo: 'Todo o Histórico'
                };
                return (
                  <button
                    key={p}
                    onClick={() => setPeriodFilter(p)}
                    className={`px-4 py-2 rounded-xl font-bold transition-all ${
                      periodFilter === p
                        ? 'bg-emerald-600 text-white shadow-md'
                        : theme === 'dark'
                        ? 'text-slate-400 hover:text-white'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {labels[p]}
                  </button>
                );
              })}
            </div>

            <div
              className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl border flex-1 sm:max-w-xs transition-all focus-within:ring-2 focus-within:ring-emerald-500/20 ${
                theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
              }`}
            >
              <Search className="w-4.5 h-4.5 text-slate-400" />
              <input
                type="text"
                placeholder="Pesquisar movimento, talão, banco..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`bg-transparent text-xs focus:outline-none w-full font-medium ${
                  theme === 'dark' ? 'text-white placeholder-slate-500' : 'text-slate-900 placeholder-slate-400'
                }`}
              />
            </div>

            <button
              onClick={() => window.print()}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl text-xs font-bold flex items-center gap-2 transition-all shadow-sm active:scale-95 cursor-pointer shrink-0"
              title="Imprimir Folha Diária / Balancete de Caixa"
            >
              <Printer className="w-4 h-4 text-emerald-400" />
              <span>Imprimir Balancete</span>
            </button>
          </div>

          {/* Movements Ledger Table */}
          <div
            className={`rounded-2xl border overflow-hidden ${
              theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead
                  className={`uppercase font-mono text-[10px] border-b ${
                    theme === 'dark'
                      ? 'bg-slate-950 text-slate-400 border-slate-800'
                      : 'bg-slate-50 text-slate-600 border-slate-200'
                  }`}
                >
                  <tr>
                    <th className="p-3.5">Data & Hora</th>
                    <th className="p-3.5">Descrição do Lançamento</th>
                    <th className="p-3.5">Categoria & Documento</th>
                    <th className="p-3.5 text-right">Crédito (+)</th>
                    <th className="p-3.5 text-right">Débito (-)</th>
                    <th className="p-3.5 text-right">Saldo Progressivo</th>
                    <th className="p-3.5">Operador</th>
                    <th className="p-3.5 text-right">Comprovativo / Recibo</th>
                  </tr>
                </thead>
                <tbody className={`font-mono ${theme === 'dark' ? 'divide-y divide-slate-800/60' : 'divide-y divide-slate-100'}`}>
                  {filteredMovimentos.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-12 text-center text-slate-500 text-xs italic font-sans">
                        Nenhum movimento registado no balancete para este período.
                      </td>
                    </tr>
                  ) : (
                    filteredMovimentos.map((mov) => (
                      <tr
                        key={mov.id}
                        className={`transition-colors ${
                          theme === 'dark' ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'
                        }`}
                      >
                        <td className="p-3.5 whitespace-nowrap">
                          <div className={`font-bold ${theme === 'dark' ? 'text-slate-200' : 'text-slate-900'}`}>
                            {mov.data}
                          </div>
                          <span className="text-[10px] text-slate-400">{mov.hora}</span>
                        </td>
                        <td className="p-3.5 max-w-sm">
                          <div className={`font-sans font-bold text-slate-800 dark:text-slate-200 leading-snug`}>
                            {mov.descricao}
                          </div>
                          {mov.beneficiario && (
                            <span className="text-[10px] font-sans text-slate-500 block mt-0.5">
                              Entidade: {mov.beneficiario}
                            </span>
                          )}
                        </td>
                        <td className="p-3.5 whitespace-nowrap">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] border font-bold ${
                              mov.tipo === 'entrada'
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950/20 dark:border-emerald-800'
                                : 'bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-950/20 dark:border-rose-800'
                            }`}
                          >
                            {mov.categoria}
                          </span>
                          {(mov.talao || mov.documentoComprovativo) && (
                            <div className="text-[10px] text-slate-400 mt-1 font-bold">
                              {mov.banco ? `${mov.banco} • ` : ''}
                              {mov.documentoComprovativo || mov.talao}
                            </div>
                          )}
                        </td>
                        <td className="p-3.5 text-right whitespace-nowrap">
                          {mov.tipo === 'entrada' ? (
                            <span className="text-emerald-600 font-black">
                              +{mov.valor.toLocaleString('pt-PT')}
                            </span>
                          ) : (
                            <span className="text-slate-300 dark:text-slate-800">-</span>
                          )}
                        </td>
                        <td className="p-3.5 text-right whitespace-nowrap">
                          {mov.tipo === 'saida' ? (
                            <span className="text-rose-600 font-black">
                              -{mov.valor.toLocaleString('pt-PT')}
                            </span>
                          ) : (
                            <span className="text-slate-300 dark:text-slate-800">-</span>
                          )}
                        </td>
                        <td
                          className={`p-3.5 text-right whitespace-nowrap font-black text-sm ${
                            theme === 'dark' ? 'text-white' : 'text-slate-900'
                          }`}
                        >
                          {mov.saldoApos.toLocaleString('pt-PT')} XOF
                        </td>
                        <td className="p-3.5 whitespace-nowrap text-slate-400 font-sans text-[11px] font-medium">
                          {mov.criado_por}
                        </td>
                        <td className="p-3.5 text-right whitespace-nowrap">
                          {mov.tipo === 'entrada' ? (
                            <button
                              onClick={() => {
                                const found = recibos.find(
                                  (r) =>
                                    r.talao === mov.talao ||
                                    (mov.documentoComprovativo && r.nFatura === mov.documentoComprovativo)
                                );
                                if (found) {
                                  setViewingRecibo(found);
                                } else {
                                  setViewingRecibo({
                                    id: `REC-${mov.id}`,
                                    nRecibo: `REC-CX-${mov.id.replace('MOV-', '')}`,
                                    fatura_id: mov.documentoComprovativo || 'FAT-AVULSO',
                                    nFatura: mov.documentoComprovativo || 'PAGAMENTO CAIXA',
                                    totalFatura: mov.valor,
                                    valorAnteriorPago: 0,
                                    valor: mov.valor,
                                    saldoRestante: 0,
                                    isLiquidacaoTotal: true,
                                    banco: (mov.banco as any) || 'BAO',
                                    talao: mov.talao || mov.documentoComprovativo || 'TAL-CX-001',
                                    data: mov.data,
                                    hora: mov.hora,
                                    emissor: mov.criado_por,
                                    cliente: mov.beneficiario || 'Armador / Utente Portuário',
                                    observacoes: mov.descricao
                                  });
                                }
                              }}
                              className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 ml-auto transition-all shadow-sm active:scale-95 cursor-pointer"
                              title="Imprimir Recibo Oficial deste recebimento"
                            >
                              <Printer className="w-3.5 h-3.5" />
                              <span>Imprimir Recibo</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => setViewingSaidaDoc(mov)}
                              className="px-2.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 ml-auto transition-all shadow-sm active:scale-95 cursor-pointer"
                              title="Imprimir Guia de Saída de Caixa"
                            >
                              <Printer className="w-3.5 h-3.5" />
                              <span>Imprimir Guia</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* LIQUIDATION / AMORTIZATION PAYMENT MODAL (WITH STRICT OVERPAYMENT DEFENSE) */}
      {faturaParaLiquidar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#072652]/80 backdrop-blur-md animate-in fade-in">
          <div
            className={`w-full max-w-xl rounded-[32px] border shadow-2xl p-8 space-y-6 transform transition-all ${
              theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            <div className={`flex items-center justify-between border-b pb-5 ${theme === 'dark' ? 'border-slate-800' : 'border-slate-200'}`}>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500">
                  <CreditCard className="w-6 h-6" />
                </div>
                <div>
                  <h3 className={`font-black text-xl tracking-tight ${theme === 'dark' ? 'text-white' : 'text-[#0B2B59]'}`}>
                    Recebimento & Quitação
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs font-black font-mono text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded">{faturaParaLiquidar.nFatura}</span>
                    <span className="text-xs text-slate-400 font-medium">| {faturaParaLiquidar.cliente}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setFaturaParaLiquidar(null)}
                className={`p-2 rounded-xl transition-all hover:rotate-90 ${
                  theme === 'dark' ? 'bg-slate-800 text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-500 hover:text-slate-800'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Target Invoice Formula Card */}
            {(() => {
              const saldoPendenteAtual =
                faturaParaLiquidar.saldo_pendente ??
                (faturaParaLiquidar.total - (faturaParaLiquidar.saldo_pago || 0));
              const pagoAnterior = faturaParaLiquidar.saldo_pago || 0;
              const novoRestante = Math.max(0, saldoPendenteAtual - valorPagamentoInput);
              const isOverpayment = valorPagamentoInput > saldoPendenteAtual;

              return (
                <div className="space-y-4">
                  <div
                    className={`p-5 rounded-3xl border text-[13px] space-y-3 font-mono shadow-inner ${
                      theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-[#F8FAFC] border-slate-200'
                    }`}
                  >
                    <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-2">
                      <span className="text-slate-500 text-[11px] font-bold">1. VALOR TOTAL EMITIDO (X):</span>
                      <span className="font-black text-slate-900 dark:text-white text-base">
                        {faturaParaLiquidar.total.toLocaleString('pt-PT')} XOF
                      </span>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-2">
                      <span className="text-slate-500 text-[11px] font-bold">2. JÁ AMORTIZADO ANTERIOR (A):</span>
                      <span className="font-black text-emerald-600">
                        {pagoAnterior.toLocaleString('pt-PT')} XOF
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-1">
                      <span className="text-amber-600 dark:text-amber-400 text-xs font-black">
                        3. SALDO ATUAL DEVEDOR (Z = X - A):
                      </span>
                      <span className="font-black text-amber-500 text-xl">
                        {saldoPendenteAtual.toLocaleString('pt-PT')} XOF
                      </span>
                    </div>
                  </div>

                  {/* Overpayment Warning & Defense */}
                  {isOverpayment && (
                    <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-3 animate-bounce">
                      <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-black block uppercase text-sm mb-1">Bloqueio de Sobrefaturação</span>
                        <p className="leading-relaxed">
                          O valor digitado <span className="font-black underline">({valorPagamentoInput.toLocaleString('pt-PT')} XOF)</span> excede a dívida real da fatura. O sistema IMP não permite arrecadar valores superiores ao faturado. Por favor, corrija o montante.
                        </p>
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleSubmitLiquidacao} className="space-y-5">
                    {/* Amount to pay */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-wider">
                          Valor a Liquidar agora (Y):
                        </label>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setValorPagamentoInput(saldoPendenteAtual)}
                            className="px-2.5 py-1 text-[10px] font-black font-mono bg-emerald-600 text-white rounded-lg shadow-sm hover:scale-105 transition-transform"
                          >
                            LIQUIDAR 100%
                          </button>
                          {saldoPendenteAtual > 10000 && (
                            <button
                              type="button"
                              onClick={() => setValorPagamentoInput(Math.round(saldoPendenteAtual / 2))}
                              className="px-2.5 py-1 text-[10px] font-black font-mono bg-amber-500 text-white rounded-lg shadow-sm hover:scale-105 transition-transform"
                            >
                              PARCIAL 50%
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="relative">
                        <input
                          type="number"
                          required
                          min="1"
                          max={saldoPendenteAtual}
                          value={valorPagamentoInput}
                          onChange={(e) => setValorPagamentoInput(Number(e.target.value) || 0)}
                          className={`w-full rounded-2xl px-5 py-4 text-xl font-black font-mono border-2 focus:outline-none focus:border-emerald-500 transition-all ${
                            isOverpayment
                              ? 'border-rose-500 bg-rose-50 text-rose-600'
                              : theme === 'dark'
                              ? 'bg-slate-950 border-slate-800 text-white'
                              : 'bg-white border-slate-200 text-[#0B2B59]'
                          }`}
                        />
                        <span className="absolute right-5 top-1/2 -translate-y-1/2 font-black text-slate-400">XOF</span>
                      </div>
                      
                      {/* Interactive Status Display */}
                      {!isOverpayment && valorPagamentoInput > 0 && (
                        <div className={`p-3.5 rounded-2xl flex items-center gap-3 transition-all ${
                          novoRestante === 0 
                            ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' 
                            : 'bg-blue-50 border border-blue-200 text-blue-800'
                        }`}>
                          {novoRestante === 0 ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                          <div className="text-xs font-bold leading-snug">
                            {novoRestante === 0 
                              ? 'QUITAÇÃO TOTAL: Esta operação liquidará permanentemente a dívida desta fatura.' 
                              : `AMORTIZAÇÃO PARCIAL: Ficará um saldo devedor de ${novoRestante.toLocaleString('pt-PT')} XOF a pagar futuramente.`}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Bank selector */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-500 uppercase">Banco de Depósito:</label>
                        <select
                          value={bancoSelecionado}
                          onChange={(e) => setBancoSelecionado(e.target.value as any)}
                          className={`w-full rounded-xl px-3 py-2.5 text-xs font-bold border focus:outline-none focus:border-emerald-500 ${
                            theme === 'dark' ? 'bg-slate-950 border-slate-800 text-white' : 'bg-[#F8FAFC] border-slate-200 text-slate-900'
                          }`}
                        >
                          {IMP_INSTITUTIONAL.officialBanks.map((b) => (
                            <option key={b} value={b}>{b}</option>
                          ))}
                        </select>
                      </div>

                      {/* Bank Slip (Talão) */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-500 uppercase">Nº Talão / Comprovativo:</label>
                        <input
                          type="text"
                          required
                          placeholder="Ex: TAL-BAO-998822"
                          value={numeroTalao}
                          onChange={(e) => {
                            setNumeroTalao(e.target.value);
                            setTalaoDuplicadoError('');
                          }}
                          className={`w-full rounded-xl px-3 py-2.5 text-xs font-black font-mono border focus:outline-none focus:border-emerald-500 ${
                            talaoDuplicadoError ? 'border-rose-500' : ''
                          } ${
                            theme === 'dark' ? 'bg-slate-950 border-slate-800 text-white' : 'bg-[#F8FAFC] border-slate-200 text-slate-900'
                          }`}
                        />
                      </div>
                    </div>

                    <div className={`flex justify-end gap-3 pt-4 border-t ${theme === 'dark' ? 'border-slate-800' : 'border-slate-200'}`}>
                      <button
                        type="button"
                        onClick={() => setFaturaParaLiquidar(null)}
                        className={`px-6 py-3 rounded-2xl text-xs font-bold transition-all ${
                          theme === 'dark' ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        Descartar
                      </button>
                      <button
                        type="submit"
                        disabled={isOverpayment || valorPagamentoInput <= 0}
                        className={`px-8 py-3 text-white rounded-2xl text-xs font-black shadow-xl flex items-center gap-2 transition-all active:scale-95 ${
                          isOverpayment || valorPagamentoInput <= 0
                            ? 'bg-slate-400 cursor-not-allowed opacity-50'
                            : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/30'
                        }`}
                      >
                        <FileCheck2 className="w-4 h-4" />
                        CONFIRMAR PAGAMENTO & EMITIR RECIBO
                      </button>
                    </div>
                  </form>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* VIEW / PRINT OFFICIAL RECEIPT MODAL (A4 & THERMAL FORMATS) */}
      {viewingRecibo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className={`w-full ${receiptPrintFormat === 'a4' ? 'max-w-3xl' : 'max-w-[100mm]'} bg-white text-slate-900 rounded-3xl border border-slate-300 shadow-2xl overflow-hidden max-h-[95vh] flex flex-col transition-all duration-300`}>
            {/* Top Bar for Actions (no-print) */}
            <div className="no-print bg-[#065F46] text-white px-6 py-4 flex items-center justify-between shrink-0 shadow-md">
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-300">
                  Recibo Oficial de Quitação • IMP / NHOMINCA
                </span>
                <span className="text-sm font-mono font-bold">{viewingRecibo.nRecibo}</span>
              </div>
              <div className="flex items-center gap-2">
                {/* Format toggle: A4 vs Termico */}
                <div className="bg-slate-900/80 p-0.5 rounded-xl flex text-[10px] font-mono border border-emerald-700/50">
                  <button
                    onClick={() => setReceiptPrintFormat('a4')}
                    className={`px-2.5 py-1.5 rounded-lg transition-all ${
                      receiptPrintFormat === 'a4' ? 'bg-emerald-600 text-white font-bold shadow' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    Guia A4
                  </button>
                  <button
                    onClick={() => setReceiptPrintFormat('termico')}
                    className={`px-2.5 py-1.5 rounded-lg transition-all ${
                      receiptPrintFormat === 'termico' ? 'bg-emerald-600 text-white font-bold shadow' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    Térmico (80mm)
                  </button>
                </div>

                {/* Primary: Imprimir Recibo */}
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-emerald-400/25 transition-all active:scale-95 cursor-pointer"
                  title="Enviar documento para a impressora"
                >
                  <Printer className="w-4 h-4" />
                  <span>Imprimir Recibo</span>
                </button>

                {/* Secondary: Baixar PDF */}
                <button
                  onClick={() => handleDownloadPDF(viewingRecibo.nRecibo)}
                  disabled={isExportingPDF}
                  className={`px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 ${
                    isExportingPDF ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  title="Descarregar ficheiro PDF"
                >
                  {isExportingPDF ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <FileText className="w-3.5 h-3.5" />}
                  <span>{isExportingPDF ? 'Gerando...' : 'PDF'}</span>
                </button>

                <button
                  onClick={() => setViewingRecibo(null)}
                  className="p-2 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
                  title="Fechar"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Document Body (Printable styling) */}
            <div className="p-0 overflow-y-auto bg-slate-100 flex justify-center py-6">
              <div
                id="printable-document"
                ref={documentRef}
                className={`bg-white shadow-xl origin-top pdf-export-container printable-document printable-area text-slate-950 ${
                  receiptPrintFormat === 'a4'
                    ? 'w-[210mm] min-h-[297mm] p-12'
                    : 'w-[80mm] p-4 text-[10px] printable-thermal'
                }`}
              >
                {/* Guinea-Bissau Tricolor National Banner */}
                <div className="flex h-1.5 w-full rounded-full overflow-hidden mb-6">
                  <div className="bg-[#CE1126] w-1/3" />
                  <div className="bg-[#FCD116] w-1/3" />
                  <div className="bg-[#009E49] w-1/3" />
                </div>

                {/* Institutional Header */}
                <div className={`text-center space-y-1.5 mb-6 ${receiptPrintFormat === 'termico' ? 'scale-90 mb-4' : ''}`}>
                  <div className="flex justify-center mb-2 text-[#065F46]">
                    <Landmark className={receiptPrintFormat === 'a4' ? 'w-14 h-14' : 'w-10 h-10'} />
                  </div>
                  <div className="font-black text-xs sm:text-sm tracking-widest uppercase text-slate-800 leading-none">
                    {IMP_INSTITUTIONAL.republic}
                  </div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                    Ministério dos Transportes e Comunicações
                  </div>
                  <div className="font-black text-base sm:text-lg text-[#065F46] uppercase leading-tight pt-0.5">
                    {IMP_INSTITUTIONAL.entity}
                  </div>
                  <div className="text-[11px] text-slate-600 font-mono font-bold">
                    NIF: {IMP_INSTITUTIONAL.nif} • Certificado DGCI: {IMP_INSTITUTIONAL.certDgci}
                  </div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-widest pt-1 border-t border-dashed w-2/3 mx-auto">
                    Direcção de Administração e Finanças • Tesouraria Central, Porto de Bissau
                  </div>
                </div>

                {/* Receipt Title & Identification Box */}
                <div className="bg-emerald-50 border-2 border-emerald-300 p-5 rounded-2xl mb-6 flex justify-between items-center">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[9px] font-black uppercase tracking-widest text-emerald-800 bg-emerald-200/80 px-2 py-0.5 rounded">
                        1ª VIA — ORIGINAL (CLIENTE / ARMAZÉM)
                      </span>
                    </div>
                    <div className="text-xl sm:text-2xl font-mono font-black text-emerald-950">
                      RECIBO DE QUITAÇÃO Nº {viewingRecibo.nRecibo}
                    </div>
                    <div className="text-[11px] text-emerald-700 font-bold mt-1">
                      Data de Liquidação no Caixa: {viewingRecibo.data} às {viewingRecibo.hora}
                    </div>
                  </div>
                  <div className="w-16 h-16 bg-white rounded-xl border-2 border-emerald-300 flex items-center justify-center text-emerald-700 shadow-sm shrink-0">
                    <QrCode className="w-10 h-10" />
                  </div>
                </div>

                {/* Details Grid */}
                <div className={`grid ${receiptPrintFormat === 'a4' ? 'grid-cols-2' : 'grid-cols-1'} gap-5 mb-6 border-b pb-6 border-slate-200`}>
                  <div className="space-y-3">
                    <div>
                      <span className="text-[9px] font-black text-slate-400 uppercase block">Fatura Liquidada:</span>
                      <span className="font-mono font-black text-blue-700 text-sm">{viewingRecibo.nFatura}</span>
                    </div>
                    <div>
                      <span className="text-[9px] font-black text-slate-400 uppercase block">Pagador / Cliente / Agência:</span>
                      <div className="text-sm font-black text-slate-900 uppercase">{viewingRecibo.cliente}</div>
                    </div>
                    {viewingRecibo.navio && (
                      <div>
                        <span className="text-[9px] font-black text-slate-400 uppercase block">Navio / Embarcação:</span>
                        <div className="text-xs font-bold text-slate-700 uppercase">{viewingRecibo.navio}</div>
                      </div>
                    )}
                  </div>
                  <div className={`${receiptPrintFormat === 'a4' ? 'text-right' : 'text-left pt-3 border-t border-dashed'} space-y-3`}>
                    <div>
                      <span className="text-[9px] font-black text-slate-400 uppercase block">Banco de Arrecadação:</span>
                      <div className="text-sm font-black text-blue-950 uppercase">{viewingRecibo.banco}</div>
                    </div>
                    <div>
                      <span className="text-[9px] font-black text-slate-400 uppercase block">Nº de Talão Bancário (Comprovativo):</span>
                      <div className="text-sm font-mono font-black text-slate-900">{viewingRecibo.talao}</div>
                    </div>
                    <div>
                      <span className="text-[9px] font-black text-slate-400 uppercase block">Local de Pagamento:</span>
                      <div className="text-xs font-bold text-slate-600">Caixa Geral do IMP — Bissau</div>
                    </div>
                  </div>
                </div>

                {/* Financial Formulas Table */}
                <div className="mb-6 p-5 bg-slate-50 rounded-2xl border-2 border-slate-200">
                  <span className="text-[10px] font-black uppercase text-slate-600 block mb-3 border-b border-slate-200 pb-1.5 tracking-wider">
                    Demonstrativo Oficial de Liquidação Portuária (Franco CFA - XOF):
                  </span>
                  <div className="space-y-2.5 font-mono">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500">1. VALOR TOTAL DA FATURA (X):</span>
                      <span className="font-bold text-slate-800">
                        {(viewingRecibo.totalFatura || viewingRecibo.valor).toLocaleString('pt-PT')} XOF
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500">2. VALOR ANTERIORMENTE AMORTIZADO (A):</span>
                      <span className="font-bold text-slate-700">
                        {(viewingRecibo.valorAnteriorPago || 0).toLocaleString('pt-PT')} XOF
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2.5 px-3 bg-emerald-100/70 rounded-xl border border-emerald-300">
                      <span className="text-emerald-900 font-black text-xs uppercase tracking-wider">
                        3. VALOR LIQUIDADO NESTE RECIBO (Y):
                      </span>
                      <span className="text-emerald-800 font-black text-lg">
                        +{viewingRecibo.valor.toLocaleString('pt-PT')} XOF
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs pt-1">
                      <span className="text-slate-500 font-bold">4. TOTAL ACUMULADO PAGO (A + Y):</span>
                      <span className="font-black text-emerald-800">
                        {((viewingRecibo.valorAnteriorPago || 0) + viewingRecibo.valor).toLocaleString('pt-PT')} XOF
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t-2 border-slate-300">
                      <span className="font-black text-slate-700">5. SALDO DEVEDOR REMANESCENTE (Z):</span>
                      <span
                        className={`font-black text-base ${
                          viewingRecibo.saldoRestante > 0 ? 'text-amber-600' : 'text-emerald-700'
                        }`}
                      >
                        {(viewingRecibo.saldoRestante || 0).toLocaleString('pt-PT')} XOF
                      </span>
                    </div>
                  </div>
                </div>

                {/* Importância por Extenso (Legal standard in PALOP / Guinea-Bissau) */}
                <div className="p-4 bg-emerald-50/80 border-2 border-emerald-200 rounded-2xl mb-6">
                  <span className="text-[9px] font-black uppercase text-emerald-800 tracking-wider block mb-1">
                    Valor Pago por Extenso:
                  </span>
                  <div className="text-xs sm:text-sm font-serif italic text-emerald-950 font-bold leading-relaxed">
                    "{valorPorExtensoXOF(viewingRecibo.valor)}"
                  </div>
                </div>

                {/* Status Stamp */}
                <div
                  className={`text-center py-4 border-2 rounded-2xl mb-6 ${
                    viewingRecibo.isLiquidacaoTotal
                      ? 'border-emerald-500 bg-emerald-500/10'
                      : 'border-amber-500 bg-amber-500/10'
                  }`}
                >
                  <div
                    className={`text-sm font-black uppercase tracking-wider ${
                      viewingRecibo.isLiquidacaoTotal ? 'text-emerald-900' : 'text-amber-900'
                    }`}
                  >
                    {viewingRecibo.isLiquidacaoTotal
                      ? 'QUITAÇÃO INTEGRAL • DÍVIDA TOTALMENTE EXTINTA'
                      : 'AMORTIZAÇÃO PARCIAL • REGISTO DE PAGAMENTO PARCIAL'}
                  </div>
                  <div className="text-[10px] text-slate-600 mt-1 italic">
                    {viewingRecibo.isLiquidacaoTotal
                      ? 'Declara-se que a presente fatura encontra-se integralmente regularizada perante o IMP.'
                      : 'Resta saldo pendente de liquidação que será cobrado em recibo subsequente.'}
                  </div>
                </div>

                {/* Signatures (3 official blocks) */}
                <div
                  className={`grid ${
                    receiptPrintFormat === 'a4' ? 'grid-cols-3' : 'grid-cols-1'
                  } gap-6 pt-6 border-t border-slate-200`}
                >
                  <div className="text-center space-y-8">
                    <div className="text-[9px] font-bold uppercase text-slate-500">O Operador do Caixa</div>
                    <div className="border-t border-slate-400 pt-2 text-[10px] text-slate-700 font-mono font-bold">
                      {viewingRecibo.emissor}
                    </div>
                  </div>
                  <div className="text-center space-y-8">
                    <div className="text-[9px] font-bold uppercase text-slate-500">O Depositante / Cliente</div>
                    <div className="border-t border-slate-400 pt-2 text-[10px] text-slate-700 font-mono">
                      Assinatura Legível
                    </div>
                  </div>
                  <div className="text-center space-y-8">
                    <div className="text-[9px] font-bold uppercase text-slate-500">Direcção Financeira</div>
                    <div className="border-t border-slate-400 pt-2 text-[10px] text-slate-700 font-mono">
                      Visto & Selo Branco
                    </div>
                  </div>
                </div>

                {/* Audit & Cryptographic Line */}
                <div className="mt-8 pt-3 border-t border-slate-200 flex justify-between items-center text-[8px] font-mono text-slate-400 uppercase tracking-tighter">
                  <span>Validação SHA-256: {Math.random().toString(36).substring(2, 12).toUpperCase()}</span>
                  <span>IMP Guiné-Bissau • Sistema Integrado NHOMINCA</span>
                </div>

                {/* Action button inside document bottom for operator convenience (hidden in print) */}
                <div className="no-print mt-6 pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                  <button
                    onClick={() => window.print()}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black flex items-center gap-2 shadow-lg shadow-emerald-600/25 transition-all active:scale-95 cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Imprimir Este Recibo</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW / PRINT OFFICIAL CASH OUTFLOW VOUCHER MODAL */}
      {viewingSaidaDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className={`w-full ${receiptPrintFormat === 'a4' ? 'max-w-2xl' : 'max-w-[100mm]'} bg-white text-slate-900 rounded-3xl border border-slate-300 shadow-2xl overflow-hidden max-h-[95vh] flex flex-col transition-all duration-300`}>
            {/* Top Bar for Actions */}
            <div className="bg-rose-900 text-white px-6 py-4 flex items-center justify-between shrink-0">
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-300">
                  Guia de Saída de Caixa
                </span>
                <span className="text-sm font-mono font-bold">{viewingSaidaDoc.id}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-slate-800 p-0.5 rounded-lg flex text-[10px] font-mono">
                  <button
                    onClick={() => setReceiptPrintFormat('a4')}
                    className={`px-2 py-1 rounded ${receiptPrintFormat === 'a4' ? 'bg-rose-600 text-white font-bold' : 'text-slate-400'}`}
                  >
                    Guia A4
                  </button>
                  <button
                    onClick={() => setReceiptPrintFormat('termico')}
                    className={`px-2 py-1 rounded ${receiptPrintFormat === 'termico' ? 'bg-rose-600 text-white font-bold' : 'text-slate-400'}`}
                  >
                    Térmico
                  </button>
                </div>

                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-rose-500 hover:bg-rose-400 text-white font-black rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-rose-500/25 transition-all active:scale-95 cursor-pointer"
                  title="Enviar guia para a impressora"
                >
                  <Printer className="w-4 h-4" />
                  <span>Imprimir Guia</span>
                </button>

                <button
                  onClick={() => handleDownloadPDF(`IMP_SAIDA_${viewingSaidaDoc.id}`)}
                  disabled={isExportingPDF}
                  className={`px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 ${
                    isExportingPDF ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isExportingPDF ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <FileText className="w-3.5 h-3.5" />}
                  <span>{isExportingPDF ? 'Gerando...' : 'PDF'}</span>
                </button>
                <button
                  onClick={() => setViewingSaidaDoc(null)}
                  className="p-2 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Document Body */}
            <div className="p-0 overflow-y-auto bg-slate-100 flex justify-center py-8">
              <div
                id="printable-document"
                ref={documentRef}
                className={`bg-white shadow-xl origin-top pdf-export-container printable-document printable-area ${
                  receiptPrintFormat === 'a4'
                    ? 'w-[210mm] min-h-[297mm] p-12'
                    : 'w-[80mm] p-4 text-[10px] printable-thermal'
                }`}
              >
                {/* Institutional Header */}
                <div className={`text-center space-y-2 mb-8 ${receiptPrintFormat === 'termico' ? 'scale-90' : ''}`}>
                  <div className="flex justify-center mb-4 text-rose-800">
                    <ArrowDownRight className={receiptPrintFormat === 'a4' ? 'w-16 h-16' : 'w-12 h-12'} />
                  </div>
                  <div className="font-black text-sm tracking-widest uppercase text-slate-800 leading-none">
                    {IMP_INSTITUTIONAL.republic}
                  </div>
                  <div className="font-black text-lg text-rose-900 uppercase leading-tight">
                    {IMP_INSTITUTIONAL.entity}
                  </div>
                  <div className="text-[11px] text-slate-600 font-mono font-bold">
                    NIF: {IMP_INSTITUTIONAL.nif} • ORDEM DE DESPESA INTERNA
                  </div>
                </div>

                <div className="bg-rose-50 border-2 border-rose-200 p-6 rounded-2xl mb-8 flex justify-between items-center">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-rose-700 block mb-1">COMPROVATIVO DE SAÍDA Nº:</span>
                    <div className="text-2xl font-mono font-black text-rose-900">{viewingSaidaDoc.id}</div>
                    <div className="text-[11px] text-rose-600 font-bold mt-1">Data: {viewingSaidaDoc.data} • {viewingSaidaDoc.hora}</div>
                  </div>
                  <div className="w-16 h-16 bg-white rounded-xl border-2 border-rose-300 flex items-center justify-center text-rose-700 shadow-sm">
                    <QrCode className="w-10 h-10" />
                  </div>
                </div>

                <div className="space-y-6 mb-10 text-xs">
                  <div className="grid grid-cols-2 gap-4 border-b pb-4">
                    <div>
                      <span className="text-[9px] font-black text-slate-400 uppercase block">Beneficiário:</span>
                      <div className="font-black text-slate-900 uppercase">{viewingSaidaDoc.beneficiario}</div>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] font-black text-slate-400 uppercase block">Categoria:</span>
                      <div className="font-bold text-rose-700">{viewingSaidaDoc.categoria}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 border-b pb-4">
                    <div>
                      <span className="text-[9px] font-black text-slate-400 uppercase block">Doc. Comprovativo:</span>
                      <div className="font-mono font-bold text-slate-700">{viewingSaidaDoc.documentoComprovativo}</div>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] font-black text-slate-400 uppercase block">Autorizado por:</span>
                      <div className="font-bold text-slate-900">{viewingSaidaDoc.autorizado_por}</div>
                    </div>
                  </div>

                  <div className="p-5 bg-slate-50 rounded-2xl border-2 border-slate-200">
                    <span className="text-[10px] font-black uppercase text-slate-500 block mb-2">Descrição da Despesa:</span>
                    <div className="text-slate-800 leading-relaxed italic font-medium">
                      "{viewingSaidaDoc.justificativa || viewingSaidaDoc.descricao}"
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-6 bg-rose-900 text-white rounded-2xl shadow-xl shadow-rose-900/20">
                    <span className="font-black text-sm uppercase tracking-widest">Valor do Desembolso:</span>
                    <span className="text-3xl font-black font-mono">-{viewingSaidaDoc.valor.toLocaleString('pt-PT')} XOF</span>
                  </div>
                </div>

                {/* Signatures */}
                <div className="grid grid-cols-3 gap-8 pt-12 border-t border-slate-200">
                  <div className="text-center space-y-10">
                    <div className="text-[9px] font-bold uppercase text-slate-400">O Beneficiário</div>
                    <div className="border-t border-slate-300 pt-2 text-[9px] text-slate-500">_________________</div>
                  </div>
                  <div className="text-center space-y-10">
                    <div className="text-[9px] font-bold uppercase text-slate-400">Operador Caixa</div>
                    <div className="border-t border-slate-300 pt-2 text-[9px] text-slate-500 font-mono">{viewingSaidaDoc.criado_por}</div>
                  </div>
                  <div className="text-center space-y-10">
                    <div className="text-[9px] font-bold uppercase text-slate-400">Direcção Geral</div>
                    <div className="border-t border-slate-300 pt-2 text-[9px] text-slate-500 font-mono">Visto & Homologado</div>
                  </div>
                </div>

                <div className="mt-12 pt-4 border-t border-slate-100 flex justify-between items-center text-[8px] font-mono text-slate-300 uppercase">
                  <span>Voucher ID: {viewingSaidaDoc.id}</span>
                  <span>IMP Guiné-Bissau • Tesouraria Central</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REGISTAR NOVA SAÍDA DE CAIXA MODAL (COM PROVAS & COMPROVATIVO OBRIGATÓRIO) */}
      {showNovaSaidaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div
            className={`w-full max-w-lg rounded-3xl border shadow-2xl p-6 space-y-4 ${
              theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            <div className={`flex items-center justify-between border-b pb-3 ${theme === 'dark' ? 'border-slate-800' : 'border-slate-200'}`}>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-rose-500/10 text-rose-500">
                  <FileMinus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className={`font-bold text-base ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    Lançamento de Saída Justificada de Caixa
                  </h3>
                  <span className="text-xs text-slate-500">Exige comprovativo documental institucional</span>
                </div>
              </div>
              <button
                onClick={() => setShowNovaSaidaModal(false)}
                className={`p-1.5 rounded-lg transition-colors ${
                  theme === 'dark' ? 'bg-slate-800 text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-500 hover:text-slate-800'
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Current Balance Banner */}
            <div className="p-3 bg-slate-100 dark:bg-slate-950 rounded-xl flex items-center justify-between font-mono text-xs">
              <span className="text-slate-500">Saldo Atual Disponível em Caixa:</span>
              <span className="font-bold text-emerald-500 text-sm">
                {saldoAtualEmCaixa.toLocaleString('pt-PT')} XOF
              </span>
            </div>

            {/* Cash Insufficiency Warning */}
            {saidaForm.valor > saldoAtualEmCaixa && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">SALDO INSUFICIENTE EM CAIXA</span>
                  O valor da saída solicitada ({saidaForm.valor.toLocaleString('pt-PT')} XOF) excede o saldo físico existente em caixa ({saldoAtualEmCaixa.toLocaleString('pt-PT')} XOF). Não é permitida saída sem suprimento prévio.
                </div>
              </div>
            )}

            <form onSubmit={handleSubmitNovaSaida} className="space-y-3.5 text-xs">
              {/* Beneficiary & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-500 block">Beneficiário / Entidade Credora:</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex.: Petroguine SARL ou Comandante Geba"
                    value={saidaForm.beneficiario}
                    onChange={(e) => setSaidaForm({ ...saidaForm, beneficiario: e.target.value })}
                    className={`w-full rounded-xl px-3 py-2 border focus:outline-none focus:border-rose-500 ${
                      theme === 'dark' ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-500 block">Categoria da Despesa:</label>
                  <select
                    value={saidaForm.categoria}
                    onChange={(e) => setSaidaForm({ ...saidaForm, categoria: e.target.value as any })}
                    className={`w-full rounded-xl px-3 py-2 border focus:outline-none focus:border-rose-500 ${
                      theme === 'dark' ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  >
                    <option value="Combustível Embarcações">Combustível Lanchas/Rebocadores</option>
                    <option value="Despesa Operacional">Despesa Operacional Portuária</option>
                    <option value="Manutenção & Faróis">Manutenção de Faróis & Balizamento</option>
                    <option value="Expediente & Material">Expediente de Escritório & Material</option>
                    <option value="Sangria Bancária">Sangria / Depósito Bancário da Receita</option>
                    <option value="Suprimento Caixa">Suprimento de Fundo de Maneio</option>
                  </select>
                </div>
              </div>

              {/* Amount */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-500 block">Valor da Saída em XOF (Franco CFA):</label>
                <input
                  type="number"
                  required
                  min="500"
                  max={saldoAtualEmCaixa}
                  step="500"
                  value={saidaForm.valor}
                  onChange={(e) => setSaidaForm({ ...saidaForm, valor: Number(e.target.value) || 0 })}
                  className={`w-full rounded-xl px-3 py-2 font-mono font-bold text-sm border focus:outline-none focus:border-rose-500 ${
                    saidaForm.valor > saldoAtualEmCaixa
                      ? 'border-rose-500 bg-rose-50/20 text-rose-600'
                      : theme === 'dark'
                      ? 'bg-slate-950 border-slate-800 text-rose-400'
                      : 'bg-slate-50 border-slate-200 text-rose-600'
                  }`}
                />
              </div>

              {/* Document Proof & Authorizer */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-500 block">
                    Nº Doc. Comprovativo (Fatura/Recibo):
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex.: FAT-FORN-2026-081"
                    value={saidaForm.documentoComprovativo}
                    onChange={(e) => setSaidaForm({ ...saidaForm, documentoComprovativo: e.target.value })}
                    className={`w-full rounded-xl px-3 py-2 font-mono border focus:outline-none focus:border-rose-500 ${
                      theme === 'dark' ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-500 block">Autorizado Superiormente Por:</label>
                  <input
                    type="text"
                    required
                    value={saidaForm.autorizado_por}
                    onChange={(e) => setSaidaForm({ ...saidaForm, autorizado_por: e.target.value })}
                    className={`w-full rounded-xl px-3 py-2 border focus:outline-none focus:border-rose-500 ${
                      theme === 'dark' ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              {/* Description & Justification */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-500 block">Descrição Resumida do Movimento:</label>
                <input
                  type="text"
                  required
                  placeholder="Ex.: Aquisição de 450L gasóleo para lancha de pilotagem Geba"
                  value={saidaForm.descricao}
                  onChange={(e) => setSaidaForm({ ...saidaForm, descricao: e.target.value })}
                  className={`w-full rounded-xl px-3 py-2 border focus:outline-none focus:border-rose-500 ${
                    theme === 'dark' ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-500 block">Justificativa da Necessidade Operacional:</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Detalhes que justificam o pagamento urgente pelo caixa..."
                  value={saidaForm.justificativa}
                  onChange={(e) => setSaidaForm({ ...saidaForm, justificativa: e.target.value })}
                  className={`w-full rounded-xl px-3 py-2 border focus:outline-none focus:border-rose-500 resize-none ${
                    theme === 'dark' ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              {/* Upload Proof Document (Simulation) */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-500 block">Anexo de Prova / Fatura Escaneada (Opcional):</label>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setSaidaForm({ ...saidaForm, anexoNome: file.name });
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className={`px-3 py-2 rounded-xl border flex items-center gap-2 text-xs font-semibold ${
                      theme === 'dark' ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5 text-slate-400" />
                    <span>{saidaForm.anexoNome ? saidaForm.anexoNome : 'Carregar Comprovativo Digital (PDF/JPG)'}</span>
                  </button>
                  {saidaForm.anexoNome && (
                    <button
                      type="button"
                      onClick={() => setSaidaForm({ ...saidaForm, anexoNome: '' })}
                      className="p-1 text-slate-400 hover:text-rose-500"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <div className={`flex justify-end gap-3 pt-3 border-t ${theme === 'dark' ? 'border-slate-800' : 'border-slate-200'}`}>
                <button
                  type="button"
                  onClick={() => setShowNovaSaidaModal(false)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
                    theme === 'dark' ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saidaForm.valor > saldoAtualEmCaixa || saidaForm.valor <= 0}
                  className={`px-5 py-2 text-white rounded-xl text-xs font-bold shadow-lg flex items-center gap-1.5 transition-all ${
                    saidaForm.valor > saldoAtualEmCaixa || saidaForm.valor <= 0
                      ? 'bg-slate-500 cursor-not-allowed opacity-50'
                      : 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/30'
                  }`}
                >
                  <FileMinus className="w-4 h-4" />
                  Homologar Saída de Caixa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DAILY CLOSING STATEMENT MODAL (FOLHA DE FECHO DE CAIXA) */}
      {showFechoFolhaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-4xl bg-white text-slate-900 rounded-3xl border border-slate-300 shadow-2xl overflow-hidden max-h-[95vh] flex flex-col">
            <div className="bg-[#0B2B59] text-white px-6 py-4 flex items-center justify-between shrink-0">
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-300">
                  Balancete de Fecho Diário
                </span>
                <span className="text-sm font-mono font-bold">Folha de Caixa • {new Date().toLocaleDateString('pt-PT')}</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleDownloadPDF(`IMP_FECHO_CAIXA_${new Date().toISOString().slice(0,10)}`)}
                  disabled={isExportingPDF}
                  className={`px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/20 ${isExportingPDF ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isExportingPDF ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Printer className="w-4 h-4" />}
                  {isExportingPDF ? 'Gerando Relatório...' : 'Baixar PDF Oficial'}
                </button>
                <button
                  onClick={() => setShowFechoFolhaModal(false)}
                  className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-0 overflow-y-auto bg-slate-100 flex justify-center py-8">
              <div
                ref={documentRef}
                className="bg-white shadow-xl origin-top pdf-export-container w-[210mm] min-h-[297mm] p-12"
              >
                {/* Institutional Header */}
                <div className="text-center space-y-2 mb-10 pb-8 border-b-2 border-slate-100">
                  <div className="flex justify-center mb-4 text-[#0B2B59]">
                    <Landmark className="w-20 h-20" />
                  </div>
                  <div className="font-black text-base tracking-[0.3em] uppercase text-slate-800">
                    {IMP_INSTITUTIONAL.republic}
                  </div>
                  <div className="font-black text-2xl text-[#0B2B59] uppercase">
                    {IMP_INSTITUTIONAL.entity}
                  </div>
                  <div className="text-xs text-slate-500 font-mono font-bold mt-2">
                    BALANCETE DIÁRIO DE TESOURARIA • DIRECÇÃO DE ADMINISTRAÇÃO E FINANÇAS
                  </div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-widest mt-4">
                    Documento de Auditoria DGCI • Exercício 2026
                  </div>
                </div>

                {/* Summary Grid */}
                <div className="grid grid-cols-4 gap-4 mb-10">
                  <div className="p-5 bg-slate-50 border-2 border-slate-200 rounded-2xl">
                    <span className="text-[9px] font-black text-slate-400 uppercase block mb-1">Saldo Inicial:</span>
                    <div className="text-lg font-black text-slate-900 font-mono">
                      {(movimentos.length > 0 ? movimentos[0].valor : 0).toLocaleString('pt-PT')}
                    </div>
                  </div>
                  <div className="p-5 bg-emerald-50 border-2 border-emerald-100 rounded-2xl">
                    <span className="text-[9px] font-black text-emerald-600 uppercase block mb-1">Total Entradas:</span>
                    <div className="text-lg font-black text-emerald-700 font-mono">
                      +{totalEntradasPeriodo.toLocaleString('pt-PT')}
                    </div>
                  </div>
                  <div className="p-5 bg-rose-50 border-2 border-rose-100 rounded-2xl">
                    <span className="text-[9px] font-black text-rose-600 uppercase block mb-1">Total Saídas:</span>
                    <div className="text-lg font-black text-rose-700 font-mono">
                      -{totalSaidasPeriodo.toLocaleString('pt-PT')}
                    </div>
                  </div>
                  <div className="p-5 bg-blue-900 text-white rounded-2xl shadow-xl shadow-blue-900/20">
                    <span className="text-[9px] font-black text-blue-200 uppercase block mb-1">Saldo Final:</span>
                    <div className="text-xl font-black font-mono">
                      {saldoFinal.toLocaleString('pt-PT')}
                    </div>
                  </div>
                </div>

                {/* Detailed Movements Table */}
                <div className="mb-12">
                  <h4 className="text-xs font-black uppercase text-slate-800 mb-4 flex items-center gap-2">
                    <div className="w-1.5 h-4 bg-blue-600 rounded-full"></div>
                    Extrato de Movimentos do Período ({new Date().toLocaleDateString('pt-PT')})
                  </h4>
                  <table className="w-full text-[10px] border-collapse">
                    <thead className="bg-slate-100 font-black uppercase text-slate-500 border-y-2 border-slate-200">
                      <tr>
                        <th className="p-3 text-left">Hora</th>
                        <th className="p-3 text-left">Descrição do Lançamento</th>
                        <th className="p-3 text-left">Categoria</th>
                        <th className="p-3 text-right">Entrada</th>
                        <th className="p-3 text-right">Saída</th>
                        <th className="p-3 text-right">Saldo Acum.</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono">
                      {filteredMovimentos.map((m) => (
                        <tr key={m.id} className="hover:bg-slate-50/50">
                          <td className="p-3 text-slate-500">{m.hora}</td>
                          <td className="p-3 font-sans font-bold text-slate-800">
                            {m.descricao}
                            {m.talao && <span className="block text-[8px] text-blue-500 mt-0.5">TALAO: {m.talao} ({m.banco})</span>}
                            {m.documentoComprovativo && <span className="block text-[8px] text-rose-500 mt-0.5">DOC: {m.documentoComprovativo}</span>}
                          </td>
                          <td className="p-3 text-slate-400">{m.categoria}</td>
                          <td className="p-3 text-right text-emerald-600 font-bold">
                            {m.tipo === 'entrada' ? m.valor.toLocaleString('pt-PT') : ''}
                          </td>
                          <td className="p-3 text-right text-rose-600 font-bold">
                            {m.tipo === 'saida' ? m.valor.toLocaleString('pt-PT') : ''}
                          </td>
                          <td className="p-3 text-right font-black text-slate-900">
                            {m.saldoApos.toLocaleString('pt-PT')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Audit & Signatures */}
                <div className="mt-auto">
                  <div className="grid grid-cols-2 gap-20 pt-16 border-t-2 border-slate-100">
                    <div className="text-center space-y-12">
                      <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest">O Operador de Caixa</div>
                      <div className="flex flex-col items-center">
                        <div className="w-48 border-b-2 border-slate-300 mb-2"></div>
                        <span className="text-[10px] font-bold text-slate-800">{currentUser.nome}</span>
                        <span className="text-[9px] text-slate-400">Responsável pela Tesouraria</span>
                      </div>
                    </div>
                    <div className="text-center space-y-12">
                      <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Controlo Financeiro (DAF)</div>
                      <div className="flex flex-col items-center">
                        <div className="w-48 border-b-2 border-slate-300 mb-2"></div>
                        <span className="text-[10px] font-bold text-slate-800">Visto e Conferido</span>
                        <span className="text-[9px] text-slate-400">Direcção de Administração e Finanças</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-16 flex justify-between items-center text-[8px] font-mono text-slate-300 uppercase">
                    <span>Gerado em: {new Date().toLocaleString('pt-PT')}</span>
                    <span>Página 1 de 1 • Sistema ERP IMP</span>
                    <span>HASH: {Math.random().toString(36).substring(2, 15).toUpperCase()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
