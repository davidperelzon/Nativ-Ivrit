import { View, Text, Button } from 'react-native';
import { useState } from 'react';

export default function TelaJogos(){
 const [pontuacao,setPontuacao] = useState(0);

 return (
  <View>
   <Text>Pontuação: {pontuacao}</Text>
   <Button title="Ganhar ponto" onPress={()=>setPontuacao(pontuacao+1)} />
  </View>
 );
}