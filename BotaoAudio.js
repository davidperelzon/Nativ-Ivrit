import React, { useEffect, useRef, useState } from "react";
import { Pressable, Text, View, StyleSheet, Animated } from "react-native";

import {
  falarHebraico,
  pararFala,
  verificarSuporteHebraico,
} from "../services/audioService";

/*
 * src/components/BotaoAudio.js
 *
 * Botão de áudio reutilizável. É usado no cartão principal de estudo
 * (variante "grande") e também ao lado de cada forma final (variante
 * "pequena"). O componente cuida sozinho de:
 *
 * - checar se existe voz em hebraico disponível no aparelho;
 * - mostrar o estado de carregando / tocando, com uma pequena animação;
 * - permitir repetir o áudio a qualquer momento -- basta tocar de novo,
 *   não existe um botão de "repetir" separado porque este já cumpre
 *   esse papel;
 * - nunca deixar um erro quebrar a tela -- qualquer problema vira uma
 *   mensagem de texto amigável, o botão continua ali, funcionando.
 */
export default function BotaoAudio({ texto, rotulo, variante = "grande" }) {
  // inativo | carregando | reproduzindo | erro | indisponivel
  const [estado, setEstado] = useState("inativo");
  const [mensagemErro, setMensagemErro] = useState(null);
  const montadoRef = useRef(true);
  const pulso = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    montadoRef.current = true;

    verificarSuporteHebraico().then((suportado) => {
      if (montadoRef.current && !suportado) {
        setEstado("indisponivel");
        setMensagemErro("Áudio em hebraico não está disponível neste aparelho.");
      }
    });

    return () => {
      montadoRef.current = false;
      pararFala();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (estado === "reproduzindo") {
      const animacao = Animated.loop(
        Animated.sequence([
          Animated.timing(pulso, {
            toValue: 1.18,
            duration: 420,
            useNativeDriver: true,
          }),
          Animated.timing(pulso, {
            toValue: 1,
            duration: 420,
            useNativeDriver: true,
          }),
        ])
      );
      animacao.start();
      return () => animacao.stop();
    }

    pulso.setValue(1);
    return undefined;
  }, [estado, pulso]);

  const aoTocar = async () => {
    if (estado === "indisponivel") return;

    setMensagemErro(null);
    setEstado("carregando");

    await falarHebraico(texto, {
      onStart: () => montadoRef.current && setEstado("reproduzindo"),
      onDone: () => montadoRef.current && setEstado("inativo"),
      onError: () => {
        if (!montadoRef.current) return;
        setEstado("erro");
        setMensagemErro("Não foi possível reproduzir o áudio agora.");
      },
    });
  };

  const pequeno = variante === "pequena";
  const tocando = estado === "reproduzindo";
  const carregando = estado === "carregando";
  const indisponivel = estado === "indisponivel";

  return (
    <View style={pequeno ? styles.envoltoriaPequena : styles.envoltoria}>
      <Pressable
        onPress={aoTocar}
        disabled={indisponivel}
        accessibilityRole="button"
        accessibilityLabel={rotulo}
        accessibilityState={{ busy: tocando || carregando, disabled: indisponivel }}
        accessibilityHint={tocando ? "Toque para repetir o áudio" : undefined}
        hitSlop={pequeno ? 10 : 6}
        style={({ pressed }) => [
          pequeno ? styles.botaoPequeno : styles.botao,
          tocando && styles.botaoTocando,
          indisponivel && styles.botaoIndisponivel,
          pressed && !indisponivel && styles.botaoPressionado,
        ]}
      >
        <Animated.Text
          style={[
            pequeno ? styles.iconePequeno : styles.icone,
            { transform: [{ scale: pulso }] },
          ]}
        >
          {indisponivel ? "🔇" : "🔊"}
        </Animated.Text>

        {!pequeno && (
          <Text style={styles.texto}>
            {carregando
              ? "Preparando…"
              : tocando
              ? "Tocando…"
              : indisponivel
              ? "Indisponível"
              : "Ouvir"}
          </Text>
        )}
      </Pressable>

      {mensagemErro && !pequeno ? (
        <Text style={styles.mensagemErro}>{mensagemErro}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  envoltoria: {
    alignItems: "center",
  },
  envoltoriaPequena: {
    alignItems: "center",
    justifyContent: "center",
  },

  botao: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#1E3A8A",
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 22,
  },
  botaoTocando: {
    backgroundColor: "#D97706",
  },
  botaoIndisponivel: {
    backgroundColor: "#CBD5E1",
  },
  botaoPressionado: {
    opacity: 0.85,
  },
  icone: {
    fontSize: 20,
  },
  texto: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },

  botaoPequeno: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EEF2FF",
  },
  iconePequeno: {
    fontSize: 15,
  },

  mensagemErro: {
    color: "#DC2626",
    fontSize: 11,
    marginTop: 6,
    textAlign: "center",
    maxWidth: 220,
  },
});
