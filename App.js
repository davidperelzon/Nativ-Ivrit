import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

// Lista com as letras do alfabeto hebraico
const letras = [
  { letra: "א", nome: "Alef", som: "Sem som próprio", exemplo: "אבא", traducao: "Pai" },
  { letra: "ב", nome: "Bet", som: "B / V", exemplo: "בית", traducao: "Casa" },
  { letra: "ג", nome: "Gimel", som: "G", exemplo: "גמל", traducao: "Camelo" },
  { letra: "ד", nome: "Dalet", som: "D", exemplo: "דלת", traducao: "Porta" },
  { letra: "ה", nome: "He", som: "H", exemplo: "הר", traducao: "Montanha" },
  { letra: "ו", nome: "Vav", som: "V / U / O", exemplo: "ורד", traducao: "Rosa" },
  { letra: "ז", nome: "Zayin", som: "Z", exemplo: "זית", traducao: "Azeitona" },
  { letra: "ח", nome: "Het", som: "H gutural", exemplo: "חלב", traducao: "Leite" },
  { letra: "ט", nome: "Tet", som: "T", exemplo: "טוב", traducao: "Bom" },
  { letra: "י", nome: "Yod", som: "Y / I", exemplo: "ים", traducao: "Mar" },
  { letra: "כ", nome: "Kaf", som: "K / Kh", exemplo: "כלב", traducao: "Cachorro" },
  { letra: "ל", nome: "Lamed", som: "L", exemplo: "לב", traducao: "Coração" },
  { letra: "מ", nome: "Mem", som: "M", exemplo: "מים", traducao: "Água" },
  { letra: "נ", nome: "Nun", som: "N", exemplo: "נר", traducao: "Vela" },
  { letra: "ס", nome: "Samekh", som: "S", exemplo: "ספר", traducao: "Livro" },
  { letra: "ע", nome: "Ayin", som: "Som gutural", exemplo: "עיר", traducao: "Cidade" },
  { letra: "פ", nome: "Pe", som: "P / F", exemplo: "פרח", traducao: "Flor" },
  { letra: "צ", nome: "Tsadi", som: "TS", exemplo: "צל", traducao: "Sombra" },
  { letra: "ק", nome: "Qof", som: "K", exemplo: "קול", traducao: "Voz" },
  { letra: "ר", nome: "Resh", som: "R", exemplo: "ראש", traducao: "Cabeça" },
  { letra: "ש", nome: "Shin", som: "SH / S", exemplo: "שמש", traducao: "Sol" },
  { letra: "ת", nome: "Tav", som: "T", exemplo: "תפוח", traducao: "Maçã" },
];

// Tela de Login
function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (email === "admin@example.com" && password === "password") {
      Alert.alert("Login bem-sucedido!");
      navigation.navigate("AlfabetoHebraico");
    } else {
      Alert.alert("Credenciais inválidas", "Por favor, verifique seu email e senha.");
    }
  };

  return (
    <View style={stylesLogin.container}>
      <Text style={stylesLogin.title}>Bem-vindo</Text>
      <Text style={stylesLogin.subtitle}>Faça login para continuar</Text>

      <TextInput
        style={stylesLogin.input}
        placeholder="Email"
        placeholderTextColor="#aaa"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={stylesLogin.input}
        placeholder="Senha"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={stylesLogin.button} onPress={handleLogin}>
        <Text style={stylesLogin.buttonText}>Entrar</Text>
      </TouchableOpacity>
    </View>
  );
}

// Tela de Alfabeto Hebraico
function AlfabetoHebraico() {
  const [indice, setIndice] = useState(0);
  const letraAtual = letras[indice];

  function proximaLetra() {
    if (indice < letras.length - 1) {
      setIndice(indice + 1);
    }
  }

  function letraAnterior() {
    if (indice > 0) {
      setIndice(indice - 1);
    }
  }

  function escolherLetra(numero) {
    setIndice(numero);
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.titulo}>Nativ Ivrit</Text>
      <Text style={styles.subtitulo}>Aprenda o alfabeto hebraico</Text>
      <Text style={styles.progresso}>
        Letra {indice + 1} de {letras.length}
      </Text>
      <View style={styles.card}>
        <Text style={styles.letraGrande}>{letraAtual.letra}</Text>
        <Text style={styles.nome}>{letraAtual.nome}</Text>
        <Text style={styles.informacao}>Som: {letraAtual.som}</Text>
        <Text style={styles.exemploTitulo}>Exemplo</Text>
        <Text style={styles.exemplo}>{letraAtual.exemplo}</Text>
        <Text style={styles.traducao}>{letraAtual.traducao}</Text>
      </View>
      <View style={styles.botoes}>
        <TouchableOpacity style={styles.botao} onPress={letraAnterior}>
          <Text style={styles.textoBotao}>← Anterior</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.botao} onPress={proximaLetra}>
          <Text style={styles.textoBotao}>Próxima →</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.tituloLista}>Todas as letras</Text>
      <View style={styles.lista}>
        {letras.map((item, numero) => (
          <TouchableOpacity
            key={numero}
            style={styles.letraBotao}
            onPress={() => escolherLetra(numero)}
          >
            <Text style={styles.letraPequena}>{item.letra}</Text>
            <Text style={styles.nomePequeno}>{item.nome}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

// Navegação Principal
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="AlfabetoHebraico" component={AlfabetoHebraico} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Estilos para a tela de login
const stylesLogin = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#007BFF",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

// Estilos para a tela de alfabeto hebraico
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f7fb",
    padding: 20,
  },
  titulo: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
  },
  subtitulo: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 5,
    marginBottom: 15,
  },
  progresso: {
    textAlign: "center",
    fontSize: 16,
    marginBottom: 15,
  },
  card: {
    backgroundColor: "white",
    padding: 25,
    borderRadius: 15,
    alignItems: "center",
    marginBottom: 20,
  },
  letraGrande: {
    fontSize: 90,
    marginBottom: 10,
  },
  nome: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
  },
  informacao: {
    fontSize: 17,
    marginBottom: 20,
  },
  exemploTitulo: {
    fontSize: 14,
    fontWeight: "bold",
  },
  exemplo: {
    fontSize: 40,
    marginTop: 5,
  },
  traducao: {
    fontSize: 17,
    marginTop: 5,
  },
  botoes: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
  },
  botao: {
    backgroundColor: "#2563eb",
    padding: 15,
    borderRadius: 10,
    width: "48%",
  },
  textoBotao: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
  tituloLista: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
  },
  lista: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  letraBotao: {
    backgroundColor: "white",
    width: "30%",
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  letraPequena: {
    fontSize: 35,
  },
  nomePequeno: {
    fontSize: 13,
    marginTop: 5,
  },
});