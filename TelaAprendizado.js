import { FlatList, Text, View } from 'react-native';
import palavras from '../data/palavras';

export default function TelaAprendizado(){
 return (
  <View>
   <FlatList
    data={palavras}
    keyExtractor={(item)=>item.id}
    renderItem={({item})=><Text>{item.hebraico} - {item.portugues}</Text>}
   />
  </View>
 );
}