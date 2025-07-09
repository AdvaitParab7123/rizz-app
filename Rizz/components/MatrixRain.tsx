import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { MatrixRainProps } from '../types';

const { width, height } = Dimensions.get('window');

export const MatrixRain: React.FC<MatrixRainProps> = ({ 
  columns = 12, 
  characters = 30 
}) => {
  const animatedValues = useRef(
    Array.from({ length: columns }, () => new Animated.Value(0))
  ).current;
  const [matrixChars, setMatrixChars] = useState<string[]>([]);
  
  useEffect(() => {
    const generateMatrixChars = () => {
      const chars = [];
      for (let i = 0; i < columns; i++) {
        const columnChars = Array.from({ length: characters }, () => {
          const charSets = [
            () => String.fromCharCode(0x30A0 + Math.random() * 96), // Katakana
            () => String.fromCharCode(0x0030 + Math.random() * 10), // Numbers
            () => String.fromCharCode(0x0041 + Math.random() * 26), // Letters
            () => ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'][Math.floor(Math.random() * 10)],
          ];
          return charSets[Math.floor(Math.random() * charSets.length)]();
        }).join('\n');
        chars.push(columnChars);
      }
      setMatrixChars(chars);
    };

    generateMatrixChars();
    
    const animations = animatedValues.map((animValue, index) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(index * 500),
          Animated.timing(animValue, {
            toValue: 1,
            duration: 5000 + Math.random() * 3000,
            useNativeDriver: true,
          }),
          Animated.delay(Math.random() * 1500),
        ])
      );
    });
    
    animations.forEach(animation => animation.start());
    
    const interval = setInterval(generateMatrixChars, 1500);
    
    return () => {
      animations.forEach(animation => animation.stop());
      clearInterval(interval);
    };
  }, [columns, characters, animatedValues]);

  return (
    <View style={styles.matrixContainer}>
      {animatedValues.map((animValue, index) => (
        <Animated.View
          key={index}
          style={[
            styles.matrixColumn,
            {
              left: (index * width) / columns,
              transform: [
                {
                  translateY: animValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-height * 2, height * 2],
                  }),
                },
              ],
              opacity: animValue.interpolate({
                inputRange: [0, 0.3, 0.7, 1],
                outputRange: [0, 0.8, 0.6, 0.2],
              }),
            },
          ]}
        >
          <Text style={styles.matrixText}>
            {matrixChars[index] || ''}
          </Text>
        </Animated.View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  matrixContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  matrixColumn: {
    position: 'absolute',
    width: width / 12,
    height: height * 4,
  },
  matrixText: {
    color: '#00FF99',
    fontSize: 16,
    fontFamily: 'monospace',
    lineHeight: 18,
    textAlign: 'center',
    fontWeight: 'bold',
    textShadowColor: '#00FF99',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 2,
  },
}); 