import React from "react";
import { Text, StyleSheet } from "react-native";

interface Props {
  size?: number;
  muted?: boolean;
}

const Flame: React.FC<Props> = ({ size = 64, muted = false }) => {
  const fontSize = size * 0.9; 
  
  return (
    <Text style={[styles.flame, { fontSize, opacity: muted ? 0.3 : 1 }]}>
      🔥
    </Text>
  );
};

const styles = StyleSheet.create({
  flame: {
    textAlign: 'center',
    textShadowColor: 'rgba(255, 87, 34, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});

export default Flame; 