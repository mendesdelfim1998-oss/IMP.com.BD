import { useState, FormEvent } from 'react';
import { Ship, Search, Plus, Filter } from 'lucide-react';
import { Embarcacao } from '../../types';
import { useTheme } from '../../context/ThemeContext';

interface EmbarcacoesModuleProps {
  embarcacoes: Embarcacao[];
  onAddEmbarcacao: (emb: Embarcacao) => void;
}

export function EmbarcacoesModule({ embarcacoes, onAddEmbarcacao }: EmbarcacoesModuleProps) {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipo, setFilterTipo] = useState<string>('TODOS');
  const [showModal, setShowModal] = useState(false);

  const [formNome, setFormNome] = useState('');
  const [formIMO, setFormIMO] = useState('');
  const [formCallSign, setFormCallSign] = useState('');
  const [formBandeira, setFormBandeira] = useState('Guiné-Bissau');
  const [formTipo, setFormTipo] = useState<any>('Carga Geral');
  const [formGT, setFormGT] = useState(2500);

  const filtered = embarcacoes.filter(e => {
    const matchSearch = e.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        e.numeroIMO.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        e.indicativoChamada.toLowerCase().includes(searchTerm.toLowerCase());
    const matchTipo = filterTipo === 'TODOS' || e.tipo === filterTipo;
    return matchSearch && matchTipo;
  });

  const handleCreate = (evt: FormEvent) => {
    evt.preventDefault();
    if (!formNome || !formIMO) return;
    const newEmb: Embarcacao = {
      id: `EMB-${Date.now()}`,
      nome: formNome,
      numeroIMO: formIMO.startsWith('IMO') ? formIMO : `IMO${formIMO}`,
      indicativoChamada: formCallSign || 'J5NEW',
      bandeira: formBandeira,
      portoRegisto: formBandeira === 'Guiné-Bissau' ? 'Porto de Bissau' : 'Estrangeiro',
      tipo: formTipo,
      tonelagemBruta: Number(formGT),
      comprimentoForaFora: 95.0,
      caladoMaximo: 5.5,
      anoConstrucao: 2020,
      armadorId: 'ARM-101',
      armadorNome: 'Armador Registado IMP',
      agenciaId: 'AGE-201',
      agenciaNome: 'Agência Marítima e Portuária da Guiné (AMPG)',
      statusCertificacao: 'Válida'
    };
    onAddEmbarcacao(newEmb);
    setShowModal(false);
    setFormNome('');
    setFormIMO('');
  };

  return (
    <div id="embarcacoes-module" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2
            className={`text-xl font-bold tracking-tight flex items-center gap-2 ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}
          >
            <Ship className="w-5 h-5 text-blue-500" />
            Registo Marítimo de Embarcações
          </h2>
          <p className={theme === 'dark' ? 'text-slate-400 text-xs' : 'text-slate-500 text-xs'}>
            Cadastro de navios nacionais e estrangeiros, IMO, tonelagem e certidões
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors shadow-lg shadow-blue-600/20"
        >
          <Plus className="w-4 h-4" />
          Registar Nova Embarcação
        </button>
      </div>

      {/* Filters Bar */}
      <div
        className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${
          theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/80 shadow-sm'
        }`}
      >
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por Nome, IMO ou Call Sign..."
            className={`w-full rounded-xl pl-9 pr-4 py-2 text-xs border focus:outline-none focus:border-blue-500 ${
              theme === 'dark'
                ? 'bg-slate-950 border-slate-800 text-slate-200 placeholder-slate-500'
                : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
            }`}
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={filterTipo}
            onChange={(e) => setFilterTipo(e.target.value)}
            className={`rounded-xl px-3 py-2 text-xs border focus:outline-none focus:border-blue-500 w-full sm:w-auto ${
              theme === 'dark'
                ? 'bg-slate-950 border-slate-800 text-slate-300'
                : 'bg-slate-50 border-slate-200 text-slate-900'
            }`}
          >
            <option value="TODOS">Todos os Tipos de Embarcação</option>
            <option value="Porta-Contentores">Porta-Contentores</option>
            <option value="Petroleiro">Petroleiro</option>
            <option value="Passageiros / Ferry">Passageiros / Ferry</option>
            <option value="Pesqueiro">Pesqueiro</option>
            <option value="Carga Geral">Carga Geral</option>
          </select>
        </div>
      </div>

      {/* Vessels Table */}
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
                <th className="py-3 px-4">Embarcação / Identificação</th>
                <th className="py-3 px-4">IMO & Call Sign</th>
                <th className="py-3 px-4">Tipo & Bandeira</th>
                <th className="py-3 px-4">Tonelagem (GT)</th>
                <th className="py-3 px-4">Agência Representante</th>
                <th className="py-3 px-4">Certificação</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className={theme === 'dark' ? 'divide-y divide-slate-800/60' : 'divide-y divide-slate-100'}>
              {filtered.map((emb) => (
                <tr
                  key={emb.id}
                  className={`transition-colors ${
                    theme === 'dark' ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'
                  }`}
                >
                  <td className="py-3 px-4">
                    <div className={`font-semibold text-sm ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                      {emb.nome}
                    </div>
                    <div className="text-[11px] text-slate-400">{emb.portoRegisto}</div>
                  </td>
                  <td className="py-3 px-4 font-mono">
                    <div className={theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}>{emb.numeroIMO}</div>
                    <div className="text-blue-500 text-[11px]">CS: {emb.indicativoChamada}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className={`font-medium ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>
                      {emb.tipo}
                    </div>
                    <div className="text-slate-400 text-[11px]">{emb.bandeira}</div>
                  </td>
                  <td className={`py-3 px-4 font-mono ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>
                    {(emb.tonelagemBruta ?? 0).toLocaleString()} GT
                  </td>
                  <td className={`py-3 px-4 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                    {emb.agenciaNome}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                        emb.statusCertificacao === 'Válida'
                          ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                          : emb.statusCertificacao === 'Pendente'
                          ? 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                          : 'bg-rose-500/10 text-rose-600 border-rose-500/20'
                      }`}
                    >
                      {emb.statusCertificacao}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      className={`px-3 py-1 rounded-lg text-[11px] font-medium transition-colors border ${
                        theme === 'dark'
                          ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                      }`}
                    >
                      Ficha Técnica
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Nova Embarcação */}
      {showModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div
            className={`border rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl ${
              theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            <h3 className={`text-lg font-bold flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              <Ship className="w-5 h-5 text-blue-500" />
              Registar Embarcação no IMP
            </h3>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-500 mb-1 font-medium">Nome da Embarcação</label>
                <input
                  type="text"
                  required
                  value={formNome}
                  onChange={(e) => setFormNome(e.target.value)}
                  placeholder="Ex: MV Bissau Star"
                  className={`w-full rounded-xl px-3 py-2 border focus:outline-none focus:border-blue-500 ${
                    theme === 'dark' ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 mb-1 font-medium">Número IMO</label>
                  <input
                    type="text"
                    required
                    value={formIMO}
                    onChange={(e) => setFormIMO(e.target.value)}
                    placeholder="IMO991283"
                    className={`w-full rounded-xl px-3 py-2 border focus:outline-none focus:border-blue-500 ${
                      theme === 'dark' ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1 font-medium">Call Sign</label>
                  <input
                    type="text"
                    value={formCallSign}
                    onChange={(e) => setFormCallSign(e.target.value)}
                    placeholder="J5AB1"
                    className={`w-full rounded-xl px-3 py-2 border focus:outline-none focus:border-blue-500 ${
                      theme === 'dark' ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 mb-1 font-medium">Tipo</label>
                  <select
                    value={formTipo}
                    onChange={(e) => setFormTipo(e.target.value)}
                    className={`w-full rounded-xl px-3 py-2 border focus:outline-none focus:border-blue-500 ${
                      theme === 'dark' ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  >
                    <option value="Carga Geral">Carga Geral</option>
                    <option value="Porta-Contentores">Porta-Contentores</option>
                    <option value="Petroleiro">Petroleiro</option>
                    <option value="Passageiros / Ferry">Passageiros / Ferry</option>
                    <option value="Pesqueiro">Pesqueiro</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-500 mb-1 font-medium">Tonelagem Bruta (GT)</label>
                  <input
                    type="number"
                    value={formGT}
                    onChange={(e) => setFormGT(Number(e.target.value))}
                    className={`w-full rounded-xl px-3 py-2 border focus:outline-none focus:border-blue-500 ${
                      theme === 'dark' ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <div className={`flex items-center justify-end gap-3 pt-3 border-t ${theme === 'dark' ? 'border-slate-800' : 'border-slate-200'}`}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                    theme === 'dark' ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold shadow-lg shadow-blue-600/20"
                >
                  Gravar Registo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
