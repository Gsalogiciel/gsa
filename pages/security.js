import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from "react-native-vector-icons/Ionicons";

const Security = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollView}>
                <Text style={styles.title}>Sécurité</Text>
                <Text style={styles.subtitle}>1. Changement de Mot de Passe</Text>
                <Text style={styles.paragraph}>
                    Il est important de changer régulièrement votre mot de passe pour garantir la sécurité de votre compte. Vous pouvez le faire depuis la section « Paramètres » de l'application.
                </Text>
                <Text style={styles.subtitle}>2. Authentification à Deux Facteurs</Text>
                <Text style={styles.paragraph}>
                    L'authentification à deux facteurs ajoute une couche de sécurité supplémentaire à votre compte. Assurez-vous d'activer cette fonctionnalité pour renforcer la protection de vos informations.
                </Text>
                
                <Text style={styles.subtitle}>3. Sécurité des Données</Text>
                <Text style={styles.paragraph}>
                    Nous utilisons des protocoles de sécurité avancés pour protéger vos données. Pour en savoir plus sur nos pratiques de sécurité, veuillez consulter notre Politique de Confidentialité.
                </Text>
                <Text style={styles.subtitle}>4. Signaler un Problème</Text>
                <Text style={styles.paragraph}>
                    Si vous suspectez une activité suspecte ou avez des préoccupations concernant la sécurité de votre compte, veuillez nous contacter immédiatement à support@example.com.
                </Text>
            </ScrollView>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Icon name="arrow-back-outline" size={24} color="#FFFFFF" />
                <Text style={styles.backButtonText}>Retour</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9F9F9',
    },
    scrollView: {
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#333',
        marginBottom: 16,
    },
    subtitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginTop: 16,
        marginBottom: 8,
    },
    paragraph: {
        fontSize: 16,
        color: '#666',
        marginBottom: 12,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#4A90E2',
        borderRadius: 4,
        padding: 12,
        margin: 16,
        justifyContent: 'center',
    },
    backButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
});

export default Security;
