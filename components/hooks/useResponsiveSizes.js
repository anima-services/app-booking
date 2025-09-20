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

const calculateSizes = (width, height) => {
  let type = width > height ? 'landscape' : 'portrait';
  type = width / height > .85 ? 'square' : type;

  let newHeight = height;
  let newWidth = width;
  switch (type) {
    case 'landscape':
      newHeight *= 1;
      newWidth *= 1;
      break;
    case 'portrait':
      newHeight *= 0.6;
      newWidth *= 0.6;
      break;
    case 'square':
      newHeight *= 1.8;
      newWidth *= 1.8;
      break;
  }

  return ({
    topOffset: newHeight * (type === 'landscape' ? 0.2 : type === 'square' ? 0 : 0.1),
    bottomOffset: newHeight * 0.05,
    propertyOffset: newHeight * 0.0175,
    titleSize: newHeight * 0.045,
    subtitleSize: newHeight * 0.0325,
    textSize: newHeight * 0.0225,
    text_2: newHeight * 0.02,
    subTextSize: newHeight * 0.015,
    hotizontalGapSize: newHeight * .01,
    windowWidth: newWidth,
    windowHeight: newHeight,
    type: type
  })
};