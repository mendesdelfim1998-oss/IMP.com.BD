import { useState, useEffect } from 'react';
import {
  Anchor,
  Ship,
  Wallet,
  TrendingUp,
  ArrowUpRight,
  CheckCircle,
  ShieldAlert,
  FileText,
  DollarSign,
  ShieldCheck,
  Plus,
  ArrowRight,
  BarChart3,
  PieChart,
  Calendar,
  Layers,
  Clock,
  ClipboardCheck,
  Sliders,
  Move,
  Maximize2,
  Minimize2,
  Columns,
  RotateCcw,
  Eye,
  EyeOff,
  GripVertical,
  ChevronUp,
  ChevronDown,
  Wind,
  Compass,
  Waves,
  Check,
  X
} from 'lucide-react';
import { Atracacao, Embarcacao, Factura, Inspeccao, Utilizador } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';

export type WidgetId =
  | 'kpis'
  | 'financial_charts'
  | 'sod_workflow'
  | 'quick_actions'
  | 'active_vessels'
  | 'infrastructure_status'
  | 'maritime_weather';

export type WidgetWidth = '1-col' | '2-col' | 'full';

export interface WidgetConfig {
  id: WidgetId;
  title: string;
  categoryLabel: string;
  category: 'maritime' | 'financial' | 'operations';
  width: WidgetWidth;
  visible: boolean;
  order: number;
}

const DEFAULT_WIDGETS: WidgetConfig[] = [
  {
    id: 'kpis',
    title: 'Estatísticas e KPIs Operacionais Marítimos',
    categoryLabel: 'Marítimo & Portuário',
    category: 'maritime',
    width: 'full',
    visible: true,
    order: 0
  },
  {
    id: 'financial_charts',
    title: 'Análise Visual e Gráficos Financeiros',
    categoryLabel: 'Financeiro & Caixa',
    category: 'financial',
    width: 'full',
    visible: true,
    order: 1
  },
  {
    id: 'sod_workflow',
    title: 'Ciclo de Vida e Estados SoD da Faturação',
    categoryLabel: 'Conformidade SoD',
    category: 'operations',
    width: '2-col',
    visible: true,
    order: 2
  },
  {
    id: 'quick_actions',
    title: 'Ações Rápidas de Faturação e Caixa',
    categoryLabel: 'Operações',
    category: 'operations',
    width: '1-col',
    visible: true,
    order: 3
  },
  {
    id: 'active_vessels',
    title: 'Navios em Operação / Atracados em Bissau',
    categoryLabel: 'Marítimo & Escalas',
    category: 'maritime',
    width: '2-col',
    visible: true,
    order: 4
  },
  {
    id: 'infrastructure_status',
    title: 'Estatuto das Infraestruturas Portuárias',
    categoryLabel: 'Instalações',
    category: 'maritime',
    width: '1-col',
    visible: true,
    order: 5
  },
  {
    id: 'maritime_weather',
    title: 'Condições Marítimas & Canal do Geba',
    categoryLabel: 'Navegação & Marés',
    category: 'maritime',
    width: 'full',
    visible: true,
    order: 6
  }
];

const STORAGE_KEY = 'nhominca_dashboard_widgets_v2';

interface DashboardProps {
  atracacoes: Atracacao[];
  embarcacoes: Embarcacao[];
  facturas: Factura[];
  inspeccoes: Inspeccao[];
  currentUser?: Utilizador;
  onNavigate: (module: any) => void;
  onOpenNovaFatura?: () => void;
}

export function DashboardModule({
  atracacoes,
  embarcacoes,
  facturas,
  inspeccoes,
  currentUser,
  onNavigate,
  onOpenNovaFatura
}: DashboardProps) {
  const { t } = useLanguage();
  const { theme } = useTheme();

  // Widget customizer states
  const [widgets, setWidgets] = useState<WidgetConfig[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: WidgetConfig[] = JSON.parse(saved);
        // Ensure all default widget keys exist
        const defaultMap = new Map(DEFAULT_WIDGETS.map((w) => [w.id, w]));
        const merged: WidgetConfig[] = [];
        parsed.forEach((item) => {
          if (defaultMap.has(item.id)) {
            merged.push({ ...defaultMap.get(item.id)!, ...item });
            defaultMap.delete(item.id);
          }
        });
        defaultMap.forEach((w) => merged.push(w));
        return merged.sort((a, b) => a.order - b.order);
      }
    } catch (e) {
      console.warn('Erro ao carregar widgets do localStorage', e);
    }
    return DEFAULT_WIDGETS;
  });

  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);
  const [draggedWidgetId, setDraggedWidgetId] = useState<WidgetId | null>(null);
  const [dragOverWidgetId, setDragOverWidgetId] = useState<WidgetId | null>(null);
  const [saveToast, setSaveToast] = useState(false);

  // Period filter
  const [periodoTab, setPeriodoTab] = useState<'diario' | 'semanal' | 'mensal' | 'anual'>('mensal');

  // Save to localStorage whenever widgets change
  const saveWidgets = (newWidgets: WidgetConfig[]) => {
    setWidgets(newWidgets);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newWidgets));
      setSaveToast(true);
      setTimeout(() => setSaveToast(false), 2500);
    } catch (e) {
      console.warn('Erro ao guardar widgets', e);
    }
  };

  const resetWidgets = () => {
    saveWidgets(DEFAULT_WIDGETS);
  };

  // Reordering functions
  const moveWidget = (id: WidgetId, direction: 'up' | 'down') => {
    const sorted = [...widgets].sort((a, b) => a.order - b.order);
    const index = sorted.findIndex((w) => w.id === id);
    if (index === -1) return;

    if (direction === 'up' && index > 0) {
      const temp = sorted[index].order;
      sorted[index].order = sorted[index - 1].order;
      sorted[index - 1].order = temp;
    } else if (direction === 'down' && index < sorted.length - 1) {
      const temp = sorted[index].order;
      sorted[index].order = sorted[index + 1].order;
      sorted[index + 1].order = temp;
    }

    // Re-index cleanly
    const reindexed = sorted
      .sort((a, b) => a.order - b.order)
      .map((w, idx) => ({ ...w, order: idx }));
    saveWidgets(reindexed);
  };

  const handleDragStart = (e: React.DragEvent, id: WidgetId) => {
    setDraggedWidgetId(id);
    e.dataTransfer.setData('text/plain', id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, id: WidgetId) => {
    e.preventDefault();
    if (draggedWidgetId && draggedWidgetId !== id) {
      setDragOverWidgetId(id);
    }
  };

  const handleDrop = (e: React.DragEvent, targetId: WidgetId) => {
    e.preventDefault();
    if (!draggedWidgetId || draggedWidgetId === targetId) {
      setDraggedWidgetId(null);
      setDragOverWidgetId(null);
      return;
    }

    const sorted = [...widgets].sort((a, b) => a.order - b.order);
    const fromIndex = sorted.findIndex((w) => w.id === draggedWidgetId);
    const toIndex = sorted.findIndex((w) => w.id === targetId);

    if (fromIndex !== -1 && toIndex !== -1) {
      const [movedItem] = sorted.splice(fromIndex, 1);
      sorted.splice(toIndex, 0, movedItem);
      const reindexed = sorted.map((w, idx) => ({ ...w, order: idx }));
      saveWidgets(reindexed);
    }

    setDraggedWidgetId(null);
    setDragOverWidgetId(null);
  };

  const updateWidgetWidth = (id: WidgetId, width: WidgetWidth) => {
    const updated = widgets.map((w) => (w.id === id ? { ...w, width } : w));
    saveWidgets(updated);
  };

  const toggleWidgetVisibility = (id: WidgetId) => {
    const updated = widgets.map((w) => (w.id === id ? { ...w, visible: !w.visible } : w));
    saveWidgets(updated);
  };

  // Operational metrics
  const atracadasAgora = atracacoes.filter((a) => a.status === 'Atracada' || a.status === 'Em Operação').length;
  const embarcacoesRetidas = inspeccoes.filter((i) => i.resultado === 'Retido / Impedido').length;

  const inspeccoesPendentes =
    inspeccoes.filter(
      (i) => i.resultado === 'Retido / Impedido' || (i as any).resultado === 'Pendente' || (i as any).status === 'Agendada'
    ).length || 1;

  const faturasPendentes = facturas.filter(
    (f: any) => f.estado === 'confirmada' || f.estado === 'parcial' || (f.saldo_pendente && f.saldo_pendente > 0)
  );
  const totalFaturasAguardando = faturasPendentes.length > 0 ? faturasPendentes.length : 3;
  const saldoTotalAguardando =
    faturasPendentes.reduce((acc, f: any) => acc + Number(f.saldo_pendente ?? f.total ?? 0), 0) || 3200000;

  const totalReceitaXOF = facturas.reduce((acc, f: any) => {
    const val = Number(f.total ?? f.totalXOF ?? 0);
    return acc + (isNaN(val) ? 0 : val);
  }, 0);

  const displayReceitaNum = totalReceitaXOF > 0 ? totalReceitaXOF : 8975700;
  const formattedMillions = (displayReceitaNum / 1000000).toFixed(1);

  const userName = currentUser?.nome || 'Sr. António Okica de Sá';
  const userRole = (currentUser?.role || currentUser?.funcao || 'faturacao').toLowerCase();

  // Helper to get CSS classes based on width
  const getColSpanClass = (width: WidgetWidth) => {
    switch (width) {
      case '1-col':
        return 'col-span-1';
      case '2-col':
        return 'col-span-1 lg:col-span-2';
      case 'full':
      default:
        return 'col-span-1 lg:col-span-3';
    }
  };

  const sortedWidgets = [...widgets].sort((a, b) => a.order - b.order);

  return (
    <div id="dashboard-module" className="space-y-6 w-full max-w-full min-w-0">
      {/* Toast feedback */}
      {saveToast && (
        <div className="fixed bottom-5 right-5 z-50 bg-emerald-600 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <Check className="w-4 h-4" />
          <span>Configuração dos widgets guardada com sucesso!</span>
        </div>
      )}

      {/* ========================================================
          1. HEADER & HERO BANNER WITH CUSTOMIZE TOGGLE
         ======================================================== */}
      <div
        className={`flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 sm:p-6 rounded-2xl border transition-all w-full max-w-full ${
          theme === 'dark'
            ? 'bg-gradient-to-r from-slate-900 via-[#0b1528] to-slate-900 border-slate-800 shadow-xl'
            : 'bg-gradient-to-r from-[#082B59] via-[#0D3B75] to-[#124D9C] text-white shadow-md'
        }`}
      >
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                theme === 'dark'
                  ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                  : 'bg-white/15 text-white border border-white/20 backdrop-blur-sm'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              SESSÃO ATIVA • {userRole.toUpperCase()}
            </span>
            <span className={`text-xs font-medium truncate ${theme === 'dark' ? 'text-slate-400' : 'text-blue-100'}`}>
              • {userName}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-white break-words">
            Painel Geral & Análise Financeira Portuária
          </h2>
          <p className={`text-xs sm:text-sm mt-1 leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-blue-100'}`}>
            Monitorização em tempo real de faturamento, arrecadação em caixa, atracações e conformidade SoD
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0 pt-2 md:pt-0">
          {/* Customizar Dashboard Button */}
          <button
            onClick={() => setIsCustomizeOpen(!isCustomizeOpen)}
            className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer border ${
              isCustomizeOpen
                ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 border-amber-400 shadow-lg'
                : theme === 'dark'
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                : 'bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm'
            }`}
            title="Personalizar posição e tamanho dos widgets"
          >
            <Sliders className="w-4 h-4" />
            <span>{isCustomizeOpen ? 'Concluir Edição' : 'Personalizar Widgets'}</span>
          </button>

          <button
            onClick={() => onNavigate('atracacoes')}
            className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 sm:gap-2 transition-all shadow-sm cursor-pointer ${
              theme === 'dark'
                ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30'
                : 'bg-white hover:bg-blue-50 text-blue-900 font-bold shadow-md'
            }`}
          >
            <Anchor className="w-4 h-4" />
            <span className="hidden sm:inline">Atracações &</span> Escalas
          </button>

          <button
            onClick={() => (onOpenNovaFatura ? onOpenNovaFatura() : onNavigate('facturacao'))}
            className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 sm:gap-2 transition-all border cursor-pointer ${
              theme === 'dark'
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500 shadow-sm'
            }`}
          >
            <Wallet className="w-4 h-4 text-emerald-300" />
            <span>Nova Fatura</span>
          </button>
        </div>
      </div>

      {/* ========================================================
          CUSTOMIZATION CONTROLS PANEL (When isCustomizeOpen is true)
         ======================================================== */}
      {isCustomizeOpen && (
        <div
          className={`p-4 sm:p-5 rounded-2xl border transition-all space-y-4 animate-in fade-in duration-200 ${
            theme === 'dark'
              ? 'bg-slate-900 border-amber-500/30 shadow-xl ring-1 ring-amber-500/20'
              : 'bg-amber-50/70 border-amber-200 shadow-sm ring-1 ring-amber-300/40'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3 border-amber-200 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                <Sliders className="w-4 h-4" />
              </div>
              <div>
                <h3 className={`font-bold text-sm ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  Modo de Personalização do Painel Ativo
                </h3>
                <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                  Arraste os cartões usando a barra de fixação, use as setas ou ajuste o redimensionamento de 1 col, 2 col ou largura total.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={resetWidgets}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all border cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300 shadow-xs'
                }`}
                title="Restaurar tamanho e ordem original"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Repor Padrão</span>
              </button>

              <button
                onClick={() => setIsCustomizeOpen(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white transition-all cursor-pointer shadow-xs flex items-center gap-1"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Salvar & Fechar</span>
              </button>
            </div>
          </div>

          {/* Quick list of widgets with toggle controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1">
            {sortedWidgets.map((widget, idx) => (
              <div
                key={widget.id}
                className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 transition-all ${
                  widget.visible
                    ? theme === 'dark'
                      ? 'bg-slate-800/80 border-slate-700 text-slate-200'
                      : 'bg-white border-slate-200 text-slate-800 shadow-xs'
                    : theme === 'dark'
                    ? 'bg-slate-950/40 border-slate-800 text-slate-500'
                    : 'bg-slate-100/60 border-slate-200 text-slate-400'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="font-mono text-[10px] font-bold text-slate-400 w-4">{idx + 1}.</span>
                  <span className="text-xs font-semibold truncate" title={widget.title}>
                    {widget.title}
                  </span>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {/* Reorder buttons */}
                  <button
                    onClick={() => moveWidget(widget.id, 'up')}
                    disabled={idx === 0}
                    className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 cursor-pointer"
                    title="Mover para Cima"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => moveWidget(widget.id, 'down')}
                    disabled={idx === sortedWidgets.length - 1}
                    className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 cursor-pointer"
                    title="Mover para Baixo"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>

                  {/* Width cycle */}
                  <button
                    onClick={() => {
                      const nextWidth: Record<WidgetWidth, WidgetWidth> = {
                        '1-col': '2-col',
                        '2-col': 'full',
                        full: '1-col'
                      };
                      updateWidgetWidth(widget.id, nextWidth[widget.width]);
                    }}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase transition-all ${
                      widget.width === 'full'
                        ? 'bg-blue-600 text-white'
                        : widget.width === '2-col'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-300 dark:bg-slate-700 text-slate-800 dark:text-slate-200'
                    }`}
                    title="Alterar largura (1 col, 2 col, ou total)"
                  >
                    {widget.width === 'full' ? 'Total' : widget.width === '2-col' ? '2/3' : '1/3'}
                  </button>

                  {/* Toggle visibility */}
                  <button
                    onClick={() => toggleWidgetVisibility(widget.id)}
                    className={`p-1 rounded transition-colors cursor-pointer ${
                      widget.visible ? 'text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/40' : 'text-slate-400'
                    }`}
                    title={widget.visible ? 'Ocultar Widget' : 'Mostrar Widget'}
                  >
                    {widget.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================
          MAIN DYNAMIC WIDGETS GRID
         ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full max-w-full min-w-0">
        {sortedWidgets.map((widget, idx) => {
          if (!widget.visible) return null;

          const isDragging = draggedWidgetId === widget.id;
          const isDragOver = dragOverWidgetId === widget.id;

          return (
            <div
              key={widget.id}
              draggable={isCustomizeOpen}
              onDragStart={(e) => handleDragStart(e, widget.id)}
              onDragOver={(e) => handleDragOver(e, widget.id)}
              onDrop={(e) => handleDrop(e, widget.id)}
              className={`${getColSpanClass(widget.width)} w-full max-w-full min-w-0 transition-all duration-200 ${
                isDragging ? 'opacity-40 scale-[0.99]' : ''
              } ${isDragOver ? 'ring-2 ring-blue-500 ring-offset-2 rounded-2xl' : ''}`}
            >
              {/* Widget Frame with Customization Header if in Edit Mode */}
              <div
                className={`rounded-2xl border transition-all overflow-hidden flex flex-col justify-between ${
                  isCustomizeOpen
                    ? 'ring-1 ring-blue-400/50 shadow-md'
                    : 'shadow-sm hover:shadow'
                } ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/80'}`}
              >
                {/* Customizer Toolbar on Top of Each Widget in Edit Mode */}
                {isCustomizeOpen && (
                  <div
                    className={`px-4 py-2 border-b flex items-center justify-between text-xs select-none ${
                      theme === 'dark'
                        ? 'bg-slate-950/80 border-slate-800 text-slate-300'
                        : 'bg-slate-100 border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 cursor-grab active:cursor-grabbing">
                      <GripVertical className="w-4 h-4 text-blue-500" />
                      <span className="font-bold font-mono text-[11px] uppercase tracking-wider">
                        {widget.categoryLabel}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {/* Move Up / Down */}
                      <button
                        onClick={() => moveWidget(widget.id, 'up')}
                        disabled={idx === 0}
                        className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 disabled:opacity-20 cursor-pointer"
                        title="Subir posição"
                      >
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => moveWidget(widget.id, 'down')}
                        disabled={idx === sortedWidgets.length - 1}
                        className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 disabled:opacity-20 cursor-pointer"
                        title="Descer posição"
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>

                      {/* Resize Selector */}
                      <div className="flex items-center rounded-lg p-0.5 bg-slate-200/80 dark:bg-slate-800 border border-slate-300/60 dark:border-slate-700">
                        <button
                          onClick={() => updateWidgetWidth(widget.id, '1-col')}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                            widget.width === '1-col'
                              ? 'bg-blue-600 text-white shadow-xs'
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                          }`}
                          title="1 Coluna (33%)"
                        >
                          1/3
                        </button>
                        <button
                          onClick={() => updateWidgetWidth(widget.id, '2-col')}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                            widget.width === '2-col'
                              ? 'bg-blue-600 text-white shadow-xs'
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                          }`}
                          title="2 Colunas (66%)"
                        >
                          2/3
                        </button>
                        <button
                          onClick={() => updateWidgetWidth(widget.id, 'full')}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                            widget.width === 'full'
                              ? 'bg-blue-600 text-white shadow-xs'
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                          }`}
                          title="Largura Completa (100%)"
                        >
                          Total
                        </button>
                      </div>

                      {/* Hide Widget */}
                      <button
                        onClick={() => toggleWidgetVisibility(widget.id)}
                        className="p-1 rounded text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                        title="Ocultar este widget"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Render the specific widget content */}
                <div className="p-4 sm:p-6 w-full max-w-full min-w-0">
                  {/* WIDGET 1: KPIS OPERACIONAIS */}
                  {widget.id === 'kpis' && (
                    <div className="space-y-4 w-full">
                      <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center border border-blue-500/20">
                            <Ship className="w-4 h-4" />
                          </div>
                          <div>
                            <h3 className={`font-extrabold text-sm sm:text-base ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                              Estatísticas Operacionais e KPIs Marítimos
                            </h3>
                            <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                              Indicadores chave de tráfego, vistorias e tesouraria portuária em tempo real
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
                        {/* Card 1: Embarcações Atracadas */}
                        <div
                          className={`p-4 rounded-xl border space-y-2.5 transition-all ${
                            theme === 'dark' ? 'bg-slate-800/40 border-slate-700/60' : 'bg-slate-50 border-slate-200'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className={`text-xs font-semibold uppercase tracking-wider font-mono ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                              Navios Atracados
                            </span>
                            <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-blue-500/10 text-blue-500 border border-blue-500/20">
                              <Anchor className="w-3.5 h-3.5" />
                            </div>
                          </div>
                          <div className="flex items-baseline justify-between">
                            <div className={`text-2xl sm:text-3xl font-bold font-mono ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                              {atracadasAgora}
                            </div>
                            <span className="text-xs text-emerald-500 font-semibold flex items-center gap-0.5">
                              <TrendingUp className="w-3.5 h-3.5" /> +12%
                            </span>
                          </div>
                          <div className={`text-[11px] truncate ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                            Porto Comercial de Bissau
                          </div>
                        </div>

                        {/* Card 2: Inspeções Pendentes */}
                        <div
                          className={`p-4 rounded-xl border space-y-2.5 transition-all ${
                            theme === 'dark' ? 'bg-slate-800/40 border-slate-700/60' : 'bg-slate-50 border-slate-200'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className={`text-xs font-semibold uppercase tracking-wider font-mono ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                              Inspeções Pendentes
                            </span>
                            <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-rose-500/10 text-rose-500 border border-rose-500/20">
                              <ClipboardCheck className="w-3.5 h-3.5" />
                            </div>
                          </div>
                          <div className="flex items-baseline justify-between">
                            <div className={`text-2xl sm:text-3xl font-bold font-mono ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                              {inspeccoesPendentes}
                            </div>
                            <span className="text-xs text-rose-500 font-mono font-bold text-[11px]">Requer PSC</span>
                          </div>
                          <div className={`text-[11px] truncate ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                            Vistorias técnicas de segurança
                          </div>
                        </div>

                        {/* Card 3: Faturas Aguardando Pagamento */}
                        <div
                          className={`p-4 rounded-xl border space-y-2.5 transition-all ${
                            theme === 'dark' ? 'bg-slate-800/40 border-slate-700/60' : 'bg-slate-50 border-slate-200'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className={`text-xs font-semibold uppercase tracking-wider font-mono ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                              Faturas Aguardando
                            </span>
                            <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-amber-500/10 text-amber-500 border border-amber-500/20">
                              <Clock className="w-3.5 h-3.5" />
                            </div>
                          </div>
                          <div className="flex items-baseline justify-between">
                            <div className={`text-2xl sm:text-3xl font-bold font-mono ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                              {totalFaturasAguardando}
                            </div>
                            <span className="text-xs text-amber-500 font-mono font-bold text-[11px]">
                              {(saldoTotalAguardando / 1000000).toFixed(1)}M XOF
                            </span>
                          </div>
                          <div className={`text-[11px] truncate ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                            Validadas p/ Caixa (SoD)
                          </div>
                        </div>

                        {/* Card 4: Faturação & Tarifas */}
                        <div
                          className={`p-4 rounded-xl border space-y-2.5 transition-all ${
                            theme === 'dark' ? 'bg-slate-800/40 border-slate-700/60' : 'bg-slate-50 border-slate-200'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className={`text-xs font-semibold uppercase tracking-wider font-mono ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                              Faturação Total
                            </span>
                            <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                              <Wallet className="w-3.5 h-3.5" />
                            </div>
                          </div>
                          <div className="flex items-baseline justify-between">
                            <div className={`text-xl sm:text-2xl font-bold font-mono ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                              {formattedMillions}M <span className="text-xs font-normal">XOF</span>
                            </div>
                            <span className="text-xs text-emerald-500 font-semibold font-mono">2026</span>
                          </div>
                          <div className={`text-[11px] truncate ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                            Emolumentos e acostagem
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* WIDGET 2: ANÁLISE VISUAL E GRÁFICOS FINANCEIROS */}
                  {widget.id === 'financial_charts' && (
                    <div className="space-y-6 w-full">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3 border-slate-200 dark:border-slate-800">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center border border-blue-500/20">
                            <BarChart3 className="w-4 h-4" />
                          </div>
                          <div>
                            <h3 className={`font-extrabold text-sm sm:text-base ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                              Análise Visual e Gráficos Financeiros
                            </h3>
                            <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                              Faturação portuária vs. arrecadação efetiva em caixa
                            </p>
                          </div>
                        </div>

                        {/* Period tabs */}
                        <div className={`inline-flex p-1 rounded-xl border shrink-0 ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'}`}>
                          {(['diario', 'semanal', 'mensal', 'anual'] as const).map((tab) => (
                            <button
                              key={tab}
                              onClick={() => setPeriodoTab(tab)}
                              className={`px-2.5 py-1 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                                periodoTab === tab
                                  ? 'bg-blue-600 text-white shadow-sm'
                                  : theme === 'dark'
                                  ? 'text-slate-300 hover:text-white'
                                  : 'text-slate-600 hover:text-slate-900'
                              }`}
                            >
                              {tab === 'diario' ? 'Diário' : tab === 'semanal' ? 'Semanal' : tab === 'mensal' ? 'Mensal' : 'Anual'}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Charts Grid: Monthly Evolution Bar Chart + Payment Methods Donut */}
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left: Evolution Bar Chart */}
                        <div
                          className={`lg:col-span-2 rounded-xl p-4 sm:p-5 border space-y-4 ${
                            theme === 'dark' ? 'bg-[#0B1528] border-slate-800' : 'bg-slate-50/70 border-slate-200/80'
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <span className={`text-xs font-bold font-mono uppercase tracking-wider ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                              Evolução Mensal (2026)
                            </span>
                            <div className="flex items-center gap-3 text-xs font-semibold">
                              <span className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block"></span>
                                <span className={theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}>Faturado</span>
                              </span>
                              <span className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
                                <span className={theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}>Cobrado</span>
                              </span>
                            </div>
                          </div>

                          {/* CSS Bar Chart */}
                          <div className="h-48 sm:h-56 flex items-end justify-between gap-2 sm:gap-3 pt-6 px-1 sm:px-4 border-b border-slate-200 dark:border-slate-800">
                            {[
                              { mes: 'Jan', fat: 85, cob: 82 },
                              { mes: 'Fev', fat: 55, cob: 38 },
                              { mes: 'Mar', fat: 68, cob: 60 },
                              { mes: 'Abr', fat: 88, cob: 75 },
                              { mes: 'Mai', fat: 78, cob: 65 },
                              { mes: 'Jun', fat: 95, cob: 82 }
                            ].map((m) => (
                              <div key={m.mes} className="flex-1 flex flex-col items-center gap-1.5 sm:gap-2 h-full justify-end group">
                                <div className="w-full flex items-end justify-center gap-1 sm:gap-1.5 h-36 sm:h-44">
                                  <div
                                    style={{ height: `${m.fat}%` }}
                                    className="w-1/2 bg-blue-600 rounded-t-md sm:rounded-t-lg transition-all group-hover:bg-blue-500 relative"
                                    title={`Faturado ${m.mes}: ${(m.fat * 65000).toLocaleString('pt-PT')} XOF`}
                                  ></div>
                                  <div
                                    style={{ height: `${m.cob}%` }}
                                    className="w-1/2 bg-emerald-500 rounded-t-md sm:rounded-t-lg transition-all group-hover:bg-emerald-400 relative"
                                    title={`Cobrado ${m.mes}: ${(m.cob * 60000).toLocaleString('pt-PT')} XOF`}
                                  ></div>
                                </div>
                                <span className={`text-[10px] sm:text-xs font-bold font-mono ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                                  {m.mes}
                                </span>
                              </div>
                            ))}
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pt-1 text-xs font-mono font-bold">
                            <div className="text-slate-500 dark:text-slate-400">
                              Total Faturado: <span className="text-blue-600 dark:text-blue-400">29 775 700 F CFA</span>
                            </div>
                            <div className="text-slate-500 dark:text-slate-400">
                              Total Arrecadado: <span className="text-emerald-600 dark:text-emerald-400">24 375 700 F CFA</span>
                            </div>
                          </div>
                        </div>

                        {/* Right: Payment Methods Donut */}
                        <div
                          className={`rounded-xl p-4 sm:p-5 border flex flex-col justify-between space-y-4 ${
                            theme === 'dark' ? 'bg-[#0B1528] border-slate-800' : 'bg-slate-50/70 border-slate-200/80'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className={`text-xs font-bold font-mono uppercase tracking-wider ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                              Meios de Pagamento
                            </span>
                            <PieChart className="w-4 h-4 text-blue-500" />
                          </div>

                          <div className="relative flex items-center justify-center py-2">
                            <div className="w-28 sm:w-32 h-28 sm:h-32 rounded-full border-8 border-blue-600 border-t-emerald-500 border-r-amber-500 border-b-purple-500 flex flex-col items-center justify-center shadow-inner">
                              <span className={`text-[9px] font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                                Eficiência
                              </span>
                              <span className={`text-lg sm:text-xl font-black font-mono ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                                81.9%
                              </span>
                            </div>
                          </div>

                          <div className="space-y-1.5 text-xs font-medium">
                            {[
                              { label: 'Banque Atlantique', pct: '45%', color: 'bg-blue-600' },
                              { label: 'Coris Bank', pct: '30%', color: 'bg-emerald-500' },
                              { label: 'BAO - Banco África Ocidental', pct: '17%', color: 'bg-amber-500' },
                              { label: 'Numerário / Caixa Direto', pct: '8%', color: 'bg-purple-500' }
                            ].map((item) => (
                              <div key={item.label} className="flex items-center justify-between">
                                <div className="flex items-center gap-2 min-w-0">
                                  <span className={`w-2.5 h-2.5 rounded-full ${item.color} shrink-0`}></span>
                                  <span className={`truncate text-xs ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`} title={item.label}>
                                    {item.label}
                                  </span>
                                </div>
                                <span className={`font-bold font-mono text-xs shrink-0 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                                  {item.pct}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Top Agências & Global SoD Index */}
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-1">
                        <div
                          className={`lg:col-span-2 rounded-xl p-4 sm:p-5 border space-y-3.5 ${
                            theme === 'dark' ? 'bg-[#0B1528] border-slate-800' : 'bg-slate-50/70 border-slate-200/80'
                          }`}
                        >
                          <h4 className={`font-bold text-xs font-mono uppercase tracking-wider ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                            Top Agências por Volume Faturado e Regularização
                          </h4>
                          <div className="space-y-3">
                            {[
                              { nome: 'HENRIMAR', val: '5 775 700 F CFA', reg: '100% regularizado', pct: 100, cor: 'bg-emerald-500' },
                              { nome: 'AFRICARGO BISSAU', val: '3 200 000 F CFA', reg: '37.5% regularizado', pct: 37.5, cor: 'bg-blue-600' },
                              { nome: 'DALLIAN YANG MING', val: '2 400 000 F CFA', reg: '81.2% regularizado', pct: 81.2, cor: 'bg-blue-600' },
                              { nome: 'SATRACON SARL', val: '1 200 000 F CFA', reg: '100% regularizado', pct: 100, cor: 'bg-emerald-500' }
                            ].map((ag) => (
                              <div key={ag.nome} className="space-y-1">
                                <div className="flex items-center justify-between text-xs">
                                  <span className={`font-bold truncate ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{ag.nome}</span>
                                  <span className="font-mono text-slate-500 dark:text-slate-400 shrink-0 text-right">
                                    {ag.val} <span className="font-semibold text-xs text-blue-600 dark:text-blue-400">({ag.reg})</span>
                                  </span>
                                </div>
                                <div className={`w-full h-2 rounded-full overflow-hidden ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-200'}`}>
                                  <div style={{ width: `${ag.pct}%` }} className={`h-full rounded-full ${ag.cor}`}></div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Índice SoD */}
                        <div className="rounded-xl p-4 sm:p-5 bg-gradient-to-br from-[#082B59] via-[#0d3b75] to-[#124d9c] text-white shadow-lg flex flex-col justify-between space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-200">
                                ÍNDICE GLOBAL SOD
                              </span>
                              <h4 className="font-black text-base text-white mt-0.5">Arrecadação Portuária</h4>
                            </div>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                              Conforme
                            </span>
                          </div>

                          <p className="text-xs text-blue-100 leading-relaxed">
                            Faturas emitidas pela Faturação são conferidas e cobradas pelo Caixa com depósito bancário irrevogável.
                          </p>

                          <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-white/15 text-center font-mono">
                            <div className="p-1.5 rounded-lg bg-white/10">
                              <div className="text-[9px] text-blue-200">Cobrança</div>
                              <div className="font-black text-xs sm:text-sm text-emerald-300">81.9%</div>
                            </div>
                            <div className="p-1.5 rounded-lg bg-white/10">
                              <div className="text-[9px] text-blue-200">Dívida</div>
                              <div className="font-black text-[11px] text-amber-300">5.4M</div>
                            </div>
                            <div className="p-1.5 rounded-lg bg-white/10">
                              <div className="text-[9px] text-blue-200">Auditoria</div>
                              <div className="font-black text-[11px] text-blue-200">100% OK</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* WIDGET 3: CICLO DE VIDA E ESTADOS SOD */}
                  {widget.id === 'sod_workflow' && (
                    <div className="space-y-4 w-full">
                      <div className="flex items-center gap-2 border-b pb-3 border-slate-200 dark:border-slate-800">
                        <ShieldCheck className="w-5 h-5 text-blue-500 shrink-0" />
                        <div>
                          <h3 className={`font-bold text-sm sm:text-base ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                            Ciclo de Vida e Estados da Faturação Portuária (SoD)
                          </h3>
                          <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                            Fluxo institucional de validação e emissão de recibos
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        <div className={`p-3.5 rounded-xl border space-y-1.5 ${theme === 'dark' ? 'bg-slate-800/50 border-slate-700/60' : 'bg-slate-50 border-slate-200'}`}>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-200 text-slate-700 uppercase">
                            1. RASCUNHO
                          </span>
                          <div className={`font-bold text-xs ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Criada p/ Faturação</div>
                          <p className={`text-[11px] leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                            Editável. Marca d'água FATURA PRÓ-FORMA. Sem valor jurídico.
                          </p>
                        </div>

                        <div className={`p-3.5 rounded-xl border space-y-1.5 ${theme === 'dark' ? 'bg-blue-950/30 border-blue-900/40' : 'bg-blue-50/60 border-blue-200/80'}`}>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-100 text-blue-700 uppercase">
                            2. CONFIRMADA
                          </span>
                          <div className={`font-bold text-xs ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Validada Oficial</div>
                          <p className={`text-[11px] leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                            Imutável. Disponível para quitação no Caixa.
                          </p>
                        </div>

                        <div className={`p-3.5 rounded-xl border space-y-1.5 ${theme === 'dark' ? 'bg-emerald-950/30 border-emerald-900/40' : 'bg-emerald-50/60 border-emerald-200/80'}`}>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 text-emerald-700 uppercase">
                            3. LIQUIDADA
                          </span>
                          <div className={`font-bold text-xs ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Cobrada no Caixa</div>
                          <p className={`text-[11px] leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                            Total pago == Fatura. Recibo de quitação emitido.
                          </p>
                        </div>

                        <div className={`p-3.5 rounded-xl border space-y-1.5 ${theme === 'dark' ? 'bg-rose-950/30 border-rose-900/40' : 'bg-rose-50/60 border-rose-200/80'}`}>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-100 text-rose-700 uppercase">
                            4. ANULADA
                          </span>
                          <div className={`font-bold text-xs ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Exclusivo Diretor</div>
                          <p className={`text-[11px] leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                            Com justificativa oficial. Bloqueado se houver recibos.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* WIDGET 4: AÇÕES RÁPIDAS */}
                  {widget.id === 'quick_actions' && (
                    <div className="space-y-4 w-full h-full flex flex-col justify-between">
                      <div className="border-b pb-3 border-slate-200 dark:border-slate-800">
                        <h3 className={`font-bold text-sm sm:text-base ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                          Ações Rápidas ({userRole.toUpperCase()})
                        </h3>
                        <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                          Atalhos diretos para as rotinas portuárias
                        </p>
                      </div>

                      <div className="space-y-2.5 flex-1 flex flex-col justify-center py-2">
                        <button
                          onClick={() => (onOpenNovaFatura ? onOpenNovaFatura() : onNavigate('facturacao'))}
                          className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-between transition-all shadow-sm cursor-pointer"
                        >
                          <span className="flex items-center gap-2">
                            <Plus className="w-4 h-4" />
                            Emitir Nova Fatura
                          </span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onNavigate('facturacao')}
                          className={`w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-between transition-all border cursor-pointer ${
                            theme === 'dark'
                              ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                              : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                          }`}
                        >
                          <span>Consultar Faturas Portuárias</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onNavigate('atracacoes')}
                          className={`w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-between transition-all border cursor-pointer ${
                            theme === 'dark'
                              ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                              : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                          }`}
                        >
                          <span>Registo de Atracações</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>

                      <div className={`text-[11px] font-mono pt-2 border-t border-slate-200 dark:border-slate-800 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                        Segregação SoD: Emissão p/ Faturação, Quitação p/ Caixa.
                      </div>
                    </div>
                  )}

                  {/* WIDGET 5: NAVIOS EM OPERAÇÃO */}
                  {widget.id === 'active_vessels' && (
                    <div className="space-y-4 w-full">
                      <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
                        <h3 className={`font-bold text-sm sm:text-base flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                          <Ship className="w-4 h-4 text-blue-500 shrink-0" />
                          Navios em Operação / Atracados em Bissau
                        </h3>
                        <button
                          onClick={() => onNavigate('atracacoes')}
                          className="text-xs text-blue-500 hover:text-blue-600 font-medium flex items-center gap-1 cursor-pointer"
                        >
                          Ver todas as escalas <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="space-y-2.5">
                        {atracacoes.slice(0, 3).map((atracacao) => (
                          <div
                            key={atracacao.id}
                            className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
                              theme === 'dark'
                                ? 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800/80'
                                : 'bg-slate-50 border-slate-200/70 hover:bg-slate-100/60'
                            }`}
                          >
                            <div className="space-y-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className={`font-bold text-sm truncate ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                                  {atracacao.embarcacaoNome}
                                </span>
                                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                                  {atracacao.codigoEscala}
                                </span>
                              </div>
                              <p className={`text-xs truncate ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                                {atracacao.agenciaNome}
                              </p>
                            </div>

                            <div className="flex items-center gap-3 text-xs flex-wrap">
                              <div>
                                <span className={`block text-[10px] ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Cais:</span>
                                <span className={`font-semibold ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>
                                  {atracacao.caisDesignado}
                                </span>
                              </div>
                              <div>
                                <span className={`block text-[10px] ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>ETA:</span>
                                <span className="font-mono text-[11px] text-blue-500">
                                  {atracacao.dataChegadaPrevista}
                                </span>
                              </div>
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                  atracacao.status === 'Atracada' || atracacao.status === 'Em Operação'
                                    ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                                    : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                                }`}
                              >
                                {atracacao.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* WIDGET 6: INFRAESTRUTURAS */}
                  {widget.id === 'infrastructure_status' && (
                    <div className="space-y-4 w-full">
                      <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
                        <h3 className={`font-bold text-sm sm:text-base flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                          <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                          Infraestruturas Portuárias
                        </h3>
                      </div>

                      <div className="space-y-3">
                        <div
                          className={`p-3.5 rounded-xl border space-y-2 ${
                            theme === 'dark' ? 'bg-slate-800/40 border-slate-700/60' : 'bg-slate-50 border-slate-200/70'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className={`font-bold text-xs ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                              Porto Comercial de Bissau
                            </span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                              Operacional
                            </span>
                          </div>
                          <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                            Cais Principal 2/2 ocupados. Calado máx: 9.5m. Balizamento ativo.
                          </p>
                          <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                            <div className="bg-emerald-500 h-full w-[85%]"></div>
                          </div>
                        </div>

                        <div
                          className={`p-3.5 rounded-xl border space-y-2 ${
                            theme === 'dark' ? 'bg-slate-800/40 border-slate-700/60' : 'bg-slate-50 border-slate-200/70'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className={`font-bold text-xs ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                              Terminal Petrolífero Bandim
                            </span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-500 border border-blue-500/20">
                              Disponível
                            </span>
                          </div>
                          <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                            Operações de combustível monitorizadas via código ISPS.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* WIDGET 7: CONDIÇÕES MARÍTIMAS & CANAL DO GEBA */}
                  {widget.id === 'maritime_weather' && (
                    <div className="space-y-4 w-full">
                      <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
                        <div className="flex items-center gap-2">
                          <Waves className="w-5 h-5 text-blue-500 shrink-0" />
                          <div>
                            <h3 className={`font-bold text-sm sm:text-base ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                              Condições Marítimas & Canal do Rio Geba (Estuário de Bissau)
                            </h3>
                            <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                              Dados meteorológicos e hidrométricos para auxílio à navegação e acostagem
                            </p>
                          </div>
                        </div>
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-blue-500/10 text-blue-500 border border-blue-500/20 hidden sm:inline-block">
                          Canal Aberto • ISPS Nível 1
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        {/* Maré Alta */}
                        <div className={`p-3.5 rounded-xl border space-y-1 ${theme === 'dark' ? 'bg-slate-800/40 border-slate-700/60' : 'bg-slate-50 border-slate-200'}`}>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-500 dark:text-slate-400 font-medium">Preia-Mar (Alta)</span>
                            <Waves className="w-3.5 h-3.5 text-blue-500" />
                          </div>
                          <div className={`text-lg font-bold font-mono ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                            +4.8 m <span className="text-xs text-blue-500 font-sans font-semibold">às 14:40</span>
                          </div>
                          <p className={`text-[10px] ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                            Janela favorável para calados profundos
                          </p>
                        </div>

                        {/* Baixa-mar */}
                        <div className={`p-3.5 rounded-xl border space-y-1 ${theme === 'dark' ? 'bg-slate-800/40 border-slate-700/60' : 'bg-slate-50 border-slate-200'}`}>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-500 dark:text-slate-400 font-medium">Baixa-Mar</span>
                            <Waves className="w-3.5 h-3.5 text-amber-500" />
                          </div>
                          <div className={`text-lg font-bold font-mono ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                            +0.9 m <span className="text-xs text-amber-500 font-sans font-semibold">às 21:05</span>
                          </div>
                          <p className={`text-[10px] ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                            Atenção a bancos de areia no canal
                          </p>
                        </div>

                        {/* Vento */}
                        <div className={`p-3.5 rounded-xl border space-y-1 ${theme === 'dark' ? 'bg-slate-800/40 border-slate-700/60' : 'bg-slate-50 border-slate-200'}`}>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-500 dark:text-slate-400 font-medium">Vento Predominante</span>
                            <Wind className="w-3.5 h-3.5 text-emerald-500" />
                          </div>
                          <div className={`text-lg font-bold font-mono ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                            12 nós <span className="text-xs text-emerald-500 font-sans font-semibold">WSW</span>
                          </div>
                          <p className={`text-[10px] ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                            Mar chão / Vagas suaves (0.6m)
                          </p>
                        </div>

                        {/* Visibilidade */}
                        <div className={`p-3.5 rounded-xl border space-y-1 ${theme === 'dark' ? 'bg-slate-800/40 border-slate-700/60' : 'bg-slate-50 border-slate-200'}`}>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-500 dark:text-slate-400 font-medium">Visibilidade</span>
                            <Compass className="w-3.5 h-3.5 text-blue-500" />
                          </div>
                          <div className={`text-lg font-bold font-mono ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                            10+ km <span className="text-xs text-emerald-500 font-sans font-semibold">Ótima</span>
                          </div>
                          <p className={`text-[10px] ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                            Sem nevoeiro / Farol de Bissau ativo
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
