import { useState } from 'react';
import { Compass, MapPin, Search } from 'lucide-react';
import { PortoTerminal } from '../../types';
import { useTheme } from '../../context/ThemeContext';

interface PortosModuleProps {
  portos: PortoTerminal[];
}

export function PortosModule({ portos }: PortosModuleProps) {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = portos.filter(p =>
    p.nomePorto.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.codigoUNLOCODE.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.localizacao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div id="portos-module" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2
            className={`text-xl font-bold tracking-tight flex items-center gap-2 ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}
          >
            <Compass className="w-5 h-5 text-blue-500" />
            Portos, Terminais & Zonas Marítimas da Guiné-Bissau
          </h2>
          <p className={theme === 'dark' ? 'text-slate-400 text-xs' : 'text-slate-500 text-xs'}>
            Infraestruturas portuárias, calados máximos, cais operacionais e regulação das águas jurisdicionais
          </p>
        </div>
      </div>

      <div
        className={`flex items-center gap-3 p-3 rounded-2xl border ${
          theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/80 shadow-sm'
        }`}
      >
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Pesquisar porto por nome, código UN/LOCODE ou localização..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`bg-transparent text-xs focus:outline-none w-full ${
            theme === 'dark' ? 'text-white placeholder-slate-500' : 'text-slate-900 placeholder-slate-400'
          }`}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filtered.map((porto) => (
          <div
            key={porto.id}
            className={`p-5 rounded-2xl border space-y-4 transition-all ${
              theme === 'dark'
                ? 'bg-slate-900 border-slate-800 hover:border-slate-700'
                : 'bg-white border-slate-200/80 shadow-sm hover:border-blue-300 hover:shadow-md'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <span
                  className={`text-[10px] font-mono px-2.5 py-1 rounded border font-bold ${
                    theme === 'dark'
                      ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                      : 'bg-blue-50 text-blue-700 border-blue-200'
                  }`}
                >
                  UN/LOCODE: {porto.codigoUNLOCODE}
                </span>
                <h3 className={`font-bold text-lg mt-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  {porto.nomePorto}
                </h3>
                <p className={`text-xs flex items-center gap-1 mt-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                  <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  {porto.localizacao}
                </p>
              </div>
            </div>

            <div
              className={`space-y-2 text-xs font-mono p-3 rounded-xl border ${
                theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200/80'
              }`}
            >
              <div className="flex justify-between">
                <span className="text-slate-500">CAIS DISPONÍVEIS:</span>
                <span className="text-emerald-500 font-bold">{porto.numCaisDisponiveis} Postos</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">CALADO MÁXIMO:</span>
                <span className="text-blue-500 font-bold">{porto.caladoMaximoPermitido} Metros</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">AUTORIDADE:</span>
                <span className={theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}>{porto.autoridadePortuaria}</span>
              </div>
            </div>

            <div className={`pt-2 border-t text-xs ${theme === 'dark' ? 'border-slate-800' : 'border-slate-100'}`}>
              <span className="text-slate-500 block mb-1 font-semibold text-[10px] uppercase tracking-wider">
                Capacidade Operacional:
              </span>
              <p
                className={`p-2.5 rounded-lg border leading-relaxed ${
                  theme === 'dark'
                    ? 'text-slate-300 bg-slate-950/60 border-slate-800/80'
                    : 'text-slate-700 bg-slate-50 border-slate-200/80'
                }`}
              >
                {porto.capacidadeOperacional}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
