import { useWindowDimensions } from 'react-native';

export const useResponsiveSizes = () => {
  const { width, height } = useWindowDimensions();
  return {
    topOffset: height * 0.2,
    bottomOffset: height * 0.05,
    propertyOffset: height * 0.0175,
    titleSize: height * 0.045,
    subtitleSize: height * 0.0325,
    textSize: height * 0.0225,
    text_2: height * 0.02,
    subTextSize: height * 0.015,
    hotizontalGapSize: height * .01
  };
}; 