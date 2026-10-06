/**
 * Valida una cédula ecuatoriana (10 dígitos, módulo 10) o un pasaporte (6-20 caracteres alfanuméricos).
 * Devuelve el mensaje de error, o null si es válida.
 */
export function validarCedula(valor: string): string | null {
  const v = valor.trim();
  if (/^\d{10}$/.test(v)) {
    const provincia = Number(v.slice(0, 2));
    if (!((provincia >= 1 && provincia <= 24) || provincia === 30)) return 'La cédula no es válida: revisa los dos primeros dígitos.';
    if (Number(v[2]) >= 6) return 'La cédula no es válida: revisa el tercer dígito.';
    const suma = v.slice(0, 9).split('').reduce((acc, d, i) => {
      let x = Number(d) * (i % 2 === 0 ? 2 : 1);
      if (x > 9) x -= 9;
      return acc + x;
    }, 0);
    const verificador = (10 - (suma % 10)) % 10;
    return verificador === Number(v[9]) ? null : 'La cédula no es válida: revisa los 10 dígitos.';
  }
  if (/^[A-Za-z0-9]{6,20}$/.test(v)) return null; // pasaporte
  return 'Ingresa una cédula de 10 dígitos o un pasaporte de 6 a 20 letras y números.';
}
