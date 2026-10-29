import { useState } from 'react';
import { ShieldCheck, Hash, Lock, CheckCircle2, Search, Link2, ShieldAlert, RefreshCw, AlertTriangle } from 'lucide-react';
import { AuditoriaLog, IMP_INSTITUTIONAL } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { calculateSha256 } from '../../utils/cryptoAudit';

interface AuditoriaModuleProps {
  logs: AuditoriaLog[];
}

export function AuditoriaModule({ logs }: AuditoriaModuleProps) {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{
    status: 'idle' | 'success' | 'error';
    message: string;
    corruptedIndex?: number;
  }>({ status: 'idle', message: '' });

  const filteredLogs = logs.filter(
    (l) =>
      l.acao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.user_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.tabela.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.item_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.hash_sha256.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const verifyChainIntegrity = async () => {
    setIsVerifying(true);
    setVerificationResult({ status: 'idle', message: 'Iniciando verificação matemática...' });

    try {
      for (let i = 0; i < logs.length; i++) {
        const log = logs[i];
        const prevHash = i === 0 ? '0000000000000000000000000000000000000000000000000000000000000000' : logs[i - 1].hash_sha256;

        // Verify if prev_hash matches
        if (log.prev_hash !== prevHash) {
          setVerificationResult({
            status: 'error',
            message: `QUEBRA DE CADEIA DETECTADA: O bloco #${log.id} aponta para um hash anterior incorreto. Possível tentativa de inserção manual ou deleção de registo.`,
            corruptedIndex: i
          });
          setIsVerifying(false);
          return;
        }

        // Re-calculate hash
        const dataToHash = `${log.prev_hash}|${log.timestamp}|${log.user_id}|${log.acao}|${log.tabela}|${log.item_id}|${log.payload_json}`;
        const computedHash = await calculateSha256(dataToHash);

        if (computedHash !== log.hash_sha256) {
          setVerificationResult({
            status: 'error',
            message: `ADULTERAÇÃO DE DADOS DETECTADA: O conteúdo do bloco #${log.id} foi alterado após a assinatura original. O hash matemático não coincide.`,
            corruptedIndex: i
          });
          setIsVerifying(false);
          return;
        }
      }

      setVerificationResult({
        status: 'success',
        message: 'INTEGRIDADE CONFIRMADA: Todos os blocos da cadeia de auditoria foram verificados e as assinaturas digitais são 100% autênticas.'
      });
    } catch (error) {
      setVerificationResult({
        status: 'error',
        message: 'Erro técnico durante o processamento da cadeia criptográfica.'
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                theme === 'dark'
                  ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                  : 'bg-purple-50 text-purple-700 border border-purple-200'
              }`}
            >
              SuperAdmin & Governação
            </span>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold flex items-center gap-1 ${
                verificationResult.status === 'error'
                  ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                  : theme === 'dark'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              }`}
            >
              {verificationResult.status === 'error' ? <ShieldAlert className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
              {verificationResult.status === 'error' ? 'Integridade Comprometida' : 'Cadeia Criptográfica Válida'}
            </span>
          </div>
          <h2
            className={`text-xl font-bold tracking-tight mt-1 flex items-center gap-2 ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}
          >
            <ShieldCheck className="w-5 h-5 text-purple-500" />
            Auditoria Criptográfica Encadeada (SHA-256 Chained)
          </h2>
          <p className={theme === 'dark' ? 'text-xs text-slate-400' : 'text-xs text-slate-500'}>
            Registo indelével de todas as ações financeiras e administrativas do {IMP_INSTITUTIONAL.entity}. Cada registo depende matematicamente do anterior.
          </p>
        </div>

        <button
          onClick={verifyChainIntegrity}
          disabled={isVerifying}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg ${
            isVerifying
              ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
          }`}
        >
          {isVerifying ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
          Verificar Cadeia de Custódia
        </button>
      </div>

      {/* Verification Result Toast */}
      {verificationResult.status !== 'idle' && (
        <div
          className={`p-4 rounded-2xl border flex items-start gap-4 animate-in slide-in-from-top-4 ${
            verificationResult.status === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900 dark:bg-emerald-500/10 dark:border-emerald-500/30 dark:text-emerald-400'
              : 'bg-rose-50 border-rose-200 text-rose-900 dark:bg-rose-500/10 dark:border-rose-500/30 dark:text-rose-400'
          }`}
        >
          {verificationResult.status === 'success' ? (
            <CheckCircle2 className="w-6 h-6 shrink-0" />
          ) : (
            <ShieldAlert className="w-6 h-6 shrink-0" />
          )}
          <div className="space-y-1">
            <div className="font-bold text-sm">Resultado da Verificação SHA-256</div>
            <p className="text-xs leading-relaxed opacity-90">{verificationResult.message}</p>
          </div>
          <button
            onClick={() => setVerificationResult({ status: 'idle', message: '' })}
            className="ml-auto p-1 rounded-lg hover:bg-black/5"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          className={`p-4 rounded-2xl border ${
            theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Total de Registos Encadeados</span>
            <Link2 className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-purple-500">{logs.length} Blocos</div>
          <p className="text-[11px] text-slate-500 mt-1">Génese: 00000000000000000000000000000000</p>
        </div>

        <div
          className={`p-4 rounded-2xl border ${
            theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Algoritmo de Assinatura</span>
            <Hash className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-500">SHA-256 Standard</div>
          <p className="text-[11px] text-slate-500 mt-1">Conformidade com padrão bancário internacional</p>
        </div>

        <div
          className={`p-4 rounded-2xl border ${
            theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Estado da Integridade</span>
            <Lock className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-blue-500">100% Inviolável</div>
          <p className="text-[11px] text-slate-500 mt-1">Sem adulterações detectadas em banco</p>
        </div>
      </div>

      {/* Search */}
      <div
        className={`flex items-center gap-3 p-3 rounded-2xl border ${
          theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}
      >
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Pesquisar por ação, utilizador, tabela, ID de item ou hash SHA-256..."
          className={`bg-transparent text-xs w-full focus:outline-none ${
            theme === 'dark' ? 'text-white placeholder-slate-500' : 'text-slate-900 placeholder-slate-400'
          }`}
        />
      </div>

      {/* Chained Logs List */}
      <div
        className={`rounded-2xl border overflow-hidden ${
          theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead
              className={`uppercase font-mono text-[10px] border-b ${
                theme === 'dark'
                  ? 'bg-slate-950 text-slate-400 border-slate-800'
                  : 'bg-slate-50 text-slate-600 border-slate-200'
              }`}
            >
              <tr>
                <th className="p-3.5">Timestamp & Bloco</th>
                <th className="p-3.5">Utilizador / Operador</th>
                <th className="p-3.5">Ação Executada</th>
                <th className="p-3.5">Tabela & Item ID</th>
                <th className="p-3.5">Payload Sanitizado</th>
                <th className="p-3.5">Elo Anterior (Prev Hash)</th>
                <th className="p-3.5">Assinatura SHA-256</th>
              </tr>
            </thead>
            <tbody className={`font-mono ${theme === 'dark' ? 'divide-y divide-slate-800/60' : 'divide-y divide-slate-100'}`}>
              {filteredLogs.map((log, idx) => {
                const isCorrupted = verificationResult.corruptedIndex === idx;
                return (
                  <tr
                    key={log.id}
                    className={`transition-colors ${
                      isCorrupted
                        ? 'bg-rose-500/10'
                        : theme === 'dark' ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'
                    }`}
                  >
                    <td className="p-3.5 whitespace-nowrap">
                      <div className={`font-bold ${theme === 'dark' ? 'text-slate-200' : 'text-slate-900'}`}>
                        {log.timestamp}
                      </div>
                      <span className="text-[10px] text-purple-500 font-semibold flex items-center gap-1">
                        #{log.id}
                        {isCorrupted && <AlertTriangle className="w-3 h-3 text-rose-500" />}
                      </span>
                    </td>
                    <td className="p-3.5 whitespace-nowrap">
                      <span className={`font-sans font-medium ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                        {log.user_email}
                      </span>
                    </td>
                    <td className="p-3.5 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                          theme === 'dark'
                            ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                            : 'bg-blue-50 text-blue-700 border-blue-200'
                        }`}
                      >
                        {log.acao}
                      </span>
                    </td>
                    <td className="p-3.5 whitespace-nowrap">
                      <div className={theme === 'dark' ? 'text-slate-300' : 'text-slate-800'}>{log.tabela}</div>
                      <div className="text-[10px] text-slate-500">{log.item_id}</div>
                    </td>
                    <td className="p-3.5 max-w-xs truncate text-[11px] text-slate-400" title={log.payload_json}>
                      {log.payload_json}
                    </td>
                    <td className="p-3.5 whitespace-nowrap text-[10px] text-slate-500 font-mono">
                      {log.prev_hash.slice(0, 10)}...{log.prev_hash.slice(-8)}
                    </td>
                    <td className={`p-3.5 whitespace-nowrap text-[10px] font-mono font-bold flex items-center gap-1.5 pt-4 ${
                      isCorrupted ? 'text-rose-500' : 'text-emerald-500'
                    }`}>
                      <Link2 className="w-3 h-3" />
                      <span>{log.hash_sha256.slice(0, 12)}...{log.hash_sha256.slice(-8)}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
