import AsyncStorage from '@react-native-async-storage/async-storage'; 
import React, { useEffect, useState } from 'react';
import { View, ScrollView, Image, StyleSheet } from 'react-native';

const HorizontalScrollImages = (props) => {
  const [responseData, setResponseData] = useState([]);
  const [key2, setKey] = useState('');
  const [user, setUser] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const username2 = await AsyncStorage.getItem('username');
        const value5 = await AsyncStorage.getItem('mac');
        setKey(value5);
        setUser(username2);
        handleApiSpecial(value5);
      } catch (error) {
        console.error('Failed to get item:', error);
      }
    };
    fetchData();
  }, []);

  const handleApiSpecial = async (key) => {
    try {
      const response = await fetch('https://gsaaouabdia.com/GSAsoftware/Admin_Gsa/page_administration/apis/img.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key2: key, idstock: props.id })
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setResponseData(data);
    } catch (error) {
      console.error('API error:', error);
    } 
  };

  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false} 
      style={styles.scrollContainer}
    >
      {responseData.map((data, index) => (
        <View key={index}> 
          <Image 
            source={{ uri: `https://gsaaouabdia.com/GSAsoftware/manage/files/${data.nameF}` }} 
            style={styles.image} 
          />
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingVertical: 10,
    marginTop: 10,
  },
  image: {
    width: 250,
    height: 250,
    marginRight: 10,
    borderRadius: 8,
    resizeMode: 'cover', // S'assure que les images sont bien ajustées
  },
});

export default HorizontalScrollImages;
