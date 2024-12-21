import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from "react-native-vector-icons/Ionicons";

const TermesEtConditions = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollView}>
                <Text style={styles.title}>Termes et Conditions</Text>
                <View style={styles.section}>
                    <Text style={styles.subtitle}>1. Introduction</Text>
                    <Text style={styles.paragraph}>
                        Bienvenue sur notre application. Ces Termes et Conditions décrivent les règles et règlements pour l'utilisation de notre application.
                    </Text>
                </View>
                <View style={styles.section}>
                    <Text style={styles.subtitle}>2. Responsabilités de l'Utilisateur</Text>
                    <Text style={styles.paragraph}>
                        En utilisant notre application, vous acceptez de respecter toutes les lois et réglementations applicables. Vous êtes responsable de toute activité se produisant sous votre compte.
                    </Text>
                </View>
                <View style={styles.section}>
                    <Text style={styles.subtitle}>3. Politique de Confidentialité</Text>
                    <Text style={styles.paragraph}>
                        Nous valorisons votre vie privée. Veuillez consulter notre Politique de Confidentialité pour obtenir des informations sur la manière dont nous recueillons, utilisons et protégeons vos données personnelles.
                    </Text>
                </View>
                <View style={styles.section}>
                    <Text style={styles.subtitle}>4. Résiliation</Text>
                    <Text style={styles.paragraph}>
                        Nous nous réservons le droit de résilier ou de suspendre l'accès à notre application sans préavis ni responsabilité pour tout motif.
                    </Text>
                </View>
                <View style={styles.section}>
                    <Text style={styles.subtitle}>5. Modifications</Text>
                    <Text style={styles.paragraph}>
                        Nous pouvons mettre à jour ces Termes et Conditions de temps à autre. Nous vous informerons de toute modification en publiant les nouveaux termes sur cette page.
                    </Text>
                </View>
                <View style={styles.section}>
                    <Text style={styles.subtitle}>6. Contactez-Nous</Text>
                    <Text style={styles.paragraph}>
                        Si vous avez des questions ou des préoccupations concernant ces Termes et Conditions, veuillez nous contacter à commercial@gsaaouabdia.com.
                    </Text>
                </View>
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
        paddingBottom: 24,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#222',
        marginBottom: 20,
        textAlign: 'center',
    },
    section: {
        marginBottom: 20,
    },
    subtitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    paragraph: {
        fontSize: 16,
        color: '#555',
        lineHeight: 22,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#4A90E2',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 20,
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

export default TermesEtConditions;
