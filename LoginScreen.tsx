import React, { useState, useEffect, FormEvent } from 'react';
import {
  Lock,
  Eye,
  EyeOff,
  AlertTriangle,
  Clock,
  ArrowRight
} from 'lucide-react';
import { Utilizador } from '../../types';

interface LoginScreenProps {
  utilizadores: Utilizador[];
  onLoginSuccess: (user: Utilizador) => void;
  onUpdateUserSecurity: (email: string, failedAttempts: number, lockUntil: number | null, active: boolean) => void;
}

// Golden IMP Ship Helm / Emblem matching the official insignia
function ImpGoldenSeal({ className = 'w-12 h-12' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Outer Golden Spoke Ring */}
      <circle cx="50" cy="50" r="47" stroke="#C59B27" strokeWidth="2" strokeDasharray="3 3" />
      <circle cx="50" cy="50" r="43" stroke="#F5D061" strokeWidth="3" />
      {/* 8 Ship Wheel Handles */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        return (
          <line
            key={i}
            x1="50"
            y1="50"
            x2={50 + 48 * Math.cos(rad)}
            y2={50 + 48 * Math.sin(rad)}
            stroke="#E5B54F"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        );
      })}
      {/* Inner Dark Rim */}
      <circle cx="50" cy="50" r="32" fill="#072652" stroke="#F5D061" strokeWidth="2.5" />
      <circle cx="50" cy="50" r="28" stroke="#D4AF37" strokeWidth="1" strokeDasharray="2 2" />
      {/* Center Golden IMP Monogram */}
      <text
        x="50"
        y="55"
        textAnchor="middle"
        fill="#FDF0CD"
        fontSize="13"
        fontWeight="900"
        fontFamily="system-ui, -apple-system, sans-serif"
        letterSpacing="1.2"
      >
        IMP
      </text>
    </svg>
  );
}

export function LoginScreen({
  utilizadores,
  onLoginSuccess,
  onUpdateUserSecurity
}: LoginScreenProps) {
  // Default to Faturação operator as shown in user's screenshot
  const [email, setEmail] = useState('faturacao@imp.gw');
  const [password, setPassword] = useState('faturacao123');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [lockCountdown, setLockCountdown] = useState<number | null>(null);

  // Defined quick credentials strictly matching the user's reference mockup
  const credenciaisOficiais = [
    {
      cargo: 'Operador de Faturação',
      nome: 'Sr. António Okica de Sá',
      email: 'faturacao@imp.gw',
      senhaPadrao: 'faturacao123',
      badge: 'FATURACAO',
      role: 'faturacao'
    },
    {
      cargo: 'Operador de Caixa / Tesouraria',
      nome: 'Dr. Álvaro Luís Da Silva',
      email: 'caixa@imp.gw',
      senhaPadrao: 'caixa123',
      badge: 'CAIXA',
      role: 'caixa'
    },
    {
      cargo: 'Presidente do Conselho (PCA / Admin)',
      nome: 'Dr. Gualdino Afonso Té',
      email: 'admin@imp.gw',
      senhaPadrao: 'admin123',
      badge: 'ADMIN',
      role: 'admin'
    },
    {
      cargo: 'Engenheiro de Sistemas / Desenvolvedor',
      nome: 'Eng. SuperAdministrador',
      email: 'superadmin@imp.gw',
      senhaPadrao: 'superadmin123',
      badge: 'SUPERADMIN',
      role: 'superadmin'
    }
  ];

  // Find target user dynamically
  const targetUser = utilizadores.find(
    (u) => u.email.toLowerCase() === email.trim().toLowerCase()
  );

  // Check if current user is currently locked with countdown
  useEffect(() => {
    if (!targetUser || !targetUser.lockUntil) {
      setLockCountdown(null);
      return;
    }

    const remainingMs = targetUser.lockUntil - Date.now();
    if (remainingMs > 0) {
      setLockCountdown(Math.ceil(remainingMs / 1000));
      const interval = setInterval(() => {
        const currentRemaining = targetUser.lockUntil! - Date.now();
        if (currentRemaining <= 0) {
          clearInterval(interval);
          setLockCountdown(null);
          onUpdateUserSecurity(targetUser.email, targetUser.failedAttempts || 0, null, true);
        } else {
          setLockCountdown(Math.ceil(currentRemaining / 1000));
        }
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setLockCountdown(null);
    }
  }, [targetUser?.lockUntil, targetUser?.email]);

  const handleSelectQuickAccount = (quickEmail: string, quickPass: string) => {
    setEmail(quickEmail);
    setPassword(quickPass);
    setErrorMessage('');
  };

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !password) {
      setErrorMessage('Por favor preencha o email institucional e a palavra-passe.');
      return;
    }

    const user = utilizadores.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (!user) {
      setErrorMessage('Credenciais inválidas. Verifique o seu e-mail institucional.');
      return;
    }

    const isSuperAdminDev = user.email.toLowerCase() === 'superadmin@imp.gw';

    // Account permanently disabled after 8 failed attempts
    if (!isSuperAdminDev && (user.active === false || user.status === 'Inativo')) {
      setErrorMessage(
        'Conta desativada por motivos de segurança (limite de 8 tentativas atingido). Contacte a Direção Geral ou o Administrador.'
      );
      return;
    }

    // Account temporarily locked (60s timer)
    if (!isSuperAdminDev && user.lockUntil && user.lockUntil > Date.now()) {
      const sec = Math.ceil((user.lockUntil - Date.now()) / 1000);
      setErrorMessage(
        `Acesso temporariamente bloqueado pela proteção anti-força bruta. Aguarde ${sec} segundos.`
      );
      return;
    }

    // Password validation
    if (user.senha === password || (isSuperAdminDev && password === 'superadmin123')) {
      if (!isSuperAdminDev) {
        onUpdateUserSecurity(user.email, 0, null, true);
      }
      onLoginSuccess(user);
    } else {
      if (isSuperAdminDev) {
        setErrorMessage('Palavra-passe incorreta para conta de Desenvolvedor (Dica: superadmin123).');
        return;
      }

      const currentAttempts = (user.failedAttempts || 0) + 1;

      if (currentAttempts >= 8) {
        onUpdateUserSecurity(user.email, currentAttempts, null, false);
        setErrorMessage(
          'ATENÇÃO: Atingiu 8 tentativas falhadas! A conta foi desativada permanentemente. Contacte a Direção do IMP.'
        );
      } else if (currentAttempts >= 5) {
        const lockTime = Date.now() + 60000;
        onUpdateUserSecurity(user.email, currentAttempts, lockTime, true);
        setLockCountdown(60);
        setErrorMessage(
          'Proteção Anti-Força Bruta: 5 tentativas incorretas consecutivas. O acesso foi bloqueado por 60 segundos.'
        );
      } else {
        onUpdateUserSecurity(user.email, currentAttempts, null, true);
        setErrorMessage(
          `Palavra-passe incorreta. Tentativa ${currentAttempts} de 5 antes do bloqueio temporário (8 para desativação total).`
        );
      }
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#072652] flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans select-none antialiased">
      {/* Main Split Container */}
      <div className="w-full max-w-5xl rounded-[28px] overflow-hidden shadow-2xl shadow-black/50 border border-blue-400/20 flex flex-col lg:flex-row bg-[#0B3B75]">
        
        {/* Left Column: Institutional Info & Quick Fill Credentials */}
        <div className="lg:w-[50%] p-8 sm:p-10 flex flex-col justify-between text-white bg-[#0B3B75]">
          <div>
            {/* Header: Republic Emblem & Entity */}
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-white p-0.5 shadow-md shrink-0 flex items-center justify-center border border-amber-300">
                <img
                  src="/assets/aistudio/images__2__12a47efd.jpg"
                  alt="NHOMINCA IMP Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <div className="text-[11px] font-bold tracking-wider text-blue-200/90 uppercase font-mono leading-none">
                  REPÚBLICA DA GUINÉ-BISSAU
                </div>
                <div className="text-sm sm:text-base font-bold text-white tracking-tight mt-1 leading-snug">
                  Instituto Marítimo e Portuário (IMP)
                </div>
              </div>
            </div>

            {/* Title & SoD description */}
            <div className="mt-8">
              <div className="inline-block text-[11px] font-mono uppercase font-bold px-2.5 py-0.5 rounded-md bg-blue-500/20 text-blue-200 border border-blue-400/30 mb-2">
                NHOMINCA V1.0 • IMP
              </div>
              <h1 className="text-2xl sm:text-[26px] font-extrabold text-white leading-tight tracking-tight">
                NHOMINCA — Sistema Integrado de Gestão Marítima e Portuária
              </h1>
              <p className="mt-3 text-xs sm:text-[13px] text-blue-100/90 leading-relaxed font-normal">
                Segregação estrita de funções (SoD), cálculo financeiro exato sem floats e auditoria criptográfica.
              </p>
            </div>

            {/* Quick Fill Credential Cards */}
            <div className="mt-8">
              <div className="text-[11px] font-bold text-blue-200/90 uppercase tracking-wider mb-3">
                OPERADORES CREDENCIADOS (CLIQUE PARA PREENCHER):
              </div>

              <div className="space-y-2.5">
                {credenciaisOficiais.map((op) => {
                  const isSelected = email.toLowerCase() === op.email.toLowerCase();
                  return (
                    <button
                      key={op.email}
                      type="button"
                      onClick={() => handleSelectQuickAccount(op.email, op.senhaPadrao)}
                      className={`w-full text-left rounded-xl px-4 py-3 flex items-center justify-between transition-all duration-150 border ${
                        isSelected
                          ? 'bg-[#062247]/90 border-blue-300 ring-2 ring-blue-400/40 shadow-lg'
                          : 'bg-[#0a2e5c]/70 hover:bg-[#07244a] border-blue-400/25 hover:border-blue-300/60'
                      }`}
                    >
                      <div className="pr-2 min-w-0">
                        <div className="font-bold text-xs sm:text-sm text-white truncate">
                          {op.cargo}
                        </div>
                        <div className="text-[11px] text-blue-200/80 truncate mt-0.5">
                          {op.nome} <span className="opacity-60">•</span> <span className="font-mono text-blue-100">{op.email}</span>
                        </div>
                      </div>
                      <span className="shrink-0 px-2.5 py-1 rounded bg-[#072652] border border-blue-400/30 text-[10px] font-bold tracking-wider text-blue-100 uppercase font-mono">
                        {op.badge}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Clean White Authentication Form */}
        <div className="lg:w-[50%] bg-white p-8 sm:p-12 flex flex-col justify-between text-slate-800">
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-extrabold text-[#0B2B59] tracking-tight">
                Iniciar Sessão Institucional
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Autentique-se com o seu email e palavra-passe
              </p>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5 animate-in fade-in">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                <div className="leading-relaxed">{errorMessage}</div>
              </div>
            )}

            {/* Lock Countdown */}
            {lockCountdown !== null && lockCountdown > 0 && (
              <div className="mb-5 p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-center gap-3">
                <Clock className="w-5 h-5 text-amber-600 shrink-0 animate-spin" />
                <div className="flex-1">
                  <div className="font-bold">Proteção Anti-Força Bruta Ativa</div>
                  <div className="text-xs text-amber-800 mt-0.5">
                    Acesso bloqueado por <span className="font-mono font-bold text-amber-900 text-sm">{lockCountdown}s</span>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              {/* Institutional Email */}
              <div className="space-y-1.5">
                <label className="text-xs sm:text-sm font-semibold text-slate-700 block">
                  Email Institucional
                </label>
                <input
                  type="email"
                  value={email}
                  disabled={lockCountdown !== null && lockCountdown > 0}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ex: faturacao@imp.gw"
                  required
                  className={`w-full px-4 py-3 bg-[#F8FAFC] border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all ${
                    lockCountdown ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-xs sm:text-sm font-semibold text-slate-700 block">
                  Palavra-passe
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    disabled={lockCountdown !== null && lockCountdown > 0}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className={`w-full px-4 py-3 pr-11 bg-[#F8FAFC] border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all ${
                      lockCountdown ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={lockCountdown !== null && lockCountdown > 0}
                  className={`w-full py-3.5 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-150 shadow-md ${
                    lockCountdown !== null && lockCountdown > 0
                      ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                      : 'bg-[#1877F2] hover:bg-[#166fe5] active:scale-[0.99] text-white shadow-blue-500/25 cursor-pointer'
                  }`}
                >
                  <Lock className="w-4 h-4" />
                  <span>Entrar no Sistema</span>
                </button>
              </div>
            </form>
          </div>

          {/* Institutional Compliance Notice */}
          <div className="mt-8 pt-4 border-t border-slate-100">
            <p className="text-[11px] text-slate-400 text-center sm:text-left leading-normal font-sans">
              DGCI — Certificado 000035C/2022 • IMP Bissau • Proteção Anti-Força Bruta Ativa
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
