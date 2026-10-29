/**
 * Converte valores inteiros em Francos CFA (XOF) para texto por extenso em português.
 * Utilizado nos recibos oficiais do IMP (Instituto Marítimo e Portuário da Guiné-Bissau).
 */

const UNIDADES = [
  '',
  'um',
  'dois',
  'três',
  'quatro',
  'cinco',
  'seis',
  'sete',
  'oito',
  'nove'
];

const ESPECIAIS = [
  'dez',
  'onze',
  'doze',
  'treze',
  'quatorze',
  'quinze',
  'dezasseis',
  'dezassete',
  'dezoito',
  'dezenove'
];

const DEZENAS = [
  '',
  '',
  'vinte',
  'trinta',
  'quarenta',
  'cinquenta',
  'sessenta',
  'setenta',
  'oitenta',
  'noventa'
];

const CENTENAS = [
  '',
  'cento',
  'duzentos',
  'trezentos',
  'quatrocentos',
  'quinhentos',
  'seiscentos',
  'setecentos',
  'oitocentos',
  'novecentos'
];

function converterCentena(n: number): string {
  if (n === 0) return '';
  if (n === 100) return 'cem';

  const c = Math.floor(n / 100);
  const resto = n % 100;
  const partes: string[] = [];

  if (c > 0) {
    partes.push(CENTENAS[c]);
  }

  if (resto > 0) {
    if (resto < 10) {
      partes.push(UNIDADES[resto]);
    } else if (resto >= 10 && resto < 20) {
      partes.push(ESPECIAIS[resto - 10]);
    } else {
      const d = Math.floor(resto / 10);
      const u = resto % 10;
      if (u > 0) {
        partes.push(`${DEZENAS[d]} e ${UNIDADES[u]}`);
      } else {
        partes.push(DEZENAS[d]);
      }
    }
  }

  return partes.join(' e ');
}

export function valorPorExtensoXOF(valor: number): string {
  if (!valor || isNaN(valor) || valor <= 0) {
    return 'Zero francos CFA';
  }

  const v = Math.round(Math.abs(valor));
  if (v === 0) return 'Zero francos CFA';

  const bilhoes = Math.floor(v / 1_000_000_000);
  const milhoes = Math.floor((v % 1_000_000_000) / 1_000_000);
  const milhares = Math.floor((v % 1_000_000) / 1_000);
  const centenas = v % 1_000;

  const grupos: string[] = [];

  if (bilhoes > 0) {
    const textoB = converterCentena(bilhoes);
    grupos.push(`${textoB} ${bilhoes === 1 ? 'bilião' : 'biliões'}`);
  }

  if (milhoes > 0) {
    const textoM = converterCentena(milhoes);
    grupos.push(`${textoM} ${milhoes === 1 ? 'milhão' : 'milhões'}`);
  }

  if (milhares > 0) {
    if (milhares === 1) {
      grupos.push('mil');
    } else {
      grupos.push(`${converterCentena(milhares)} mil`);
    }
  }

  if (centenas > 0) {
    grupos.push(converterCentena(centenas));
  }

  let resultado = grupos.join(centenas > 0 && centenas < 100 && grupos.length > 0 ? ' e ' : ', ');
  // Capitaliza a primeira letra
  resultado = resultado.charAt(0).toUpperCase() + resultado.slice(1);

  return `${resultado} Francos CFA`;
}
