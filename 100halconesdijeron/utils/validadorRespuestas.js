export function validarRespuesta(respuestaJugador, respuestasValidas, respuestasAcertadas) {
  const limpia = respuestaJugador.trim().toLowerCase();

  for (const respuesta of respuestasValidas) {
    const principal = respuesta.texto.toLowerCase();
    const sinonimos = respuesta.sinonimos.map(s => s.toLowerCase());

    if (
      (principal === limpia || sinonimos.includes(limpia)) &&
      !respuestasAcertadas.includes(principal)
    ) {
      return {
        acertada: true,
        respuesta: principal,
        puntos: respuesta.puntos
      };
    }
  }

  return { acertada: false };
}
