export function onlyDigits(value: string) {
  return value.replace(/\D/g, '');
}

export function maskCnpj(value: string) {
  const v = onlyDigits(value).slice(0, 14);
  return v
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2');
}

export function maskPhone(value: string) {
  const v = onlyDigits(value).slice(0, 11);
  if (v.length <= 10) {
    return v
      .replace(/^(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2');
  }
  return v
    .replace(/^(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2');
}

export function maskUf(value: string) {
  return value.replace(/[^a-zA-Z]/g, '').slice(0, 2).toUpperCase();
}

export function clampNumber(value: unknown, min = 0, max = 1000000) {
  const n = Number(value);
  if (Number.isNaN(n)) return min;
  return Math.min(max, Math.max(min, n));
}
