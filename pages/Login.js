import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image, ActivityIndicator, Alert } from 'react-native';
import { Button, Input } from 'react-native-elements';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = ({ route }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false); // Loading state
    const navigation = useNavigation();
    const { user } = route.params || {};

    // Effect for initial checks
    useEffect(() => {
        const checkUser = async () => {
            if (user === 'nabil') {
                await AsyncStorage.removeItem('username');
            }
        };
        checkUser();

        const checkStatus = async () => {
            const storedUsername = await AsyncStorage.getItem('username');
            if (storedUsername) {
                navigation.navigate('Tabs', {
                    screen: 'Accueil',
                    params: { storedUsername },
                });
            }
        };
        checkStatus();
    }, [user]);

    // Login handler
    const handleLogin = async () => {
        if (!username || !password) {
            Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
            return;
        }

        setLoading(true); // Start loading
        try {
            const response = await axios.post(
                'https://gsaaouabdia.com/GSAsoftware/Admin_Gsa/page_administration/apis/log.php',
                JSON.stringify({ username, password })
            );

            if (response.data[0] === 'yes') {
                await AsyncStorage.setItem('username', username);
                await AsyncStorage.setItem('mac', response.data[1]);

                const storedUsername = await AsyncStorage.getItem('username');
                const storedMac = await AsyncStorage.getItem('mac');
                
                navigation.navigate('Tabs', {
                    screen: 'Accueil',
                    params: { storedUsername, storedMac },
                });
            } else {
                setResponse('Nom d\'utilisateur ou mot de passe incorrect.');
            }
        } catch (error) {
            console.error('Erreur de connexion:', error);
            Alert.alert('Erreur', 'Une erreur est survenue. Veuillez réessayer.');
        } finally {
            setLoading(false); // Stop loading
        }
    };

    return (
        <View style={styles.container}>
            <Image
                style={styles.image}
                source={require('../assets/logo2.png')}
                resizeMode="contain"
            />
            <View style={styles.form}>
                <Input
                    placeholder="Nom d'utilisateur"
                    leftIcon={{ type: 'font-awesome', name: 'user' }}
                    containerStyle={styles.inputContainer}
                    inputStyle={styles.input}
                    onChangeText={setUsername}
                    value={username}
                    autoCapitalize="none"
                />
                <Input
                    placeholder="Mot de passe"
                    leftIcon={{ type: 'font-awesome', name: 'key' }}
                    containerStyle={styles.inputContainer}
                    inputStyle={styles.input}
                    secureTextEntry
                    onChangeText={setPassword}
                    value={password}
                    autoCapitalize="none"
                />
                <Button
                    onPress={handleLogin}
                    title="Connexion"
                    buttonStyle={styles.button}
                    disabled={loading}
                />
                {loading && (
                    <ActivityIndicator size="large" color="#007BFF" style={styles.loadingIndicator} />
                )}
                {response ? <Text style={styles.responseText}>{response}</Text> : null}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9F9F9',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    image: {
        width: 150,
        height: 80,
        marginBottom: 30,
    },
    form: {
        width: '100%',
        maxWidth: 400,
    },
    inputContainer: {
        marginBottom: 15,
    },
    input: {
        fontSize: 16,
        color: '#333',
    },
    button: {
        backgroundColor: '#007BFF',
        borderRadius: 8,
        paddingVertical: 15,
        marginVertical: 10,
    },
    loadingIndicator: {
        marginVertical: 10,
    },
    responseText: {
        color: '#E74C3C',
        textAlign: 'center',
        marginTop: 10,
        fontSize: 14,
    },
});

export default Login;
