import {
  LayoutDashboard,
  Ship,
  Anchor,
  Building2,
  Users,
  Compass,
  Receipt,
  Wallet,
  ClipboardCheck,
  Award,
  FileCheck2,
  BarChart3,
  Settings,
  ShieldAlert,
  KeyRound,
  TrendingUp,
  ShieldCheck,
  Briefcase,
  ChevronLeft,
  FileText,
  Plus,
  X
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { Utilizador } from '../../types';
import { useTheme } from '../../context/ThemeContext';

export type ModuleKey =
  | 'authentication'
  | 'dashboard'
  | 'utilizadores'
  | 'embarcacoes'
  | 'agencias_maritimas'
  | 'armadores'
  | 'portos'
  | 'atracacoes'
  | 'facturacao'
  | 'tesouraria'
  | 'receitas'
  | 'inspeccoes'
  | 'certificados'
  | 'licencas'
  | 'multas'
  | 'relatorios'
  | 'configuracao'
  | 'auditoria';

interface SidebarProps {
  activeModule: ModuleKey;
  currentUser?: Utilizador;
  onSelectModule: (module: ModuleKey) => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export function Sidebar({ activeModule, currentUser, onSelectModule, isMobileOpen, onCloseMobile }: SidebarProps) {
  const { t } = useLanguage();
  const { theme } = useTheme();

  const userRole = (currentUser?.role || currentUser?.funcao || 'admin').toLowerCase();
  const isFaturacao = userRole === 'faturacao';
  const isCaixa = userRole === 'caixa';
  const isSuperAdmin = userRole === 'superadmin';
  const isAdmin = userRole === 'admin' || userRole === 'admin_imp' || isSuperAdmin;

  // STRICT SoD NAVIGATION LOGIC
  const navSections = isFaturacao
    ? [
        {
          title: '• OPERAÇÕES DE FATURAÇÃO',
          items: [
            { id: 'dashboard' as ModuleKey, label: 'Painel Geral', icon: LayoutDashboard },
            { id: 'facturacao' as ModuleKey, label: 'Emissão de Faturas', icon: Receipt, badge: '3' },
            { id: 'receitas' as ModuleKey, label: 'Tarifário Oficial', icon: TrendingUp },
            { id: 'agencias_maritimas' as ModuleKey, label: 'Agências Marítimas', icon: Building2 },
            { id: 'embarcacoes' as ModuleKey, label: 'Consulta Navios', icon: Ship },
            { id: 'relatorios' as ModuleKey, label: 'Extratos de Faturação', icon: BarChart3 },
            { id: 'authentication' as ModuleKey, label: 'Meu Perfil', icon: KeyRound },
          ]
        }
      ]
    : isCaixa
    ? [
        {
          title: '• TESOURARIA E CAIXA',
          items: [
            { id: 'dashboard' as ModuleKey, label: 'Painel de Caixa', icon: LayoutDashboard },
            { id: 'tesouraria' as ModuleKey, label: 'Gestão de Caixa', icon: Wallet, badge: '!' },
            { id: 'facturacao' as ModuleKey, label: 'Consultar Faturas', icon: Receipt },
            { id: 'agencias_maritimas' as ModuleKey, label: 'Consulta Agências', icon: Building2 },
            { id: 'relatorios' as ModuleKey, label: 'Balancetes', icon: BarChart3 },
            { id: 'authentication' as ModuleKey, label: 'Meu Perfil', icon: KeyRound },
          ]
        }
      ]
    : [
        {
          title: t.sidebar.systemAndOverview,
          items: [
            { id: 'dashboard' as ModuleKey, label: t.sidebar.dashboard, icon: LayoutDashboard },
            { id: 'authentication' as ModuleKey, label: 'Minha Sessão & Perfil', icon: KeyRound },
            ...(isAdmin
              ? [{ id: 'utilizadores' as ModuleKey, label: t.sidebar.usersAndProfiles, icon: Users }]
              : []),
          ]
        },
        {
          title: t.sidebar.financesAndRevenue,
          items: [
            { id: 'facturacao' as ModuleKey, label: 'Faturação & Tarifas', icon: Receipt },
            { id: 'tesouraria' as ModuleKey, label: 'Caixa & Tesouraria', icon: Wallet },
            { id: 'receitas' as ModuleKey, label: t.sidebar.revenueRubrics, icon: TrendingUp },
          ]
        },
        {
          title: t.sidebar.portOperations,
          items: [
            { id: 'embarcacoes' as ModuleKey, label: t.sidebar.vessels, icon: Ship },
            { id: 'agencias_maritimas' as ModuleKey, label: t.sidebar.agencies, icon: Building2 },
            { id: 'armadores' as ModuleKey, label: t.sidebar.shipowners, icon: Briefcase },
            { id: 'atracacoes' as ModuleKey, label: t.sidebar.berthingAndCalls, icon: Anchor },
          ]
        },
        ...(isAdmin
          ? [
              {
                title: t.sidebar.regulationAndSafety,
                items: [
                  { id: 'inspeccoes' as ModuleKey, label: t.sidebar.inspections, icon: ClipboardCheck },
                  { id: 'certificados' as ModuleKey, label: t.sidebar.certificates, icon: Award },
                  { id: 'licencas' as ModuleKey, label: t.sidebar.licenses, icon: FileCheck2 },
                  { id: 'multas' as ModuleKey, label: t.sidebar.finesAndInfractions, icon: ShieldAlert },
                ]
              },
              {
                title: t.sidebar.administration,
                items: [
                  { id: 'relatorios' as ModuleKey, label: t.sidebar.reportsAndStats, icon: BarChart3 },
                  ...(isSuperAdmin
                    ? [
                        { id: 'auditoria' as ModuleKey, label: 'Auditoria Criptográfica', icon: ShieldCheck },
                      ]
                    : []),
                  { id: 'configuracao' as ModuleKey, label: t.sidebar.configuration, icon: Settings },
                ]
              }
            ]
          : [])
      ];

  return (
    <>
      {/* Mobile Drawer Backdrop Overlay */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      <aside
        id="nhominca-sidebar"
        className={`w-72 sm:w-64 flex flex-col shrink-0 transition-colors border-r ${
          theme === 'dark'
            ? 'bg-slate-900 border-slate-800'
            : 'bg-[#082B59] border-[#082B59] text-white'
        } ${
          isMobileOpen
            ? 'fixed inset-y-0 left-0 z-50 flex shadow-2xl animate-in slide-in-from-left duration-200'
            : 'hidden lg:flex'
        }`}
      >
        {/* Mobile Header Bar inside Sidebar Drawer */}
        <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-white/10 bg-black/10">
          <div className="flex items-center gap-2">
            <img
              src="/assets/aistudio/images__2__12a47efd.jpg"
              alt="IMP Logo"
              className="w-7 h-7 object-contain rounded-lg bg-white p-0.5"
            />
            <span className="font-extrabold text-sm tracking-tight text-white">Menu NHOMINCA</span>
          </div>
          <button
            onClick={onCloseMobile}
            className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
            title="Fechar menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      {/* SoD Active Role Indicator Bar */}
      <div
        className={`px-4 py-3 border-b text-xs flex items-center justify-between ${
          theme === 'dark'
            ? 'bg-slate-950/60 border-slate-800 text-slate-400'
            : 'bg-[#051E3E] border-blue-900 text-blue-200'
        }`}
      >
        <span className="text-[10px] uppercase font-mono font-bold tracking-wider">
          Segregação SoD
        </span>
        <span
          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
            isFaturacao
              ? 'bg-amber-500/20 text-amber-300'
              : isCaixa
              ? 'bg-emerald-500/20 text-emerald-300'
              : isSuperAdmin
              ? 'bg-purple-500/20 text-purple-300'
              : 'bg-blue-500/20 text-blue-300'
          }`}
        >
          {userRole.toUpperCase()}
        </span>
      </div>

      <div className="p-4 flex-1 space-y-6 overflow-y-auto">
        {navSections.map((section, sIdx) => (
          <div key={sIdx} className="space-y-1.5">
            <div
              className={`px-3 text-[11px] font-bold tracking-wider flex items-center justify-between ${
                theme === 'dark' ? 'text-slate-500 font-mono uppercase' : 'text-blue-200'
              }`}
            >
              <span className="truncate">{section.title}</span>
            </div>



            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeModule === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-item-${item.id}`}
                  onClick={() => onSelectModule(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? theme === 'dark'
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 font-bold'
                        : 'bg-[#F0F4F8] text-[#082B59] font-bold shadow-sm'
                      : theme === 'dark'
                      ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                      : 'text-blue-100/90 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isActive
                          ? theme === 'dark'
                            ? 'text-white'
                            : 'text-[#1677E8]'
                          : theme === 'dark'
                          ? 'text-slate-400'
                          : 'text-blue-200'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                        isActive
                          ? theme === 'dark'
                            ? 'bg-blue-700 text-white'
                            : 'bg-blue-100 text-[#082B59] font-bold'
                          : theme === 'dark'
                          ? 'bg-slate-800 text-slate-300'
                          : 'bg-blue-950/60 text-blue-200'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      <div
        className={`p-4 border-t text-xs flex items-center justify-between font-mono ${
          theme === 'dark'
            ? 'border-slate-800 text-slate-500 bg-slate-950/40'
            : 'border-blue-900/60 text-blue-300 bg-[#051E3E]'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <img
            src="/assets/aistudio/images__2__12a47efd.jpg"
            alt="NHOMINCA"
            className="w-6 h-6 object-contain rounded-full bg-white p-0.5 shadow-sm"
          />
          <div>
            <div className="text-[11px] font-bold">NHOMINCA • IMP</div>
            <div className="text-[10px] text-emerald-400">Sistema Integral v3.0</div>
          </div>
        </div>
        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
      </div>
    </aside>
    </>
  );
}
