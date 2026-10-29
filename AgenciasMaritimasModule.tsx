import { useState, FormEvent } from 'react';
import { Building2, Plus, Search, Phone, Mail, MapPin, Award } from 'lucide-react';
import { AgenciaMaritima } from '../../types';
import { useTheme } from '../../context/ThemeContext';

interface AgenciasMaritimasModuleProps {
  agencias: AgenciaMaritima[];
  onAddAgencia: (agencia: AgenciaMaritima) => void;
}

export function AgenciasMaritimasModule({ agencias, onAddAgencia }: AgenciasMaritimasModuleProps) {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    nomeComercial: '',
    nif: '',
    licencaAtividade: '',
    responsavelLegal: '',
    telefone: '',
    email: '',
    endereco: '',
    embarcacoesRepresentadas: 1
  });

  const filtered = agencias.filter(a =>
    a.nomeComercial.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.nif.includes(searchTerm) ||
    a.responsavelLegal.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onAddAgencia({
      id: `AGE-${Date.now().toString().slice(-3)}`,
      ...formData,
      status: 'Ativa'
    });
    setShowModal(false);
    setFormData({
      nomeComercial: '',
      nif: '',
      licencaAtividade: '',
      responsavelLegal: '',
      telefone: '',
      email: '',
      endereco: '',
      embarcacoesRepresentadas: 1
    });
  };

  return (
    <div id="agencias-maritimas-module" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2
            className={`text-xl font-bold tracking-tight flex items-center gap-2 ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}
          >
            <Building2 className="w-5 h-5 text-blue-500" />
            Agências Marítimas & Consignatários de Navegação
          </h2>
          <p className={theme === 'dark' ? 'text-slate-400 text-xs' : 'text-slate-500 text-xs'}>
            Licenciamento e registo de agências de agenciamento em portos guineenses
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition-colors shadow-lg shadow-blue-600/20"
        >
          <Plus className="w-4 h-4" />
          Registar Agência
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
          placeholder="Pesquisar por nome comercial, NIF ou responsável legal..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`bg-transparent text-xs focus:outline-none w-full ${
            theme === 'dark' ? 'text-white placeholder-slate-500' : 'text-slate-900 placeholder-slate-400'
          }`}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((agencia) => (
          <div
            key={agencia.id}
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
                  NIF: {agencia.nif}
                </span>
                <h3 className={`font-bold text-base mt-1 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  {agencia.nomeComercial}
                </h3>
                <p className={`text-xs flex items-center gap-1.5 mt-0.5 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                  <Award className="w-3.5 h-3.5 text-amber-500" />
                  {agencia.licencaAtividade}
                </p>
              </div>
              <span
                className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                  agencia.status === 'Ativa'
                    ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                    : 'bg-red-500/10 text-red-600 border-red-500/20'
                }`}
              >
                {agencia.status}
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
                <span className="text-slate-500">RESPONSÁVEL:</span>
                <span className={`font-sans font-medium ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  {agencia.responsavelLegal}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">TELEFONE:</span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3 text-slate-400"/> {agencia.telefone}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">EMAIL:</span>
                <span className="flex items-center gap-1">
                  <Mail className="w-3 h-3 text-slate-400"/> {agencia.email}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">ENDEREÇO:</span>
                <span className="flex items-center gap-1 text-[11px] text-slate-500">
                  <MapPin className="w-3 h-3 text-slate-400"/> {agencia.endereco}
                </span>
              </div>
            </div>

            <div
              className={`flex items-center justify-between pt-2 border-t text-xs ${
                theme === 'dark' ? 'border-slate-800' : 'border-slate-100'
              }`}
            >
              <span className={theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}>Embarcações Representadas:</span>
              <span className="font-bold font-mono text-blue-500">{agencia.embarcacoesRepresentadas} Navios</span>
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
              Registar Nova Agência Marítima
            </h3>
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-500 mb-1">Nome Comercial / Razão Social</label>
                <input
                  type="text"
                  required
                  value={formData.nomeComercial}
                  onChange={e => setFormData({ ...formData, nomeComercial: e.target.value })}
                  className={`w-full rounded-xl px-3 py-2 border focus:outline-none focus:border-blue-500 ${
                    theme === 'dark' ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                  placeholder="Ex: Agência Marítima Geba Lda"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 mb-1">NIF</label>
                  <input
                    type="text"
                    required
                    value={formData.nif}
                    onChange={e => setFormData({ ...formData, nif: e.target.value })}
                    className={`w-full rounded-xl px-3 py-2 border focus:outline-none focus:border-blue-500 ${
                      theme === 'dark' ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                    placeholder="500123999"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">Licença de Actividade IMP</label>
                  <input
                    type="text"
                    required
                    value={formData.licencaAtividade}
                    onChange={e => setFormData({ ...formData, licencaAtividade: e.target.value })}
                    className={`w-full rounded-xl px-3 py-2 border focus:outline-none focus:border-blue-500 ${
                      theme === 'dark' ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                    placeholder="LIC-AMP-2026/01"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-500 mb-1">Responsável Legal</label>
                <input
                  type="text"
                  required
                  value={formData.responsavelLegal}
                  onChange={e => setFormData({ ...formData, responsavelLegal: e.target.value })}
                  className={`w-full rounded-xl px-3 py-2 border focus:outline-none focus:border-blue-500 ${
                    theme === 'dark' ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                  placeholder="Nome do Director de Operações"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 mb-1">Telefone Oficial</label>
                  <input
                    type="text"
                    required
                    value={formData.telefone}
                    onChange={e => setFormData({ ...formData, telefone: e.target.value })}
                    className={`w-full rounded-xl px-3 py-2 border focus:outline-none focus:border-blue-500 ${
                      theme === 'dark' ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                    placeholder="+245 95 000 00 00"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">Email de Contacto</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full rounded-xl px-3 py-2 border focus:outline-none focus:border-blue-500 ${
                      theme === 'dark' ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                    placeholder="agencia@email.gw"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-500 mb-1">Endereço Físico</label>
                <input
                  type="text"
                  required
                  value={formData.endereco}
                  onChange={e => setFormData({ ...formData, endereco: e.target.value })}
                  className={`w-full rounded-xl px-3 py-2 border focus:outline-none focus:border-blue-500 ${
                    theme === 'dark' ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                  placeholder="Av. Amílcar Cabral, Bissau"
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
                  Guardar Agência
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
