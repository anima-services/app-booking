import React from 'react';
import { View, Text, StyleSheet, ScrollView, Button } from 'react-native';

const DetailsScreen = ({ navigation }) => {
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Экран с деталями</Text>
        
        {[...Array(20)].map((_, i) => (
          <Text key={i} style={styles.item}>
            Элемент информации #{i + 1}
          </Text>
        ))}
        
        <View style={styles.buttonContainer}>
          <Button
            title="Назад"
            onPress={() => navigation.goBack()}
            color="#6200ee"
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 15,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    color: '#444',
  },
  buttonContainer: {
    marginTop: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },
});

export default DetailsScreen;