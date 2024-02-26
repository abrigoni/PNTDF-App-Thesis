// Import dependencies
import React from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {Camera, Image} from 'react-native-pytorch-core';
// Import classify image function
import classifyImage from '@/ml-model/ImageClassifier';

// App function to render a camera and a text
export default function ClasificadorScreen() {
  // 1. Create a React state to store the top class returned from the
  // classifyImage function
  const [topClass, setTopClass] = React.useState<string | null>(null);
  const [time, setTime] = React.useState(-1);
  // Function to handle images whenever the user presses the capture button
  async function handleImage(image: Image) {
    const timeStart = Date.now();
    // Call the classify image function with the camera image
    const result = await classifyImage(image);
    // 2. Set result as top class label state
    setTopClass(result);
    const timeEnd = Date.now();
    setTime(timeEnd - timeStart);
    // Release the image from memory
    image.release();
  }

  return (
    <SafeAreaView style={StyleSheet.absoluteFill}>
      {/* Render camara and make it parent filling */}
      <Camera
        style={[StyleSheet.absoluteFill]}
        // Add handle image callback on the camera component
        onCapture={handleImage}
      />
      {/* Label container with custom render style and a text */}
      <View style={styles.labelContainer}>
        {/* 3. Change the text to render the top class label */}
        {topClass !== null && time !== -1 ? (
          <Text>
            {topClass}: {time}ms
          </Text>
        ) : (
          <Text>Presionar el boton para capturar y clasificar una especie</Text>
        )}
      </View>
    </SafeAreaView>
  );
}

// Custom render style for label container
const styles = StyleSheet.create({
  labelContainer: {
    padding: 20,
    margin: 20,
    marginTop: 40,
    borderRadius: 10,
    backgroundColor: 'white',
  },
});
