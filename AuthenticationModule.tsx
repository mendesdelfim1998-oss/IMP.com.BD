import { useState, FormEvent, ChangeEvent } from 'react';
import {
  KeyRound,
  User,
  Lock,
  Unlock,
  CheckCircle2,
  AlertCircle,
  History,
  RefreshCw,
  Camera,
  Mail,
  Upload,
  Check,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  Shield
} from 'lucide-react';
import { LogAcessoAutenticacao, Utilizador } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { resizeAvatarImage } from '../../utils/imageResize';

interface AuthenticationModuleProps {
  currentUser: Utilizador;
  logs: LogAcessoAutenticacao[];
  onSwitchUser: (role: string) => void;
  onUpdateUser?: (updated: Utilizador) => void;
  onClearLogs?: () => void;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=256&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&q=80',
];

export function AuthenticationModule({ currentUser, logs, onSwitchUser, onUpdateUser, onClearLogs }: AuthenticationModuleProps) {
  const { theme } = useTheme();

  const userRole = (currentUser?.role || currentUser?.funcao || '').toLowerCase();
  const isAdminOrSuper = userRole === 'admin' || userRole === 'admin_imp' || userRole === 'superadmin';

  // Locked/Hidden option states (hidden until clicked)
  const [photoUnlocked, setPhotoUnlocked] = useState(false);
  const [emailUnlocked, setEmailUnlocked] = useState(false);
  const [passwordUnlocked, setPasswordUnlocked] = useState(false);

  const [newPhoto, setNewPhoto] = useState(currentUser.avatar || currentUser.fotoUrl || '');
  const [newEmail, setNewEmail] = useState(currentUser.email);

  const [passwordForm, setPasswordForm] = useState({
    atual: '',
    nova: '',
    confirmacao: ''
  });
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handlePhotoUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const resized = await resizeAvatarImage(file, 300);
      setNewPhoto(resized);
    } catch {
      setErrorMsg('Erro ao processar imagem.');
    }
  };

  const handleSavePhoto = () => {
    if (!newPhoto) return;
    if (onUpdateUser) {
      onUpdateUser({ ...currentUser, avatar: newPhoto, fotoUrl: newPhoto });
    }
    setPhotoUnlocked(false);
    setSuccessMsg('Fotografia de perfil atualizada!');
    setTimeout(() => setSuccessMsg(''), 3500);
  };

  const handleSaveEmail = (e: FormEvent) => {
    e.preventDefault();
    if (!newEmail || !newEmail.includes('@')) {
      setErrorMsg('E-mail institucional inválido');
      return;
    }
    if (onUpdateUser) {
      onUpdateUser({ ...currentUser, email: newEmail.trim().toLowerCase() });
    }
    setEmailUnlocked(false);
    setSuccessMsg('E-mail institucional atualizado!');
    setTimeout(() => setSuccessMsg(''), 3500);
  };

  const handlePasswordChange = (e: FormEvent) => {
    e.preventDefault();
    if (!passwordForm.nova) {
      setErrorMsg('Por favor introduza a nova palavra-passe.');
      return;
    }
    if (passwordForm.nova.length < 6) {
      setErrorMsg('A palavra-passe deve conter pelo menos 6 caracteres.');
      return;
    }
    if (passwordForm.nova !== passwordForm.confirmacao) {
      setErrorMsg('As palavras-passe não coincidem! Verifique a confirmação.');
      return;
    }
    if (onUpdateUser) {
      onUpdateUser({ ...currentUser, senha: passwordForm.nova });
    }
    setErrorMsg('');
    setSuccessMsg('Palavra-passe alterada e cifrada com sucesso!');
    setPasswordForm({ atual: '', nova: '', confirmacao: '' });
    setPasswordUnlocked(false);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <div id="authentication-module" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className={`text-xl font-bold tracking-tight flex items-center gap-2 ${
            theme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}>
            <KeyRound className="w-5 h-5 text-blue-500" />
            Autenticação, Gestão de Sessão & Controlo de Acesso
          </h2>
          <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
            Identificação de utilizadores, privilégios de segurança RBAC e histórico de acessos
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Session Info & Switcher */}
        <div className={`p-5 rounded-2xl border space-y-4 ${
          theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/90 shadow-sm'
        }`}>
          <div className={`flex items-center gap-3 border-b pb-3 ${
            theme === 'dark' ? 'border-slate-800' : 'border-slate-200'
          }`}>
            <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-500 overflow-hidden shrink-0">
              {currentUser.fotoUrl || currentUser.avatar ? (
                <img src={currentUser.fotoUrl || currentUser.avatar} alt={currentUser.nome} className="w-full h-full object-cover" />
              ) : (
                <User className="w-6 h-6" />
              )}
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded border border-blue-500/20 font-bold">
                Sessão Activa
              </span>
              <h3 className={`font-bold text-base mt-1 ${
                theme === 'dark' ? 'text-white' : 'text-slate-900'
              }`}>{currentUser.nome}</h3>
              <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>{currentUser.cargo}</p>
            </div>
          </div>

          <div className={`space-y-2 text-xs font-mono p-3 rounded-xl border ${
            theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex justify-between">
              <span className="text-slate-500">EMAIL:</span>
              <span className={theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}>{currentUser.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">DEPARTAMENTO:</span>
              <span className={theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}>{currentUser.departamento}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">PAPEL RBAC:</span>
              <span className="text-emerald-500 font-bold">{currentUser.role || currentUser.funcao}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">ÚLTIMO ACESSO:</span>
              <span className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}>{currentUser.ultimoAcesso}</span>
            </div>
          </div>
        </div>

        {/* Protected Settings Column (Foto, Email, Palavra-Passe - Locked/Hidden until clicked) */}
        <div className="space-y-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-blue-500" />
            <span>Configurações Protegidas de Perfil</span>
          </div>

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              {successMsg}
            </div>
          )}

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {errorMsg}
            </div>
          )}

          {/* 1. Fotografia de Perfil Card */}
          <div className={`rounded-2xl border transition-all ${
            theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/90 shadow-sm'
          }`}>
            <button
              type="button"
              onClick={() => {
                setPhotoUnlocked(!photoUnlocked);
                setErrorMsg('');
              }}
              className="w-full p-4 flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  photoUnlocked
                    ? 'bg-blue-500/10 text-blue-500'
                    : theme === 'dark' ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'
                }`}>
                  <Camera className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-xs flex items-center gap-2">
                    <span>Fotografia de Perfil</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold border border-slate-700/40 text-slate-400">
                      {photoUnlocked ? 'Em Edição' : 'Bloqueado'}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {photoUnlocked
                      ? 'Selecione uma fotografia ou carregue nova imagem'
                      : '🔒 Clique para desbloquear e alterar fotografia'}
                  </div>
                </div>
              </div>

              <span className={`text-[11px] font-mono font-semibold px-2.5 py-1 rounded-lg border flex items-center gap-1.5 ${
                photoUnlocked
                  ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30'
                  : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
              }`}>
                {photoUnlocked ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                <span>{photoUnlocked ? 'Desbloqueado' : 'Bloqueado'}</span>
              </span>
            </button>

            {photoUnlocked && (
              <div className="p-4 pt-1 border-t border-slate-800/60 space-y-3">
                <div className="flex items-center gap-3 pt-2">
                  <div className="w-14 h-14 rounded-xl overflow-hidden border border-blue-500/40 shrink-0 bg-slate-800 flex items-center justify-center">
                    {newPhoto ? (
                      <img src={newPhoto} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-6 h-6 text-slate-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <label className="flex items-center justify-center gap-2 px-3 py-1.5 rounded-xl border border-dashed border-blue-500/40 hover:border-blue-500 cursor-pointer bg-blue-500/5 hover:bg-blue-500/10 text-blue-500 font-semibold text-xs">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Carregar Ficheiro</span>
                      <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                    </label>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {PRESET_AVATARS.map((url, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setNewPhoto(url)}
                      className={`w-8 h-8 rounded-lg overflow-hidden border-2 ${
                        newPhoto === url ? 'border-blue-500 ring-2 ring-blue-500/40' : 'border-slate-700 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={url} alt={`Preset ${i}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-800/40">
                  <button
                    type="button"
                    onClick={() => {
                      setNewPhoto(currentUser.avatar || currentUser.fotoUrl || '');
                      setPhotoUnlocked(false);
                    }}
                    className="px-3 py-1 text-xs text-slate-400 hover:text-white"
                  >
                    Bloquear
                  </button>
                  <button
                    type="button"
                    onClick={handleSavePhoto}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold"
                  >
                    Guardar Foto
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 2. E-mail Institucional Card */}
          <div className={`rounded-2xl border transition-all ${
            theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/90 shadow-sm'
          }`}>
            <button
              type="button"
              onClick={() => {
                setEmailUnlocked(!emailUnlocked);
                setErrorMsg('');
              }}
              className="w-full p-4 flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  emailUnlocked
                    ? 'bg-blue-500/10 text-blue-500'
                    : theme === 'dark' ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'
                }`}>
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-xs flex items-center gap-2">
                    <span>E-mail Institucional</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold border border-slate-700/40 text-slate-400">
                      {emailUnlocked ? 'Em Edição' : 'Bloqueado'}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {emailUnlocked
                      ? 'Introduza o novo e-mail'
                      : `🔒 ${currentUser.email} (Clique para desbloquear)`}
                  </div>
                </div>
              </div>

              <span className={`text-[11px] font-mono font-semibold px-2.5 py-1 rounded-lg border flex items-center gap-1.5 ${
                emailUnlocked
                  ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30'
                  : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
              }`}>
                {emailUnlocked ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                <span>{emailUnlocked ? 'Desbloqueado' : 'Bloqueado'}</span>
              </span>
            </button>

            {emailUnlocked && (
              <form onSubmit={handleSaveEmail} className="p-4 pt-1 border-t border-slate-800/60 space-y-3">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-300">
                    Novo E-mail:
                  </label>
                  <input
                    type="email"
                    required
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className={`w-full rounded-xl px-3 py-2 text-xs border outline-none font-mono ${
                      theme === 'dark'
                        ? 'bg-slate-950 border-slate-800 text-white focus:border-blue-500'
                        : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-500'
                    }`}
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2 border-t border-slate-800/40">
                  <button
                    type="button"
                    onClick={() => {
                      setNewEmail(currentUser.email);
                      setEmailUnlocked(false);
                    }}
                    className="px-3 py-1 text-xs text-slate-400 hover:text-white"
                  >
                    Bloquear
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold"
                  >
                    Atualizar E-mail
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* 3. Palavra-Passe com 2 Confirmações Card */}
          <div className={`p-5 rounded-2xl border space-y-4 ${
            theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/90 shadow-sm'
          }`}>
            <button
              type="button"
              onClick={() => {
                setPasswordUnlocked(!passwordUnlocked);
                setErrorMsg('');
              }}
              className="w-full flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-500" />
                <span className={`font-bold text-sm ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  Palavra-Passe & Senha
                </span>
              </div>
              <span className={`text-[11px] font-mono font-semibold px-2.5 py-1 rounded-lg border flex items-center gap-1.5 ${
                passwordUnlocked
                  ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30'
                  : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
              }`}>
                {passwordUnlocked ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                <span>{passwordUnlocked ? 'Desbloqueado' : 'Clique p/ Desbloquear'}</span>
              </span>
            </button>

            {!passwordUnlocked ? (
              <div
                onClick={() => setPasswordUnlocked(true)}
                className={`p-3 rounded-xl border border-dashed cursor-pointer text-xs text-center ${
                  theme === 'dark' ? 'border-slate-800 text-slate-400 hover:bg-slate-800/40' : 'border-slate-300 text-slate-600 hover:bg-slate-50'
                }`}
              >
                🔒 Palavra-passe protegida com cifra segura. Clique para desbloquear e alterar.
              </div>
            ) : (
              <form onSubmit={handlePasswordChange} className="space-y-3 text-xs pt-2 border-t border-slate-800/60 animate-in slide-in-from-top-2">
                <div>
                  <label className={`block mb-1 font-semibold ${theme === 'dark' ? 'text-slate-400' : 'text-slate-700'}`}>
                    Palavra-passe Actual:
                  </label>
                  <input
                    type="password"
                    value={passwordForm.atual}
                    onChange={(e) => setPasswordForm({ ...passwordForm, atual: e.target.value })}
                    placeholder="••••••••"
                    className={`w-full rounded-xl px-3 py-2 border outline-none font-mono ${
                      theme === 'dark'
                        ? 'bg-slate-950 border-slate-800 text-white focus:border-blue-500'
                        : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-500'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block mb-1 font-semibold ${theme === 'dark' ? 'text-slate-400' : 'text-slate-700'}`}>
                    Nova Palavra-passe:
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPass ? 'text' : 'password'}
                      required
                      value={passwordForm.nova}
                      onChange={(e) => setPasswordForm({ ...passwordForm, nova: e.target.value })}
                      placeholder="Mínimo 6 caracteres"
                      className={`w-full rounded-xl pl-3 pr-9 py-2 border outline-none font-mono ${
                        theme === 'dark'
                          ? 'bg-slate-950 border-slate-800 text-white focus:border-blue-500'
                          : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-500'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPass(!showNewPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                    >
                      {showNewPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className={`block mb-1 font-semibold ${theme === 'dark' ? 'text-slate-400' : 'text-slate-700'}`}>
                    Confirmar Nova Palavra-passe (2.ª vez):
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPass ? 'text' : 'password'}
                      required
                      value={passwordForm.confirmacao}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmacao: e.target.value })}
                      placeholder="Repita a nova palavra-passe"
                      className={`w-full rounded-xl pl-3 pr-9 py-2 border outline-none font-mono ${
                        theme === 'dark'
                          ? 'bg-slate-950 border-slate-800 text-white focus:border-blue-500'
                          : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-500'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPass(!showConfirmPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                    >
                      {showConfirmPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  {passwordForm.nova && passwordForm.confirmacao && (
                    <div className="mt-1 text-[11px]">
                      {passwordForm.nova === passwordForm.confirmacao ? (
                        <span className="text-emerald-500 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Palavras-passe coincidem
                        </span>
                      ) : (
                        <span className="text-rose-500 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          Palavras-passe não coincidem
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-800/40">
                  <button
                    type="button"
                    onClick={() => {
                      setPasswordForm({ atual: '', nova: '', confirmacao: '' });
                      setPasswordUnlocked(false);
                    }}
                    className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                  >
                    Bloquear
                  </button>
                  <button
                    type="submit"
                    disabled={!passwordForm.nova || passwordForm.nova !== passwordForm.confirmacao}
                    className={`py-2 px-4 text-white rounded-xl font-semibold shadow-md transition-colors ${
                      !passwordForm.nova || passwordForm.nova !== passwordForm.confirmacao
                        ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-500'
                    }`}
                  >
                    Guardar Palavra-Passe
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Audit Log / History (Admin & SuperAdmin only) */}
        {isAdminOrSuper && (
          <div className={`p-5 rounded-2xl border space-y-4 ${
            theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/90 shadow-sm'
          }`}>
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className={`font-bold text-sm flex items-center gap-2 ${
                theme === 'dark' ? 'text-white' : 'text-slate-900'
              }`}>
                <History className="w-4 h-4 text-amber-500" />
                Registos de Acesso & Auditoria (Audit Trail)
              </h3>
              {onClearLogs && (
                <button
                  type="button"
                  onClick={onClearLogs}
                  className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 transition-all border border-rose-500/30"
                >
                  Limpar Registos
                </button>
              )}
            </div>

            <div className="space-y-3 text-xs max-h-[400px] overflow-y-auto pr-1">
              {logs.length === 0 ? (
                <div className="text-center py-6 text-slate-400 text-xs italic">
                  Nenhum registo encontrado.
                </div>
              ) : (
                logs.map((log) => (
                  <div
                    key={log.id}
                    className={`p-3 rounded-xl border space-y-1 ${
                      theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className={`flex items-center justify-between font-semibold ${
                      theme === 'dark' ? 'text-white' : 'text-slate-900'
                    }`}>
                      <span>{log.utilizadorNome}</span>
                      <span className="text-[10px] font-mono text-emerald-500">{log.acao}</span>
                    </div>
                    <div className={`text-[11px] font-mono flex justify-between ${
                      theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      <span>📅 {log.dataHora}</span>
                      <span className="text-slate-500">IP: {log.ipOrigem}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 truncate">{log.dispositivo}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
