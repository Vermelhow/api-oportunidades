import { useEffect, useState } from 'react';

/**
 * Adia em um frame a exposição de um texto para leitores de tela dentro de
 * uma live region (role="status"/"alert"). Necessário porque, quando o texto
 * já nasce presente no mesmo mount do container, o leitor de tela ainda não
 * registrou a região como "viva" e ignora o anúncio. Use o valor retornado em
 * aria-hidden={!announce} no elemento que contém o texto (o conteúdo visual
 * não muda, só a exposição na árvore de acessibilidade).
 *
 * @returns {boolean} true a partir do frame seguinte ao mount
 */
export default function useDeferredAnnounce() {
  const [announce, setAnnounce] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setAnnounce(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return announce;
}
