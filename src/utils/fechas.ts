// Convierte una fecha en texto tipo "Hace 3 días"
export function fechaRelativa(fecha?: string): string {
  if (!fecha) return '';

  const diffMs = Date.now() - new Date(fecha).getTime();
  const minutos = Math.floor(diffMs / 60000);

  if (minutos < 1) return 'Hace un momento';
  if (minutos < 60) return `Hace ${minutos} min`;

  const horas = Math.floor(minutos / 60);
  if (horas < 24) return `Hace ${horas} h`;

  const dias = Math.floor(horas / 24);
  if (dias < 7) return dias === 1 ? 'Hace 1 día' : `Hace ${dias} días`;

  const semanas = Math.floor(dias / 7);
  if (dias < 30) return semanas === 1 ? 'Hace 1 semana' : `Hace ${semanas} semanas`;

  const meses = Math.floor(dias / 30);
  if (dias < 365) return meses === 1 ? 'Hace 1 mes' : `Hace ${meses} meses`;

  const anios = Math.floor(dias / 365);
  return anios === 1 ? 'Hace 1 año' : `Hace ${anios} años`;
}
