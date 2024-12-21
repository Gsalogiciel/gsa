import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import Icon from "react-native-vector-icons/Ionicons";
import AsyncStorage from '@react-native-async-storage/async-storage';

const Settings = () => {
    const navigation = useNavigation();

    const handleLogout = async () => {
        // Supprime les données de l'utilisateur
        await AsyncStorage.removeItem('username');
        await AsyncStorage.removeItem('mac');
        await AsyncStorage.removeItem('client');
        // Redirige vers l'écran de connexion
        navigation.navigate("Login", {
            user: "nabil"
        });
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollView}>
                <TouchableOpacity style={styles.option} onPress={() => navigation.navigate("Sécurité")}>
                    <Icon name="shield-checkmark-outline" size={24} color="#4A90E2" />
                    <Text style={styles.optionText}>Sécurité</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.option} onPress={() => navigation.navigate("Termes et Conditions")}>
                    <Icon name="alert-circle-outline" size={24} color="#4A90E2" />
                    <Text style={styles.optionText}>Termes et Conditions</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.option} onPress={() => navigation.navigate("Feedback")}>
                    <Icon name="chatbox-outline" size={24} color="#4A90E2" />
                    <Text style={styles.optionText}>Feedback</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.option, styles.logout]} onPress={handleLogout}>
                    <Icon name="exit-outline" size={24} color="#FF3B30" />
                    <Text style={styles.optionText}>Déconnexion</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9F9F9',
    },
    scrollView: {
        paddingHorizontal: 16,
        paddingVertical: 24,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
        elevation: 2,
        shadowColor: '#00000029',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    optionText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginLeft: 12,
    },
    logout: {
        marginTop: 24,
    },
});

export default Settings;
