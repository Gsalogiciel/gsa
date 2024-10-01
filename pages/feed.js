import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from "react-native-vector-icons/Ionicons";

const Feedback = () => {
    const [feedback, setFeedback] = useState('');
    const navigation = useNavigation();

    const handleSubmit = () => {
        if (feedback.trim()) {
            // Here you would usually send the feedback to your server or handle it as needed
            Alert.alert("Merci pour votre retour !", "Nous avons bien reçu votre commentaire.");
            setFeedback(''); // Clear the input after submission
        } else {
            Alert.alert("Erreur", "Veuillez entrer un commentaire avant de soumettre.");
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollView}>
                <Text style={styles.title}>Retour d'Information</Text>
                <Text style={styles.subtitle}>Nous apprécions vos retours !</Text>
                <Text style={styles.paragraph}>
                    Utilisez le champ ci-dessous pour nous faire part de vos commentaires, suggestions ou préoccupations. Votre avis est important pour nous aider à améliorer notre application.
                </Text>
                <TextInput
                    style={styles.textInput}
                    multiline
                    numberOfLines={6}
                    placeholder="Écrivez votre commentaire ici..."
                    value={feedback}
                    onChangeText={setFeedback}
                />
                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                    <Text style={styles.submitButtonText}>Envoyer</Text>
                </TouchableOpacity>
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
    textInput: {
        backgroundColor: '#FFFFFF',
        borderColor: '#DDDDDD',
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
        fontSize: 16,
        color: '#333',
    },
    submitButton: {
        backgroundColor: '#4A90E2',
        borderRadius: 4,
        padding: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    submitButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
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

export default Feedback;
