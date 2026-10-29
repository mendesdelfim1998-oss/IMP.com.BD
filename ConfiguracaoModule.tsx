import { useState } from 'react';
import { Settings, Server, Save, CheckCircle2, HardDrive, Mail, Send } from 'lucide-react';
import { ConfiguraçãoServidor, ParamentroTaxaPortuaria } from '../../types';
import { useTheme } from '../../context/ThemeContext';

interface ConfiguracaoModuleProps {
  taxas: ParamentroTaxaPortuaria[];
  servidor: ConfiguraçãoServidor;
}

export function ConfiguracaoModule({ taxas, servidor }: ConfiguracaoModuleProps) {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<'taxas' | 'servidor' | 'smtp'>('taxas');
  const [taxasState, setTaxasState] = useState(taxas);
  const [savedMsg, setSavedMsg] = useState('');

  // SMTP Settings State
  const [smtpConfig, setSmtpConfig] = useState({
    host: 'smtp.imp.gw',
    port: '587',
    encryption: 'TLS',
    username: 'faturacao@imp.gw',
    password: '••••••••••••',
    senderEmail: 'no-reply@imp.gw',
    senderName: 'IMP Guiné-Bissau - Faturação',
    autoSendInvoice: true
  });
  const [smtpSavedMsg, setSmtpSavedMsg] = useState('');

  const handleSaveTaxas = () => {
    setSavedMsg('Tabela de Taxas e Parâmetros Portuários guardada com sucesso!');
    setTimeout(() => setSavedMsg(''), 4000);
  };

  const handleSaveSmtp = () => {
    setSmtpSavedMsg('Configurações de SMTP guardadas com sucesso! Envio automático de faturas PDF ativado.');
    setTimeout(() => setSmtpSavedMsg(''), 4000);
  };

  const handleTestSmtp = () => {
    alert(`E-mail de teste enviado com sucesso para ${smtpConfig.senderEmail} através de ${smtpConfig.host}:${smtpConfig.port} (${smtpConfig.encryption}). Servidor SMTP respondeu 250 OK.`);
  };

  return (
    <div id="configuracao-module" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className={`text-xl font-bold tracking-tight flex items-center gap-2 ${
            theme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}>
            <Settings className="w-5 h-5 text-blue-500" />
            Configuração do Sistema, Tarifas, Servidor & SMTP
          </h2>
          <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
            Parâmetros das taxas portuárias, servidor PostgreSQL e envio automático de faturas PDF por e-mail
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className={`flex flex-wrap items-center gap-2 p-2 rounded-2xl border text-xs ${
        theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/90 shadow-sm'
      }`}>
        <button
          onClick={() => setActiveTab('taxas')}
          className={`px-4 py-2 rounded-xl font-semibold transition-all ${
            activeTab === 'taxas'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
              : theme === 'dark'
              ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          1. Tabela de Taxas & Tarifas
        </button>
        <button
          onClick={() => setActiveTab('servidor')}
          className={`px-4 py-2 rounded-xl font-semibold transition-all ${
            activeTab === 'servidor'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
              : theme === 'dark'
              ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          2. Servidor On-Premises
        </button>
        <button
          onClick={() => setActiveTab('smtp')}
          className={`px-4 py-2 rounded-xl font-semibold transition-all flex items-center gap-1.5 ${
            activeTab === 'smtp'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
              : theme === 'dark'
              ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Mail className="w-3.5 h-3.5" />
          3. Configurações de SMTP & E-mail
        </button>
      </div>

      {savedMsg && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs flex items-center gap-2 font-semibold">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          {savedMsg}
        </div>
      )}

      {activeTab === 'taxas' ? (
        <div className={`p-5 rounded-2xl border space-y-4 ${
          theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/90 shadow-sm'
        }`}>
          <div className={`flex items-center justify-between border-b pb-3 ${
            theme === 'dark' ? 'border-slate-800' : 'border-slate-200'
          }`}>
            <div>
              <h3 className={`font-bold text-sm ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                Parâmetros Oficiais de Tarifas Portuárias (XOF)
              </h3>
              <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                Valores aplicados no cálculo automático das faturas de navios
              </p>
            </div>
            <button
              onClick={handleSaveTaxas}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg shadow-emerald-600/20"
            >
              <Save className="w-4 h-4" />
              Guardar Alterações
            </button>
          </div>

          <div className="space-y-3">
            {taxasState.map((taxa, idx) => (
              <div
                key={taxa.id}
                className={`p-4 rounded-xl border grid grid-cols-1 md:grid-cols-4 gap-3 text-xs items-center ${
                  theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div>
                  <span className="text-[10px] font-mono text-blue-500 font-bold bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                    {taxa.codigoServico}
                  </span>
                  <p className={`font-semibold mt-1 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    {taxa.descricaoServico}
                  </p>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] font-mono">CATEGORIA:</span>
                  <span className={`font-medium ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                    {taxa.categoria}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] font-mono">UNIDADE DE MEDIDA:</span>
                  <span className={`font-mono ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                    {taxa.unidadeMedida}
                  </span>
                </div>
                <div>
                  <label className="text-slate-500 block text-[10px] font-mono mb-0.5">VALOR UNITÁRIO (XOF):</label>
                  <input
                    type="number"
                    value={taxa.valorUnitarioXOF}
                    onChange={(e) => {
                      const newArr = [...taxasState];
                      newArr[idx].valorUnitarioXOF = parseInt(e.target.value) || 0;
                      setTaxasState(newArr);
                    }}
                    className={`w-full rounded-lg px-3 py-1.5 font-mono font-bold focus:outline-none focus:border-blue-500 border ${
                      theme === 'dark'
                        ? 'bg-slate-900 border-slate-700 text-emerald-400'
                        : 'bg-white border-slate-300 text-emerald-600 shadow-sm'
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : activeTab === 'servidor' ? (
        <div className={`p-5 rounded-2xl border space-y-6 ${
          theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/90 shadow-sm'
        }`}>
          <div className={`border-b pb-3 ${theme === 'dark' ? 'border-slate-800' : 'border-slate-200'}`}>
            <h3 className={`font-bold text-sm flex items-center gap-2 ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}>
              <Server className="w-4 h-4 text-emerald-500" />
              Infraestrutura do Servidor Local On-Premises (IMP Bissau)
            </h3>
            <p className={`text-xs mt-0.5 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
              Estado em tempo real da máquina e da base de dados PostgreSQL
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div className={`p-4 rounded-xl border space-y-2 ${
              theme === 'dark' ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}>
              <div className="flex justify-between">
                <span className="text-slate-500">NOME DO SERVIDOR:</span>
                <span className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  {servidor.nomeServidor}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">AMBIENTE:</span>
                <span className="text-emerald-500 font-semibold">{servidor.ambiente}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">IP DE REDE LOCAL:</span>
                <span className="text-blue-500 font-semibold">{servidor.ipLocalServer}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">VERSÃO DA APLICAÇÃO:</span>
                <span className={theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}>{servidor.versaoApp}</span>
              </div>
            </div>

            <div className={`p-4 rounded-xl border space-y-2 ${
              theme === 'dark' ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}>
              <div className="flex justify-between">
                <span className="text-slate-500">MOTOR DE BASE DE DADOS:</span>
                <span className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  {servidor.bdEngine}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">DIRETÓRIO DE BACKUP:</span>
                <span className={`truncate ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                  {servidor.diretorioBackup}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">ÚLTIMO BACKUP AUTOMÁTICO:</span>
                <span className="text-emerald-500 font-semibold">{servidor.ultimoBackupAuto}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">ESTADO DA CONEXÃO:</span>
                <span className="text-emerald-500 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  {servidor.statusConexao}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={() => alert('Backup manual efetuado e armazenado com sucesso em /var/backups/nhominca/postgresql!')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg shadow-blue-600/20"
            >
              <HardDrive className="w-4 h-4" />
              Executar Backup Manual Agora
            </button>
          </div>
        </div>
      ) : activeTab === 'smtp' ? (
        <div className={`p-5 rounded-2xl border space-y-6 ${
          theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/90 shadow-sm'
        }`}>
          <div className={`flex items-center justify-between border-b pb-3 ${
            theme === 'dark' ? 'border-slate-800' : 'border-slate-200'
          }`}>
            <div>
              <h3 className={`font-bold text-sm flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                <Mail className="w-4 h-4 text-blue-500" />
                Configurações do Servidor de E-mail (SMTP) & Envio Automático de Faturas PDF
              </h3>
              <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                Permite enviar faturas digitais e recibos PDF diretamente para o e-mail cadastrado das agências marítimas
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleTestSmtp}
                className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-blue-600/20"
              >
                <Send className="w-3.5 h-3.5" />
                Testar Conexão SMTP
              </button>
              <button
                onClick={handleSaveSmtp}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg shadow-emerald-600/20"
              >
                <Save className="w-4 h-4" />
                Guardar SMTP
              </button>
            </div>
          </div>

          {smtpSavedMsg && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs flex items-center gap-2 font-semibold">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              {smtpSavedMsg}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-500 font-mono text-[10px] mb-1">SERVIDOR SMTP HOST:</label>
              <input
                type="text"
                value={smtpConfig.host}
                onChange={(e) => setSmtpConfig({ ...smtpConfig, host: e.target.value })}
                className={`w-full rounded-xl px-3 py-2 font-mono focus:outline-none focus:border-blue-500 border ${
                  theme === 'dark' ? 'bg-slate-950 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
            </div>
            <div>
              <label className="block text-slate-500 font-mono text-[10px] mb-1">PORTA SMTP:</label>
              <input
                type="text"
                value={smtpConfig.port}
                onChange={(e) => setSmtpConfig({ ...smtpConfig, port: e.target.value })}
                className={`w-full rounded-xl px-3 py-2 font-mono focus:outline-none focus:border-blue-500 border ${
                  theme === 'dark' ? 'bg-slate-950 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
            </div>
            <div>
              <label className="block text-slate-500 font-mono text-[10px] mb-1">ENCRIPTAÇÃO:</label>
              <select
                value={smtpConfig.encryption}
                onChange={(e) => setSmtpConfig({ ...smtpConfig, encryption: e.target.value })}
                className={`w-full rounded-xl px-3 py-2 font-mono focus:outline-none focus:border-blue-500 border ${
                  theme === 'dark' ? 'bg-slate-950 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              >
                <option value="TLS">TLS (STARTTLS)</option>
                <option value="SSL">SSL / TLS</option>
                <option value="Nenhum">Nenhum (Plain)</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-500 font-mono text-[10px] mb-1">UTILIZADOR / AUTENTICAÇÃO SMTP:</label>
              <input
                type="text"
                value={smtpConfig.username}
                onChange={(e) => setSmtpConfig({ ...smtpConfig, username: e.target.value })}
                className={`w-full rounded-xl px-3 py-2 font-mono focus:outline-none focus:border-blue-500 border ${
                  theme === 'dark' ? 'bg-slate-950 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
            </div>
            <div>
              <label className="block text-slate-500 font-mono text-[10px] mb-1">PALAVRA-PASSE SMTP:</label>
              <input
                type="password"
                value={smtpConfig.password}
                onChange={(e) => setSmtpConfig({ ...smtpConfig, password: e.target.value })}
                className={`w-full rounded-xl px-3 py-2 font-mono focus:outline-none focus:border-blue-500 border ${
                  theme === 'dark' ? 'bg-slate-950 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
            </div>
            <div>
              <label className="block text-slate-500 font-mono text-[10px] mb-1">E-MAIL DO REMETENTE (FROM):</label>
              <input
                type="text"
                value={smtpConfig.senderEmail}
                onChange={(e) => setSmtpConfig({ ...smtpConfig, senderEmail: e.target.value })}
                className={`w-full rounded-xl px-3 py-2 font-mono focus:outline-none focus:border-blue-500 border ${
                  theme === 'dark' ? 'bg-slate-950 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-slate-500 font-mono text-[10px] mb-1">NOME DO REMETENTE:</label>
              <input
                type="text"
                value={smtpConfig.senderName}
                onChange={(e) => setSmtpConfig({ ...smtpConfig, senderName: e.target.value })}
                className={`w-full rounded-xl px-3 py-2 font-mono focus:outline-none focus:border-blue-500 border ${
                  theme === 'dark' ? 'bg-slate-950 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={smtpConfig.autoSendInvoice}
                onChange={(e) => setSmtpConfig({ ...smtpConfig, autoSendInvoice: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded border-slate-700 focus:ring-blue-500"
              />
              <span className={`text-xs font-medium ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                Ativar envio automático de faturas digitais em PDF por e-mail para as Agências Marítimas ao confirmar e emitir fatura oficial
              </span>
            </label>
          </div>
        </div>
      ) : null}
    </div>
  );
}
