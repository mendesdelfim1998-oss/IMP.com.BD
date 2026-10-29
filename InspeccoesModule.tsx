import { useState, FormEvent } from 'react';
import { ClipboardCheck, Plus, Search, CheckCircle2, XCircle } from 'lucide-react';
import { Inspeccao } from '../../types';
import { useTheme } from '../../context/ThemeContext';

interface InspeccoesModuleProps {
  inspeccoes: Inspeccao[];
  onAddInspeccao: (inspeccao: Inspeccao) => void;
}

export function InspeccoesModule({ inspeccoes, onAddInspeccao }: InspeccoesModuleProps) {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    embarcacaoNome: '',
    inspectorNome: 'Eng. Adama Baldé',
    tipoVistoria: 'Segurança da Navegação' as Inspeccao['tipoVistoria'],
    resultado: 'Aprovado' as Inspeccao['resultado'],
    observacoes: '',
    validadeMeses: 12
  });

  const filtered = inspeccoes.filter(i =>
    i.codigoInspeccao.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.embarcacaoNome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.inspectorNome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onAddInspeccao({
      id: `INSP-${Date.now().toString().slice(-4)}`,
      codigoInspeccao: `VIS-2026/${(inspeccoes.length + 50).toString().padStart(3, '0')}`,
      embarcacaoId: 'EMB-001',
      dataInspeccao: new Date().toISOString().split('T')[0],
      ...formData
    });
    setShowModal(false);
  };

  return (
    <div id="inspeccoes-module" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2
            className={`text-xl font-bold tracking-tight flex items-center gap-2 ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}
          >
            <ClipboardCheck className="w-5 h-5 text-blue-500" />
            Inspecções Marítimas & Port State Control (PSC)
          </h2>
          <p className={theme === 'dark' ? 'text-slate-400 text-xs' : 'text-slate-500 text-xs'}>
            Vistorias técnicas de segurança, prevenção de poluição MARPOL e retenção preventiva de navios
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition-colors shadow-lg shadow-blue-600/20"
        >
          <Plus className="w-4 h-4" />
          Registar Nova Vistoria
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
          placeholder="Pesquisar por código de inspecção, navio ou inspector..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`bg-transparent text-xs focus:outline-none w-full ${
            theme === 'dark' ? 'text-white placeholder-slate-500' : 'text-slate-900 placeholder-slate-400'
          }`}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((insp) => (
          <div
            key={insp.id}
            className={`p-5 rounded-2xl border space-y-4 transition-all ${
              theme === 'dark'
                ? 'bg-slate-900 border-slate-800 hover:border-slate-700'
                : 'bg-white border-slate-200/80 shadow-sm hover:border-blue-300 hover:shadow-md'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded border font-bold ${
                    theme === 'dark'
                      ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                      : 'bg-blue-50 text-blue-700 border-blue-200'
                  }`}
                >
                  {insp.codigoInspeccao}
                </span>
                <h3 className={`font-bold text-base mt-1.5 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  {insp.embarcacaoNome}
                </h3>
                <p className={`text-xs font-mono mt-0.5 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                  Tipo: {insp.tipoVistoria}
                </p>
              </div>
              <span
                className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 border ${
                  insp.resultado === 'Aprovado'
                    ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                    : insp.resultado === 'Aprovado com Recomendações'
                    ? 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                    : 'bg-red-500/10 text-red-600 border-red-500/20 font-mono'
                }`}
              >
                {insp.resultado === 'Aprovado' && <CheckCircle2 className="w-3 h-3"/>}
                {insp.resultado === 'Retido / Impedido' && <XCircle className="w-3 h-3"/>}
                {insp.resultado}
              </span>
            </div>

            <div
              className={`space-y-1.5 text-xs font-mono p-3 rounded-xl border ${
                theme === 'dark'
                  ? 'bg-slate-950 border-slate-800 text-slate-300'
                  : 'bg-slate-50 border-slate-200/80 text-slate-700'
              }`}
            >
              <div className="flex justify-between">
                <span className="text-slate-500">INSPECTOR RESPONSÁVEL:</span>
                <span className={`font-sans ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{insp.inspectorNome}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">DATA DA VISTORIA:</span>
                <span className={theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}>{insp.dataInspeccao}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">VALIDADE ATRIBUÍDA:</span>
                <span className="text-blue-500 font-bold">{insp.validadeMeses} Meses</span>
              </div>
            </div>

            <div className={`pt-2 border-t text-xs ${theme === 'dark' ? 'border-slate-800' : 'border-slate-100'}`}>
              <span className="text-slate-500 block text-[10px] uppercase font-mono font-semibold mb-1">
                Observações da Vistoria:
              </span>
              <p
                className={`p-2.5 rounded-lg border leading-relaxed ${
                  theme === 'dark'
                    ? 'text-slate-300 bg-slate-950/60 border-slate-800/80'
                    : 'text-slate-700 bg-slate-50 border-slate-200/80'
                }`}
              >
                {insp.observacoes}
              </p>
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
              Registar Vistoria Marítima
            </h3>
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-500 mb-1">Nome do Navio / Embarcação</label>
                <input
                  type="text"
                  required
                  value={formData.embarcacaoNome}
                  onChange={e => setFormData({ ...formData, embarcacaoNome: e.target.value })}
                  className={`w-full rounded-xl px-3 py-2 border focus:outline-none focus:border-blue-500 ${
                    theme === 'dark' ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                  placeholder="Ex: MV Rio Geba Express"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 mb-1">Tipo de Vistoria</label>
                  <select
                    value={formData.tipoVistoria}
                    onChange={e => setFormData({ ...formData, tipoVistoria: e.target.value as any })}
                    className={`w-full rounded-xl px-3 py-2 border focus:outline-none focus:border-blue-500 ${
                      theme === 'dark' ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  >
                    <option value="Segurança da Navegação">Segurança da Navegação</option>
                    <option value="Prevenção da Poluição (MARPOL)">Prevenção da Poluição (MARPOL)</option>
                    <option value="Condições de Habitabilidade">Condições de Habitabilidade</option>
                    <option value="Estrutural / Casco">Estrutural / Casco</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">Resultado da Inspecção</label>
                  <select
                    value={formData.resultado}
                    onChange={e => setFormData({ ...formData, resultado: e.target.value as any })}
                    className={`w-full rounded-xl px-3 py-2 border focus:outline-none focus:border-blue-500 ${
                      theme === 'dark' ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  >
                    <option value="Aprovado">Aprovado</option>
                    <option value="Aprovado com Recomendações">Aprovado com Recomendações</option>
                    <option value="Retido / Impedido">Retido / Impedido do Porto</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-slate-500 mb-1">Inspector Técnico</label>
                <input
                  type="text"
                  required
                  value={formData.inspectorNome}
                  onChange={e => setFormData({ ...formData, inspectorNome: e.target.value })}
                  className={`w-full rounded-xl px-3 py-2 border focus:outline-none focus:border-blue-500 ${
                    theme === 'dark' ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>
              <div>
                <label className="block text-slate-500 mb-1">Observações Técnicas / Deficiências</label>
                <textarea
                  required
                  rows={3}
                  value={formData.observacoes}
                  onChange={e => setFormData({ ...formData, observacoes: e.target.value })}
                  className={`w-full rounded-xl px-3 py-2 border focus:outline-none focus:border-blue-500 ${
                    theme === 'dark' ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                  placeholder="Relatório sintético dos equipamentos de emergência ou coletes de salvação..."
                ></textarea>
              </div>

              <div className={`flex justify-end gap-3 pt-3 border-t ${theme === 'dark' ? 'border-slate-800' : 'border-slate-200'}`}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className={`px-4 py-2 rounded-xl font-semibold transition-colors ${
                    theme === 'dark' ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold shadow-lg shadow-blue-600/20"
                >
                  Guardar Vistoria
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
