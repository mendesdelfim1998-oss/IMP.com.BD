import { useState, FormEvent } from 'react';
import { Award, Plus, Search } from 'lucide-react';
import { CertificadoMaritimo } from '../../types';
import { useTheme } from '../../context/ThemeContext';

interface CertificadosModuleProps {
  certificados: CertificadoMaritimo[];
  onAddCertificado: (certificado: CertificadoMaritimo) => void;
}

export function CertificadosModule({ certificados, onAddCertificado }: CertificadosModuleProps) {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    tipoCertificado: 'Navegabilidade' as CertificadoMaritimo['tipoCertificado'],
    embarcacaoNome: '',
    emitoPor: 'Instituto Marítimo Portuário (IMP)'
  });

  const filtered = certificados.filter(c =>
    c.numeroCertificado.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.embarcacaoNome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const now = new Date();
    const exp = new Date(Date.now() + 365 * 86400000);
    onAddCertificado({
      id: `CERT-${Date.now().toString().slice(-4)}`,
      numeroCertificado: `CERT-${formData.tipoCertificado.slice(0, 3).toUpperCase()}-2026/${(certificados.length + 10).toString().padStart(2, '0')}`,
      embarcacaoNome: formData.embarcacaoNome || 'MV Bissau Express',
      tipoCertificado: formData.tipoCertificado,
      dataEmissao: now.toISOString().split('T')[0],
      dataExpiracao: exp.toISOString().split('T')[0],
      emitoPor: formData.emitoPor,
      status: 'Ativo'
    });
    setShowModal(false);
  };

  return (
    <div id="certificados-module" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2
            className={`text-xl font-bold tracking-tight flex items-center gap-2 ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}
          >
            <Award className="w-5 h-5 text-amber-500" />
            Certificados Marítimos de Navegabilidade & Lotação
          </h2>
          <p className={theme === 'dark' ? 'text-slate-400 text-xs' : 'text-slate-500 text-xs'}>
            Emissão e controlo de caducidade de certificados estatutários de navios
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition-colors shadow-lg shadow-blue-600/20"
        >
          <Plus className="w-4 h-4" />
          Emitir Certificado IMP
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
          placeholder="Pesquisar por número do certificado ou nome da embarcação..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`bg-transparent text-xs focus:outline-none w-full ${
            theme === 'dark' ? 'text-white placeholder-slate-500' : 'text-slate-900 placeholder-slate-400'
          }`}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((cert) => (
          <div
            key={cert.id}
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
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}
                >
                  {cert.numeroCertificado}
                </span>
                <h3 className={`font-bold text-base mt-1.5 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  {cert.embarcacaoNome}
                </h3>
                <p className={`text-xs font-semibold mt-0.5 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                  Certificado de {cert.tipoCertificado}
                </p>
              </div>
              <span
                className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                  cert.status === 'Ativo'
                    ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                    : 'bg-red-500/10 text-red-600 border-red-500/20'
                }`}
              >
                {cert.status}
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
                <span className="text-slate-500">DATA DE EMISSÃO:</span>
                <span className={theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}>{cert.dataEmissao}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">DATA DE EXPIRAÇÃO:</span>
                <span className="text-amber-500 font-bold">{cert.dataExpiracao}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">ENTIDADE EMISSORA:</span>
                <span className={theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}>{cert.emitoPor}</span>
              </div>
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
              Emitir Certificado Marítimo
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
              <div>
                <label className="block text-slate-500 mb-1">Tipo de Certificado</label>
                <select
                  value={formData.tipoCertificado}
                  onChange={e => setFormData({ ...formData, tipoCertificado: e.target.value as any })}
                  className={`w-full rounded-xl px-3 py-2 border focus:outline-none focus:border-blue-500 ${
                    theme === 'dark' ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                >
                  <option value="Navegabilidade">Certificado de Navegabilidade</option>
                  <option value="Lotação Mínima">Certificado de Lotação Mínima de Segurança</option>
                  <option value="Segurança Rádio">Certificado de Segurança Rádio</option>
                  <option value="Prevenção de Poluição">Certificado de Prevenção de Poluição</option>
                  <option value="Matrícula Marítima">Título de Matrícula Marítima</option>
                </select>
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
                  Gerar Certificado
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
