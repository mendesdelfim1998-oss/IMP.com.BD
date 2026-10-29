import { useState, useEffect, lazy, Suspense } from 'react';
import { Header } from './components/layout/Header';
import { Sidebar, ModuleKey } from './components/layout/Sidebar';
import { LoginScreen } from './components/auth/LoginScreen';
import { ProfileModal } from './components/auth/ProfileModal';

import {
  mockUtilizadores,
  mockArmadores,
  mockAgencias,
  mockPortos,
  mockEmbarcacoes,
  mockAtracacoes,
  mockTaxas,
  mockRubricasReceitas,
  mockLogsAutenticacao,
  mockConfiguracaoServidor,
  mockInspeccoes,
  mockCertificados,
  mockLicencas,
  mockMultas,
  mockFaturasIMP,
  mockRecibosIMP,
  mockCaixaMovs,
  mockAuditoriaLogs
} from './mock/data';

const AuthenticationModule = lazy(() => import('./components/modules/AuthenticationModule').then(m => ({ default: m.AuthenticationModule })));
const DashboardModule = lazy(() => import('./components/modules/DashboardModule').then(m => ({ default: m.DashboardModule })));
const UtilizadoresModule = lazy(() => import('./components/modules/UtilizadoresModule').then(m => ({ default: m.UtilizadoresModule })));
const EmbarcacoesModule = lazy(() => import('./components/modules/EmbarcacoesModule').then(m => ({ default: m.EmbarcacoesModule })));
const AgenciasMaritimasModule = lazy(() => import('./components/modules/AgenciasMaritimasModule').then(m => ({ default: m.AgenciasMaritimasModule })));
const ArmadoresModule = lazy(() => import('./components/modules/ArmadoresModule').then(m => ({ default: m.ArmadoresModule })));
const PortosModule = lazy(() => import('./components/modules/PortosModule').then(m => ({ default: m.PortosModule })));
const AtracacoesModule = lazy(() => import('./components/modules/AtracacoesModule').then(m => ({ default: m.AtracacoesModule })));
const FacturacaoModule = lazy(() => import('./components/modules/FacturacaoModule').then(m => ({ default: m.FacturacaoModule })));
const TesourariaModule = lazy(() => import('./components/modules/TesourariaModule').then(m => ({ default: m.TesourariaModule })));
const ReceitasModule = lazy(() => import('./components/modules/ReceitasModule').then(m => ({ default: m.ReceitasModule })));
const InspeccoesModule = lazy(() => import('./components/modules/InspeccoesModule').then(m => ({ default: m.InspeccoesModule })));
const CertificadosModule = lazy(() => import('./components/modules/CertificadosModule').then(m => ({ default: m.CertificadosModule })));
const LicencasModule = lazy(() => import('./components/modules/LicencasModule').then(m => ({ default: m.LicencasModule })));
const MultasModule = lazy(() => import('./components/modules/MultasModule').then(m => ({ default: m.MultasModule })));
const RelatoriosModule = lazy(() => import('./components/modules/RelatoriosModule').then(m => ({ default: m.RelatoriosModule })));
const ConfiguracaoModule = lazy(() => import('./components/modules/ConfiguracaoModule').then(m => ({ default: m.ConfiguracaoModule })));
const AuditoriaModule = lazy(() => import('./components/modules/AuditoriaModule').then(m => ({ default: m.AuditoriaModule })));

import {
  AgenciaMaritima,
  Armador,
  Atracacao,
  CertificadoMaritimo,
  Embarcacao,
  Inspeccao,
  LicencaNavegacao,
  MultaInfracao,
  RubricaReceita,
  Utilizador,
  FaturaIMP,
  ReciboIMP,
  CaixaMov,
  AuditoriaLog,
  LogAcessoAutenticacao
} from './types';
import { useTheme } from './context/ThemeContext';
import { calculateSha256 } from './utils/cryptoAudit';

export default function App() {
  const { theme } = useTheme();

  // Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [utilizadores, setUtilizadores] = useState<Utilizador[]>(mockUtilizadores);
  const [currentUserId, setCurrentUserId] = useState<string>('USR-FAT'); // Default to Faturação operator as shown in screenshot

  const currentUser = utilizadores.find((u) => u.id === currentUserId) || utilizadores[0];

  // Active module
  const [activeModule, setActiveModule] = useState<ModuleKey>('dashboard');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Domain State (Prompt Mestre v3.0)
  const [faturas, setFaturas] = useState<FaturaIMP[]>(mockFaturasIMP);
  const [recibos, setRecibos] = useState<ReciboIMP[]>(mockRecibosIMP);
  const [movimentos, setMovimentos] = useState<CaixaMov[]>(mockCaixaMovs);
  const [auditoriaLogs, setAuditoriaLogs] = useState<AuditoriaLog[]>(mockAuditoriaLogs);
  const [authLogs, setAuthLogs] = useState<LogAcessoAutenticacao[]>(mockLogsAutenticacao);

  // Other port domain state
  const [embarcacoes, setEmbarcacoes] = useState<Embarcacao[]>(mockEmbarcacoes);
  const [agencias, setAgencias] = useState<AgenciaMaritima[]>(mockAgencias);
  const [armadores, setArmadores] = useState<Armador[]>(mockArmadores);
  const [portos] = useState(mockPortos);
  const [atracacoes, setAtracacoes] = useState<Atracacao[]>(mockAtracacoes);
  const [rubricas] = useState<RubricaReceita[]>(mockRubricasReceitas);
  const [inspeccoes, setInspeccoes] = useState<Inspeccao[]>(mockInspeccoes);
  const [certificados, setCertificados] = useState<CertificadoMaritimo[]>(mockCertificados);
  const [licencas, setLicencas] = useState<LicencaNavegacao[]>(mockLicencas);
  const [multas, setMultas] = useState<MultaInfracao[]>(mockMultas);

  // Segregation of Duties (SoD) Enforcer
  useEffect(() => {
    const role = currentUser.role || currentUser.funcao;
    // Faturacao must never access tesouraria / caixa
    if (role === 'faturacao' && activeModule === 'tesouraria') {
      setActiveModule('facturacao');
    }
    // Caixa should not be on configuracao or auditoria
    if (role === 'caixa' && (activeModule === 'configuracao' || activeModule === 'auditoria')) {
      setActiveModule('tesouraria');
    }
  }, [currentUser, activeModule]);

  // Append Chained SHA-256 Audit Log
  const recordAuditAction = async (acao: string, tabela: string, itemId: string, payload: any) => {
    const prevLog = auditoriaLogs[auditoriaLogs.length - 1];
    const prevHash = prevLog ? prevLog.hash_sha256 : '0000000000000000000000000000000000000000000000000000000000000000';
    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
    const payloadStr = JSON.stringify(payload);

    const dataToHash = `${prevHash}|${timestamp}|${currentUser.id}|${acao}|${tabela}|${itemId}|${payloadStr}`;
    const hash = await calculateSha256(dataToHash);

    const newLog: AuditoriaLog = {
      id: `AUD-${String(auditoriaLogs.length + 1).padStart(3, '0')}`,
      timestamp,
      user_id: currentUser.id,
      user_email: currentUser.email,
      acao,
      tabela,
      item_id: itemId,
      payload_json: payloadStr,
      prev_hash: prevHash,
      hash_sha256: hash
    };

    setAuditoriaLogs((prev) => [...prev, newLog]);
  };

  // Faturação Handlers
  const handleAddFatura = (novaFatura: FaturaIMP) => {
    const faturaComSaldos: FaturaIMP = {
      ...novaFatura,
      saldo_pago: 0,
      saldo_pendente: novaFatura.total,
      recibos: []
    };
    setFaturas([faturaComSaldos, ...faturas]);
    recordAuditAction('EMITIR_FATURA', 'FATURAS', novaFatura.nFatura, {
      cliente: novaFatura.cliente,
      navio: novaFatura.navio,
      total: novaFatura.total,
      estado: novaFatura.estado
    });
  };

  const handleUpdateFatura = (faturaActualizada: FaturaIMP) => {
    setFaturas(faturas.map((f) => (f.id === faturaActualizada.id ? faturaActualizada : f)));
    recordAuditAction('EDITAR_RASCUNHO_FATURA', 'FATURAS', faturaActualizada.nFatura, {
      total: faturaActualizada.total,
      estado: faturaActualizada.estado
    });
  };

  const handleConfirmFatura = (faturaId: string) => {
    setFaturas(
      faturas.map((f) => (f.id === faturaId ? { ...f, estado: 'confirmada' } : f))
    );
    recordAuditAction('CONFIRMAR_FATURA', 'FATURAS', faturaId, {
      estadoAnterior: 'rascunho',
      novoEstado: 'confirmada'
    });
  };

  const handleAnularFatura = (faturaId: string, justificativa: string) => {
    const dataAnulacao = new Date().toISOString().replace('T', ' ').slice(0, 16);
    setFaturas(
      faturas.map((f) =>
        f.id === faturaId
          ? {
              ...f,
              estado: 'anulada',
              justificativaAnulacao: justificativa,
              anulado_por: currentUser.nome,
              data_anulacao: dataAnulacao
            }
          : f
      )
    );
    recordAuditAction('ANULAR_FATURA_PCA', 'FATURAS', faturaId, {
      justificativa,
      anulado_por: currentUser.nome,
      data_anulacao: dataAnulacao
    });
  };

  // Caixa & Tesouraria Handlers
  const handleLiquidateFatura = (faturaId: string, novoRecibo: ReciboIMP, novoMov: CaixaMov) => {
    // 1. Update fatura balance and status (full vs partial liquidation)
    setFaturas(
      faturas.map((f) => {
        if (f.id !== faturaId) return f;
        const novoSaldoPago = (f.saldo_pago || 0) + novoRecibo.valor;
        const novoSaldoPendente = Math.max(0, f.total - novoSaldoPago);
        const novoEstado = novoSaldoPendente === 0 ? 'paga' : 'parcial';
        const listaRecibos = f.recibos ? [...f.recibos, novoRecibo.nRecibo] : [novoRecibo.nRecibo];
        return {
          ...f,
          saldo_pago: novoSaldoPago,
          saldo_pendente: novoSaldoPendente,
          estado: novoEstado,
          recibos: listaRecibos
        };
      })
    );
    // 2. Add receipt
    setRecibos([novoRecibo, ...recibos]);
    // 3. Register cash ledger movement
    setMovimentos([...movimentos, novoMov]);

    recordAuditAction(
      novoRecibo.isLiquidacaoTotal ? 'LIQUIDAR_FATURA_CAIXA_TOTAL' : 'AMORTIZAR_FATURA_CAIXA_PARCIAL',
      'RECIBOS',
      novoRecibo.nRecibo,
      {
        fatura_id: faturaId,
        totalFatura: novoRecibo.totalFatura,
        valorPago: novoRecibo.valor,
        saldoRestante: novoRecibo.saldoRestante,
        banco: novoRecibo.banco,
        talao: novoRecibo.talao
      }
    );
  };

  const handleAddCaixaMovimento = (novoMov: CaixaMov) => {
    setMovimentos([...movimentos, novoMov]);
    recordAuditAction('LANCAMENTO_FOLHA_CAIXA', 'CAIXA_MOV', novoMov.id, {
      tipo: novoMov.tipo,
      valor: novoMov.valor,
      categoria: novoMov.categoria,
      descricao: novoMov.descricao
    });
  };

  // User Profile & Status Handlers
  const handleUpdateUtilizador = (usuarioActualizado: Utilizador) => {
    setUtilizadores(
      utilizadores.map((u) => (u.id === usuarioActualizado.id ? usuarioActualizado : u))
    );
    recordAuditAction('ATUALIZAR_PERFIL_UTILIZADOR', 'USUARIOS', usuarioActualizado.id, {
      nome: usuarioActualizado.nome,
      email: usuarioActualizado.email,
      cargo: usuarioActualizado.cargo,
      genero: usuarioActualizado.gender
    });
  };

  const handleToggleUserStatus = (id: string) => {
    const userToToggle = utilizadores.find((u) => u.id === id);
    if (!userToToggle) return;
    const novoStatus = userToToggle.status === 'Ativo' ? 'Inativo' : 'Ativo';
    const novoActive = novoStatus === 'Ativo';

    setUtilizadores(
      utilizadores.map((u) =>
        u.id === id ? { ...u, status: novoStatus, active: novoActive, failedAttempts: 0, lockUntil: null } : u
      )
    );

    recordAuditAction('ALTERAR_ESTADO_UTILIZADOR', 'USUARIOS', id, {
      novoStatus,
      email: userToToggle.email,
      alteradoPor: currentUser.nome
    });
  };

  const handleAddUtilizador = (novoUsuario: Utilizador) => {
    setUtilizadores([novoUsuario, ...utilizadores]);
    recordAuditAction('CRIAR_UTILIZADOR', 'USUARIOS', novoUsuario.id, {
      nome: novoUsuario.nome,
      email: novoUsuario.email,
      funcao: novoUsuario.funcao
    });
  };

  const handleUpdateUserSecurity = (
    email: string,
    failedAttempts: number,
    lockUntil: number | null,
    active: boolean
  ) => {
    setUtilizadores(
      utilizadores.map((u) =>
        u.email.toLowerCase() === email.toLowerCase()
          ? {
              ...u,
              failedAttempts,
              lockUntil,
              active,
              status: active ? 'Ativo' : 'Inativo'
            }
          : u
      )
    );
  };

  // Fast switch role or user
  const handleSelectRole = (roleOrEmail: string) => {
    const matched = utilizadores.find(
      (u) =>
        u.role === roleOrEmail ||
        u.funcao === roleOrEmail ||
        u.email.toLowerCase() === roleOrEmail.toLowerCase()
    );
    if (matched) {
      setCurrentUserId(matched.id);
      // Auto route to their main functional module
      if (matched.role === 'faturacao' || matched.funcao === 'faturacao') {
        setActiveModule('facturacao');
      } else if (matched.role === 'caixa' || matched.funcao === 'caixa') {
        setActiveModule('tesouraria');
      }
    }
  };

  // Logout handler -> returns to LoginScreen
  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const handleLoginSuccess = (user: Utilizador) => {
    setCurrentUserId(user.id);
    setIsLoggedIn(true);
    // Route to appropriate module based on SoD
    if (user.role === 'faturacao' || user.funcao === 'faturacao') {
      setActiveModule('facturacao');
    } else if (user.role === 'caixa' || user.funcao === 'caixa') {
      setActiveModule('tesouraria');
    } else {
      setActiveModule('dashboard');
    }
  };

  // If user is logged out, render the Login Screen
  if (!isLoggedIn) {
    return (
      <LoginScreen
        utilizadores={utilizadores}
        onLoginSuccess={handleLoginSuccess}
        onUpdateUserSecurity={handleUpdateUserSecurity}
      />
    );
  }

  // Other port handlers
  const handleAddEmbarcacao = (novaEmbarcacao: Embarcacao) => setEmbarcacoes([novaEmbarcacao, ...embarcacoes]);
  const handleAddAgencia = (novaAgencia: AgenciaMaritima) => setAgencias([novaAgencia, ...agencias]);
  const handleAddArmador = (novoArmador: Armador) => setArmadores([novoArmador, ...armadores]);
  const handleAddAtracacao = (novaAtracacao: Atracacao) => setAtracacoes([novaAtracacao, ...atracacoes]);
  const handleUpdateAtracacaoStatus = (id: string, newStatus: any) =>
    setAtracacoes(atracacoes.map((a) => (a.id === id ? { ...a, status: newStatus } : a)));
  const handleAddInspeccao = (novaInspeccao: Inspeccao) => setInspeccoes([novaInspeccao, ...inspeccoes]);
  const handleAddCertificado = (novoCertificado: CertificadoMaritimo) => setCertificados([novoCertificado, ...certificados]);
  const handleAddLicenca = (novaLicenca: LicencaNavegacao) => setLicencas([novaLicenca, ...licencas]);
  const handleAddMulta = (novaMulta: MultaInfracao) => setMultas([novaMulta, ...multas]);

  return (
    <div
      id="nhominca-app-container"
      className={`min-h-screen w-full max-w-full overflow-x-hidden font-sans flex flex-col transition-colors duration-200 ${
        theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-[#F0F4F8] text-slate-900'
      }`}
    >
      {/* Header with Republic Emblem, Active User, Theme Toggle & Logout */}
      <Header
        currentUser={currentUser}
        onSelectUserRole={handleSelectRole}
        onLogout={handleLogout}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
      />

      {/* User Profile & Security Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        currentUser={currentUser}
        onUpdateUser={handleUpdateUtilizador}
      />

      {/* Main Body with Sidebar */}
      <div className="flex-1 flex overflow-hidden w-full max-w-full min-w-0">
        <Sidebar
          activeModule={activeModule}
          currentUser={currentUser}
          onSelectModule={(mod) => {
            setActiveModule(mod);
            setIsMobileMenuOpen(false);
          }}
          isMobileOpen={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />

        {/* Content View Area */}
        <main
          id="nhominca-content-area"
          className={`flex-1 min-w-0 w-full max-w-full overflow-y-auto overflow-x-hidden p-3 sm:p-5 md:p-8 transition-colors ${
            theme === 'dark' ? 'bg-slate-950' : 'bg-[#F0F4F8]'
          }`}
        >
          <div className="w-full max-w-7xl mx-auto space-y-6 min-w-0">
            <Suspense fallback={
              <div className="flex flex-col items-center justify-center h-64 text-slate-400 space-y-2">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-xs font-mono">A carregar módulo do sistema...</span>
              </div>
            }>
              {/* 1. Dashboard Module */}
              {activeModule === 'dashboard' && (
                <DashboardModule
                  atracacoes={atracacoes}
                  embarcacoes={embarcacoes}
                  facturas={faturas as any}
                  inspeccoes={inspeccoes}
                  currentUser={currentUser}
                  onNavigate={(mod) => setActiveModule(mod)}
                />
              )}

              {/* 2. Authentication & Session Module */}
              {activeModule === 'authentication' && (
                <AuthenticationModule
                  currentUser={currentUser}
                  logs={authLogs}
                  onSwitchUser={(role) => handleSelectRole(role)}
                  onUpdateUser={handleUpdateUtilizador}
                  onClearLogs={() => setAuthLogs([])}
                />
              )}

              {/* 3. Faturação Module (Full Prompt Mestre v3.0) */}
              {activeModule === 'facturacao' && (
                <FacturacaoModule
                  faturas={faturas}
                  recibos={recibos}
                  taxas={mockTaxas}
                  embarcacoes={embarcacoes}
                  agencias={agencias}
                  currentUser={currentUser}
                  onAddFatura={handleAddFatura}
                  onUpdateFatura={handleUpdateFatura}
                  onConfirmFatura={handleConfirmFatura}
                  onAnularFatura={handleAnularFatura}
                  onNavigateToCaixa={() => setActiveModule('tesouraria')}
                  onNavigateToDashboard={() => setActiveModule('dashboard')}
                />
              )}

              {/* 4. Caixa & Tesouraria Module (Full Prompt Mestre v3.0) */}
              {activeModule === 'tesouraria' && (
                <TesourariaModule
                  faturas={faturas}
                  recibos={recibos}
                  movimentos={movimentos}
                  currentUser={currentUser}
                  onLiquidateFatura={handleLiquidateFatura}
                  onAddMovimento={handleAddCaixaMovimento}
                />
              )}

              {/* 5. Users & Profiles Module */}
              {activeModule === 'utilizadores' && (
                <UtilizadoresModule
                  utilizadores={utilizadores}
                  currentUser={currentUser}
                  onUpdateUtilizador={handleUpdateUtilizador}
                  onToggleUserStatus={handleToggleUserStatus}
                  onAddUtilizador={handleAddUtilizador}
                />
              )}

              {/* 6. Cryptographic Audit Module (SuperAdmin & PCA) */}
              {activeModule === 'auditoria' && (
                <AuditoriaModule logs={auditoriaLogs} />
              )}

              {/* 7. Port Operations Modules */}
              {activeModule === 'embarcacoes' && (
                <EmbarcacoesModule
                  embarcacoes={embarcacoes}
                  onAddEmbarcacao={handleAddEmbarcacao}
                />
              )}

              {activeModule === 'agencias_maritimas' && (
                <AgenciasMaritimasModule
                  agencias={agencias}
                  onAddAgencia={handleAddAgencia}
                />
              )}

              {activeModule === 'armadores' && (
                <ArmadoresModule
                  armadores={armadores}
                  onAddArmador={handleAddArmador}
                />
              )}

              {activeModule === 'portos' && (
                <PortosModule portos={portos} />
              )}

              {activeModule === 'atracacoes' && (
                <AtracacoesModule
                  atracacoes={atracacoes}
                  embarcacoes={embarcacoes}
                  portos={portos}
                  onAddAtracacao={handleAddAtracacao}
                  onUpdateStatus={handleUpdateAtracacaoStatus}
                />
              )}

              {activeModule === 'receitas' && (
                <ReceitasModule rubricas={rubricas} />
              )}

              {activeModule === 'inspeccoes' && (
                <InspeccoesModule
                  inspeccoes={inspeccoes}
                  onAddInspeccao={handleAddInspeccao}
                />
              )}

              {activeModule === 'certificados' && (
                <CertificadosModule
                  certificados={certificados}
                  onAddCertificado={handleAddCertificado}
                />
              )}

              {activeModule === 'licencas' && (
                <LicencasModule
                  licencas={licencas}
                  onAddLicenca={handleAddLicenca}
                />
              )}

              {activeModule === 'multas' && (
                <MultasModule
                  multas={multas}
                  onAddMulta={handleAddMulta}
                />
              )}

              {activeModule === 'relatorios' && (
                <RelatoriosModule />
              )}

              {activeModule === 'configuracao' && (
                <ConfiguracaoModule
                  taxas={mockTaxas}
                  servidor={mockConfiguracaoServidor}
                />
              )}
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  );
}
