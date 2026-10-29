import { useState } from 'react';
import {
  Anchor,
  Bell,
  Globe,
  Search,
  Shield,
  User,
  Check,
  Sun,
  Moon,
  LogOut,
  Sparkles,
  Menu
} from 'lucide-react';
import { Utilizador, IMP_INSTITUTIONAL } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { Language } from '../../i18n/translations';
import { useTheme } from '../../context/ThemeContext';

interface HeaderProps {
  currentUser: Utilizador;
  onSelectUserRole: (role: string) => void;
  onLogout?: () => void;
  onOpenProfile?: () => void;
  onOpenMobileMenu?: () => void;
}

export function Header({ currentUser, onSelectUserRole, onLogout, onOpenProfile, onOpenMobileMenu }: HeaderProps) {
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const languages: { code: Language; label: string; flag: string; short: string }[] = [
    { code: 'pt', label: 'Português', flag: '🇵🇹', short: 'PT' },
    { code: 'fr', label: 'Français', flag: '🇫🇷', short: 'FR' },
    { code: 'en', label: 'English', flag: '🇬🇧', short: 'EN' },
  ];

  const currentLangObj = languages.find((l) => l.code === language) || languages[0];

  const getRoleBadge = (roleStr: string) => {
    switch (roleStr?.toLowerCase()) {
      case 'superadmin':
        return (
          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-500 border border-purple-500/30 font-bold">
            SUPERADMIN (DEV)
          </span>
        );
      case 'admin':
      case 'admin_imp':
        return (
          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-500 border border-blue-500/30 font-bold">
            DIRETOR GERAL / PCA
          </span>
        );
      case 'faturacao':
        return (
          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/30 font-bold">
            FATURAÇÃO
          </span>
        );
      case 'caixa':
      case 'tesouraria':
        return (
          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 font-bold">
            CAIXA / TESOURARIA
          </span>
        );
      default:
        return (
          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-500/10 text-slate-500 border border-slate-500/30 font-bold">
            {roleStr?.toUpperCase()}
          </span>
        );
    }
  };

  return (
    <header
      id="nhominca-header"
      className={`h-16 px-3 sm:px-6 flex items-center justify-between sticky top-0 z-40 transition-colors border-b w-full max-w-full ${
        theme === 'dark'
          ? 'bg-slate-900 border-slate-800'
          : 'bg-white border-slate-200 shadow-sm'
      }`}
    >
      <div className="flex items-center gap-2 sm:gap-4 min-w-0">
        {/* Mobile Hamburger Menu Toggle Button - Placed at the very left on mobile for easy one-hand reach */}
        {onOpenMobileMenu && (
          <button
            onClick={onOpenMobileMenu}
            className={`p-2 rounded-xl lg:hidden border transition-all shrink-0 cursor-pointer ${
              theme === 'dark'
                ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
                : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
            }`}
            title="Abrir Menu de Navegação"
            aria-label="Abrir Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div id="nhominca-brand" className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          {/* Official Golden IMP Ship Helm Logo */}
          <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden flex items-center justify-center p-0.5 shadow-md border shrink-0 ${
            theme === 'dark'
              ? 'bg-slate-900 border-blue-500/30 shadow-blue-900/30'
              : 'bg-white border-blue-200 shadow-slate-200'
          }`}>
            <img
              src="/assets/aistudio/images__2__12a47efd.jpg"
              alt="NHOMINCA - IMP Logo"
              className="w-full h-full object-contain rounded-lg"
            />
          </div>
          <div className="min-w-0">
            <h1 className="font-bold text-sm sm:text-base tracking-tight flex items-center gap-1.5 sm:gap-2 truncate">
              <span className={theme === 'dark' ? 'text-white' : 'text-slate-900 font-extrabold'}>
                NHOMINCA
              </span>
              <span className={`text-[9px] sm:text-[10px] uppercase font-mono px-1.5 sm:px-2 py-0.5 rounded font-bold border shrink-0 ${
                theme === 'dark'
                  ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                  : 'bg-blue-50 text-blue-700 border-blue-200'
              }`}>
                V1.0 • IMP
              </span>
            </h1>
            <p className={`text-[10px] sm:text-[11px] truncate hidden md:block ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
            }`}>
              República da Guiné-Bissau • NIF: 910005508
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">

        {/* Global Search Bar */}
        <div className="relative hidden lg:block w-56">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={t.header.searchPlaceholder}
            className={`w-full rounded-xl pl-9 pr-4 py-1.5 text-xs placeholder-slate-500 focus:outline-none focus:border-blue-500 border ${
              theme === 'dark'
                ? 'bg-slate-950 border-slate-800 text-slate-200'
                : 'bg-slate-50 border-slate-200 text-slate-800'
            }`}
          />
        </div>

        {/* Theme Switcher Toggle */}
        <button
          onClick={toggleTheme}
          className={`p-1.5 sm:p-2 rounded-xl border transition-all shrink-0 cursor-pointer ${
            theme === 'dark'
              ? 'bg-slate-800/80 border-slate-700/80 text-yellow-400 hover:border-slate-600'
              : 'bg-slate-100 border-slate-200 text-slate-700 hover:border-blue-400'
          }`}
          title={theme === 'dark' ? 'Mudar para Tema Claro IMP' : 'Mudar para Tema Escuro'}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4 text-slate-700" />}
        </button>

        {/* Notifications (Tablet / Desktop, also in Mobile drawer) */}
        <button
          id="btn-notifications"
          title={t.header.notifications}
          className={`p-1.5 sm:p-2 rounded-xl relative transition-colors border hidden sm:flex shrink-0 cursor-pointer ${
            theme === 'dark'
              ? 'text-slate-400 hover:text-white bg-slate-800/60 border-slate-800'
              : 'text-slate-600 hover:text-slate-900 bg-slate-100 border-slate-200'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 rounded-full bg-blue-500 absolute top-1.5 right-1.5"></span>
        </button>

        {/* Language Selector Dropdown (Tablet / Desktop, also in Mobile drawer) */}
        <div className="relative hidden sm:block shrink-0">
          <button
            id="btn-language-selector"
            onClick={() => setLangDropdownOpen(!langDropdownOpen)}
            className={`py-1.5 px-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm border cursor-pointer ${
              theme === 'dark'
                ? 'bg-slate-800/80 hover:bg-slate-800 border-slate-700/80 text-slate-200'
                : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
            }`}
            title={t.header.language}
          >
            <Globe className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            <span className="font-mono text-[11px] uppercase tracking-wider">{currentLangObj.short}</span>
          </button>

          {langDropdownOpen && (
            <div
              className={`absolute right-0 top-full mt-2 w-44 rounded-2xl shadow-2xl p-1.5 z-50 animate-in fade-in slide-in-from-top-2 border ${
                theme === 'dark'
                  ? 'bg-slate-900 border-slate-800 text-slate-200'
                  : 'bg-white border-slate-200 text-slate-800'
              }`}
            >
              <div className={`px-2 py-1 text-[10px] font-mono font-semibold uppercase border-b mb-1 ${
                theme === 'dark' ? 'text-slate-400 border-slate-800' : 'text-slate-500 border-slate-100'
              }`}>
                {t.header.language}
              </div>
              {languages.map((item) => (
                <button
                  key={item.code}
                  onClick={() => {
                    setLanguage(item.code);
                    setLangDropdownOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                    language === item.code
                      ? 'bg-blue-600/20 text-blue-400 font-semibold border border-blue-500/30'
                      : theme === 'dark'
                      ? 'text-slate-300 hover:bg-slate-800'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="font-semibold text-xs">{item.label}</span>
                  </span>
                  {language === item.code && <Check className="w-3.5 h-3.5 text-blue-500 shrink-0" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* User Profile Info & Click-to-Profile Avatar */}
        <div
          className={`flex items-center gap-1.5 sm:gap-2.5 pl-1.5 sm:pl-3 border-l shrink-0 ${
            theme === 'dark' ? 'border-slate-800' : 'border-slate-200'
          }`}
        >
          {/* User Name on top, Role/Função below */}
          <div className="text-right hidden md:block">
            <div
              className={`text-xs font-bold leading-tight ${
                theme === 'dark' ? 'text-white' : 'text-slate-900'
              }`}
            >
              {currentUser?.nome || 'Sr. António Okica de Sá'}
            </div>
            <div className="mt-0.5 flex justify-end">
              {getRoleBadge(currentUser?.role || currentUser?.funcao || 'faturacao')}
            </div>
          </div>

          {/* User Avatar Button: Clicking opens Profile Modal */}
          <button
            id="user-avatar-btn"
            type="button"
            onClick={onOpenProfile}
            title="Clique para abrir e gerir o seu Perfil & Senha"
            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center font-bold text-xs sm:text-sm transition-all overflow-hidden relative border cursor-pointer hover:ring-2 hover:ring-blue-500 shadow-sm shrink-0 ${
              theme === 'dark'
                ? 'bg-slate-800 border-slate-700 text-slate-200'
                : 'bg-white border-slate-300 text-slate-800'
            }`}
          >
            {currentUser?.fotoUrl || currentUser?.avatar ? (
              <img
                src={currentUser.avatar || currentUser.fotoUrl}
                alt={currentUser.nome}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-blue-600 font-bold">{(currentUser?.nome || 'S').charAt(0).toUpperCase()}</span>
            )}
            <span
              className={`absolute bottom-0 right-0 w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full border-2 ${
                theme === 'dark' ? 'border-slate-900' : 'border-white'
              } ${currentUser?.status === 'Inativo' ? 'bg-rose-500' : 'bg-emerald-500'}`}
              title={currentUser?.status === 'Inativo' ? 'Inativo' : 'Sessão Ativa'}
            />
          </button>

          {/* Dedicated Logout Button (Fechar Conta) */}
          {onLogout && (
            <button
              onClick={onLogout}
              title="Terminar Sessão (Fechar Conta)"
              className={`p-1.5 sm:p-2 rounded-xl transition-all shadow-sm flex items-center justify-center shrink-0 cursor-pointer ${
                theme === 'dark'
                  ? 'text-rose-400 hover:text-white hover:bg-rose-600/20 border border-slate-800'
                  : 'bg-[#e01e37] hover:bg-rose-600 text-white border border-rose-600 shadow-rose-600/20'
              }`}
            >
              <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
