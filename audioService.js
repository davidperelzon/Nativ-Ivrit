/*
 * src/services/audioService.js
 *
 * Encapsula toda a lógica de pronúncia em áudio do app.
 *
 * DECISÃO DE ARQUITETURA (leia isto antes de trocar por outra API):
 *
 * Usamos o `expo-speech`, que dá acesso ao motor de texto-para-fala
 * NATIVO do sistema (AVSpeechSynthesizer no iOS, TextToSpeech no
 * Android, e a Web Speech API no navegador). Ele foi escolhido em vez
 * de uma API paga na nuvem (Google Cloud TTS, Amazon Polly, Azure
 * Speech etc.) pelos seguintes motivos, na mesma ordem de prioridade
 * pedido:
 *
 *   1. Gratuito para sempre, sem chave, sem cadastro, sem cartão.
 *   2. Uma linha de instalação (`npx expo install expo-speech`).
 *   3. Zero infraestrutura: não precisa de backend nem de proxy.
 *   4. Funciona em Android, iOS e Web (react-native-web).
 *   5. Suporta hebraico (depende da voz instalada no aparelho -- por
 *      isso existe a verificação de suporte abaixo, com um aviso
 *      amigável quando o hebraico não estiver disponível).
 *   6. Fala frases inteiras, não só letras isoladas.
 *   7. Já nasce com um "fallback" embutido: se a voz em hebraico não
 *      existir no aparelho, avisamos o usuário em vez de travar.
 *
 * O motor é 100% local (não depende de internet), então não existe
 * "chave de API" para configurar nem custo por caractere. Por isso
 * este projeto não tem HEBREW_TTS_API_KEY nem .env -- não há nada
 * para configurar. Se um dia quiserem trocar por uma voz de nuvem
 * mais expressiva, é só reimplementar `falarHebraico` mantendo a
 * mesma assinatura; o restante do app não precisa mudar.
 */

import * as Speech from "expo-speech";
import { Platform } from "react-native";

export const IDIOMA_HEBRAICO = "he-IL";

// Cache em memória (evita perguntar de novo ao sistema operacional a
// cada toque no botão -- é o equivalente, para voz nativa, ao "cache
// para evitar requisições repetidas" pedido para APIs de rede).
let cacheSuporteHebraico = null;

/**
 * Verifica se existe uma voz em hebraico disponível no aparelho.
 * O resultado fica em cache em memória durante a sessão do app.
 *
 * @returns {Promise<boolean>} true se é razoável tentar falar em hebraico.
 */
export async function verificarSuporteHebraico() {
  if (cacheSuporteHebraico !== null) {
    return cacheSuporteHebraico;
  }

  // Na web, muitos navegadores só preenchem a lista de vozes depois
  // do primeiro gesto do usuário (é uma particularidade da Web Speech
  // API). Em vez de bloquear o botão por causa disso, deixamos a
  // tentativa real de fala decidir e tratamos o erro se ele vier.
  if (Platform.OS === "web") {
    cacheSuporteHebraico = true;
    return true;
  }

  try {
    const vozes = await Speech.getAvailableVoicesAsync();

    if (!vozes || vozes.length === 0) {
      // Alguns Android só populam a lista após a primeira fala.
      // Não bloqueamos o botão nesse caso -- deixamos o usuário tentar.
      cacheSuporteHebraico = true;
    } else {
      cacheSuporteHebraico = vozes.some((voz) =>
        (voz.language || "").toLowerCase().startsWith("he")
      );
    }
  } catch (erro) {
    // Se nem for possível checar, não travamos a experiência:
    // assumimos que pode funcionar e deixamos o Speech.speak() real
    // confirmar (e cair no tratamento de erro se necessário).
    cacheSuporteHebraico = true;
  }

  return cacheSuporteHebraico;
}

/**
 * Fala um texto em hebraico.
 *
 * Nunca lança uma exceção para quem chamou: qualquer problema é
 * reportado através do callback `onError`, nunca quebra a tela.
 *
 * @param {string} texto texto em hebraico a ser pronunciado
 * @param {object} callbacks { onStart, onDone, onError }
 */
export async function falarHebraico(texto, callbacks = {}) {
  const { onStart, onDone, onError } = callbacks;

  if (!texto) return;

  try {
    // Interrompe qualquer fala em andamento antes de iniciar a nova,
    // para nunca sobrepor dois áudios.
    await Speech.stop();

    Speech.speak(texto, {
      language: IDIOMA_HEBRAICO,
      pitch: 1,
      rate: 0.85,
      onStart: () => onStart && onStart(),
      onDone: () => onDone && onDone(),
      onStopped: () => onDone && onDone(),
      onError: (erro) => onError && onError(erro),
    });
  } catch (erro) {
    onError && onError(erro);
  }
}

/**
 * Interrompe qualquer fala em andamento. Seguro de chamar a qualquer
 * momento (por exemplo, ao trocar de letra ou sair da aba).
 */
export function pararFala() {
  Speech.stop().catch(() => {
    // Se nem o stop funcionar, ignoramos silenciosamente -- não é
    // um erro que o usuário precise ver.
  });
}
