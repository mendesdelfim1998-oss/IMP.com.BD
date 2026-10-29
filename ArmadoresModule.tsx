import { useState, FormEvent } from 'react';
import { Briefcase, Plus, Search, Flag, Mail, Phone, Ship } from 'lucide-react';
import { Armador } from '../../types';
import { useTheme } from '../../context/ThemeContext';

interface ArmadoresModuleProps {
  armadores: Armador[];
  onAddArmador: (armador: Armador) => void;
}

export function ArmadoresModule({ armadores, onAddArmador }: ArmadoresModuleProps) {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    nomeRazaoSocial: '',
    paisOrigem: '',
    tipoEntidade: 'Nacional' as 'Nacional' | 'Estrangeiro',
    contactoOficial: '',
    email: '',
    frotaContada: 1
  });

  const filtered = armadores.filter(a =>
    a.nomeRazaoSocial.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.paisOrigem.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onAddArmador({
      id: `ARM-${Date.now().toString().slice(-3)}`,
      ...formData
    });
    setShowModal(false);
    setFormData({
      nomeRazaoSocial: '',
      paisOrigem: '',
      tipoEntidade: 'Nacional',
      contactoOficial: '',
      email: '',
      frotaContada: 1
    });
  };

  return (
    <div id="armadores-module" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2
            className={`text-xl font-bold tracking-tight flex items-center gap-2 ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}
          >
            <Briefcase className="w-5 h-5 text-blue-500" />
            Armadores & Operadores de Frotas Marítimas
          </h2>
          <p className={theme === 'dark' ? 'text-slate-400 text-xs' : 'text-slate-500 text-xs'}>
            Proprietários de navios, companhias de transporte e armadores nacionais e internacionais
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition-colors shadow-lg shadow-blue-600/20"
        >
          <Plus className="w-4 h-4" />
          Registar Armador
        </button>
      </div>

      <div
        className={`flex items-center gap-3 p-3 rounded-2xl border ${
          theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/80 shadow-sm'
        }`}
      >
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Pesquisar por razão social do armador ou país de origem..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`bg-transparent text-xs focus:outline-none w-full ${
            theme === 'dark' ? 'text-white placeholder-slate-500' : 'text-slate-900 placeholder-slate-400'
          }`}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((armador) => (
          <div
            key={armador.id}
            className={`p-5 rounded-2xl border space-y-4 transition-all ${
              theme === 'dark'
                ? 'bg-slate-900 border-slate-800 hover:border-slate-700'
                : 'bg-white border-slate-200/80 shadow-sm hover:border-blue-300 hover:shadow-md'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                    theme === 'dark'
                      ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                      : 'bg-blue-50 text-blue-700 border-blue-200'
                  }`}
                >
                  {armador.id}
                </span>
                <h3 className={`font-bold text-base mt-1 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  {armador.nomeRazaoSocial}
                </h3>
              </div>
              <span
                className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                  armador.tipoEntidade === 'Nacional'
                    ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                    : 'bg-purple-500/10 text-purple-600 border-purple-500/20'
                }`}
              >
                {armador.tipoEntidade}
              </span>
            </div>

            <div
              className={`space-y-1.5 text-xs font-mono p-3 rounded-xl border ${
                theme === 'dark'
                  ? 'bg-slate-950 border-slate-800/80 text-slate-300'
                  : 'bg-slate-50 border-slate-200/80 text-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-slate-500">PAÍS DE ORIGEM:</span>
                <span className={`font-sans flex items-center gap-1 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  <Flag className="w-3 h-3 text-amber-500"/> {armador.paisOrigem}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">CONTACTO:</span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3 text-slate-400"/> {armador.contactoOficial}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">EMAIL:</span>
                <span className="flex items-center gap-1">
                  <Mail className="w-3 h-3 text-slate-400"/> {armador.email}
                </span>
              </div>
            </div>

            <div
              className={`flex items-center justify-between pt-2 border-t text-xs ${
                theme === 'dark' ? 'border-slate-800' : 'border-slate-100'
              }`}
            >
              <span className={`flex items-center gap-1.5 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                <Ship className="w-4 h-4 text-blue-500"/> Frota Registada:
              </span>
              <span className="font-bold font-mono text-emerald-500 text-sm">{armador.frotaContada} Embarcações</span>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div
            className={`border rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl ${
              theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              Registar Novo Armador
            </h3>
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-500 mb-1">Razão Social / Empresa Armadora</label>
                <input
                  type="text"
                  required
                  value={formData.nomeRazaoSocial}
                  onChange={e => setFormData({ ...formData, nomeRazaoSocial: e.target.value })}
                  className={`w-full rounded-xl px-3 py-2 border focus:outline-none focus:border-blue-500 ${
                    theme === 'dark' ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                  placeholder="Ex: Maersk Line West Africa"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 mb-1">País de Origem</label>
                  <input
                    type="text"
                    required
                    value={formData.paisOrigem}
                    onChange={e => setFormData({ ...formData, paisOrigem: e.target.value })}
                    className={`w-full rounded-xl px-3 py-2 border focus:outline-none focus:border-blue-500 ${
                      theme === 'dark' ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                    placeholder="Ex: Guiné-Bissau / França"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">Tipo de Entidade</label>
                  <select
                    value={formData.tipoEntidade}
                    onChange={e => setFormData({ ...formData, tipoEntidade: e.target.value as any })}
                    className={`w-full rounded-xl px-3 py-2 border focus:outline-none focus:border-blue-500 ${
                      theme === 'dark' ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  >
                    <option value="Nacional">Nacional (Guiné-Bissau)</option>
                    <option value="Estrangeiro">Estrangeiro</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 mb-1">Contacto Telefónico</label>
                  <input
                    type="text"
                    required
                    value={formData.contactoOficial}
                    onChange={e => setFormData({ ...formData, contactoOficial: e.target.value })}
                    className={`w-full rounded-xl px-3 py-2 border focus:outline-none focus:border-blue-500 ${
                      theme === 'dark' ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                    placeholder="+245 95 000 00 00"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">Email Oficial</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full rounded-xl px-3 py-2 border focus:outline-none focus:border-blue-500 ${
                      theme === 'dark' ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                    placeholder="contacto@armador.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-500 mb-1">Número Inicial de Embarcações na Frota</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={formData.frotaContada}
                  onChange={e => setFormData({ ...formData, frotaContada: parseInt(e.target.value) || 1 })}
                  className={`w-full rounded-xl px-3 py-2 border focus:outline-none focus:border-blue-500 ${
                    theme === 'dark' ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>
              <div className={`flex justify-end gap-3 pt-3 border-t ${theme === 'dark' ? 'border-slate-800' : 'border-slate-200'}`}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className={`px-4 py-2 rounded-xl font-semibold transition-colors ${
                    theme === 'dark' ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold shadow-lg shadow-blue-600/20"
                >
                  Guardar Armador
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
