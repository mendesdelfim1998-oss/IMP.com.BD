import React, { useState, useEffect, FormEvent, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {
  Receipt,
  Plus,
  Search,
  FileText,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Ship,
  Building2,
  Trash2,
  Calculator,
  ShieldCheck,
  Printer,
  X,
  Ban,
  Edit3,
  Check,
  FileCheck,
  Eye,
  RefreshCw,
  QrCode,
  ArrowLeft
} from 'lucide-react';
import {
  FaturaIMP,
  ReciboIMP,
  ParamentroTaxaPortuaria,
  RubricaReceita,
  Embarcacao,
  AgenciaMaritima,
  Utilizador,
  IMP_INSTITUTIONAL
} from '../../types';
import { mockRubricasReceitas } from '../../mock/data';
import { useTheme } from '../../context/ThemeContext';
import { valorPorExtensoXOF } from '../../utils/moedaExtenso';
import { GuineBissauCoatOfArms, IMPOfficialHelmEmblem } from '../common/OfficialEmblems';

// Format invoice number to match official standard 0001/2026 or FAT-2026-0006
export const formatFaturaDisplayNumber = (nFatura: string, ano?: number): string => {
  if (!nFatura) return '0001/2026';
  if (nFatura.includes('/')) return nFatura;
  const parts = nFatura.split('-');
  const lastPart = parts[parts.length - 1];
  const year = ano || (parts.length > 2 ? parts[1] : new Date().getFullYear());
  const numOnly = lastPart.replace(/\D/g, '') || lastPart;
  return `${numOnly.padStart(4, '0')}/${year}`;
};

interface FacturacaoModuleProps {
  faturas: FaturaIMP[];
  recibos?: ReciboIMP[];
  taxas?: ParamentroTaxaPortuaria[];
  rubricas?: RubricaReceita[];
  embarcacoes: Embarcacao[];
  agencias: AgenciaMaritima[];
  currentUser: Utilizador;
  onAddFatura: (fatura: FaturaIMP) => void;
  onUpdateFatura: (fatura: FaturaIMP) => void;
  onConfirmFatura: (faturaId: string) => void;
  onAnularFatura: (faturaId: string, justificativa: string) => void;
  onNavigateToCaixa?: () => void;
  onNavigateToDashboard?: () => void;
}

interface ItemFormState {
  codigoRubrica?: string;
  rubricaId?: string;
  descricao: string;
  quantidade: number;
  precoUnitario: number;
  subtotal: number;
}

export function FacturacaoModule({
  faturas,
  recibos = [],
  taxas,
  rubricas,
  embarcacoes,
  agencias,
  currentUser,
  onAddFatura,
  onUpdateFatura,
  onConfirmFatura,
  onAnularFatura,
  onNavigateToCaixa,
  onNavigateToDashboard
}: FacturacaoModuleProps) {
  const { theme } = useTheme();

  // Search & Status Tab
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'todos' | 'rascunho' | 'confirmada' | 'parcial' | 'paga' | 'anulada'>('todos');

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingFatura, setEditingFatura] = useState<FaturaIMP | null>(null);
  const [viewingFatura, setViewingFatura] = useState<FaturaIMP | null>(null);
  const [anulandoFatura, setAnulandoFatura] = useState<FaturaIMP | null>(null);
  const [justificativaAnulacao, setJustificativaAnulacao] = useState('');
  const [anulacaoError, setAnulacaoError] = useState('');
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [invoicePrintFormat, setInvoicePrintFormat] = useState<'a4' | 'termico'>('a4');
  const [selectedFaturaId, setSelectedFaturaId] = useState<string | null>(faturas.length > 0 ? faturas[0].id : null);
  const [faturaParaImprimir, setFaturaParaImprimir] = useState<FaturaIMP | null>(null);
  const documentRef = useRef<HTMLDivElement>(null);

  // Direct Invoice Print Handler: Identifies invoice, ensures preview is mounted, and invokes window.print()
  const handlePrintFatura = (fat: FaturaIMP) => {
    setSelectedFaturaId(fat.id);
    setFaturaParaImprimir(fat);
    setViewingFatura(fat);
    setTimeout(() => {
      window.print();
    }, 220);
  };

  const handlePrintFaturaById = (faturaId: string) => {
    const fat = faturas.find((f) => f.id === faturaId || f.nFatura === faturaId);
    if (fat) {
      handlePrintFatura(fat);
    }
  };

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

  // Form State
  const [selectedEmbarcacaoId, setSelectedEmbarcacaoId] = useState('');
  const [selectedAgenciaId, setSelectedAgenciaId] = useState('');
  const [dataEmissao, setDataEmissao] = useState(new Date().toISOString().slice(0, 10));
  const [items, setItems] = useState<ItemFormState[]>([]);
  const [saveAsDraft, setSaveAsDraft] = useState(false);

  // Official Rubricas set by Director
  // Official Rubricas (RubricaReceita) registered by Director
  const [rubricasList, setRubricasList] = useState<RubricaReceita[]>(() => {
    if (rubricas && rubricas.length > 0) return rubricas;
    return mockRubricasReceitas;
  });
  const [showAddRubricaModal, setShowAddRubricaModal] = useState(false);
  const [novaRubricaForm, setNovaRubricaForm] = useState({
    codigoServico: '',
    descricaoServico: '',
    valorUnitarioXOF: 1850000,
    categoria: 'Pilotagem',
    unidadeMedida: 'Taxa Fixa'
  });

  useEffect(() => {
    if (rubricas && rubricas.length > 0) {
      setRubricasList(rubricas);
    }
  }, [rubricas]);

  const isAdminOrSuper = currentUser.role === 'admin' || currentUser.role === 'superadmin' || currentUser.funcao === 'ADMIN_IMP';
  const isFaturacaoOrAdmin = currentUser.role === 'faturacao' || isAdminOrSuper;

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setEditingFatura(null);
    const initialEmb = embarcacoes[0] || null;
    const initialAg = agencias[0] || null;

    setSelectedEmbarcacaoId(initialEmb ? initialEmb.id : '');
    setSelectedAgenciaId(initialAg ? initialAg.id : '');
    setDataEmissao(new Date().toISOString().slice(0, 10));
    setSaveAsDraft(false);

    const firstRub = rubricasList[0];
    const initialPrice = firstRub ? Math.round(firstRub.precoUnitarioXOF || 1850000) : 1850000;
    const initialCode = firstRub ? firstRub.codigoRubrica : 'PIL-01';
    const initialDesc = firstRub ? `[${firstRub.codigoRubrica}] ${firstRub.nomeRubrica}` : '[PIL-01] Serviço de Pilotagem por Manobra';

    setItems([
      {
        codigoRubrica: initialCode,
        rubricaId: firstRub?.id,
        descricao: initialDesc,
        quantidade: 1,
        precoUnitario: initialPrice,
        subtotal: initialPrice
      }
    ]);
    setShowCreateModal(true);
  };

  // Open Edit Modal (allowed only for "rascunho")
  const handleOpenEditModal = (fat: FaturaIMP) => {
    if (fat.estado !== 'rascunho') {
      alert('Apenas faturas em estado "Rascunho" podem ser editadas pelo operador.');
      return;
    }
    setEditingFatura(fat);
    const matchedEmb = embarcacoes.find((e) => e.nome === fat.navio);
    const matchedAg = agencias.find((a) => a.nomeComercial === fat.cliente);

    setSelectedEmbarcacaoId(matchedEmb ? matchedEmb.id : (embarcacoes[0]?.id || ''));
    setSelectedAgenciaId(matchedAg ? matchedAg.id : (agencias[0]?.id || ''));
    setDataEmissao(fat.data);
    setItems(
      fat.itens.map((it) => ({
        codigoRubrica: it.codigoRubrica || (it.descricao.startsWith('[') ? it.descricao.split(']')[0].replace('[', '') : undefined),
        rubricaId: it.rubricaId,
        descricao: it.descricao,
        quantidade: it.quantidade,
        precoUnitario: Math.round(it.precoUnitario),
        subtotal: Math.round(it.subtotal)
      }))
    );
    setSaveAsDraft(true);
    setShowCreateModal(true);
  };

  // Select Rubrica from Director's registered list
  const handleSelectRubrica = (index: number, codigoRubricaOuId: string) => {
    const found = rubricasList.find(
      (r) => r.codigoRubrica === codigoRubricaOuId || r.id === codigoRubricaOuId
    );
    if (found) {
      const fullDesc = `[${found.codigoRubrica}] ${found.nomeRubrica}`;
      const unitPrice = Math.round(found.precoUnitarioXOF || 0);
      setItems(
        items.map((it, i) => {
          if (i !== index) return it;
          const qtd = Number(it.quantidade) || 1;
          return {
            ...it,
            codigoRubrica: found.codigoRubrica,
            rubricaId: found.id,
            descricao: fullDesc,
            precoUnitario: unitPrice,
            subtotal: Math.round(qtd * unitPrice)
          };
        })
      );
    }
  };

  // Director registers a new official rubric
  const handleCreateRubricaByDirector = (e: FormEvent) => {
    e.preventDefault();
    if (!novaRubricaForm.codigoServico || !novaRubricaForm.descricaoServico) return;
    const newRubrica: RubricaReceita = {
      id: `RUB-${Date.now()}`,
      codigoRubrica: novaRubricaForm.codigoServico.trim().toUpperCase(),
      nomeRubrica: novaRubricaForm.descricaoServico.trim(),
      categoria: novaRubricaForm.categoria,
      precoUnitarioXOF: Math.round(Number(novaRubricaForm.valorUnitarioXOF) || 0),
      unidadeMedida: novaRubricaForm.unidadeMedida,
      arrecadadoMesAtualXOF: 0,
      metaAnualXOF: (Number(novaRubricaForm.valorUnitarioXOF) || 0) * 12,
      percentualExecucao: 0,
      portoOrigem: 'Porto de Bissau / IMP'
    };
    setRubricasList([newRubrica, ...rubricasList]);
    setShowAddRubricaModal(false);
    setNovaRubricaForm({
      codigoServico: '',
      descricaoServico: '',
      valorUnitarioXOF: 1850000,
      categoria: 'Pilotagem',
      unidadeMedida: 'Taxa Fixa'
    });
  };

  // Item helpers
  const handleAddItem = () => {
    const nextRub = rubricasList[items.length % rubricasList.length] || rubricasList[0];
    const unitPrice = nextRub ? Math.round(nextRub.precoUnitarioXOF || 1850000) : 1850000;
    const code = nextRub ? nextRub.codigoRubrica : 'PIL-01';
    const desc = nextRub ? `[${nextRub.codigoRubrica}] ${nextRub.nomeRubrica}` : '[PIL-01] Serviço de Pilotagem por Manobra';
    setItems([
      ...items,
      {
        codigoRubrica: code,
        rubricaId: nextRub?.id,
        descricao: desc,
        quantidade: 1,
        precoUnitario: unitPrice,
        subtotal: unitPrice
      }
    ]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const handleUpdateItem = (index: number, field: keyof ItemFormState, value: any) => {
    setItems(
      items.map((it, i) => {
        if (i !== index) return it;
        const updated = { ...it, [field]: value };
        if (field === 'quantidade' || field === 'precoUnitario') {
          updated.subtotal = Math.round((Number(updated.quantidade) || 0) * (Number(updated.precoUnitario) || 0));
        }
        return updated;
      })
    );
  };

  // Calculations (strict integer math for XOF)
  const subtotalXOF = Math.round(items.reduce((acc, it) => acc + (it.subtotal || 0), 0));
  const ivaXOF = 0; // Tax exemption / specific regime
  const totalXOF = subtotalXOF + ivaXOF;

  const selectedEmbarcacao = embarcacoes.find((e) => e.id === selectedEmbarcacaoId);
  const selectedAgencia = agencias.find((a) => a.id === selectedAgenciaId);

  // Submit invoice create / update
  const handleSubmitInvoice = (e: FormEvent) => {
    e.preventDefault();
    if (!selectedEmbarcacao || !selectedAgencia || items.length === 0) return;

    const currentYear = new Date().getFullYear();
    const nextSeq = faturas.length + 1;
    const nFat = editingFatura ? editingFatura.nFatura : `FAT-${currentYear}-${String(nextSeq).padStart(4, '0')}`;

    const totalPagoAnterior = editingFatura ? (editingFatura.saldo_pago || 0) : 0;
    const faturaObj: FaturaIMP = {
      id: editingFatura ? editingFatura.id : nFat,
      ano: currentYear,
      seq: editingFatura ? editingFatura.seq : nextSeq,
      nFatura: nFat,
      data: dataEmissao,
      cliente: selectedAgencia.nomeComercial,
      nif: selectedAgencia.nif,
      navio: selectedEmbarcacao.nome,
      tipo: selectedEmbarcacao.tipo,
      gross_tonnage: selectedEmbarcacao.tonelagemBruta,
      itens: items.map((it) => ({
        descricao: it.descricao,
        quantidade: it.quantidade,
        precoUnitario: Math.round(it.precoUnitario),
        subtotal: Math.round(it.subtotal)
      })),
      subtotal: subtotalXOF,
      iva: ivaXOF,
      total: totalXOF,
      saldo_pago: totalPagoAnterior,
      saldo_pendente: Math.max(0, totalXOF - totalPagoAnterior),
      recibos: editingFatura?.recibos || [],
      estado: saveAsDraft ? 'rascunho' : (totalPagoAnterior > 0 ? (totalPagoAnterior >= totalXOF ? 'paga' : 'parcial') : 'confirmada'),
      criado_por: currentUser.nome
    };

    if (editingFatura) {
      onUpdateFatura(faturaObj);
    } else {
      onAddFatura(faturaObj);
    }
    setShowCreateModal(false);
    if (!saveAsDraft) {
      setViewingFatura(faturaObj);
    }
  };

  // Anulação handler (Admin/SuperAdmin only with mandatory justification)
  const handleConfirmAnulacao = () => {
    if (!justificativaAnulacao.trim() || justificativaAnulacao.trim().length < 10) {
      setAnulacaoError('A justificativa de anulação é obrigatória e deve ter pelo menos 10 caracteres.');
      return;
    }
    if (anulandoFatura) {
      onAnularFatura(anulandoFatura.id, justificativaAnulacao.trim());
      setAnulandoFatura(null);
      setJustificativaAnulacao('');
      setAnulacaoError('');
    }
  };

  // Filtered list
  const filteredFaturas = faturas.filter((f) => {
    const matchesSearch =
      f.nFatura.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.navio.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.nif.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'todos' || f.estado === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // KPI calculations
  const totalFaturado = faturas
    .filter((f) => f.estado !== 'anulada')
    .reduce((acc, f) => acc + f.total, 0);

  const totalConfirmadoPendente = faturas
    .filter((f) => f.estado === 'confirmada' || f.estado === 'parcial')
    .reduce((acc, f) => acc + (f.saldo_pendente ?? f.total), 0);

  const totalPago = faturas
    .filter((f) => f.estado !== 'anulada')
    .reduce((acc, f) => acc + (f.saldo_pago || (f.estado === 'paga' ? f.total : 0)), 0);

  const getStatusBadge = (estado: FaturaIMP['estado']) => {
    switch (estado) {
      case 'rascunho':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-amber-500/10 text-amber-500 border border-amber-500/30 flex items-center gap-1 w-fit">
            <Clock className="w-3 h-3" />
            Rascunho (Editável)
          </span>
        );
      case 'confirmada':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-blue-500/10 text-blue-500 border border-blue-500/30 flex items-center gap-1 w-fit">
            <CheckCircle2 className="w-3 h-3" />
            Confirmada (Pendente Caixa)
          </span>
        );
      case 'parcial':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center gap-1 w-fit">
            <Clock className="w-3 h-3" />
            Amortização Parcial
          </span>
        );
      case 'paga':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 flex items-center gap-1 w-fit">
            <FileCheck className="w-3 h-3" />
            Totalmente Paga
          </span>
        );
      case 'anulada':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-rose-500/10 text-rose-500 border border-rose-500/30 flex items-center gap-1 w-fit">
            <Ban className="w-3 h-3" />
            Anulada (PCA)
          </span>
        );
    }
  };

  return (
    <div id="facturacao-module" className="space-y-6">
      {/* Module Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase">
              Módulo de Faturação & Tarifas
            </span>
            <span className="text-xs font-mono text-slate-500">
              NIF: {IMP_INSTITUTIONAL.nif} • Moeda: {IMP_INSTITUTIONAL.currency}
            </span>
          </div>
          <h2 className="text-xl font-bold tracking-tight mt-1 flex items-center gap-2">
            <Receipt className="w-5 h-5 text-blue-400" />
            Gestão & Emissão de Faturas de Tarifas Portuárias
          </h2>
          <p className="text-xs text-slate-400">
            Ciclo de vida documental: Rascunho → Confirmação → Liquidação em Caixa. Segregação de Funções (SoD) ativa.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {onNavigateToDashboard && (
            <button
              onClick={onNavigateToDashboard}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-bold transition-all border border-slate-600 shadow-sm cursor-pointer"
              title="Voltar ao Painel Principal"
            >
              <span>← Voltar ao Painel</span>
            </button>
          )}
          {selectedFaturaId && (
            <button
              onClick={() => handlePrintFaturaById(selectedFaturaId)}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all border border-slate-700 shadow-sm cursor-pointer"
              title={`Imprimir Fatura Selecionada (${faturas.find((f) => f.id === selectedFaturaId)?.nFatura || selectedFaturaId})`}
            >
              <Printer className="w-4 h-4 text-blue-400" />
              <span>Imprimir Fatura ({faturas.find((f) => f.id === selectedFaturaId)?.nFatura || selectedFaturaId})</span>
            </button>
          )}

          {isFaturacaoOrAdmin && (
            <button
              onClick={handleOpenCreateModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-blue-600/30 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Emitir Nova Fatura
            </button>
          )}
        </div>
      </div>

      {/* Financial KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          className={`p-4 rounded-2xl border ${
            theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <span className="text-[10px] uppercase font-mono text-slate-400 font-semibold block">Total Emitido / Válido</span>
          <div className="text-2xl font-bold font-mono text-blue-400 mt-1">
            {totalFaturado.toLocaleString('pt-PT')} XOF
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Moeda Oficial Franco CFA</span>
        </div>

        <div
          className={`p-4 rounded-2xl border ${
            theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <span className="text-[10px] uppercase font-mono text-slate-400 font-semibold block">Confirmadas (A Aguardar Caixa)</span>
          <div className="text-2xl font-bold font-mono text-amber-400 mt-1">
            {totalConfirmadoPendente.toLocaleString('pt-PT')} XOF
          </div>
          <span className="text-[11px] text-amber-500/80 mt-1 block">Prontas para liquidação bancária</span>
        </div>

        <div
          className={`p-4 rounded-2xl border ${
            theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <span className="text-[10px] uppercase font-mono text-slate-400 font-semibold block">Total Liquidado (Caixa)</span>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
            {totalPago.toLocaleString('pt-PT')} XOF
          </div>
          <span className="text-[11px] text-emerald-500/80 mt-1 block">Com recibos emitidos no Caixa</span>
        </div>

        <div
          className={`p-4 rounded-2xl border ${
            theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <span className="text-[10px] uppercase font-mono text-slate-400 font-semibold block">Taxa de Eficiência</span>
          <div className="text-2xl font-bold font-mono text-purple-400 mt-1">
            {totalFaturado > 0 ? Math.round((totalPago / totalFaturado) * 100) : 0}%
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Cobrança vs Faturação líquida</span>
        </div>
      </div>

      {/* Status Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Status Pills */}
        <div
          className={`flex flex-wrap items-center gap-1.5 p-1 rounded-xl border text-xs ${
            theme === 'dark'
              ? 'bg-slate-900/60 border-slate-800'
              : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <button
            onClick={() => setStatusFilter('todos')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              statusFilter === 'todos'
                ? 'bg-blue-600 text-white font-bold shadow'
                : theme === 'dark'
                ? 'text-slate-400 hover:text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Todas ({faturas.length})
          </button>
          <button
            onClick={() => setStatusFilter('rascunho')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              statusFilter === 'rascunho'
                ? 'bg-amber-600 text-white font-bold shadow'
                : theme === 'dark'
                ? 'text-slate-400 hover:text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Rascunho ({faturas.filter((f) => f.estado === 'rascunho').length})
          </button>
          <button
            onClick={() => setStatusFilter('confirmada')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              statusFilter === 'confirmada'
                ? 'bg-blue-600 text-white font-bold shadow'
                : theme === 'dark'
                ? 'text-slate-400 hover:text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Confirmadas ({faturas.filter((f) => f.estado === 'confirmada').length})
          </button>
          <button
            onClick={() => setStatusFilter('parcial')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              statusFilter === 'parcial'
                ? 'bg-amber-600 text-white font-bold shadow'
                : theme === 'dark'
                ? 'text-slate-400 hover:text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Parciais ({faturas.filter((f) => f.estado === 'parcial').length})
          </button>
          <button
            onClick={() => setStatusFilter('paga')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              statusFilter === 'paga'
                ? 'bg-emerald-600 text-white font-bold shadow'
                : theme === 'dark'
                ? 'text-slate-400 hover:text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Pagas ({faturas.filter((f) => f.estado === 'paga').length})
          </button>
          <button
            onClick={() => setStatusFilter('anulada')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              statusFilter === 'anulada'
                ? 'bg-rose-600 text-white font-bold shadow'
                : theme === 'dark'
                ? 'text-slate-400 hover:text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Anuladas ({faturas.filter((f) => f.estado === 'anulada').length})
          </button>
        </div>

        {/* Search */}
        <div
          className={`flex items-center gap-2 px-3 py-2 rounded-xl border flex-1 sm:max-w-xs ${
            theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Pesquisar fatura, cliente, navio..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`bg-transparent text-xs placeholder-slate-400 focus:outline-none w-full ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}
          />
        </div>
      </div>

      {/* Invoices Table */}
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
                <th className="p-3.5">Nº Fatura & Data</th>
                <th className="p-3.5">Cliente / Agência Marítima</th>
                <th className="p-3.5">Navio & Tonelagem (GT)</th>
                <th className="p-3.5 text-right">Valor Total (XOF)</th>
                <th className="p-3.5">Estado da Fatura</th>
                <th className="p-3.5">Criado Por</th>
                <th className="p-3.5 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className={theme === 'dark' ? 'divide-y divide-slate-800/60' : 'divide-y divide-slate-100'}>
              {filteredFaturas.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500 text-xs">
                    Nenhuma fatura encontrada para este filtro.
                  </td>
                </tr>
              ) : (
                filteredFaturas.map((fat) => (
                  <tr
                    key={fat.id}
                    onClick={() => setSelectedFaturaId(fat.id)}
                    className={`transition-colors cursor-pointer ${
                      selectedFaturaId === fat.id
                        ? theme === 'dark'
                          ? 'bg-blue-950/40 border-l-4 border-blue-500'
                          : 'bg-blue-50/80 border-l-4 border-blue-500'
                        : theme === 'dark'
                        ? 'hover:bg-slate-800/40'
                        : 'hover:bg-slate-50/80'
                    }`}
                  >
                    {/* Number & Date */}
                    <td className="p-3.5 whitespace-nowrap">
                      <div
                        className={`font-mono font-bold flex items-center gap-1.5 ${
                          theme === 'dark' ? 'text-white' : 'text-slate-900'
                        }`}
                      >
                        <FileText className="w-3.5 h-3.5 text-blue-500" />
                        {fat.nFatura}
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">{fat.data}</span>
                    </td>

                    {/* Client / Agency */}
                    <td className="p-3.5">
                      <div
                        className={`font-semibold ${
                          theme === 'dark' ? 'text-slate-200' : 'text-slate-800'
                        }`}
                      >
                        {fat.cliente}
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">NIF: {fat.nif}</span>
                    </td>

                    {/* Vessel & GT */}
                    <td className="p-3.5 whitespace-nowrap">
                      <div
                        className={`flex items-center gap-1.5 font-medium ${
                          theme === 'dark' ? 'text-slate-200' : 'text-slate-800'
                        }`}
                      >
                        <Ship className="w-3.5 h-3.5 text-blue-500" />
                        {fat.navio}
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {fat.tipo} • GT: {fat.gross_tonnage?.toLocaleString('pt-PT')}
                      </span>
                    </td>

                    {/* Total Amount & Balance */}
                    <td className="p-3.5 text-right whitespace-nowrap">
                      <div
                        className={`font-mono font-bold text-sm ${
                          theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'
                        }`}
                      >
                        {fat.total.toLocaleString('pt-PT')} XOF
                      </div>
                      {fat.estado === 'parcial' && (
                        <div className="text-[10px] font-mono text-amber-500 font-semibold">
                          Pago: {(fat.saldo_pago || 0).toLocaleString('pt-PT')} | Resta: {(fat.saldo_pendente || 0).toLocaleString('pt-PT')} XOF
                        </div>
                      )}
                      {fat.estado === 'confirmada' && (
                        <div className="text-[10px] font-mono text-slate-400">
                          Pendente integral
                        </div>
                      )}
                    </td>

                    {/* Status */}
                    <td className="p-3.5 whitespace-nowrap">{getStatusBadge(fat.estado)}</td>

                    {/* Issuer */}
                    <td className="p-3.5 text-slate-400 text-[11px] whitespace-nowrap">
                      {fat.criado_por}
                    </td>

                    {/* Actions */}
                    <td className="p-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Direct Imprimir Fatura Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePrintFatura(fat);
                          }}
                          title={`Imprimir Fatura Oficial ${fat.nFatura}`}
                          className="px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-all text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Imprimir Fatura</span>
                        </button>

                        {/* View Modal */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedFaturaId(fat.id);
                            setViewingFatura(fat);
                          }}
                          title="Visualizar Detalhes e Exportar PDF"
                          className="p-1.5 rounded-lg bg-slate-500/10 text-slate-400 hover:bg-slate-600 hover:text-white transition-all text-xs cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {/* Edit Invoice (Draft only) */}
                        {fat.estado === 'rascunho' && isFaturacaoOrAdmin && (
                          <>
                            <button
                              onClick={() => handleOpenEditModal(fat)}
                              title="Editar Fatura em Rascunho"
                              className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-600 hover:text-white transition-colors"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
    onConfirmFatura(fat.id);
    if (window.confirm('Fatura validada e confirmada com sucesso!\n\nDeseja imprimir o documento oficial agora?')) {
      handlePrintFaturaById(fat.id);
    }
  }}
                              title="Confirmar Fatura (Bloquear e enviar para Caixa)"
                              className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-600 hover:text-white transition-colors"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}

                        {/* Anular Fatura (Admin/SuperAdmin only with mandatory justification) */}
                        {isAdminOrSuper && fat.estado !== 'anulada' && fat.estado !== 'paga' && (
                          <button
                            onClick={() => {
                              setAnulandoFatura(fat);
                              setJustificativaAnulacao('');
                              setAnulacaoError('');
                            }}
                            title="Anular Fatura (Requer Justificativa do PCA)"
                            className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-600 hover:text-white transition-colors"
                          >
                            <Ban className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE / EDIT MODAL - REDESIGNED MICROSOFT ACCESS STYLE */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div
            className={`w-full max-w-5xl rounded-2xl border shadow-2xl overflow-hidden max-h-[95vh] flex flex-col ${
              theme === 'dark' ? 'bg-[#0F172A] border-slate-700' : 'bg-[#F1F5F9] border-slate-300'
            }`}
          >
            {/* Modal Header (Institutional) */}
            <div className={`p-4 border-b flex items-center justify-between ${theme === 'dark' ? 'bg-[#1E293B] border-slate-700' : 'bg-[#082B59] text-white border-slate-400'}`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center p-1">
                  <Ship className="w-7 h-7 text-[#082B59]" />
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-widest">
                    {editingFatura ? `Editor de Fatura: ${editingFatura.nFatura}` : 'Emissão de Fatura Portuária (A4 Official)'}
                  </h3>
                  <p className="text-[10px] opacity-80 font-mono">Sistema de Gestão Marítima — IMP Guiné-Bissau</p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1.5 rounded-md hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body - Grid Layout matching User Image (Access Style) */}
            <form onSubmit={handleSubmitInvoice} className="p-6 overflow-y-auto space-y-6">
              {/* Top Row: Vessel & Agency Info */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Section A: Informação do Navio */}
                <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                  <div className="flex items-center gap-2 mb-4 border-b pb-2">
                    <Ship className="w-4 h-4 text-blue-500" />
                    <span className="text-[11px] font-black uppercase text-slate-500">Informação da Embarcação (Navio)</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Selecione o Navio:</label>
                      <select
                        value={selectedEmbarcacaoId}
                        onChange={(e) => setSelectedEmbarcacaoId(e.target.value)}
                        required
                        className={`w-full rounded-lg px-3 py-2 text-xs border focus:outline-none font-bold ${
                          theme === 'dark' ? 'bg-slate-950 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                        }`}
                      >
                        {embarcacoes.map((e) => (
                          <option key={e.id} value={e.id}>
                            {e.nome}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Número IMO:</label>
                      <div className="w-full rounded-lg px-3 py-2 text-xs border font-mono bg-slate-100 dark:bg-slate-800 text-slate-500 border-dashed">
                        {selectedEmbarcacao?.numeroIMO || '---'}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Tipo de Navio:</label>
                      <div className="w-full rounded-lg px-3 py-2 text-xs border font-mono bg-slate-100 dark:bg-slate-800 text-slate-500 border-dashed">
                        {selectedEmbarcacao?.tipo || '---'}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Arqueação Bruta (GT):</label>
                      <div className="w-full rounded-lg px-3 py-2 text-xs border font-mono font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/20 border-blue-200">
                        {selectedEmbarcacao?.tonelagemBruta?.toLocaleString('pt-PT')} GT
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section B: Dados da Agência / Cliente */}
                <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                  <div className="flex items-center gap-2 mb-4 border-b pb-2">
                    <Building2 className="w-4 h-4 text-emerald-500" />
                    <span className="text-[11px] font-black uppercase text-slate-500">Agência Marítima / Facturar a:</span>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Agente Responsável:</label>
                      <select
                        value={selectedAgenciaId}
                        onChange={(e) => setSelectedAgenciaId(e.target.value)}
                        required
                        className={`w-full rounded-lg px-3 py-2 text-xs border focus:outline-none font-bold ${
                          theme === 'dark' ? 'bg-slate-950 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                        }`}
                      >
                        {agencias.map((a) => (
                          <option key={a.id} value={a.id}>
                            {a.nomeComercial}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">NIF do Cliente:</label>
                        <div className="w-full rounded-lg px-3 py-2 text-xs border font-mono bg-slate-100 dark:bg-slate-800 text-slate-500 border-dashed">
                          {selectedAgencia?.nif || '---'}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Data de Emissão:</label>
                        <input
                          type="date"
                          value={dataEmissao}
                          onChange={(e) => setDataEmissao(e.target.value)}
                          required
                          className={`w-full rounded-lg px-3 py-2 text-xs border focus:outline-none font-bold ${
                            theme === 'dark' ? 'bg-slate-950 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section C: Lançamento das Vendas (Items Table matching image_9d1411d3.png) */}
              <div className={`rounded-xl border overflow-hidden ${theme === 'dark' ? 'bg-[#0B1528] border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                <div className={`p-3 border-b flex flex-wrap items-center justify-between gap-2 ${theme === 'dark' ? 'bg-[#101D36] border-slate-700' : 'bg-slate-100 border-slate-300'}`}>
                  <div className="flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-blue-500" />
                    <span className="text-[11px] font-black uppercase text-slate-700 dark:text-slate-200">
                      Lançamento das Vendas / Rubricas de Facturação
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      Tarifário Homologado pelo Diretor
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {isAdminOrSuper && (
                      <button
                        type="button"
                        onClick={() => setShowAddRubricaModal(true)}
                        className="px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/30 rounded text-[10px] font-bold flex items-center gap-1 transition-all"
                        title="Registar Nova Rubrica Oficial no Tarifário (Privilégio do Diretor / PCA)"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        + Nova Rubrica (Direção)
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={handleAddItem}
                      className="px-3 py-1 bg-[#082B59] hover:bg-blue-800 text-white rounded text-[10px] font-bold flex items-center gap-1.5 transition-all active:scale-95 shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Adicionar Nova Linha
                    </button>
                  </div>
                </div>
                
                <table className="w-full text-left text-xs border-collapse">
                  <thead className={`text-[10px] font-black uppercase ${theme === 'dark' ? 'bg-[#070D18] text-slate-400' : 'bg-slate-50 text-slate-500'}`}>
                    <tr>
                      <th className="p-3 border-r border-slate-200 dark:border-slate-800">CÓD / DESCRIÇÃO DO SERVIÇO</th>
                      <th className="p-3 border-r border-slate-200 dark:border-slate-800 w-36 text-center">QTD</th>
                      <th className="p-3 border-r border-slate-200 dark:border-slate-800 w-40 text-right">P. UNITÁRIO (XOF)</th>
                      <th className="p-3 border-r border-slate-200 dark:border-slate-800 w-44 text-right">SUBTOTAL</th>
                      <th className="p-3 w-12 text-center">#</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${theme === 'dark' ? 'divide-slate-800' : 'divide-slate-200'}`}>
                    {items.map((it, idx) => {
                      const matchedRubrica = rubricasList.find(
                        (r) =>
                          r.codigoRubrica === it.codigoRubrica ||
                          r.id === it.rubricaId ||
                          `[${r.codigoRubrica}] ${r.nomeRubrica}` === it.descricao ||
                          r.nomeRubrica === it.descricao
                      );

                      return (
                        <tr
                          key={idx}
                          className={`${theme === 'dark' ? 'bg-[#0B1528] hover:bg-[#13223D]' : 'bg-white hover:bg-blue-50/30'} transition-colors`}
                        >
                          {/* 1. Cód / Descrição do Serviço (Dropdown com todas as rubricas RubricaReceita disponíveis) */}
                          <td className="p-2.5 border-r border-slate-200 dark:border-slate-800">
                            <div className="space-y-1.5">
                              <select
                                value={matchedRubrica ? matchedRubrica.codigoRubrica : (it.codigoRubrica || (it.descricao.startsWith('[') ? it.descricao.split(']')[0].replace('[', '') : 'CUSTOM'))}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  if (val !== 'CUSTOM') {
                                    handleSelectRubrica(idx, val);
                                  }
                                }}
                                className={`w-full rounded-lg px-2.5 py-1.5 text-xs font-semibold border outline-none cursor-pointer ${
                                  theme === 'dark'
                                    ? 'bg-[#121E36] border-slate-700 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                                    : 'bg-white border-slate-300 text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm'
                                }`}
                              >
                                <option value="" disabled>-- Selecione Rubrica Oficial Registada pelo Diretor --</option>
                                {Object.entries(
                                  rubricasList.reduce((acc, r) => {
                                    const cat = r.categoria || 'Serviços Portuários';
                                    if (!acc[cat]) acc[cat] = [];
                                    acc[cat].push(r);
                                    return acc;
                                  }, {} as Record<string, RubricaReceita[]>)
                                ).map(([cat, list]) => (
                                  <optgroup key={cat} label={`• ${cat.toUpperCase()}`}>
                                    {list.map((r) => (
                                      <option key={r.id || r.codigoRubrica} value={r.codigoRubrica}>
                                        [{r.codigoRubrica}] {r.nomeRubrica} — {Math.round(r.precoUnitarioXOF || 0).toLocaleString('pt-PT')} XOF
                                      </option>
                                    ))}
                                  </optgroup>
                                ))}
                                <option value="CUSTOM">-- Outro Serviço / Descrição Personalizada --</option>
                              </select>

                              {/* Editable note / custom description escape hatch */}
                              <input
                                type="text"
                                value={it.descricao}
                                onChange={(e) => handleUpdateItem(idx, 'descricao', e.target.value)}
                                placeholder="Descrição detalhada do serviço..."
                                className={`w-full bg-transparent px-2 py-0.5 text-[11px] font-mono border-b focus:border-blue-500 outline-none ${
                                  theme === 'dark' ? 'text-slate-300 border-slate-800' : 'text-slate-600 border-slate-200'
                                }`}
                              />
                            </div>
                          </td>

                          {/* 2. QTD (Pode aumentar quantidade com botões +/- ou digitando) */}
                          <td className="p-2.5 border-r border-slate-200 dark:border-slate-800 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                type="button"
                                onClick={() =>
                                  handleUpdateItem(idx, 'quantidade', Math.max(1, (Number(it.quantidade) || 1) - 1))
                                }
                                className={`w-7 h-7 rounded-lg border font-bold text-sm flex items-center justify-center transition-all active:scale-95 ${
                                  theme === 'dark'
                                    ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white'
                                    : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
                                }`}
                                title="Diminuir Quantidade (-1)"
                              >
                                -
                              </button>
                              <input
                                type="number"
                                min="1"
                                max="9999"
                                value={it.quantidade}
                                onChange={(e) =>
                                  handleUpdateItem(idx, 'quantidade', Math.max(1, parseInt(e.target.value) || 1))
                                }
                                className={`w-14 text-center rounded-lg border py-1 text-xs font-mono font-bold outline-none focus:ring-2 focus:ring-blue-500 ${
                                  theme === 'dark'
                                    ? 'bg-[#121E36] border-slate-700 text-white'
                                    : 'bg-white border-slate-300 text-slate-900'
                                }`}
                                title="Digite ou use + / - para aumentar a quantidade"
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  handleUpdateItem(idx, 'quantidade', (Number(it.quantidade) || 1) + 1)
                                }
                                className={`w-7 h-7 rounded-lg border font-bold text-sm flex items-center justify-center transition-all active:scale-95 ${
                                  theme === 'dark'
                                    ? 'bg-blue-600/30 border-blue-500/50 text-blue-300 hover:bg-blue-600 hover:text-white'
                                    : 'bg-blue-50 border-blue-300 text-blue-700 hover:bg-blue-100'
                                }`}
                                title="Aumentar Quantidade (+1)"
                              >
                                +
                              </button>
                            </div>
                          </td>

                          {/* 3. P. Unitário (XOF) - Fixed / Read-only */}
                          <td className="p-2.5 border-r border-slate-200 dark:border-slate-800 text-right">
                            <input
                              type="text"
                              readOnly
                              value={it.precoUnitario.toLocaleString('pt-PT')}
                              className={`w-full text-right font-mono font-bold text-xs px-2.5 py-1.5 rounded-lg border outline-none cursor-not-allowed ${
                                theme === 'dark'
                                  ? 'bg-slate-800 border-slate-700 text-blue-400'
                                  : 'bg-slate-100 border-slate-300 text-blue-600'
                              }`}
                              title="Preço unitário fixo definido pelo tarifário oficial homologado pelo Diretor"
                            />
                          </td>

                          {/* 4. Subtotal (Shaded box matching image_9d1411d3.png) */}
                          <td
                            className={`p-3 border-r border-slate-200 dark:border-slate-800 text-right font-mono font-bold text-xs whitespace-nowrap ${
                              theme === 'dark'
                                ? 'bg-[#334155]/60 text-slate-200'
                                : 'bg-slate-100/90 text-slate-800'
                            }`}
                          >
                            {it.subtotal.toLocaleString('pt-PT')}
                          </td>

                          {/* 5. Delete Action Button */}
                          <td className="p-2.5 text-center w-12">
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(idx)}
                              disabled={items.length <= 1}
                              title="Remover Linha"
                              className="p-1.5 text-slate-400 hover:text-rose-500 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  {/* Totals Row in Table matching image_9d1411d3.png */}
                  <tfoot>
                    <tr className={`border-t-2 ${theme === 'dark' ? 'bg-[#070D18] border-slate-700' : 'bg-slate-100 border-slate-300'}`}>
                      <td colSpan={3} className="p-3.5 text-right font-black text-xs uppercase tracking-wider">
                        TOTAL FINAL DA FACTURA:
                      </td>
                      <td className="p-3.5 text-right font-mono font-black text-lg text-emerald-500 whitespace-nowrap">
                        {totalXOF.toLocaleString('pt-PT')} XOF
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Bottom Actions & Status */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-3 bg-blue-50 dark:bg-blue-900/20 px-4 py-2.5 rounded-xl border border-blue-200 dark:border-blue-800">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-black uppercase text-blue-600 block leading-none">Guardar como Rascunho?</span>
                      <span className="text-[10px] text-slate-500 italic">Permite edição posterior antes de enviar ao caixa.</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={saveAsDraft}
                      onChange={(e) => setSaveAsDraft(e.target.checked)}
                      className="w-5 h-5 rounded-md text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono italic max-w-[200px]">
                    * Ao confirmar sem rascunho, o documento torna-se imutável e é enviado para liquidação imediata.
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      setEditingFatura(null);
                    }}
                    className="px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest text-slate-300 bg-slate-800 hover:bg-slate-700 transition-all flex items-center gap-1.5 border border-slate-700"
                    title="Retornar à lista principal sem salvar"
                  >
                    <ArrowLeft className="w-4 h-4 text-blue-400" />
                    <span>Voltar</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      setEditingFatura(null);
                    }}
                    className="px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest text-slate-500 hover:bg-slate-200 transition-all active:scale-95"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-blue-600/30 flex items-center gap-2 transition-all active:scale-95"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {saveAsDraft ? 'Gravar Rascunho' : 'Confirmar e Emitir'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW / PRINT OFFICIAL INVOICE MODAL */}
      {viewingFatura && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className={`w-full ${invoicePrintFormat === 'a4' ? 'max-w-2xl' : 'max-w-[100mm]'} bg-white text-slate-900 rounded-3xl border border-slate-300 shadow-2xl overflow-hidden max-h-[95vh] flex flex-col transition-all duration-300`}>
            {/* Top Bar for Actions */}
            <div className="bg-[#082B59] text-white px-6 py-4 flex items-center justify-between shrink-0 no-print">
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-300">
                  Fatura de Tarifas Portuárias
                </span>
                <span className="text-sm font-mono font-bold">
                  {formatFaturaDisplayNumber(viewingFatura.nFatura, viewingFatura.ano)} ({viewingFatura.nFatura})
                </span>
              </div>
              <div className="flex items-center gap-2">
                {/* Format toggle: A4 vs Termico */}
                <div className="bg-slate-900/80 p-0.5 rounded-xl flex text-[10px] font-mono border border-blue-700/50">
                  <button
                    onClick={() => setInvoicePrintFormat('a4')}
                    className={`px-2.5 py-1.5 rounded-lg transition-all ${
                      invoicePrintFormat === 'a4' ? 'bg-blue-600 text-white font-bold shadow' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    Guia A4
                  </button>
                  <button
                    onClick={() => setInvoicePrintFormat('termico')}
                    className={`px-2.5 py-1.5 rounded-lg transition-all ${
                      invoicePrintFormat === 'termico' ? 'bg-blue-600 text-white font-bold shadow' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    Térmico (80mm)
                  </button>
                </div>

                {/* Primary: Imprimir Fatura na Impressora */}
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all active:scale-95 cursor-pointer"
                  title="Enviar fatura para a impressora do computador (Ctrl+P)"
                >
                  <Printer className="w-4 h-4" />
                  <span>Imprimir na Impressora</span>
                </button>

                {/* Secondary: Baixar PDF */}
                <button
                  onClick={() => handleDownloadPDF(`IMP_FATURA_${viewingFatura.nFatura}`)}
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
                  onClick={() => setViewingFatura(null)}
                  className="p-2 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl"
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
                className={`bg-white shadow-xl origin-top pdf-export-container printable-document printable-area relative overflow-hidden ${
                  invoicePrintFormat === 'a4'
                    ? 'w-[210mm] min-h-[297mm] p-8 sm:p-10'
                    : 'w-[80mm] p-4 text-[10px] printable-thermal'
                }`}
              >
                {/* Outer Document Border Frame matching Captura de ecrã 2026-10-28 173014.png */}
                <div className="border-2 border-slate-700 rounded-3xl p-6 sm:p-8 bg-white relative">
                  {/* Proforma Watermark & Banner if Draft */}
                  {viewingFatura.estado === 'rascunho' && (
                    <>
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10 z-0">
                        <div className="text-6xl font-black uppercase tracking-[0.3em] text-amber-600 rotate-[-30deg] border-8 border-amber-600 p-8 rounded-3xl">
                          FATURA PROFORMA
                        </div>
                      </div>
                      <div className="relative z-10 mb-6 p-4 rounded-2xl bg-amber-500/15 border-2 border-amber-500/50 text-amber-900 text-center">
                        <span className="text-xs font-black uppercase tracking-[0.2em] block">FATURA PRO-FORMA</span>
                        <span className="text-[10px] font-mono opacity-90">Documento provisório (Rascunho). Não válido como fatura fiscal definitiva até validação.</span>
                      </div>
                    </>
                  )}

                  {/* Institutional Header matching official model */}
                  <div className="text-center space-y-1 mb-4">
                    {/* Official Gold Nautical Helm Emblem Centered */}
                    <div className="flex justify-center mb-1">
                      <IMPOfficialHelmEmblem className="w-16 h-16 sm:w-20 sm:h-20" />
                    </div>

                    {/* REPÚBLICA DA [Coat of Arms] GUINÉ-BISSAU */}
                    <div className="flex items-center justify-center gap-2 sm:gap-3 my-1">
                      <span className="font-black text-xs sm:text-sm tracking-widest uppercase text-slate-900 leading-none">
                        REPÚBLICA DA
                      </span>
                      <GuineBissauCoatOfArms className="w-8 h-8 sm:w-10 sm:h-10 inline-block shrink-0" />
                      <span className="font-black text-xs sm:text-sm tracking-widest uppercase text-slate-900 leading-none">
                        GUINÉ-BISSAU
                      </span>
                    </div>

                    {/* Ministry */}
                    <div className="font-bold text-[9px] sm:text-[11px] tracking-wider uppercase text-slate-800 leading-tight">
                      MINISTÉRIO DOS TRANSPORTES, TELECOMUNICAÇÕES E ECONOMIA DIGITAL
                    </div>

                    {/* IMP Title */}
                    <div className="font-black text-xs sm:text-sm text-slate-900 uppercase leading-tight pt-0.5">
                      INSTITUTO MARÍTIMO PORTUÁRIO DA GUINÉ-BISSAU
                    </div>

                    {/* Address, NIF, Tel */}
                    <div className="text-[8px] sm:text-[9px] text-slate-600 font-mono font-bold pt-0.5">
                      AV. 3 DE AGOSTO - BISSAU | NIF: {IMP_INSTITUTIONAL.nif} | TEL: +245 95 555 28 79
                    </div>

                    {/* Solid Divider Line */}
                    <div className="border-b-[2px] border-slate-900 mt-2 mb-4" />
                  </div>

                  {/* Invoice Number & Visto Box Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="text-left font-mono">
                      <div className="text-base sm:text-lg font-black text-slate-900">
                        FATURA Nº {formatFaturaDisplayNumber(viewingFatura.nFatura, viewingFatura.ano)}
                      </div>
                      <div className="text-[10px] sm:text-[11px] text-slate-800 font-bold uppercase mt-0.5">
                        DATA DE EMISSÃO: {viewingFatura.data}
                      </div>
                    </div>
                    <div className="border border-slate-700 rounded-md px-4 py-2 text-center min-w-[150px] bg-white">
                      <span className="text-[8px] font-bold uppercase text-slate-500 block leading-tight">Visto</span>
                      <span className="text-[10px] font-black text-slate-900 block leading-tight mt-0.5">O Presidente do CA</span>
                      <span className="text-[10px] italic font-serif text-slate-800 block mt-0.5">Dr. Gualdino Afonso Té</span>
                    </div>
                  </div>

                  {/* Client / Armador & Vessel Details Box matching Screenshot */}
                  <div className="border border-slate-700 rounded-2xl p-4 sm:p-5 mb-5 text-[10px] sm:text-[11px] bg-white">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2.5 gap-x-6">
                      <div className="space-y-1.5">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-slate-600 font-bold uppercase shrink-0">CLIENTE / ARMADOR:</span>
                          <span className="font-black text-slate-900 uppercase truncate">{viewingFatura.cliente}</span>
                        </div>
                        <div className="flex items-baseline gap-1.5 font-mono">
                          <span className="text-slate-600 font-bold uppercase shrink-0">NIF:</span>
                          <span className="font-black text-slate-900">{viewingFatura.nif}</span>
                        </div>
                        <div className="flex items-baseline gap-1.5 font-mono">
                          <span className="text-slate-600 font-bold uppercase shrink-0">CERTIFICADO / MANIFESTO (CM):</span>
                          <span className="font-black text-slate-900">CM-{viewingFatura.ano || '2026'}-001</span>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-slate-600 font-bold uppercase shrink-0">NAVIO:</span>
                          <span className="font-black text-slate-900 uppercase truncate">{viewingFatura.navio}</span>
                        </div>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-slate-600 font-bold uppercase shrink-0">TIPO:</span>
                          <span className="font-black text-slate-900 uppercase">{viewingFatura.tipo}</span>
                        </div>
                        <div className="flex items-baseline gap-1.5 font-mono">
                          <span className="text-slate-600 font-bold uppercase shrink-0">DATA ENTRADA:</span>
                          <span className="font-black text-slate-900">{viewingFatura.data}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                {/* Items Table matching official model */}
                <div className="mb-6 overflow-hidden rounded-xl border border-slate-300">
                  <table className="w-full text-left text-[10px]">
                    <thead className="bg-[#082B59] text-white font-black uppercase">
                      <tr>
                        <th className="p-2.5">Cód / Descrição</th>
                        <th className="p-2.5 text-center">Qtd</th>
                        <th className="p-2.5 text-right">P. Unitário (XOF)</th>
                        <th className="p-2.5 text-right">Valor (XOF)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 font-mono">
                      {viewingFatura.itens.map((it, i) => (
                        <tr key={i}>
                          <td className="p-2.5 font-sans font-bold text-slate-800">{it.descricao}</td>
                          <td className="p-2.5 text-center">{it.quantidade}</td>
                          <td className="p-2.5 text-right">{it.precoUnitario.toLocaleString('pt-PT')}</td>
                          <td className="p-2.5 text-right font-black text-slate-900">{it.subtotal.toLocaleString('pt-PT')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Sub-Total, IVA, Total Geral & Extenso */}
                <div className="border border-slate-300 rounded-xl p-4 mb-6 space-y-2 text-[11px] font-mono bg-slate-50">
                  <div className="flex justify-between border-b border-slate-200 pb-1.5">
                    <span className="font-bold text-slate-600 uppercase">Sub-Total:</span>
                    <span className="font-black text-slate-900">{viewingFatura.subtotal.toLocaleString('pt-PT')} XOF</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-1.5">
                    <span className="font-bold text-slate-600 uppercase">Taxa - IVA (0% Isento):</span>
                    <span className="font-black text-slate-900">0 XOF</span>
                  </div>
                  <div className="flex justify-between pt-1 text-sm">
                    <span className="font-black text-[#082B59] uppercase">Total Geral:</span>
                    <span className="font-black text-[#082B59] text-base">{viewingFatura.total.toLocaleString('pt-PT')} XOF</span>
                  </div>
                  <div className="pt-2 border-t border-slate-200 text-[10px] italic text-slate-700 text-center font-sans">
                    ( {valorPorExtensoXOF(viewingFatura.total)} )
                  </div>
                </div>

                {/* Payment Instructions matching PDF */}
                <div className="border border-blue-200 bg-blue-50/50 rounded-xl p-3.5 mb-6 text-[10px] space-y-1">
                  <span className="font-black text-[#082B59] uppercase block mb-1">INSTRUÇÕES DE PAGAMENTO: O pagamento pode ser efetuado por depósito ou transferência:</span>
                  <div className="font-mono text-slate-800 space-y-0.5">
                    <div>• <b>BANQUE ATLANTIQUE:</b> Conta Nº 20131940001</div>
                    <div>• <b>CORIS BANK:</b> Conta Nº 001056624101</div>
                  </div>
                  <div className="text-[9px] text-slate-600 pt-1">
                    O talão de depósito deve ser entregue na Tesouraria do IMP para emissão do Recibo Oficial de Quitação. Prazo de pagamento: 7 dias.
                  </div>
                </div>

                {/* Signatures block matching official PDF model */}
                <div className="grid grid-cols-4 gap-2 pt-6 border-t border-slate-300 text-center text-[9px]">
                  <div>
                    <span className="font-bold text-slate-500 uppercase block mb-1">Elaborado</span>
                    <span className="text-[8px] text-slate-600 block leading-tight mb-4">O Chefe de Serviço de Faturação</span>
                    <div className="border-t border-slate-400 pt-1 font-mono font-bold text-slate-800">{viewingFatura.criado_por}</div>
                  </div>
                  <div>
                    <span className="font-bold text-slate-500 uppercase block mb-1">Conferido</span>
                    <span className="text-[8px] text-slate-600 block leading-tight mb-4">A Chefe de Dep. Faturação e Cobrança</span>
                    <div className="border-t border-slate-400 pt-1 font-mono font-bold text-slate-800">Srª Ana Miriam M. Té</div>
                  </div>
                  <div>
                    <span className="font-bold text-slate-500 uppercase block mb-1">Conferido</span>
                    <span className="text-[8px] text-slate-600 block leading-tight mb-4">O Director Adm. Financeiro</span>
                    <div className="border-t border-slate-400 pt-1 font-mono font-bold text-slate-800">Dr. M. S. Cande</div>
                  </div>
                  <div>
                    <span className="font-bold text-slate-500 uppercase block mb-1">Visto</span>
                    <span className="text-[8px] text-slate-600 block leading-tight mb-4">O Presidente do Conselho de Adm.</span>
                    <div className="border-t border-slate-400 pt-1 font-mono font-bold text-slate-800">Dr. Gualdino Afonso Té</div>
                  </div>
                </div>

                {/* Footer Certificate & System */}
                <div className="mt-8 pt-3 border-t border-slate-200 flex justify-between items-center text-[8px] font-mono text-slate-400 uppercase">
                  <span>DGCI — Nº de certificado 00035C/2022</span>
                  <span>Sistema Integral de Gestão Marítima (IMP)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )}

      {/* ANULAÇÃO JUSTIFICATION MODAL (ADMIN ONLY) */}
      {anulandoFatura && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div
            className={`w-full max-w-md rounded-3xl border shadow-2xl p-6 space-y-4 ${
              theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex items-center gap-3 text-rose-500">
              <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20">
                <Ban className="w-6 h-6" />
              </div>
              <div>
                <h3 className={`font-bold text-base ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  Anular Fatura Oficial
                </h3>
                <span className="text-xs font-mono text-slate-400">{anulandoFatura.nFatura}</span>
              </div>
            </div>

            <p className={`text-xs leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
              De acordo com a auditoria criptográfica e regras de Segregação de Funções (SoD), a anulação de uma fatura oficial é irreversível e exige justificativa fundamentada pelo Diretor Geral / SuperAdmin.
            </p>

            {anulacaoError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
                {anulacaoError}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 block">
                Justificativa Obrigatória de Anulação:
              </label>
              <textarea
                rows={3}
                value={justificativaAnulacao}
                onChange={(e) => setJustificativaAnulacao(e.target.value)}
                placeholder="Ex.: Duplicação de escala retificada pelo armador e autorizada pela Direção Geral..."
                className={`w-full rounded-xl p-3 text-xs border focus:outline-none focus:border-rose-500 ${
                  theme === 'dark' ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              />
            </div>

            <div className={`flex justify-end gap-3 pt-2 border-t ${theme === 'dark' ? 'border-slate-800' : 'border-slate-200'}`}>
              <button
                type="button"
                onClick={() => setAnulandoFatura(null)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
                  theme === 'dark' ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Voltar
              </button>
              <button
                type="button"
                onClick={handleConfirmAnulacao}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-rose-600/30 flex items-center gap-1.5"
              >
                <Ban className="w-4 h-4" />
                Confirmar Anulação
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal to Register New Rubric (Director / Admin privilege) */}
      {showAddRubricaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div
            className={`w-full max-w-lg rounded-2xl border shadow-2xl overflow-hidden ${
              theme === 'dark' ? 'bg-[#0F172A] border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className={`p-4 border-b flex items-center justify-between ${theme === 'dark' ? 'bg-[#1E293B] border-slate-700' : 'bg-[#082B59] text-white'}`}>
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="font-bold text-sm">Registar Nova Rubrica de Tarifário (Direção Geral)</h3>
                  <p className="text-[10px] opacity-80 font-mono">SoD: Definição oficial de tarifas marítimo-portuárias</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddRubricaModal(false)}
                className="p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRubricaByDirector} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">CÓDIGO DO SERVIÇO:</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: PIL-04, ATR-05"
                    value={novaRubricaForm.codigoServico}
                    onChange={(e) => setNovaRubricaForm({ ...novaRubricaForm, codigoServico: e.target.value })}
                    className={`w-full rounded-lg px-3 py-2 border font-mono font-bold outline-none ${
                      theme === 'dark' ? 'bg-slate-950 border-slate-700 text-white focus:border-blue-500' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-500'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">CATEGORIA:</label>
                  <select
                    value={novaRubricaForm.categoria}
                    onChange={(e) => setNovaRubricaForm({ ...novaRubricaForm, categoria: e.target.value })}
                    className={`w-full rounded-lg px-3 py-2 border font-bold outline-none ${
                      theme === 'dark' ? 'bg-slate-950 border-slate-700 text-white focus:border-blue-500' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-500'
                    }`}
                  >
                    <option value="Pilotagem">Pilotagem</option>
                    <option value="Cais & Permanência">Cais & Permanência</option>
                    <option value="Faróis e Balizamento">Faróis e Balizamento</option>
                    <option value="Rebocadores & Manobra">Rebocadores & Manobra</option>
                    <option value="Movimentação & Cargas">Movimentação & Cargas</option>
                    <option value="Licenciamento">Licenciamento</option>
                    <option value="Inspecções & Certificados">Inspecções & Certificados</option>
                    <option value="Serviços Portuários">Serviços Portuários</option>
                    <option value="Multas & Penalidades">Multas & Penalidades</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">DESCRIÇÃO OFICIAL DO SERVIÇO:</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Serviço Especial de Praticagem Noturna em Águas Restritas"
                  value={novaRubricaForm.descricaoServico}
                  onChange={(e) => setNovaRubricaForm({ ...novaRubricaForm, descricaoServico: e.target.value })}
                  className={`w-full rounded-lg px-3 py-2 border font-bold outline-none ${
                    theme === 'dark' ? 'bg-slate-950 border-slate-700 text-white focus:border-blue-500' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-500'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">PREÇO UNITÁRIO (XOF):</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={novaRubricaForm.valorUnitarioXOF}
                    onChange={(e) => setNovaRubricaForm({ ...novaRubricaForm, valorUnitarioXOF: parseInt(e.target.value) || 0 })}
                    className={`w-full rounded-lg px-3 py-2 border font-mono font-bold text-blue-500 outline-none ${
                      theme === 'dark' ? 'bg-slate-950 border-slate-700 focus:border-blue-500' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-500'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">UNIDADE DE MEDIDA:</label>
                  <input
                    type="text"
                    required
                    value={novaRubricaForm.unidadeMedida}
                    onChange={(e) => setNovaRubricaForm({ ...novaRubricaForm, unidadeMedida: e.target.value })}
                    placeholder="Taxa Fixa, Por Hora, Por Dia..."
                    className={`w-full rounded-lg px-3 py-2 border font-bold outline-none ${
                      theme === 'dark' ? 'bg-slate-950 border-slate-700 text-white focus:border-blue-500' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-500'
                    }`}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-700/60">
                <button
                  type="button"
                  onClick={() => setShowAddRubricaModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  Registar no Tarifário
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
