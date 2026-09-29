import React, { useRef, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  Pressable,
  StyleSheet,
} from "react-native";

import { LETRAS, FORMAS_FINAIS } from "../data/letrasHebraicas";
import { pararFala } from "../services/audioService";
import BotaoAudio from "./BotaoAudio";

/*
 * src/components/AlfabetoHebraico.js
 *
 * Ensina as 22 letras do alfabeto hebraico de forma progressiva:
 * - um cartão de estudo no topo mostra a letra atual, sua pronúncia,
 *   um exemplo de palavra (com áudio) e navegação Anterior/Próxima;
 * - uma grade abaixo funciona como índice, para pular direto para
 *   qualquer letra;
 * - uma seção final explica as 5 formas finais (sofit).
 *
 * Os dados ficam em ../data/letrasHebraicas.js e o áudio é resolvido
 * por ../services/audioService.js (veja os comentários lá para saber
 * por que a pronúncia usa o motor de fala nativo do aparelho).
 */

const TOTAL_LETRAS = LETRAS.length;

export default function AlfabetoHebraico() {
  // Guarda o ÍNDICE da letra em estudo (não o objeto), para que
  // "Anterior" e "Próxima" sejam um simples +1 / -1.
  const [indiceAtual, setIndiceAtual] = useState(0);
  const scrollRef = useRef(null);

  const letraAtual = LETRAS[indiceAtual];
  const estaNaPrimeira = indiceAtual === 0;
  const estaNaUltima = indiceAtual === TOTAL_LETRAS - 1;
  const progresso = (indiceAtual + 1) / TOTAL_LETRAS;

  const irParaTopo = () => {
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  const selecionarLetra = (indice) => {
    pararFala();
    setIndiceAtual(indice);
    irParaTopo();
  };

  const irParaAnterior = () => {
    if (estaNaPrimeira) return;
    pararFala();
    setIndiceAtual((i) => i - 1);
    irParaTopo();
  };

  const irParaProxima = () => {
    if (estaNaUltima) return;
    pararFala();
    setIndiceAtual((i) => i + 1);
    irParaTopo();
  };

  return (
    <ScrollView
      ref={scrollRef}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.limitadorLargura}>
        <View style={styles.hero}>
          <Text style={styles.heroLetra}>א</Text>

          <View style={styles.heroTexto}>
            <Text style={styles.heroTitulo}>Ensino do Alfabeto Hebraico</Text>

            <Text style={styles.heroDescricao}>
              Aprenda as 22 letras, uma de cada vez: nome, pronúncia, um
              exemplo de palavra e o áudio correto para cada uma.
            </Text>
          </View>
        </View>

        {/* Cartão de estudo da letra atual */}
        <View style={styles.cardDestaque}>
          <View style={styles.linhaProgresso}>
            <Text style={styles.cardEtiqueta}>
              LETRA {indiceAtual + 1} DE {TOTAL_LETRAS}
            </Text>
            <View style={styles.barraFundo}>
              <View
                style={[
                  styles.barraPreenchida,
                  { width: `${Math.round(progresso * 100)}%` },
                ]}
              />
            </View>
          </View>

          <Text style={styles.letraGrande}>{letraAtual.letra}</Text>
          <Text style={styles.nomeGrande}>{letraAtual.nome}</Text>

          <View style={styles.badgeTransliteracao}>
            <Text style={styles.somGrande}>{letraAtual.transliteracao}</Text>
          </View>

          <Text style={styles.pronunciaTexto}>{letraAtual.pronuncia}</Text>

          <View style={styles.divisor} />

          <View style={styles.blocoExemplo}>
            <Text style={styles.exemploRotulo}>PALAVRA DE EXEMPLO</Text>

            <Text style={styles.exemploPalavra}>{letraAtual.exemplo}</Text>

            <Text style={styles.exemploDetalhes}>
              {letraAtual.exemploTransliteracao} · {letraAtual.traducao}
            </Text>

            <BotaoAudio
              texto={letraAtual.audioTexto}
              rotulo={`Ouvir a pronúncia de ${letraAtual.exemplo}, ${letraAtual.exemploTransliteracao}, que significa ${letraAtual.traducao}`}
              variante="grande"
            />
          </View>

          <View style={styles.linhaNavegacao}>
            <Pressable
              onPress={irParaAnterior}
              disabled={estaNaPrimeira}
              accessibilityRole="button"
              accessibilityLabel="Letra anterior"
              accessibilityState={{ disabled: estaNaPrimeira }}
              style={[
                styles.botaoNav,
                estaNaPrimeira && styles.botaoNavDesabilitado,
              ]}
            >
              <Text
                style={[
                  styles.textoNav,
                  estaNaPrimeira && styles.textoNavDesabilitado,
                ]}
              >
                ‹ Anterior
              </Text>
            </Pressable>

            <Pressable
              onPress={irParaProxima}
              disabled={estaNaUltima}
              accessibilityRole="button"
              accessibilityLabel="Próxima letra"
              accessibilityState={{ disabled: estaNaUltima }}
              style={[
                styles.botaoNav,
                estaNaUltima && styles.botaoNavDesabilitado,
              ]}
            >
              <Text
                style={[
                  styles.textoNav,
                  estaNaUltima && styles.textoNavDesabilitado,
                ]}
              >
                Próxima ›
              </Text>
            </Pressable>
          </View>
        </View>

        <Text style={styles.secaoTitulo}>As 22 letras</Text>

        <Text style={styles.secaoDescricao}>
          Toque em uma letra para estudar a pronúncia, ver um exemplo e
          ouvir o áudio no cartão acima.
        </Text>

        <View style={styles.grid}>
          {LETRAS.map((item, indice) => {
            const selecionada = indice === indiceAtual;

            return (
              <Pressable
                key={item.letra}
                onPress={() => selecionarLetra(indice)}
                accessibilityRole="button"
                accessibilityLabel={`${item.nome}, letra ${indice + 1} de ${TOTAL_LETRAS}`}
                accessibilityState={{ selected: selecionada }}
                style={[
                  styles.letraCard,
                  selecionada && styles.letraCardAtiva,
                ]}
              >
                <Text
                  style={[styles.letra, selecionada && styles.letraAtiva]}
                >
                  {item.letra}
                </Text>

                <Text style={[styles.nome, selecionada && styles.nomeAtivo]}>
                  {item.nome}
                </Text>

                <Text
                  style={[
                    styles.transliteracao,
                    selecionada && styles.transliteracaoAtiva,
                  ]}
                >
                  {item.transliteracao}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.cardFinais}>
          <Text style={styles.secaoTitulo}>Formas finais</Text>

          <Text style={styles.secaoDescricao}>
            Cinco letras mudam de formato quando aparecem no final de uma
            palavra. O som continua o mesmo — só o desenho da letra muda.
          </Text>

          <View style={styles.finaisLista}>
            {FORMAS_FINAIS.map((item) => (
              <View key={item.letra} style={styles.finalItem}>
                <Text style={styles.finalLetra}>{item.letra}</Text>

                <View style={styles.finalTexto}>
                  <Text style={styles.finalNome}>
                    {item.nome}{" "}
                    <Text style={styles.finalOrigem}>
                      (forma de {item.origem})
                    </Text>
                  </Text>

                  <Text style={styles.finalExemplo}>
                    {item.exemplo} — {item.exemploTransliteracao} ·{" "}
                    {item.traducao}
                  </Text>
                </View>

                <BotaoAudio
                  texto={item.audioTexto}
                  rotulo={`Ouvir a pronúncia de ${item.exemplo}, ${item.exemploTransliteracao}, que significa ${item.traducao}`}
                  variante="pequena"
                />
              </View>
            ))}
          </View>
        </View>

        <View style={styles.dica}>
          <Text style={styles.dicaIcone}>💡</Text>

          <View style={{ flex: 1 }}>
            <Text style={styles.dicaTitulo}>Dica de estudo</Text>

            <Text style={styles.dicaTexto}>
              Estude poucas letras por vez. Primeiro reconheça o formato,
              depois memorize o nome e por último pratique a pronúncia
              ouvindo o áudio algumas vezes.
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 18,
    paddingBottom: 28,
    alignItems: "center",
  },

  // Em telas largas (tablet/desktop, via Expo Web), limita a largura
  // do conteúdo para não esticar demais e prejudicar a leitura.
  limitadorLargura: {
    width: "100%",
    maxWidth: 720,
  },

  hero: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E3A8A",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },

  heroLetra: {
    color: "#FFFFFF",
    fontSize: 56,
    fontWeight: "700",
    marginRight: 16,
    writingDirection: "rtl",
  },

  heroTexto: {
    flex: 1,
  },

  heroTitulo: {
    color: "#FFFFFF",
    fontSize: 21,
    fontWeight: "700",
    marginBottom: 7,
  },

  heroDescricao: {
    color: "#DBEAFE",
    fontSize: 13,
    lineHeight: 19,
  },

  cardDestaque: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
    padding: 22,
    marginBottom: 24,
  },

  linhaProgresso: {
    width: "100%",
    alignItems: "center",
    marginBottom: 4,
  },

  cardEtiqueta: {
    color: "#64748B",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 8,
  },

  barraFundo: {
    width: "100%",
    height: 6,
    borderRadius: 3,
    backgroundColor: "#E2E8F0",
    overflow: "hidden",
  },

  barraPreenchida: {
    height: "100%",
    borderRadius: 3,
    backgroundColor: "#1D4ED8",
  },

  letraGrande: {
    color: "#1E3A8A",
    fontSize: 62,
    fontWeight: "700",
    marginTop: 14,
    writingDirection: "rtl",
  },

  nomeGrande: {
    color: "#111827",
    fontSize: 22,
    fontWeight: "700",
    marginTop: 3,
  },

  badgeTransliteracao: {
    backgroundColor: "#FEF3C7",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 5,
    marginTop: 8,
  },

  somGrande: {
    color: "#92400E",
    fontSize: 13,
    fontWeight: "700",
    textAlign: "center",
  },

  pronunciaTexto: {
    color: "#374151",
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
    marginTop: 14,
  },

  divisor: {
    width: "100%",
    height: 1,
    backgroundColor: "#E2E8F0",
    marginVertical: 18,
  },

  blocoExemplo: {
    width: "100%",
    alignItems: "center",
  },

  exemploRotulo: {
    color: "#64748B",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 8,
  },

  exemploPalavra: {
    color: "#1E3A8A",
    fontSize: 34,
    fontWeight: "700",
    writingDirection: "rtl",
    textAlign: "center",
  },

  exemploDetalhes: {
    color: "#64748B",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 4,
    marginBottom: 16,
    textAlign: "center",
  },

  linhaNavegacao: {
    flexDirection: "row",
    width: "100%",
    marginTop: 20,
    gap: 10,
  },

  botaoNav: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#EEF2FF",
  },

  botaoNavDesabilitado: {
    backgroundColor: "#F1F5F9",
  },

  textoNav: {
    color: "#1E3A8A",
    fontSize: 14,
    fontWeight: "700",
  },

  textoNavDesabilitado: {
    color: "#CBD5E1",
  },

  secaoTitulo: {
    color: "#111827",
    fontSize: 20,
    fontWeight: "700",
  },

  secaoDescricao: {
    color: "#64748B",
    fontSize: 13,
    lineHeight: 19,
    marginTop: 5,
    marginBottom: 14,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: "100%",
  },

  letraCard: {
    width: "31.5%",
    minHeight: 124,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    padding: 9,
    marginBottom: 10,
  },

  letraCardAtiva: {
    backgroundColor: "#EEF2FF",
    borderColor: "#1D4ED8",
  },

  letra: {
    fontSize: 34,
    color: "#1E3A8A",
    fontWeight: "700",
    writingDirection: "rtl",
  },

  letraAtiva: {
    color: "#1D4ED8",
  },

  nome: {
    color: "#111827",
    fontSize: 12,
    fontWeight: "700",
    marginTop: 5,
    textAlign: "center",
  },

  nomeAtivo: {
    color: "#1E3A8A",
  },

  transliteracao: {
    color: "#64748B",
    fontSize: 10,
    textAlign: "center",
    marginTop: 4,
  },

  transliteracaoAtiva: {
    color: "#D97706",
    fontWeight: "700",
  },

  cardFinais: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 18,
    marginTop: 14,
  },

  finaisLista: {
    gap: 8,
  },

  finalItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 10,
  },

  finalLetra: {
    width: 46,
    color: "#1E3A8A",
    fontSize: 30,
    textAlign: "center",
    fontWeight: "700",
    writingDirection: "rtl",
  },

  finalTexto: {
    flex: 1,
    marginLeft: 8,
    marginRight: 8,
  },

  finalNome: {
    color: "#111827",
    fontSize: 14,
    fontWeight: "700",
  },

  finalOrigem: {
    color: "#64748B",
    fontSize: 12,
    fontWeight: "400",
  },

  finalExemplo: {
    color: "#64748B",
    fontSize: 12,
    marginTop: 3,
    writingDirection: "rtl",
  },

  dica: {
    width: "100%",
    flexDirection: "row",
    backgroundColor: "#FEF3C7",
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
  },

  dicaIcone: {
    fontSize: 24,
    marginRight: 10,
  },

  dicaTitulo: {
    color: "#92400E",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 4,
  },

  dicaTexto: {
    color: "#78350F",
    fontSize: 13,
    lineHeight: 18,
  },
});
