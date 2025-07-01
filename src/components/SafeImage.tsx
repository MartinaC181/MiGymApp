import React from 'react';
import { Image, ImageProps, ImageSourcePropType } from 'react-native';

interface SafeImageProps extends Omit<ImageProps, 'source'> {
  uri?: string | null;
  fallbackSource?: ImageSourcePropType;
}

// Helper function para validar URIs
const isValidUri = (uri: any): boolean => {
  return uri && typeof uri === 'string' && uri.trim().length > 0;
};

const SafeImage: React.FC<SafeImageProps> = ({ 
  uri, 
  fallbackSource = require('../../assets/icon.png'), 
  ...props 
}) => {
  const source = isValidUri(uri) 
    ? { uri: uri!.trim() } 
    : fallbackSource;

  return <Image source={source} {...props} />;
};

export default SafeImage; 