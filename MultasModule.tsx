import { useState, FormEvent } from 'react';
import { ShieldAlert, Plus, Search } from 'lucide-react';
import { MultaInfracao } from '../../types';
import { useTheme } from '../../context/ThemeContext';

interface MultasModuleProps {
  multas: MultaInfracao[];
  onAddMulta: (multa: MultaInfracao) => void;
}

export function MultasModule({ multas, onAddMulta }: MultasModuleProps) {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    embarcacaoOuEntidade: '',
    artigoViolado: 'Art. 42º do Código Marítimo de Bissau - Poluição das Águas Portuárias',
    descricaoInfracao: '',
    valorMultaXOF: 1000000
  });

  const filtered = multas.filter(m =>
    m.numeroAutoInfracao.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.embarcacaoOuEntidade.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onAddMulta({
      id: `MUL-${Date.now().toString().slice(-4)}`,
      numeroAutoInfracao: `AUTO-IMP-2026/${(multas.length + 5).toString().padStart(3, '0')}`,
      dataOcorrencia: new Date().toISOString().split('T')[0],
      embarcacaoOuEntidade: formData.embarcacaoOuEntidade || 'Navio Infractor',
      artigoViolado: formData.artigoViolado,
      descricaoInfracao: formData.descricaoInfracao,
      valorMultaXOF: formData.valorMultaXOF,
      statusMulta: 'Notificado'
    });
    setShowModal(false);
  };

  return (
    <div id="multas-module" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className={`text-xl font-bold tracking-tight flex items-center gap-2 ${
            theme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}>
            <ShieldAlert className="w-5 h-5 text-rose-500" />
            Multas, Contraordenações & Autos de Infração
          </h2>
          <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
            Aplicação do Código Marítimo de Bissau, fiscalização de ilícitos e cobrança de coimas
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold transition-colors shadow-lg shadow-rose-600/20"
        >
          <Plus className="w-4 h-4" />
          Lavrar Auto de Infração
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
          placeholder="Pesquisar por auto de infração, navio ou artigo violado..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`bg-transparent text-xs focus:outline-none w-full ${
            theme === 'dark' ? 'text-white placeholder-slate-500' : 'text-slate-900 placeholder-slate-400'
          }`}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((m) => (
          <div
            key={m.id}
            className={`p-5 rounded-2xl border space-y-4 transition-colors ${
              theme === 'dark'
                ? 'bg-slate-900 border-slate-800 hover:border-slate-700'
                : 'bg-white border-slate-200/90 hover:border-rose-300 shadow-sm'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono bg-rose-500/10 text-rose-500 px-2 py-0.5 rounded border border-rose-500/20 font-bold">
                  {m.numeroAutoInfracao}
                </span>
                <h3 className={`font-bold text-base mt-1.5 ${
                  theme === 'dark' ? 'text-white' : 'text-slate-900'
                }`}>{m.embarcacaoOuEntidade}</h3>
                <p className={`text-xs font-mono mt-0.5 ${
                  theme === 'dark' ? 'text-rose-300' : 'text-rose-700 font-semibold'
                }`}>{m.artigoViolado}</p>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                m.statusMulta === 'Pago'
                  ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
              }`}>
                {m.statusMulta}
              </span>
            </div>

            <div className={`space-y-1 text-xs p-3 rounded-xl border font-mono ${
              theme === 'dark'
                ? 'bg-slate-950 border-slate-800 text-slate-300'
                : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}>
              <div className="flex justify-between">
                <span className={theme === 'dark' ? 'text-slate-500' : 'text-slate-500'}>DATA DA OCORRÊNCIA:</span>
                <span>{m.dataOcorrencia}</span>
              </div>
              <div className={`flex justify-between border-t pt-1 ${
                theme === 'dark' ? 'border-slate-800' : 'border-slate-200'
              }`}>
                <span className={theme === 'dark' ? 'text-slate-500' : 'text-slate-500'}>VALOR DA COIMA:</span>
                <span className="text-rose-500 font-bold text-sm">{m.valorMultaXOF.toLocaleString('pt-PT')} XOF</span>
              </div>
            </div>

            <div className={`pt-2 border-t text-xs ${theme === 'dark' ? 'border-slate-800' : 'border-slate-100'}`}>
              <span className={`block text-[10px] uppercase font-mono font-semibold mb-1 ${
                theme === 'dark' ? 'text-slate-500' : 'text-slate-500'
              }`}>Descrição da Infração:</span>
              <p className={`p-2.5 rounded-lg border leading-relaxed ${
                theme === 'dark'
                  ? 'text-slate-300 bg-slate-950/60 border-slate-800/80'
                  : 'text-slate-700 bg-slate-50 border-slate-200'
              }`}>{m.descricaoInfracao}</p>
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
              Lavrar Auto de Infração Marítima
            </h3>
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className={`block mb-1 font-semibold ${theme === 'dark' ? 'text-slate-400' : 'text-slate-700'}`}>
                  Embarcação ou Entidade Infratora
                </label>
                <input
                  type="text"
                  required
                  value={formData.embarcacaoOuEntidade}
                  onChange={e => setFormData({ ...formData, embarcacaoOuEntidade: e.target.value })}
                  className={`w-full rounded-xl px-3 py-2 border outline-none ${
                    theme === 'dark'
                      ? 'bg-slate-950 border-slate-800 text-white'
                      : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                  placeholder="Ex: Pesqueiro Bijagós nº 4"
                />
              </div>
              <div>
                <label className={`block mb-1 font-semibold ${theme === 'dark' ? 'text-slate-400' : 'text-slate-700'}`}>
                  Artigo Violado do Código Marítimo
                </label>
                <input
                  type="text"
                  required
                  value={formData.artigoViolado}
                  onChange={e => setFormData({ ...formData, artigoViolado: e.target.value })}
                  className={`w-full rounded-xl px-3 py-2 border outline-none ${
                    theme === 'dark'
                      ? 'bg-slate-950 border-slate-800 text-white'
                      : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>
              <div>
                <label className={`block mb-1 font-semibold ${theme === 'dark' ? 'text-slate-400' : 'text-slate-700'}`}>
                  Valor da Multa (XOF)
                </label>
                <input
                  type="number"
                  required
                  value={formData.valorMultaXOF}
                  onChange={e => setFormData({ ...formData, valorMultaXOF: parseInt(e.target.value) || 0 })}
                  className={`w-full rounded-xl px-3 py-2 font-mono border outline-none ${
                    theme === 'dark'
                      ? 'bg-slate-950 border-slate-800 text-white'
                      : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>
              <div>
                <label className={`block mb-1 font-semibold ${theme === 'dark' ? 'text-slate-400' : 'text-slate-700'}`}>
                  Descrição Circunstanciada do Ilícito
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.descricaoInfracao}
                  onChange={e => setFormData({ ...formData, descricaoInfracao: e.target.value })}
                  className={`w-full rounded-xl px-3 py-2 border outline-none ${
                    theme === 'dark'
                      ? 'bg-slate-950 border-slate-800 text-white'
                      : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                  placeholder="Descrição detalhada das circunstâncias da infração detetada pelos inspectores..."
                ></textarea>
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
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-semibold shadow-lg shadow-rose-600/20"
                >
                  Registar Auto de Infração
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
