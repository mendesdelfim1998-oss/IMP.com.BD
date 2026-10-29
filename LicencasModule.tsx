import { useState, FormEvent } from 'react';
import { FileCheck2, Plus, Search } from 'lucide-react';
import { LicencaNavegacao } from '../../types';
import { useTheme } from '../../context/ThemeContext';

interface LicencasModuleProps {
  licencas: LicencaNavegacao[];
  onAddLicenca: (licenca: LicencaNavegacao) => void;
}

export function LicencasModule({ licencas, onAddLicenca }: LicencasModuleProps) {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    titular: '',
    tipoActividade: 'Transporte de Passageiros' as LicencaNavegacao['tipoActividade']
  });

  const filtered = licencas.filter(l =>
    l.numeroLicenca.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.titular.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const now = new Date().toISOString().split('T')[0];
    const exp = new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0];
    onAddLicenca({
      id: `LIC-${Date.now().toString().slice(-4)}`,
      numeroLicenca: `LIC-NAV-2026/${(licencas.length + 10).toString().padStart(3, '0')}`,
      titular: formData.titular || 'Empresa Marítima Guineense',
      tipoActividade: formData.tipoActividade,
      dataConcessao: now,
      dataValidade: exp,
      status: 'Válida'
    });
    setShowModal(false);
  };

  return (
    <div id="licencas-module" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className={`text-xl font-bold tracking-tight flex items-center gap-2 ${
            theme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}>
            <FileCheck2 className="w-5 h-5 text-blue-500" />
            Licenças de Navegação, Cabotagem & Actividade Marítima
          </h2>
          <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
            Licenciamento de pesca comercial, transporte fluvial de passageiros e tráfego local
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition-colors shadow-lg shadow-blue-600/20"
        >
          <Plus className="w-4 h-4" />
          Emitir Licença de Actividade
        </button>
      </div>

      <div className={`flex items-center gap-3 p-3 rounded-2xl border ${
        theme === 'dark'
          ? 'bg-slate-900 border-slate-800'
          : 'bg-white border-slate-200/90 shadow-sm'
      }`}>
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Pesquisar por número da licença ou empresa titular..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`bg-transparent text-xs focus:outline-none w-full ${
            theme === 'dark' ? 'text-white placeholder-slate-500' : 'text-slate-900 placeholder-slate-400'
          }`}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((lic) => (
          <div
            key={lic.id}
            className={`p-5 rounded-2xl border space-y-4 transition-colors ${
              theme === 'dark'
                ? 'bg-slate-900 border-slate-800 hover:border-slate-700'
                : 'bg-white border-slate-200/90 hover:border-blue-300 shadow-sm'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded border border-blue-500/20 font-bold">
                  {lic.numeroLicenca}
                </span>
                <h3 className={`font-bold text-base mt-1.5 ${
                  theme === 'dark' ? 'text-white' : 'text-slate-900'
                }`}>{lic.titular}</h3>
                <p className={`text-xs font-semibold mt-0.5 ${
                  theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
                }`}>Actividade: {lic.tipoActividade}</p>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                lic.status === 'Válida'
                  ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
              }`}>
                {lic.status}
              </span>
            </div>

            <div className={`space-y-1.5 text-xs font-mono p-3 rounded-xl border ${
              theme === 'dark'
                ? 'bg-slate-950 border-slate-800 text-slate-300'
                : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}>
              <div className="flex justify-between">
                <span className={theme === 'dark' ? 'text-slate-500' : 'text-slate-500'}>DATA CONCESSÃO:</span>
                <span className={theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}>{lic.dataConcessao}</span>
              </div>
              <div className="flex justify-between">
                <span className={theme === 'dark' ? 'text-slate-500' : 'text-slate-500'}>DATA VALIDADE:</span>
                <span className="text-blue-500 font-bold">{lic.dataValidade}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`border rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl ${
            theme === 'dark' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              Emitir Licença de Navegação
            </h3>
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className={`block mb-1 font-semibold ${theme === 'dark' ? 'text-slate-400' : 'text-slate-700'}`}>
                  Empresa / Titular Requerente
                </label>
                <input
                  type="text"
                  required
                  value={formData.titular}
                  onChange={e => setFormData({ ...formData, titular: e.target.value })}
                  className={`w-full rounded-xl px-3 py-2 border outline-none ${
                    theme === 'dark'
                      ? 'bg-slate-950 border-slate-800 text-white'
                      : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                  placeholder="Ex: Companhia Fluvial das Bijagós"
                />
              </div>
              <div>
                <label className={`block mb-1 font-semibold ${theme === 'dark' ? 'text-slate-400' : 'text-slate-700'}`}>
                  Tipo de Actividade Marítima
                </label>
                <select
                  value={formData.tipoActividade}
                  onChange={e => setFormData({ ...formData, tipoActividade: e.target.value as any })}
                  className={`w-full rounded-xl px-3 py-2 border outline-none ${
                    theme === 'dark'
                      ? 'bg-slate-950 border-slate-800 text-white'
                      : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                >
                  <option value="Transporte de Passageiros">Transporte de Passageiros e Ferry</option>
                  <option value="Pesca Comercial">Pesca Comercial Nacional</option>
                  <option value="Tráfego Local / Cabotagem">Tráfego Local / Cabotagem Fluvial</option>
                  <option value="Serviços Portuários">Serviços Portuários e Rebocadores</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className={`px-4 py-2 rounded-xl font-semibold transition-colors ${
                    theme === 'dark'
                      ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold shadow-lg shadow-blue-600/20"
                >
                  Conceder Licença
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
