import React, { useState, FormEvent, ChangeEvent } from 'react';
import {
  X,
  Lock,
  Unlock,
  Camera,
  Mail,
  KeyRound,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Shield,
  Upload,
  User,
  Check,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Utilizador } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { resizeAvatarImage } from '../../utils/imageResize';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: Utilizador;
  onUpdateUser: (updatedUser: Utilizador) => void;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=256&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&q=80',
];

export function ProfileModal({
  isOpen,
  onClose,
  currentUser,
  onUpdateUser
}: ProfileModalProps) {
  const { theme } = useTheme();

  // State to track which options are unlocked (initially all locked/hidden as requested)
  const [photoUnlocked, setPhotoUnlocked] = useState(false);
  const [emailUnlocked, setEmailUnlocked] = useState(false);
  const [passwordUnlocked, setPasswordUnlocked] = useState(false);

  // Form states
  const [newPhoto, setNewPhoto] = useState(currentUser.avatar || currentUser.fotoUrl || '');
  const [newEmail, setNewEmail] = useState(currentUser.email);
  
  // Password states (Current, New, Confirm New - 2 confirmation fields)
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  // Notifications inside modal
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  if (!isOpen) return null;

  // Handler for uploading local photo
  const handlePhotoUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const resizedBase64 = await resizeAvatarImage(file, 300);
      setNewPhoto(resizedBase64);
      setFeedback({ type: 'success', message: 'Fotografia carregada e otimizada com sucesso. Clique em Guardar para confirmar.' });
    } catch (err) {
      setFeedback({ type: 'error', message: 'Erro ao processar imagem de perfil. Tente outro ficheiro.' });
    }
  };

  // Save Photo handler
  const handleSavePhoto = () => {
    if (!newPhoto) {
      setFeedback({ type: 'error', message: 'Por favor seleccione ou introduza um URL de fotografia.' });
      return;
    }
    const updated: Utilizador = {
      ...currentUser,
      avatar: newPhoto,
      fotoUrl: newPhoto
    };
    onUpdateUser(updated);
    setPhotoUnlocked(false);
    setFeedback({ type: 'success', message: 'Fotografia de perfil atualizada com sucesso!' });
    setTimeout(() => setFeedback(null), 3500);
  };

  // Save Email handler
  const handleSaveEmail = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = newEmail.trim().toLowerCase();
    if (!trimmed || !trimmed.includes('@')) {
      setFeedback({ type: 'error', message: 'Por favor introduza um endereço de e-mail institucional válido.' });
      return;
    }
    const updated: Utilizador = {
      ...currentUser,
      email: trimmed
    };
    onUpdateUser(updated);
    setEmailUnlocked(false);
    setFeedback({ type: 'success', message: 'Endereço de e-mail atualizado com sucesso!' });
    setTimeout(() => setFeedback(null), 3500);
  };

  // Save Password handler (requires both new password and confirmation to match)
  const handleSavePassword = (e: FormEvent) => {
    e.preventDefault();
    if (!newPassword) {
      setFeedback({ type: 'error', message: 'Por favor preencha a nova palavra-passe.' });
      return;
    }
    if (newPassword.length < 6) {
      setFeedback({ type: 'error', message: 'A nova palavra-passe deve conter pelo menos 6 caracteres.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setFeedback({ type: 'error', message: 'A confirmação não coincide com a nova palavra-passe!' });
      return;
    }

    const updated: Utilizador = {
      ...currentUser,
      senha: newPassword
    };
    onUpdateUser(updated);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordUnlocked(false);
    setFeedback({ type: 'success', message: 'Palavra-passe alterada e cifrada com sucesso!' });
    setTimeout(() => setFeedback(null), 3500);
  };

  const getRoleBadge = (roleStr: string) => {
    switch (roleStr) {
      case 'superadmin':
        return <span className="text-[10px] uppercase font-mono px-2.5 py-0.5 rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/30 font-bold">SuperAdmin (Dev)</span>;
      case 'admin':
      case 'ADMIN_IMP':
        return <span className="text-[10px] uppercase font-mono px-2.5 py-0.5 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/30 font-bold">Diretor Geral / PCA</span>;
      case 'faturacao':
        return <span className="text-[10px] uppercase font-mono px-2.5 py-0.5 rounded-md bg-amber-500/10 text-amber-500 border border-amber-500/30 font-bold">Faturação</span>;
      case 'caixa':
      case 'TESOURARIA':
        return <span className="text-[10px] uppercase font-mono px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 font-bold">Caixa / Tesouraria</span>;
      default:
        return <span className="text-[10px] uppercase font-mono px-2.5 py-0.5 rounded-md bg-slate-500/10 text-slate-400 border border-slate-700 font-bold">{roleStr}</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className={`w-full max-w-2xl rounded-2xl shadow-2xl border flex flex-col max-h-[90vh] overflow-hidden ${
          theme === 'dark'
            ? 'bg-slate-900 border-slate-800 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Modal Header */}
        <div
          className={`px-6 py-4 border-b flex items-center justify-between ${
            theme === 'dark' ? 'border-slate-800 bg-slate-950/60' : 'border-slate-100 bg-slate-50'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-white border border-blue-200 flex items-center justify-center shadow-sm">
              <img
                src="/assets/aistudio/images__2__12a47efd.jpg"
                alt="Logo IMP"
                className="w-full h-full object-contain p-0.5"
              />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight flex items-center gap-2">
                <span>Perfil de Utilizador & Segurança</span>
                <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-500 border border-blue-500/20">
                  NHOMINCA
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Gestão individual de credenciais, e-mail e palavra-passe
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition-colors ${
              theme === 'dark'
                ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200'
            }`}
            title="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Feedback banner */}
          {feedback && (
            <div
              className={`p-3.5 rounded-xl border flex items-center gap-3 text-xs animate-in fade-in ${
                feedback.type === 'success'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500 font-medium'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-500 font-medium'
              }`}
            >
              {feedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              <span>{feedback.message}</span>
            </div>
          )}

          {/* User Overview Summary Card */}
          <div
            className={`p-4 rounded-xl border flex flex-col sm:flex-row items-center gap-4 ${
              theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-blue-500/30 shadow-md bg-blue-600/10 flex items-center justify-center">
                {currentUser.avatar || currentUser.fotoUrl ? (
                  <img
                    src={currentUser.avatar || currentUser.fotoUrl}
                    alt={currentUser.nome}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-8 h-8 text-blue-500" />
                )}
              </div>
              <span
                className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 ${
                  theme === 'dark' ? 'border-slate-950' : 'border-white'
                } ${currentUser.status === 'Inativo' ? 'bg-rose-500' : 'bg-emerald-500'}`}
                title={currentUser.status === 'Inativo' ? 'Conta Inativa' : 'Sessão Ativa'}
              />
            </div>

            <div className="text-center sm:text-left flex-1 min-w-0">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h3 className="font-bold text-base truncate">{currentUser.nome}</h3>
                {getRoleBadge(currentUser.role || currentUser.funcao || 'faturacao')}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {currentUser.cargo} • {currentUser.departamento || 'Instituto Marítimo Portuário'}
              </p>
              <div className="mt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3 text-[11px] font-mono text-slate-500">
                <span>ID: <strong className="text-slate-400">{currentUser.id}</strong></span>
                <span>•</span>
                <span>E-MAIL: <strong className="text-blue-500">{currentUser.email}</strong></span>
                <span>•</span>
                <span>ESTADO: <strong className="text-emerald-500">{currentUser.status || 'Ativo'}</strong></span>
              </div>
            </div>
          </div>

          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-blue-500" />
            <span>Configurações Protegidas de Segurança</span>
          </div>

          {/* OPTION 1: FOTOGRAFIA DE PERFIL */}
          <div
            className={`rounded-xl border transition-all ${
              theme === 'dark' ? 'bg-slate-950/70 border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            {/* Clickable Header: Unlocks when clicked */}
            <button
              type="button"
              onClick={() => {
                setPhotoUnlocked(!photoUnlocked);
                setFeedback(null);
              }}
              className={`w-full p-4 flex items-center justify-between text-left transition-colors rounded-xl ${
                photoUnlocked
                  ? theme === 'dark' ? 'bg-slate-800/40' : 'bg-slate-50'
                  : theme === 'dark' ? 'hover:bg-slate-900' : 'hover:bg-slate-50/80'
              }`}
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
                      ? 'Selecione uma fotografia oficial ou carregue do computador'
                      : '🔒 Clique em cima para desbloquear e alterar fotografia'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`text-[11px] font-mono font-semibold px-2.5 py-1 rounded-lg border flex items-center gap-1.5 ${
                  photoUnlocked
                    ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30'
                    : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                }`}>
                  {photoUnlocked ? (
                    <>
                      <Unlock className="w-3 h-3" />
                      <span>Desbloqueado</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-3 h-3" />
                      <span>Clique p/ desbloquear</span>
                    </>
                  )}
                </span>
                {photoUnlocked ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </div>
            </button>

            {/* Hidden / Collapsed Content: Revealed ONLY when unlocked */}
            {photoUnlocked && (
              <div className="p-4 pt-1 border-t border-slate-800/60 space-y-4 animate-in slide-in-from-top-2 duration-150">
                <div className="flex flex-col sm:flex-row items-center gap-4 pt-3">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-blue-500 shrink-0 bg-slate-800 flex items-center justify-center">
                    {newPhoto ? (
                      <img src={newPhoto} alt="Pré-visualização" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-8 h-8 text-slate-400" />
                    )}
                  </div>

                  <div className="flex-1 w-full space-y-2 text-xs">
                    <label className="block font-medium text-slate-300">
                      Carregar nova imagem do computador:
                    </label>
                    <label className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-dashed border-blue-500/40 hover:border-blue-500 cursor-pointer bg-blue-500/5 hover:bg-blue-500/10 transition-colors text-blue-400 font-semibold text-xs">
                      <Upload className="w-4 h-4" />
                      <span>Escolher Ficheiro (JPG, PNG)</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Preset Options */}
                <div>
                  <div className="text-[11px] font-semibold text-slate-400 mb-2">
                    Ou selecione um avatar predefinido do pessoal IMP:
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {PRESET_AVATARS.map((url, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setNewPhoto(url)}
                        className={`w-10 h-10 rounded-xl overflow-hidden border-2 transition-transform hover:scale-105 ${
                          newPhoto === url ? 'border-blue-500 ring-2 ring-blue-500/40' : 'border-slate-700 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={url} alt={`Preset ${idx}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-2 pt-2 border-t border-slate-800/40">
                  <button
                    type="button"
                    onClick={() => {
                      setNewPhoto(currentUser.avatar || currentUser.fotoUrl || '');
                      setPhotoUnlocked(false);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                      theme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Bloquear / Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleSavePhoto}
                    className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/20 flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Guardar Fotografia</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* OPTION 2: EMAIL INSTITUCIONAL */}
          <div
            className={`rounded-xl border transition-all ${
              theme === 'dark' ? 'bg-slate-950/70 border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            {/* Clickable Header: Unlocks when clicked */}
            <button
              type="button"
              onClick={() => {
                setEmailUnlocked(!emailUnlocked);
                setFeedback(null);
              }}
              className={`w-full p-4 flex items-center justify-between text-left transition-colors rounded-xl ${
                emailUnlocked
                  ? theme === 'dark' ? 'bg-slate-800/40' : 'bg-slate-50'
                  : theme === 'dark' ? 'hover:bg-slate-900' : 'hover:bg-slate-50/80'
              }`}
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
                      ? 'Altere o endereço associado aos registos e autenticação'
                      : `🔒 E-mail atual: ${currentUser.email} (Clique para desbloquear)`}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`text-[11px] font-mono font-semibold px-2.5 py-1 rounded-lg border flex items-center gap-1.5 ${
                  emailUnlocked
                    ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30'
                    : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                }`}>
                  {emailUnlocked ? (
                    <>
                      <Unlock className="w-3 h-3" />
                      <span>Desbloqueado</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-3 h-3" />
                      <span>Clique p/ desbloquear</span>
                    </>
                  )}
                </span>
                {emailUnlocked ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </div>
            </button>

            {/* Hidden / Collapsed Content: Revealed ONLY when unlocked */}
            {emailUnlocked && (
              <form onSubmit={handleSaveEmail} className="p-4 pt-1 border-t border-slate-800/60 space-y-3 animate-in slide-in-from-top-2 duration-150">
                <div className="pt-2">
                  <label className="block text-xs font-semibold mb-1 text-slate-300">
                    Novo E-mail Institucional (@imp.gw):
                  </label>
                  <input
                    type="email"
                    required
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="exemplo@imp.gw"
                    className={`w-full rounded-xl px-3.5 py-2 text-xs border outline-none font-mono ${
                      theme === 'dark'
                        ? 'bg-slate-900 border-slate-700 text-white focus:border-blue-500'
                        : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-500'
                    }`}
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Nota: O e-mail define a sua identidade nas assinaturas criptográficas de faturação e caixa.
                  </p>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-800/40">
                  <button
                    type="button"
                    onClick={() => {
                      setNewEmail(currentUser.email);
                      setEmailUnlocked(false);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                      theme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Bloquear / Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/20 flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Atualizar E-mail</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* OPTION 3: PALAVRA-PASSE / SENHA (COM 2 CONFIRMAÇÕES) */}
          <div
            className={`rounded-xl border transition-all ${
              theme === 'dark' ? 'bg-slate-950/70 border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            {/* Clickable Header: Unlocks when clicked */}
            <button
              type="button"
              onClick={() => {
                setPasswordUnlocked(!passwordUnlocked);
                setFeedback(null);
              }}
              className={`w-full p-4 flex items-center justify-between text-left transition-colors rounded-xl ${
                passwordUnlocked
                  ? theme === 'dark' ? 'bg-slate-800/40' : 'bg-slate-50'
                  : theme === 'dark' ? 'hover:bg-slate-900' : 'hover:bg-slate-50/80'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  passwordUnlocked
                    ? 'bg-blue-500/10 text-blue-500'
                    : theme === 'dark' ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'
                }`}>
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-xs flex items-center gap-2">
                    <span>Palavra-passe & Senha</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold border border-slate-700/40 text-slate-400">
                      {passwordUnlocked ? 'Em Edição' : 'Bloqueado'}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {passwordUnlocked
                      ? 'Introduza a nova palavra-passe e confirme duas vezes'
                      : '🔒 Palavra-passe atual protegida (Clique para desbloquear e alterar)'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`text-[11px] font-mono font-semibold px-2.5 py-1 rounded-lg border flex items-center gap-1.5 ${
                  passwordUnlocked
                    ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30'
                    : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                }`}>
                  {passwordUnlocked ? (
                    <>
                      <Unlock className="w-3 h-3" />
                      <span>Desbloqueado</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-3 h-3" />
                      <span>Clique p/ desbloquear</span>
                    </>
                  )}
                </span>
                {passwordUnlocked ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </div>
            </button>

            {/* Hidden / Collapsed Content: Revealed ONLY when unlocked */}
            {passwordUnlocked && (
              <form onSubmit={handleSavePassword} className="p-4 pt-1 border-t border-slate-800/60 space-y-3 animate-in slide-in-from-top-2 duration-150">
                <div className="pt-2">
                  <label className="block text-xs font-semibold mb-1 text-slate-300">
                    Palavra-passe Atual:
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPass ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Introduza a palavra-passe atual"
                      className={`w-full rounded-xl pl-3.5 pr-10 py-2 text-xs border outline-none font-mono ${
                        theme === 'dark'
                          ? 'bg-slate-900 border-slate-700 text-white focus:border-blue-500'
                          : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-500'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPass(!showCurrentPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                    >
                      {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* NOVA PALAVRA-PASSE */}
                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-300">
                    Nova Palavra-passe:
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPass ? 'text' : 'password'}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Mínimo 6 caracteres"
                      className={`w-full rounded-xl pl-3.5 pr-10 py-2 text-xs border outline-none font-mono ${
                        theme === 'dark'
                          ? 'bg-slate-900 border-slate-700 text-white focus:border-blue-500'
                          : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-500'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPass(!showNewPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                    >
                      {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* CONFIRMAR PALAVRA-PASSE (EXIGÊNCIA DE 2 VEZES) */}
                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-300">
                    Confirmar Nova Palavra-passe (2.ª vez):
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPass ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repita exatamente a nova palavra-passe"
                      className={`w-full rounded-xl pl-3.5 pr-10 py-2 text-xs border outline-none font-mono ${
                        theme === 'dark'
                          ? 'bg-slate-900 border-slate-700 text-white focus:border-blue-500'
                          : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-500'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPass(!showConfirmPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                    >
                      {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Matching Indicator */}
                  {newPassword && confirmPassword && (
                    <div className="mt-1.5 text-[11px] flex items-center gap-1.5 font-medium">
                      {newPassword === confirmPassword ? (
                        <span className="text-emerald-500 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          As palavras-passe coincidem perfeitamente.
                        </span>
                      ) : (
                        <span className="text-rose-500 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          As palavras-passe ainda não coincidem.
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-800/40">
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentPassword('');
                      setNewPassword('');
                      setConfirmPassword('');
                      setPasswordUnlocked(false);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                      theme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Bloquear / Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={!newPassword || newPassword !== confirmPassword}
                    className={`px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-md ${
                      !newPassword || newPassword !== confirmPassword
                        ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Guardar Nova Palavra-passe</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Audit Chain Footer Note */}
          <div
            className={`p-3 rounded-xl border text-[11px] flex items-center gap-2.5 font-mono ${
              theme === 'dark' ? 'bg-slate-950/40 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}
          >
            <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              Qualquer alteração efetuada ao perfil institucional é cifrada e registada na cadeia de auditoria SHA-256 do NHOMINCA.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
