import React, { useState, useEffect } from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import NetInfo from '@react-native-community/netinfo';
import Clients from './pages/Clients';
import Orders from './pages/orders';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Stock from './pages/Stock';
import Home from './pages/home';
import Settings from './pages/settings';
import Login from './pages/Login';
import AddProduct from './pages/addProduct';
import Panier from './pages/panier';
import Valide from './pages/valide';
import Bon from './pages/Bon';
import { StyleSheet, TouchableOpacity, View, Alert } from 'react-native';
import SplashScreenComponent from './pages/SplashScreen';
import Clients2 from './pages/SelectClient';
import TermesEtConditions from './pages/terme';
import Security from './pages/security';
import Feedback from './pages/feed';
import Stock2 from './pages/stockSelect';


const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MyTabs() {
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  const randnum = Math.random(86428648282);

  


  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          switch (route.name) {
            case 'Accueil':
              iconName = 'home';
              break;
            case 'Stock':
              iconName = 'archive';
              break;
            case 'Plus':
              iconName = 'plus-circle';
              break;
            case 'Clients':
              iconName = 'account-group';
              break;
            case 'Factures':
              iconName = 'file-document';
              break;
            default:
              iconName = 'home';
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#0163d2',
        tabBarInactiveTintColor: '#8e8e93',
        tabBarStyle: {
          paddingBottom: 5,
          height: 60,
          borderTopWidth: 0,
          elevation: 0,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          backgroundColor: '#fff',
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      })}
    >
      <Tab.Screen
        name="Accueil"
        component={Home}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Stock"
        component={Stock}
        options={{ headerStyle: { backgroundColor: '#f0f0f0' } }}
      />
      <Tab.Screen
        name="Plus"
        component={Valide}
        options={{
          tabBarIcon: () => (
            <TouchableOpacity
              style={styles.plusButton}
              onPress={() => navigation.navigate("Ajouter une Facture", {
                valclient: 'Sélectionner un client',
                randnum: randnum
              })}
            >
              <Icon name="plus" size={30} color="white" />
            </TouchableOpacity>
          ),
          tabBarLabel: () => null
        }}
      />
      <Tab.Screen
        name="Clients"
        component={Clients}
        options={{ headerStyle: { backgroundColor: '#f0f0f0' } }}
      />
      <Tab.Screen
        name="Factures"
        component={Orders}
        options={{ headerStyle: { backgroundColor: '#f0f0f0' } }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleConnectivityChange = (state) => {
      if (!state.isConnected) {
        Alert.alert(
          'Pas de connexion Internet',
          'Veuillez vérifier votre connexion Internet et réessayer.',
          [{ text: 'OK' }]
        );
      } else if (state.effectiveType === '2g' || state.effectiveType === 'slow-2g' || state.effectiveType === '3g') {
        Alert.alert(
          'Connexion Internet lente',
          'Votre connexion Internet est lente. Certaines fonctionnalités peuvent ne pas fonctionner comme prévu.',
          [{ text: 'OK' }]
        );
      }
    };

    // Initial check
    NetInfo.fetch().then(handleConnectivityChange);

    // Subscribe to network state changes
    const unsubscribe = NetInfo.addEventListener(handleConnectivityChange);

    // Clean up the subscription on component unmount
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const loadApp = async () => {
      // Simulate app loading
      await new Promise(resolve => setTimeout(resolve, 5000));
      setIsLoading(false);
    };

    loadApp();
  }, []);

  if (isLoading) {
    return <SplashScreenComponent />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#f0f0f0' },
          headerTitleStyle: { fontWeight: 'bold' },
          headerTintColor: '#0163d2',
        }}
      >
        <Stack.Screen options={{ headerShown: false }} name="Login" component={Login} />
        <Stack.Screen options={{ headerShown: false }} name="Tabs" component={MyTabs} />
        <Stack.Screen name="Ajouter au Liste" component={AddProduct} />
        <Stack.Screen name="Panier" component={Panier} />
        <Stack.Screen name="Ajouter une Facture" component={Valide} />
        <Stack.Screen name="Bon" component={Bon} />
        <Stack.Screen name="Séléctionner un client" component={Clients2} />
        <Stack.Screen name="Paramaître" component={Settings} />
        <Stack.Screen name="Termes et Conditions" component={TermesEtConditions} />
        <Stack.Screen name="Sécurité" component={Security} />
        <Stack.Screen name="Feedback" component={Feedback} />
        <Stack.Screen name="Ajouter un produit" component={Stock2} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  plusButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#0163d2',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)', // Semi-transparent background
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    borderRadius: 10,
    backgroundColor: 'white',
    // Rounded corners
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5, // Android shadow
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  touchClient: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    backgroundColor: '#f7f7f7',
    marginTop: 15,
  },
  clientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  clientText: {
    fontSize: 16,
    color: '#333',
  },
  clientChoice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  choiceText: {
    fontSize: 14,
    color: 'gray',
  },
  chooseProductButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0163d2',
    borderRadius: 10,
    paddingVertical: 12,
    marginTop: 20,
  },
  chooseProductButtonText: {
    color: 'white',
    fontSize: 15,
    marginLeft: 8,
  },
  textInput: {
    marginTop: 20,
    backgroundColor: 'white',
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  inputHalf: {
    width: '48%',
    backgroundColor: 'white',
  },
  submitButton: {
    marginTop: 25,
    backgroundColor: '#0163d2',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});