import { useState } from 'react';
import { Wallet, Receipt, Plus, CheckCircle, FileText, Download, DollarSign, Calendar, Building } from 'lucide-react';
import { Factura, ParamentroTaxaPortuaria, TransacaoTesouraria } from '../../types';

interface FacturacaoTesourariaModuleProps {
  facturas: Factura[];
  taxas: ParamentroTaxaPortuaria[];
  transacoes: TransacaoTesouraria[];
  onAddFactura: (fac: Factura) => void;
  onPagarFactura: (facturaId: string, metodo: string) => void;
}

export function FacturacaoTesourariaModule({ facturas, taxas, transacoes, onAddFactura, onPagarFactura }: FacturacaoTesourariaModuleProps) {
  const [activeSubTab, setActiveSubTab] = useState<'facturacao' | 'tesouraria' | 'tarifas'>('facturacao');
  const [selectedFacturaModal, setSelectedFacturaModal] = useState<Factura | null>(null);

  const totalFacturadoXOF = facturas.reduce((acc, f) => acc + f.totalXOF, 0);
  const totalRecebidoXOF = facturas.filter(f => f.statusPagamento === 'Pago').reduce((acc, f) => acc + f.totalXOF, 0);
  const totalPendenteXOF = totalFacturadoXOF - totalRecebidoXOF;

  return (
    <div id="facturacao-tesouraria-module" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Wallet className="w-5 h-5 text-emerald-400" />
            Facturação, Tesouraria & Arrecadação de Receitas
          </h2>
          <p className="text-slate-400 text-xs">Cálculo de tarifas portuárias, liquidação de facturas e conciliação de caixa da Tesouraria do IMP</p>
        </div>
      </div>

      {/* Subtabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveSubTab('facturacao')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeSubTab === 'facturacao'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
              : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          Facturas de Serviços Portuários ({facturas.length})
        </button>
        <button
          onClick={() => setActiveSubTab('tesouraria')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeSubTab === 'tesouraria'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
              : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          Caixa & Lançamentos Tesouraria ({transacoes.length})
        </button>
        <button
          onClick={() => setActiveSubTab('tarifas')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeSubTab === 'tarifas'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
              : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          Tabela Oficial de Taxas & Tarifas
        </button>
      </div>

      {/* Overview Financial Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-slate-400 text-xs font-mono block">TOTAL FACTURADO</span>
          <div className="text-xl font-bold text-white mt-1">{totalFacturadoXOF.toLocaleString()} XOF</div>
        </div>
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-slate-400 text-xs font-mono block">ARRECADADO (PAGO)</span>
          <div className="text-xl font-bold text-emerald-400 mt-1">{totalRecebidoXOF.toLocaleString()} XOF</div>
        </div>
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-slate-400 text-xs font-mono block">PENDENTE EM COBRANÇA</span>
          <div className="text-xl font-bold text-amber-400 mt-1">{totalPendenteXOF.toLocaleString()} XOF</div>
        </div>
      </div>

      {/* Facturação Tab */}
      {activeSubTab === 'facturacao' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase font-mono text-[10px]">
                <tr>
                  <th className="py-3 px-4">Nº Factura / Data</th>
                  <th className="py-3 px-4">Embarcação</th>
                  <th className="py-3 px-4">Agência Devedora</th>
                  <th className="py-3 px-4">Valor Total (XOF)</th>
                  <th className="py-3 px-4">Estado</th>
                  <th className="py-3 px-4 text-right">Ações Tesouraria</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {facturas.map((fac) => (
                  <tr key={fac.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-mono font-bold text-white text-xs">{fac.numeroFactura}</div>
                      <div className="text-[11px] text-slate-400">Emissão: {fac.dataEmissao}</div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-200">
                      {fac.embarcacaoNome}
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      {fac.agenciaNome}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-white">
                      {fac.totalXOF.toLocaleString()} XOF
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                          fac.statusPagamento === 'Pago'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        }`}
                      >
                        {fac.statusPagamento}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      {fac.statusPagamento === 'Pendente' && (
                        <button
                          onClick={() => onPagarFactura(fac.id, 'Transferência Bancária')}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[11px] font-medium transition-colors"
                        >
                          Liquidar na Tesouraria
                        </button>
                      )}
                      <button
                        onClick={() => setSelectedFacturaModal(fac)}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[11px] font-medium border border-slate-700 transition-colors"
                      >
                        Ver Detalhe
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tesouraria Lançamentos Tab */}
      {activeSubTab === 'tesouraria' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase font-mono text-[10px]">
                <tr>
                  <th className="py-3 px-4">Data / Hora</th>
                  <th className="py-3 px-4">Tipo Lançamento</th>
                  <th className="py-3 px-4">Referência Documento</th>
                  <th className="py-3 px-4">Entidade Pagadora</th>
                  <th className="py-3 px-4">Operador / Caixa</th>
                  <th className="py-3 px-4 text-right">Montante (XOF)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {transacoes.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-mono text-slate-300">
                      {t.dataHora}
                    </td>
                    <td className="py-3 px-4 font-semibold text-emerald-400">
                      {t.tipoTransacao}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-200">
                      {t.referencia}
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      {t.entidadePagadora}
                    </td>
                    <td className="py-3 px-4 text-slate-400 text-[11px]">
                      {t.operadorTesouraria} ({t.caixaNumero})
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-white text-right">
                      +{t.valorXOF.toLocaleString()} XOF
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tarifas Tab */}
      {activeSubTab === 'tarifas' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {taxas.map((tx) => (
            <div key={tx.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-mono bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20">
                  {tx.categoria} • {tx.codigoServico}
                </span>
                <h4 className="font-semibold text-white text-sm mt-2">{tx.descricaoServico}</h4>
                <div className="text-xs text-slate-400 mt-1">Base: {tx.unidadeMedida}</div>
              </div>

              <div className="text-right font-mono">
                <div className="text-lg font-bold text-white">{tx.valorUnitarioXOF.toLocaleString()}</div>
                <div className="text-[10px] text-slate-400">XOF</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Factura Detail Modal */}
      {selectedFacturaModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 space-y-5">
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs text-emerald-400 font-mono font-bold uppercase">Factura Portuária Oficial</span>
                <h3 className="text-xl font-bold text-white font-mono">{selectedFacturaModal.numeroFactura}</h3>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {selectedFacturaModal.statusPagamento}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-500 block">Embarcação:</span>
                <span className="font-semibold text-white text-sm">{selectedFacturaModal.embarcacaoNome}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Agência Devedora:</span>
                <span className="font-semibold text-white text-sm">{selectedFacturaModal.agenciaNome}</span>
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
              <div className="font-mono text-[10px] text-slate-500 uppercase border-b border-slate-800 pb-2">Itens & Serviços Portuários Facturados</div>
              {selectedFacturaModal.itens.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between py-1 border-b border-slate-900">
                  <span className="text-slate-300">{item.descricao}</span>
                  <span className="font-mono text-white">{item.subtotalXOF.toLocaleString()} XOF</span>
                </div>
              ))}
              <div className="flex items-center justify-between pt-2 text-sm font-bold font-mono">
                <span className="text-white">TOTAL FACTURA:</span>
                <span className="text-emerald-400">{selectedFacturaModal.totalXOF.toLocaleString()} XOF</span>
              </div>
            </div>

            <div className="flex justify-end pt-3">
              <button
                onClick={() => setSelectedFacturaModal(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-medium text-xs"
              >
                Fechar Ficha
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
