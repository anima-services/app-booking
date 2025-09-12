import { Dimensions } from 'react-native';
import { useState, useEffect } from 'react';

export const useResponsiveSizes = () => {
  const [sizes, setSizes] = useState(() => {
    const { width, height } = Dimensions.get('window');
    return calculateSizes(width, height);
  });

  useEffect(() => {
    const updateSizes = () => {
      const { width, height } = Dimensions.get('window');
      setSizes(calculateSizes(width, height));
    };

    const subscription = Dimensions.addEventListener('change', updateSizes);
    return () => subscription.remove();
  }, []);

  return sizes;
};

// Вынесем расчеты в отдельную функцию
const calculateSizes = (width, height) => ({
  topOffset: height * 0.2,
  bottomOffset: height * 0.05,
  propertyOffset: height * 0.0175,
  titleSize: height * 0.045,
  subtitleSize: height * 0.0325,
  textSize: height * 0.0225,
  text_2: height * 0.02,
  subTextSize: height * 0.015,
  hotizontalGapSize: height * .01,
  windowWidth: width,
  windowHeight: height,
  type: width > height ? 'landscape' : 'portrait'
});