import { useState, FormEvent, ChangeEvent } from 'react';
import {
  Users,
  Shield,
  Pencil,
  Eye,
  EyeOff,
  Power,
  Camera,
  Upload,
  Phone,
  Mail,
  Lock,
  Building2,
  Briefcase,
  Search,
  Filter,
  X,
  CheckCircle,
  AlertCircle,
  UserCheck,
  UserX,
  ShieldCheck,
  KeyRound,
  UserPlus
} from 'lucide-react';
import { Utilizador, UserRole } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { resizeAvatarImage, calculateAge } from '../../utils/imageResize';

interface UtilizadoresModuleProps {
  utilizadores: Utilizador[];
  currentUser: Utilizador;
  onUpdateUtilizador: (usuarioActualizado: Utilizador) => void;
  onToggleUserStatus: (id: string) => void;
  onAddUtilizador: (novoUsuario: Utilizador) => void;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=256&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=256&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=256&q=80',
];

export function UtilizadoresModule({
  utilizadores,
  currentUser,
  onUpdateUtilizador,
  onToggleUserStatus,
  onAddUtilizador,
}: UtilizadoresModuleProps) {
  const { t } = useLanguage();
  const { theme } = useTheme();

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('TODOS');
  const [statusFilter, setStatusFilter] = useState<string>('TODOS');

  // Modals state
  const [editingUser, setEditingUser] = useState<Utilizador | null>(null);
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'warning' } | null>(null);

  // Edit Form State
  const [editForm, setEditForm] = useState<{
    nome: string;
    firstName: string;
    lastName: string;
    gender: 'M' | 'F' | 'Outro';
    birthDate: string;
    email: string;
    cargo: string;
    funcao: UserRole;
    departamento: string;
    telefone: string;
    senha: string;
    fotoUrl: string;
  }>({
    nome: '',
    firstName: '',
    lastName: '',
    gender: 'M',
    birthDate: '1990-01-01',
    email: '',
    cargo: '',
    funcao: 'faturacao',
    departamento: '',
    telefone: '',
    senha: '',
    fotoUrl: '',
  });

  // Create Form State
  const [createForm, setCreateForm] = useState<{
    nome: string;
    email: string;
    cargo: string;
    funcao: UserRole;
    departamento: string;
    telefone: string;
    senha: string;
    fotoUrl: string;
  }>({
    nome: '',
    email: '',
    cargo: '',
    funcao: 'faturacao',
    departamento: 'Faturação & Finanças',
    telefone: '',
    senha: '',
    fotoUrl: PRESET_AVATARS[0],
  });

  const [showPassword, setShowPassword] = useState(false);

  // Admin access checks
  const isAdminGeral = currentUser.role === 'admin' || currentUser.role === 'superadmin' || currentUser.funcao === 'ADMIN_IMP';

  const showToast = (text: string, type: 'success' | 'info' | 'warning' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Open Edit Modal
  const handleOpenEdit = (user: Utilizador) => {
    setEditingUser(user);
    const parts = (user.nome || '').split(' ');
    const fName = user.firstName || parts[0] || '';
    const lName = user.lastName || parts.slice(1).join(' ') || '';

    setEditForm({
      nome: user.nome,
      firstName: fName,
      lastName: lName,
      gender: user.gender || 'M',
      birthDate: user.birthDate || '1985-06-15',
      email: user.email,
      cargo: user.cargo,
      funcao: user.funcao,
      departamento: user.departamento,
      telefone: user.telefone || '+245 95 000 0000',
      senha: user.senha || 'IMP2026Secure!',
      fotoUrl: user.fotoUrl || user.avatar || PRESET_AVATARS[0],
    });
    setShowPassword(false);
  };

  // Save Edit
  const handleSaveEdit = (e: FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    const fullNominal = `${editForm.firstName.trim()} ${editForm.lastName.trim()}`.trim();

    const updated: Utilizador = {
      ...editingUser,
      nome: fullNominal || editForm.nome,
      firstName: editForm.firstName.trim(),
      lastName: editForm.lastName.trim(),
      gender: editForm.gender,
      birthDate: editForm.birthDate,
      email: isAdminGeral ? editForm.email.trim() : editingUser.email,
      cargo: isAdminGeral ? editForm.cargo : editingUser.cargo,
      funcao: isAdminGeral ? editForm.funcao : editingUser.funcao,
      role: (isAdminGeral && (editForm.funcao === 'superadmin' || editForm.funcao === 'admin' || editForm.funcao === 'faturacao' || editForm.funcao === 'caixa')) ? editForm.funcao : editingUser.role,
      departamento: editForm.departamento,
      telefone: editForm.telefone.trim(),
      senha: editForm.senha,
      fotoUrl: editForm.fotoUrl,
      avatar: editForm.fotoUrl,
    };

    onUpdateUtilizador(updated);
    setEditingUser(null);
    showToast(`Perfil de ${updated.nome} atualizado com sucesso!`);
  };

  // Save New User
  const handleSaveCreate = (e: FormEvent) => {
    e.preventDefault();
    if (!createForm.nome.trim() || !createForm.email.trim()) {
      showToast('Nome e Email são obrigatórios.', 'warning');
      return;
    }

    const parts = createForm.nome.trim().split(' ');
    const fName = parts[0] || '';
    const lName = parts.slice(1).join(' ') || '';

    const novo: Utilizador = {
      id: `USR-${Date.now().toString().slice(-4)}`,
      nome: createForm.nome.trim(),
      firstName: fName,
      lastName: lName,
      gender: 'M',
      birthDate: '1990-01-01',
      email: createForm.email.trim(),
      cargo: createForm.cargo || 'Operador Marítimo',
      funcao: createForm.funcao,
      role: (createForm.funcao === 'superadmin' || createForm.funcao === 'admin' || createForm.funcao === 'faturacao' || createForm.funcao === 'caixa') ? createForm.funcao : 'faturacao',
      departamento: createForm.departamento || 'Operações',
      status: 'Ativo',
      active: true,
      ultimoAcesso: 'Hoje, recém-criado',
      fotoUrl: createForm.fotoUrl || PRESET_AVATARS[0],
      avatar: createForm.fotoUrl || PRESET_AVATARS[0],
      telefone: createForm.telefone || '+245 95 000 0000',
      senha: createForm.senha || 'IMP2026Secure!',
    };

    onAddUtilizador(novo);
    setIsCreatingUser(false);
    setCreateForm({
      nome: '',
      email: '',
      cargo: '',
      funcao: 'faturacao',
      departamento: 'Faturação & Finanças',
      telefone: '',
      senha: '',
      fotoUrl: PRESET_AVATARS[0],
    });
    showToast(`Novo utilizador ${novo.nome} criado com sucesso!`);
  };

  // Handle Image Upload with Automatic Client-Side Resize (max 400px)
  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>, isEditMode = true) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const optimizedUrl = await resizeAvatarImage(file, 400);
        if (isEditMode) {
          setEditForm((prev) => ({ ...prev, fotoUrl: optimizedUrl }));
        } else {
          setCreateForm((prev) => ({ ...prev, fotoUrl: optimizedUrl }));
        }
        showToast('Foto processada e redimensionada para máx 400px.');
      } catch {
        const reader = new FileReader();
        reader.onloadend = () => {
          const resultStr = reader.result as string;
          if (isEditMode) {
            setEditForm((prev) => ({ ...prev, fotoUrl: resultStr }));
          } else {
            setCreateForm((prev) => ({ ...prev, fotoUrl: resultStr }));
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  // Status Toggle by Admin
  const handleToggleStatus = (user: Utilizador) => {
    if (!isAdminGeral) {
      showToast('Apenas o Administrador Geral (ADMIN_IMP) pode alterar o estado da conta.', 'warning');
      return;
    }
    const novoStatus = user.status === 'Ativo' ? 'Inativo' : 'Ativo';
    onToggleUserStatus(user.id);
    showToast(
      `Conta de ${user.nome} foi ${novoStatus === 'Ativo' ? 'ativada' : 'desativada'} com sucesso.`,
      novoStatus === 'Ativo' ? 'success' : 'info'
    );
  };

  // Filtered list
  const filteredUsers = utilizadores.filter((u) => {
    const matchesSearch =
      u.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.cargo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.departamento.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === 'TODOS' || u.funcao === roleFilter;
    const matchesStatus = statusFilter === 'TODOS' || u.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const totalActivos = utilizadores.filter(u => u.status === 'Ativo').length;
  const totalInactivos = utilizadores.filter(u => u.status === 'Inativo').length;

  return (
    <div id="utilizadores-module" className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed top-20 right-6 z-50 p-4 rounded-xl shadow-2xl border flex items-center gap-3 transition-all animate-bounce ${
            toastMessage.type === 'success'
              ? theme === 'dark' ? 'bg-slate-900 border-emerald-500/40 text-emerald-300' : 'bg-white border-emerald-300 text-emerald-800 shadow-md'
              : toastMessage.type === 'warning'
              ? theme === 'dark' ? 'bg-slate-900 border-amber-500/40 text-amber-300' : 'bg-white border-amber-300 text-amber-800 shadow-md'
              : theme === 'dark' ? 'bg-slate-900 border-blue-500/40 text-blue-300' : 'bg-white border-blue-300 text-blue-800 shadow-md'
          }`}
        >
          {toastMessage.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
          ) : toastMessage.type === 'warning' ? (
            <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
          ) : (
            <ShieldCheck className="w-5 h-5 text-blue-500 shrink-0" />
          )}
          <span className="text-xs font-semibold">{toastMessage.text}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2
              className={`text-xl font-bold tracking-tight flex items-center gap-2 ${
                theme === 'dark' ? 'text-white' : 'text-slate-900'
              }`}
            >
              <Users className="w-5 h-5 text-blue-500" />
              {t.users.title}
            </h2>
            <span
              className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded border ${
                theme === 'dark'
                  ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                  : 'bg-blue-50 text-blue-700 border-blue-200'
              }`}
            >
              {t.users.rbacModule}
            </span>
          </div>
          <p className={theme === 'dark' ? 'text-slate-400 text-xs mt-1' : 'text-slate-500 text-xs mt-1'}>
            {t.users.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleOpenEdit(currentUser)}
            className={`py-2 px-3.5 text-xs font-semibold rounded-xl border flex items-center gap-2 transition-all shadow-sm ${
              theme === 'dark'
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
            }`}
          >
            <Pencil className="w-3.5 h-3.5 text-blue-500" />
            {t.users.editMyProfile}
          </button>
          {isAdminGeral && (
            <button
              onClick={() => setIsCreatingUser(true)}
              className="py-2 px-4 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl flex items-center gap-2 transition-colors shadow-lg shadow-blue-600/20"
            >
              <UserPlus className="w-4 h-4" />
              {t.users.createNewUser}
            </button>
          )}
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          className={`p-4 rounded-2xl border flex items-center justify-between ${
            theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/80 shadow-sm'
          }`}
        >
          <div>
            <div className="text-slate-500 text-xs font-medium">{t.users.totalUsers}</div>
            <div className={`text-2xl font-bold font-mono mt-1 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              {utilizadores.length}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">{t.users.totalDesc}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div
          className={`p-4 rounded-2xl border flex items-center justify-between ${
            theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/80 shadow-sm'
          }`}
        >
          <div>
            <div className="text-slate-500 text-xs font-medium">{t.users.activeAccounts}</div>
            <div className="text-2xl font-bold text-emerald-500 font-mono mt-1">{totalActivos}</div>
            <div className="text-[10px] text-emerald-500/80 mt-0.5">{t.users.activeDesc}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>

        <div
          className={`p-4 rounded-2xl border flex items-center justify-between ${
            theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/80 shadow-sm'
          }`}
        >
          <div>
            <div className="text-slate-500 text-xs font-medium">{t.users.inactiveAccounts}</div>
            <div className="text-2xl font-bold text-rose-500 font-mono mt-1">{totalInactivos}</div>
            <div className="text-[10px] text-rose-500/80 mt-0.5">{t.users.inactiveDesc}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500">
            <UserX className="w-5 h-5" />
          </div>
        </div>

        <div
          className={`p-4 rounded-2xl border flex items-center justify-between ${
            theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/80 shadow-sm'
          }`}
        >
          <div>
            <div className="text-slate-500 text-xs font-medium">{t.users.currentPrivilege}</div>
            <div className="text-sm font-bold text-blue-500 font-mono mt-1 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              {currentUser.funcao}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              {isAdminGeral ? t.users.privilegeDescAdmin : t.users.privilegeDescRestricted}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
            <Shield className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Admin Privilege Notice Banner */}
      <div
        className={`p-4 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs ${
          theme === 'dark' ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200/80 shadow-sm'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-500 shrink-0">
            <KeyRound className="w-4 h-4" />
          </div>
          <div>
            <div className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              Política de Segurança & Privilégios Institucionais
            </div>
            <div className={theme === 'dark' ? 'text-slate-400 text-[11px]' : 'text-slate-500 text-[11px]'}>
              Cada utilizador pode actualizar a sua foto de perfil, dados de contacto e palavra-passe. O Administrador Geral possui controlo total para ativar ou desativar utilizadores a qualquer momento.
            </div>
          </div>
        </div>
        <div
          className={`px-3 py-1.5 rounded-xl border font-mono text-[11px] shrink-0 ${
            theme === 'dark'
              ? 'bg-slate-950 border-slate-800 text-slate-300'
              : 'bg-slate-50 border-slate-200 text-slate-700'
          }`}
        >
          Sessão: <span className="text-emerald-500 font-bold">{currentUser.nome}</span> ({currentUser.funcao})
        </div>
      </div>

      {/* Filters Bar */}
      <div
        className={`p-4 rounded-2xl border flex flex-col md:flex-row gap-3 items-center justify-between ${
          theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/80 shadow-sm'
        }`}
      >
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Pesquisar por nome, email, departamento..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full rounded-xl pl-9 pr-4 py-2 text-xs border focus:outline-none focus:border-blue-500 ${
              theme === 'dark'
                ? 'bg-slate-950 border-slate-800 text-slate-200 placeholder-slate-500'
                : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
            }`}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs text-slate-500">Função:</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className={`rounded-xl px-3 py-2 text-xs border focus:outline-none focus:border-blue-500 ${
                theme === 'dark'
                  ? 'bg-slate-950 border-slate-800 text-slate-200'
                  : 'bg-slate-50 border-slate-200 text-slate-900'
              }`}
            >
              <option value="TODOS">Todas as Funções</option>
              <option value="ADMIN_IMP">ADMIN_IMP</option>
              <option value="INSPECTOR">INSPECTOR</option>
              <option value="CAPITANIA">CAPITANIA</option>
              <option value="TESOURARIA">TESOURARIA</option>
              <option value="AGENTE_MARITIMO">AGENTE_MARITIMO</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Estado:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={`rounded-xl px-3 py-2 text-xs border focus:outline-none focus:border-blue-500 ${
                theme === 'dark'
                  ? 'bg-slate-950 border-slate-800 text-slate-200'
                  : 'bg-slate-50 border-slate-200 text-slate-900'
              }`}
            >
              <option value="TODOS">Todos os Estados</option>
              <option value="Ativo">Activos</option>
              <option value="Inativo">Inactivos</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div
        className={`border rounded-2xl overflow-hidden shadow-sm ${
          theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/80'
        }`}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead
              className={`border-b uppercase font-mono text-[10px] ${
                theme === 'dark'
                  ? 'bg-slate-950/80 border-slate-800 text-slate-400'
                  : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}
            >
              <tr>
                <th className="py-3.5 px-4">Utilizador & Foto</th>
                <th className="py-3.5 px-4">Contactos</th>
                <th className="py-3.5 px-4">Papel / Perfil RBAC</th>
                <th className="py-3.5 px-4">Departamento</th>
                <th className="py-3.5 px-4">Estado da Conta</th>
                <th className="py-3.5 px-4">Último Acesso</th>
                <th className="py-3.5 px-4 text-right">Ações & Controlo</th>
              </tr>
            </thead>
            <tbody className={theme === 'dark' ? 'divide-y divide-slate-800/60' : 'divide-y divide-slate-100'}>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 text-xs">
                    Nenhum utilizador encontrado para os filtros selecionados.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const isCurrent = u.id === currentUser.id;
                  const isUserActive = u.status === 'Ativo';

                  return (
                    <tr
                      key={u.id}
                      className={`transition-colors ${
                        theme === 'dark'
                          ? `hover:bg-slate-800/40 ${!isUserActive ? 'bg-rose-950/10' : ''}`
                          : `hover:bg-slate-50 ${!isUserActive ? 'bg-rose-50/50' : ''}`
                      }`}
                    >
                      {/* Avatar & User Info */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative shrink-0">
                            <div
                              className={`w-10 h-10 rounded-xl overflow-hidden shadow-inner flex items-center justify-center font-bold border ${
                                theme === 'dark'
                                  ? 'bg-slate-800 border-slate-700 text-slate-300'
                                  : 'bg-slate-100 border-slate-200 text-slate-700'
                              }`}
                            >
                              {u.fotoUrl ? (
                                <img src={u.fotoUrl} alt={u.nome} className="w-full h-full object-cover" />
                              ) : (
                                u.nome.substring(0, 2).toUpperCase()
                              )}
                            </div>
                            <span
                              className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 ${
                                theme === 'dark' ? 'border-slate-900' : 'border-white'
                              } ${isUserActive ? 'bg-emerald-500' : 'bg-rose-500'}`}
                              title={isUserActive ? 'Conta Activa' : 'Conta Inactiva'}
                            />
                          </div>

                          <div>
                            <div className={`font-bold text-sm flex items-center gap-1.5 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                              {u.nome}
                              {isCurrent && (
                                <span className="text-[9px] bg-blue-500/20 text-blue-600 border border-blue-500/30 px-1.5 py-0.2 rounded font-mono font-bold">
                                  Você
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500 flex items-center gap-1">
                              <Briefcase className="w-3 h-3 text-slate-400" />
                              {u.cargo}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Contact Info */}
                      <td className="py-3.5 px-4 space-y-0.5">
                        <div className={`font-mono text-[11px] flex items-center gap-1.5 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                          <Mail className="w-3 h-3 text-blue-500 shrink-0" />
                          {u.email}
                        </div>
                        <div className="text-slate-500 font-mono text-[11px] flex items-center gap-1.5">
                          <Phone className="w-3 h-3 text-emerald-500 shrink-0" />
                          {u.telefone || '+245 95 000 0000'}
                        </div>
                      </td>

                      {/* Role */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border font-mono inline-flex items-center gap-1 ${
                            u.funcao === 'ADMIN_IMP'
                              ? 'bg-purple-500/10 text-purple-600 border-purple-500/20'
                              : u.funcao === 'INSPECTOR'
                              ? 'bg-blue-500/10 text-blue-600 border-blue-500/20'
                              : u.funcao === 'CAPITANIA'
                              ? 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                              : u.funcao === 'TESOURARIA'
                              ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                              : theme === 'dark'
                              ? 'bg-slate-800 text-slate-300 border-slate-700'
                              : 'bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                        >
                          <Shield className="w-3 h-3" />
                          {u.funcao}
                        </span>
                      </td>

                      {/* Department */}
                      <td className={`py-3.5 px-4 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                        <div className="flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-slate-400" />
                          {u.departamento}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border inline-flex items-center gap-1.5 ${
                            isUserActive
                              ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                              : 'bg-rose-500/10 text-rose-600 border-rose-500/20'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isUserActive ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
                            }`}
                          />
                          {u.status}
                        </span>
                      </td>

                      {/* Last Access */}
                      <td className="py-3.5 px-4 font-mono text-slate-500 text-[11px]">
                        {u.ultimoAcesso}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEdit(u)}
                            className={`py-1.5 px-2.5 rounded-lg border flex items-center gap-1.5 text-xs font-semibold transition-colors ${
                              theme === 'dark'
                                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                            }`}
                            title="Editar informações do utilizador"
                          >
                            <Pencil className="w-3.5 h-3.5 text-blue-500" />
                            Editar
                          </button>

                          {isAdminGeral && (
                            <button
                              onClick={() => handleToggleStatus(u)}
                              className={`py-1.5 px-2.5 rounded-lg border flex items-center gap-1.5 text-xs font-semibold transition-all ${
                                isUserActive
                                  ? 'bg-rose-500/10 text-rose-600 border-rose-500/20 hover:bg-rose-500/20'
                                  : 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/20'
                              }`}
                              title={
                                isUserActive
                                  ? 'Desativar este utilizador no sistema'
                                  : 'Ativar este utilizador no sistema'
                              }
                            >
                              <Power className="w-3.5 h-3.5" />
                              {isUserActive ? 'Desativar' : 'Ativar'}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* EDIT USER MODAL */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div
            className={`border rounded-2xl max-w-2xl w-full p-6 space-y-6 shadow-2xl my-8 ${
              theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            <div className={`flex items-center justify-between border-b pb-4 ${theme === 'dark' ? 'border-slate-800' : 'border-slate-200'}`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-500">
                  <Pencil className="w-5 h-5" />
                </div>
                <div>
                  <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    Editar Perfil de Utilizador
                  </h3>
                  <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                    Alteração de dados pessoais, foto de perfil, dados de contacto e credenciais
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEditingUser(null)}
                className={`p-2 rounded-lg transition-colors ${
                  theme === 'dark' ? 'bg-slate-800 text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-500 hover:text-slate-800'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-5">
              {/* Profile Photo Selector & Preview */}
              <div
                className={`p-4 rounded-xl border space-y-3 ${
                  theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider font-mono">
                  Foto de Perfil do Utilizador
                </label>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {/* Photo Preview */}
                  <div className="relative shrink-0">
                    <div
                      className={`w-20 h-20 rounded-2xl border-2 border-blue-500/50 overflow-hidden shadow-lg flex items-center justify-center ${
                        theme === 'dark' ? 'bg-slate-800 text-slate-300' : 'bg-white text-slate-600'
                      }`}
                    >
                      {editForm.fotoUrl ? (
                        <img src={editForm.fotoUrl} alt="Avatar Preview" className="w-full h-full object-cover" />
                      ) : (
                        <Camera className="w-8 h-8 text-slate-400" />
                      )}
                    </div>
                  </div>

                  {/* Options: File Upload or Preset Selection */}
                  <div className="space-y-2 flex-1 w-full">
                    <div className="flex items-center gap-2">
                      <label className="cursor-pointer py-1.5 px-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg flex items-center gap-2 transition-colors">
                        <Upload className="w-3.5 h-3.5" />
                        Carregar Ficheiro de Foto
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, true)}
                          className="hidden"
                        />
                      </label>
                      <span className="text-[11px] text-slate-500">ou escolha um dos avatares oficiais:</span>
                    </div>

                    {/* Presets */}
                    <div className="flex items-center gap-2 overflow-x-auto py-1">
                      {PRESET_AVATARS.map((url, idx) => (
                        <button
                          type="button"
                          key={idx}
                          onClick={() => setEditForm({ ...editForm, fotoUrl: url })}
                          className={`w-9 h-9 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                            editForm.fotoUrl === url
                              ? 'border-blue-500 scale-105 shadow-md shadow-blue-500/20'
                              : 'border-slate-300 opacity-60 hover:opacity-100'
                          }`}
                        >
                          <img src={url} alt={`Preset ${idx}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>

                    {/* Custom Image URL input */}
                    <input
                      type="text"
                      placeholder="Ou cole a URL da imagem aqui (https://...)"
                      value={editForm.fotoUrl}
                      onChange={(e) => setEditForm({ ...editForm, fotoUrl: e.target.value })}
                      className={`w-full rounded-lg px-3 py-1.5 text-xs font-mono border focus:outline-none focus:border-blue-500 ${
                        theme === 'dark'
                          ? 'bg-slate-900 border-slate-800 text-slate-300 placeholder-slate-600'
                          : 'bg-white border-slate-200 text-slate-800 placeholder-slate-400'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Editable Fields Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Primeiro Nome</label>
                  <input
                    type="text"
                    required
                    value={editForm.firstName}
                    onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                    className={`w-full rounded-xl px-3.5 py-2 text-xs border focus:outline-none focus:border-blue-500 ${
                      theme === 'dark' ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Sobrenome / Apelido</label>
                  <input
                    type="text"
                    required
                    value={editForm.lastName}
                    onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                    className={`w-full rounded-xl px-3.5 py-2 text-xs border focus:outline-none focus:border-blue-500 ${
                      theme === 'dark' ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Sexo / Género</label>
                  <select
                    value={editForm.gender}
                    onChange={(e) => setEditForm({ ...editForm, gender: e.target.value as any })}
                    className={`w-full rounded-xl px-3.5 py-2 text-xs border focus:outline-none focus:border-blue-500 ${
                      theme === 'dark' ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  >
                    <option value="M">Masculino (M)</option>
                    <option value="F">Feminino (F)</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-medium text-slate-500">Data de Nascimento</label>
                    {calculateAge(editForm.birthDate) !== null && (
                      <span className="text-[11px] font-mono text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {calculateAge(editForm.birthDate)} anos
                      </span>
                    )}
                  </div>
                  <input
                    type="date"
                    required
                    value={editForm.birthDate}
                    onChange={(e) => setEditForm({ ...editForm, birthDate: e.target.value })}
                    className={`w-full rounded-xl px-3.5 py-2 text-xs font-mono border focus:outline-none focus:border-blue-500 ${
                      theme === 'dark' ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-medium text-slate-500">Email Corporativo</label>
                    {!isAdminGeral && (
                      <span className="text-[10px] text-amber-600 flex items-center gap-1 font-mono">
                        <Lock className="w-3 h-3" /> Bloqueado (SoD)
                      </span>
                    )}
                  </div>
                  <input
                    type="email"
                    required
                    disabled={!isAdminGeral}
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className={`w-full border rounded-xl px-3.5 py-2 text-xs font-mono transition-all ${
                      isAdminGeral
                        ? theme === 'dark'
                          ? 'bg-slate-950 border-slate-800 text-white focus:border-blue-500'
                          : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-500'
                        : theme === 'dark'
                        ? 'bg-slate-900 border-slate-800 text-slate-400 cursor-not-allowed opacity-75'
                        : 'bg-slate-100 border-slate-200 text-slate-500 cursor-not-allowed opacity-75'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Palavra-passe (Senha)</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={editForm.senha}
                      onChange={(e) => setEditForm({ ...editForm, senha: e.target.value })}
                      className={`w-full rounded-xl pl-3.5 pr-10 py-2 text-xs font-mono border focus:outline-none focus:border-blue-500 ${
                        theme === 'dark' ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Telefone de Contacto</label>
                  <input
                    type="text"
                    value={editForm.telefone}
                    onChange={(e) => setEditForm({ ...editForm, telefone: e.target.value })}
                    placeholder="+245 95 000 0000"
                    className={`w-full rounded-xl px-3.5 py-2 text-xs font-mono border focus:outline-none focus:border-blue-500 ${
                      theme === 'dark' ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-medium text-slate-500">Cargo / Função RBAC</label>
                    {!isAdminGeral && (
                      <span className="text-[10px] text-amber-600 flex items-center gap-1 font-mono">
                        <Lock className="w-3 h-3" /> Bloqueado (SoD)
                      </span>
                    )}
                  </div>
                  {isAdminGeral ? (
                    <select
                      value={editForm.funcao}
                      onChange={(e) => setEditForm({ ...editForm, funcao: e.target.value as any })}
                      className={`w-full rounded-xl px-3.5 py-2 text-xs border focus:outline-none focus:border-blue-500 ${
                        theme === 'dark' ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                      }`}
                    >
                      <option value="superadmin">SuperAdmin (Desenvolvedor / IT)</option>
                      <option value="admin">Admin (Diretor Geral / PCA)</option>
                      <option value="faturacao">Faturação (Tarifas Portuárias)</option>
                      <option value="caixa">Caixa & Tesouraria Central</option>
                      <option value="INSPECTOR">Inspector Marítimo</option>
                      <option value="CAPITANIA">Capitania dos Portos</option>
                    </select>
                  ) : (
                    <input
                      type="text"
                      disabled
                      value={`${editForm.cargo} (${editForm.funcao})`}
                      className={`w-full rounded-xl px-3.5 py-2 text-xs cursor-not-allowed opacity-75 border ${
                        theme === 'dark' ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-500'
                      }`}
                    />
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-500 mb-1">Departamento Institucional</label>
                  <input
                    type="text"
                    required
                    value={editForm.departamento}
                    onChange={(e) => setEditForm({ ...editForm, departamento: e.target.value })}
                    className={`w-full rounded-xl px-3.5 py-2 text-xs border focus:outline-none focus:border-blue-500 ${
                      theme === 'dark' ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              {/* Protected Permissions Section */}
              <div
                className={`p-3.5 rounded-xl border space-y-1 ${
                  theme === 'dark' ? 'bg-slate-950 border-amber-500/20' : 'bg-amber-50 border-amber-200/80 text-amber-900'
                }`}
              >
                <div className="flex items-center gap-2 text-amber-600 font-semibold text-xs">
                  <Lock className="w-3.5 h-3.5" />
                  Segregação de Funções (SoD) & Segurança de Perfil:
                </div>
                <p className={`text-[11px] leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                  Pode alterar a sua foto de perfil (redimensionada para máx 400px), nome, sobrenome, sexo, data de nascimento e palavra-passe. O Email e o Cargo RBAC são protegidos contra auto-elevação de privilégios.
                </p>
              </div>

              {/* Submit / Cancel */}
              <div className={`flex items-center justify-end gap-3 pt-2 border-t ${theme === 'dark' ? 'border-slate-800' : 'border-slate-200'}`}>
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className={`py-2.5 px-4 text-xs font-semibold rounded-xl transition-colors ${
                    theme === 'dark' ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl flex items-center gap-2 transition-colors shadow-lg shadow-blue-600/20"
                >
                  <CheckCircle className="w-4 h-4" />
                  Guardar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* NEW USER MODAL */}
      {isCreatingUser && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div
            className={`border rounded-2xl max-w-2xl w-full p-6 space-y-6 shadow-2xl my-8 ${
              theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            <div className={`flex items-center justify-between border-b pb-4 ${theme === 'dark' ? 'border-slate-800' : 'border-slate-200'}`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-500">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    Criar Novo Utilizador
                  </h3>
                  <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                    Registo institucional de nova conta no sistema marítimo IMP
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCreatingUser(false)}
                className={`p-2 rounded-lg transition-colors ${
                  theme === 'dark' ? 'bg-slate-800 text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-500 hover:text-slate-800'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCreate} className="space-y-5">
              {/* Photo selection */}
              <div
                className={`p-4 rounded-xl border space-y-3 ${
                  theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider font-mono">
                  Foto do Novo Utilizador
                </label>

                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-slate-800 border-2 border-blue-500/50 overflow-hidden shrink-0">
                    <img src={createForm.fotoUrl} alt="New Avatar" className="w-full h-full object-cover" />
                  </div>

                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <label
                        className={`cursor-pointer py-1.5 px-3 text-xs font-semibold rounded-lg flex items-center gap-2 border transition-colors ${
                          theme === 'dark'
                            ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                            : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-sm'
                        }`}
                      >
                        <Upload className="w-3.5 h-3.5 text-blue-500" />
                        Upload
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, false)}
                          className="hidden"
                        />
                      </label>
                      <span className="text-[11px] text-slate-500">ou selecione um avatar preset:</span>
                    </div>

                    <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                      {PRESET_AVATARS.map((url, idx) => (
                        <button
                          type="button"
                          key={idx}
                          onClick={() => setCreateForm({ ...createForm, fotoUrl: url })}
                          className={`w-8 h-8 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                            createForm.fotoUrl === url
                              ? 'border-blue-500 scale-105 shadow-md'
                              : 'border-slate-300 opacity-60 hover:opacity-100'
                          }`}
                        >
                          <img src={url} alt={`Preset ${idx}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Nome Completo *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Dr. Ansumane Mane"
                    value={createForm.nome}
                    onChange={(e) => setCreateForm({ ...createForm, nome: e.target.value })}
                    className={`w-full rounded-xl px-3.5 py-2 text-xs border focus:outline-none focus:border-blue-500 ${
                      theme === 'dark' ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Email Corporativo *</label>
                  <input
                    type="email"
                    required
                    placeholder="nome.sobrenome@imp.gb"
                    value={createForm.email}
                    onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                    className={`w-full rounded-xl px-3.5 py-2 text-xs font-mono border focus:outline-none focus:border-blue-500 ${
                      theme === 'dark' ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Palavra-passe Inicial *</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={createForm.senha}
                    onChange={(e) => setCreateForm({ ...createForm, senha: e.target.value })}
                    className={`w-full rounded-xl px-3.5 py-2 text-xs font-mono border focus:outline-none focus:border-blue-500 ${
                      theme === 'dark' ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Função / Perfil RBAC *</label>
                  <select
                    value={createForm.funcao}
                    onChange={(e) => setCreateForm({ ...createForm, funcao: e.target.value as UserRole })}
                    className={`w-full rounded-xl px-3.5 py-2 text-xs border focus:outline-none focus:border-blue-500 ${
                      theme === 'dark' ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  >
                    <option value="INSPECTOR">INSPECTOR - Inspecção Marítima</option>
                    <option value="CAPITANIA">CAPITANIA - Capitania dos Portos</option>
                    <option value="TESOURARIA">TESOURARIA - Finanças e Facturação</option>
                    <option value="AGENTE_MARITIMO">AGENTE_MARITIMO - Agências de Navegação</option>
                    <option value="ADMIN_IMP">ADMIN_IMP - Administrador Geral</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Cargo / Posição</label>
                  <input
                    type="text"
                    placeholder="Ex: Tabela Táctica / Inspector"
                    value={createForm.cargo}
                    onChange={(e) => setCreateForm({ ...createForm, cargo: e.target.value })}
                    className={`w-full rounded-xl px-3.5 py-2 text-xs border focus:outline-none focus:border-blue-500 ${
                      theme === 'dark' ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Telefone</label>
                  <input
                    type="text"
                    placeholder="+245 95 000 0000"
                    value={createForm.telefone}
                    onChange={(e) => setCreateForm({ ...createForm, telefone: e.target.value })}
                    className={`w-full rounded-xl px-3.5 py-2 text-xs font-mono border focus:outline-none focus:border-blue-500 ${
                      theme === 'dark' ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              {/* Submit / Cancel */}
              <div className={`flex items-center justify-end gap-3 pt-2 border-t ${theme === 'dark' ? 'border-slate-800' : 'border-slate-200'}`}>
                <button
                  type="button"
                  onClick={() => setIsCreatingUser(false)}
                  className={`py-2.5 px-4 text-xs font-semibold rounded-xl transition-colors ${
                    theme === 'dark' ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl flex items-center gap-2 transition-colors shadow-lg shadow-blue-600/20"
                >
                  <UserPlus className="w-4 h-4" />
                  Cadastrar Utilizador
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
