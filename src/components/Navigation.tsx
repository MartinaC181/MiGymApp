import React, { useEffect, useState } from 'react';
import { View, Pressable, Text, Keyboard } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import useNavigationStyles from '../styles/navigation';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../hooks/useAuth';

export default function Navigation() {
  const router = useRouter();
  const pathname = usePathname();
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const styles = useNavigationStyles();
  const { theme, isDarkMode } = useTheme();
  const { user } = useAuth();

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardVisible(true);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardVisible(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const NavItem = ({
    iconName,
    label,
    route,
  }: {
    iconName: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
    label: string;
    route: string;
  }) => {
    const isActive = pathname === route;
    
    return (
      <View style={styles.navItemWrapper}>
        <Pressable
          style={({ pressed }) => [
            styles.iconContainer,
            isActive && styles.iconContainerActive,
            pressed ? styles.iconContainerPressed : {},
          ]}
          onPress={() => router.push(route)}
        >
          <MaterialCommunityIcons
            name={iconName}
            size={36}
            color={isDarkMode ? '#000000' : theme.colors.primary}
          />
        </Pressable>
        <Text style={styles.iconText}>
          {label}
        </Text>
      </View>
    );
  };

  const gymItems = [
    { icon: 'account-group', label: 'Socios', route: '/(gimnasio)/gestion-socios' },
    { icon: 'dumbbell', label: 'Clases', route: '/(gimnasio)/gestion-clases' },
    { icon: 'wallet', label: 'Cuota', route: '/cuota' },
    { icon: 'account', label: 'Perfil', route: '/perfil' },
  ];

  const clientItems = [
    { icon: 'home', label: 'Inicio', route: '/home' },
    { icon: 'weight-lifter', label: 'Entrenamiento', route: '/entrenamiento' },
    { icon: 'wallet', label: 'Cuota', route: '/cuota' },
    { icon: 'account', label: 'Perfil', route: '/perfil' },
  ];

  const navItems = user?.role === 'gym' ? gymItems : clientItems;

  if (keyboardVisible) {
    return null;
  }

  return (
    <SafeAreaView edges={['bottom']} style={styles.safeArea}>
      <View style={styles.container}>
        {navItems.map((item) => (
          <NavItem
            key={item.route}
            iconName={item.icon as any}
            label={item.label}
            route={item.route}
          />
        ))}
      </View>
    </SafeAreaView>
  );
}


