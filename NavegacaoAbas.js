import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TelaInicio from '../screens/TelaInicio';
import TelaAprendizado from '../screens/TelaAprendizado';
import TelaJogos from '../screens/TelaJogos';
import TelaForum from '../screens/TelaForum';

const Tab = createBottomTabNavigator();

export default function NavegacaoAbas() {
 return (
  <Tab.Navigator>
   <Tab.Screen name="Inicio" component={TelaInicio} />
   <Tab.Screen name="Aprender" component={TelaAprendizado} />
   <Tab.Screen name="Jogos" component={TelaJogos} />
   <Tab.Screen name="Forum" component={TelaForum} />
  </Tab.Navigator>
 );
}
