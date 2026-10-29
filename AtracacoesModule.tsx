import { useState, FormEvent } from 'react';
import { Anchor, Plus } from 'lucide-react';
import { Atracacao, Embarcacao, PortoTerminal } from '../../types';
import { useTheme } from '../../context/ThemeContext';

interface AtracacoesModuleProps {
  atracacoes: Atracacao[];
  embarcacoes: Embarcacao[];
  portos: PortoTerminal[];
  onAddAtracacao: (atracacao: Atracacao) => void;
  onUpdateStatus: (id: string, newStatus: any) => void;
}

export function AtracacoesModule({ atracacoes, embarcacoes, portos, onAddAtracacao, onUpdateStatus }: AtracacoesModuleProps) {
  const { theme } = useTheme();
  const [showModal, setShowModal] = useState(false);
  const [selectedEmbId, setSelectedEmbId] = useState(embarcacoes[0]?.id || '');
  const [selectedPortoId, setSelectedPortoId] = useState(portos[0]?.id || '');
  const [caisInput, setCaisInput] = useState('Cais Principal - Posto 02');
  const [etaInput, setEtaInput] = useState('2026-08-09 10:00');
  const [etdInput, setEtdInput] = useState('2026-08-11 16:00');
  const [cargaInput, setCargaInput] = useState('Contentores & Carga Geral');
  const [toneladasInput, setToneladasInput] = useState(5000);

  const handleCreateAtracacao = (evt: FormEvent) => {
    evt.preventDefault();
    const emb = embarcacoes.find(e => e.id === selectedEmbId);
    const porto = portos.find(p => p.id === selectedPortoId);

    if (!emb || !porto) return;

    const newAtr: Atracacao = {
      id: `ATR-${Date.now()}`,
      codigoEscala: `ESC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      embarcacaoId: emb.id,
      embarcacaoNome: emb.nome,
      agenciaNome: emb.agenciaNome,
      portoNome: porto.nomePorto,
      caisDesignado: caisInput,
      dataChegadaPrevista: etaInput,
      dataSaidaPrevista: etdInput,
      status: 'Anunciada',
      servicosSolicitados: ['Pilotagem', 'Rebocador', 'Amarraçao'],
      manifestoCarga: {
        tipoCarga: cargaInput,
        quantidadeToneladas: Number(toneladasInput),
        operacao: 'Descarga'
      }
    };

    onAddAtracacao(newAtr);
    setShowModal(false);
  };

  return (
    <div id="atracacoes-module" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2
            className={`text-xl font-bold tracking-tight flex items-center gap-2 ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}
          >
            <Anchor className="w-5 h-5 text-blue-500" />
            Gestão de Escalas, Atracações & Pilotagem
          </h2>
          <p className={theme === 'dark' ? 'text-slate-400 text-xs' : 'text-slate-500 text-xs'}>
            Controle de manifesto de carga, entrada/saída de navios e alocação de cais
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors shadow-lg shadow-blue-600/20"
        >
          <Plus className="w-4 h-4" />
          Anunciar Nova Chegada (ETA)
        </button>
      </div>

      {/* Escalas Grid / Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {atracacoes.map((atr) => (
          <div
            key={atr.id}
            className={`p-5 rounded-2xl border space-y-4 transition-all ${
              theme === 'dark'
                ? 'bg-slate-900 border-slate-800 hover:border-slate-700'
                : 'bg-white border-slate-200/80 shadow-sm hover:border-blue-300 hover:shadow-md'
            }`}
          >
            <div
              className={`flex items-start justify-between border-b pb-3 ${
                theme === 'dark' ? 'border-slate-800' : 'border-slate-100'
              }`}
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className={`font-bold text-base ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    {atr.embarcacaoNome}
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-mono border ${
                      theme === 'dark'
                        ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                        : 'bg-blue-50 text-blue-700 border-blue-200'
                    }`}
                  >
                    {atr.codigoEscala}
                  </span>
                </div>
                <div className={`text-xs mt-1 flex items-center gap-2 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                  <span>{atr.agenciaNome}</span>
                  <span>•</span>
                  <span className={theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}>{atr.portoNome}</span>
                </div>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                  atr.status === 'Em Operação'
                    ? 'bg-blue-500/10 text-blue-600 border-blue-500/20'
                    : atr.status === 'Anunciada'
                    ? 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                    : 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                }`}
              >
                {atr.status}
              </span>
            </div>

            <div
              className={`grid grid-cols-2 gap-3 text-xs font-mono p-3 rounded-xl border ${
                theme === 'dark' ? 'bg-slate-950 border-slate-800/80' : 'bg-slate-50 border-slate-200/80'
              }`}
            >
              <div>
                <span className="text-slate-500 text-[10px] block uppercase">Posto / Cais Alocado</span>
                <span className={`font-semibold ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>
                  {atr.caisDesignado}
                </span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block uppercase">Carga & Movimentação</span>
                <span className={`font-semibold ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>
                  {atr.manifestoCarga.quantidadeToneladas.toLocaleString()} Ton ({atr.manifestoCarga.operacao})
                </span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block uppercase">ETA (Chegada)</span>
                <span className="text-emerald-500 font-bold">{atr.dataChegadaPrevista}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block uppercase">ETD (Saída)</span>
                <span className="text-rose-500 font-bold">{atr.dataSaidaPrevista}</span>
              </div>
            </div>

            {/* Services badges */}
            <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
              <span className="text-slate-500 font-medium mr-1">Serviços:</span>
              {atr.servicosSolicitados.map((srv, idx) => (
                <span
                  key={idx}
                  className={`px-2 py-0.5 rounded border ${
                    theme === 'dark'
                      ? 'bg-slate-800 text-slate-300 border-slate-700'
                      : 'bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  {srv}
                </span>
              ))}
            </div>

            {/* Quick Status Action Controls */}
            <div
              className={`pt-2 border-t flex items-center justify-between text-xs ${
                theme === 'dark' ? 'border-slate-800/80' : 'border-slate-100'
              }`}
            >
              <span className="text-slate-500">Alterar Estado Operacional:</span>
              <div className="flex items-center gap-1.5">
                {atr.status === 'Anunciada' && (
                  <button
                    onClick={() => onUpdateStatus(atr.id, 'Em Operação')}
                    className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors"
                  >
                    Confirmar Atracação
                  </button>
                )}
                {atr.status === 'Em Operação' && (
                  <button
                    onClick={() => onUpdateStatus(atr.id, 'Desatracada')}
                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-colors"
                  >
                    Registar Desatracação (Saída)
                  </button>
                )}
                {atr.status === 'Desatracada' && (
                  <span className="text-emerald-500 font-mono text-[11px] font-bold">Escala Concluída</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Novo Anúncio de Escala */}
      {showModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div
            className={`border rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl ${
              theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            <h3 className={`text-lg font-bold flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              <Anchor className="w-5 h-5 text-blue-500" />
              Registar Anúncio de Chegada (ETA)
            </h3>

            <form onSubmit={handleCreateAtracacao} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-500 mb-1 font-medium">Selecionar Embarcação</label>
                <select
                  value={selectedEmbId}
                  onChange={(e) => setSelectedEmbId(e.target.value)}
                  className={`w-full rounded-xl px-3 py-2 border focus:outline-none focus:border-blue-500 ${
                    theme === 'dark' ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                >
                  {embarcacoes.map(e => (
                    <option key={e.id} value={e.id}>{e.nome} ({e.numeroIMO}) - Agência: {e.agenciaNome}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 mb-1 font-medium">Porto de Destino</label>
                  <select
                    value={selectedPortoId}
                    onChange={(e) => setSelectedPortoId(e.target.value)}
                    className={`w-full rounded-xl px-3 py-2 border focus:outline-none focus:border-blue-500 ${
                      theme === 'dark' ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  >
                    {portos.map(p => (
                      <option key={p.id} value={p.id}>{p.nomePorto}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-500 mb-1 font-medium">Cais Designado</label>
                  <input
                    type="text"
                    value={caisInput}
                    onChange={(e) => setCaisInput(e.target.value)}
                    className={`w-full rounded-xl px-3 py-2 border focus:outline-none focus:border-blue-500 ${
                      theme === 'dark' ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 mb-1 font-medium">Data/Hora ETA (Chegada)</label>
                  <input
                    type="text"
                    value={etaInput}
                    onChange={(e) => setEtaInput(e.target.value)}
                    className={`w-full rounded-xl px-3 py-2 border focus:outline-none focus:border-blue-500 ${
                      theme === 'dark' ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1 font-medium">Data/Hora ETD (Saída)</label>
                  <input
                    type="text"
                    value={etdInput}
                    onChange={(e) => setEtdInput(e.target.value)}
                    className={`w-full rounded-xl px-3 py-2 border focus:outline-none focus:border-blue-500 ${
                      theme === 'dark' ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 mb-1 font-medium">Descrição Carga</label>
                  <input
                    type="text"
                    value={cargaInput}
                    onChange={(e) => setCargaInput(e.target.value)}
                    className={`w-full rounded-xl px-3 py-2 border focus:outline-none focus:border-blue-500 ${
                      theme === 'dark' ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1 font-medium">Volume (Toneladas)</label>
                  <input
                    type="number"
                    value={toneladasInput}
                    onChange={(e) => setToneladasInput(Number(e.target.value))}
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
                  Submeter Anúncio de Escala
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
