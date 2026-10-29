import { useState } from 'react';
import { Building2, Users, FileText, Plus, Phone, Mail, CheckCircle, ShieldAlert } from 'lucide-react';
import { AgenciaMaritima, Armador } from '../../types';

interface AgenciasArmadoresModuleProps {
  agencias: AgenciaMaritima[];
  armadores: Armador[];
}

export function AgenciasArmadoresModule({ agencias, armadores }: AgenciasArmadoresModuleProps) {
  const [activeTab, setActiveTab] = useState<'agencias' | 'armadores'>('agencias');

  return (
    <div id="agencias-armadores-module" className="space-y-6">
      {/* Module Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-400" />
            Agências Marítimas & Armadores
          </h2>
          <p className="text-slate-400 text-xs">Licenciamento de agentes de navegação, representantes legais e operadores de frota</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('agencias')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'agencias'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
              : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          Agências Marítimas ({agencias.length})
        </button>
        <button
          onClick={() => setActiveTab('armadores')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'armadores'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
              : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          Armadores & Frota ({armadores.length})
        </button>
      </div>

      {/* Agencias List */}
      {activeTab === 'agencias' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {agencias.map((ag) => (
            <div key={ag.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 hover:border-slate-700 transition-all">
              <div className="flex items-start justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="font-bold text-white text-base">{ag.nomeComercial}</h3>
                  <div className="text-xs text-slate-400 mt-0.5">NIF: <span className="font-mono text-slate-300">{ag.nif}</span></div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {ag.status}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-500">Licença de Actividade IMP:</span>
                  <span className="font-mono text-blue-400">{ag.licencaAtividade}</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-500">Responsável Legal:</span>
                  <span>{ag.responsavelLegal}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400 pt-1">
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  <span>{ag.telefone}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  <span>{ag.email}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>Representação em Bissau:</span>
                <span className="text-white font-bold">{ag.embarcacoesRepresentadas} embarcações</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Armadores List */}
      {activeTab === 'armadores' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {armadores.map((arm) => (
            <div key={arm.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 hover:border-slate-700 transition-all">
              <div className="border-b border-slate-800 pb-3">
                <span className="text-[10px] uppercase font-mono bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20">
                  {arm.tipoEntidade}
                </span>
                <h3 className="font-bold text-white text-base mt-2">{arm.nomeRazaoSocial}</h3>
                <div className="text-xs text-slate-400 mt-1">País: <span className="text-slate-200">{arm.paisOrigem}</span></div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="text-slate-400">
                  <span className="text-slate-500 block text-[10px] uppercase">Contacto Oficial</span>
                  <span className="text-slate-200">{arm.contactoOficial}</span>
                </div>
                <div className="text-slate-400">
                  <span className="text-slate-500 block text-[10px] uppercase">Email Corporativo</span>
                  <span className="text-slate-200">{arm.email}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-500">Frota Registada:</span>
                <span className="text-emerald-400 font-bold">{arm.frotaContada} navios</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
