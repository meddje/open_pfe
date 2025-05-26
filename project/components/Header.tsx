import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  leftIcon?: React.ReactNode;
  onLeftPress?: () => void;
  rightIcon?: React.ReactNode;
  onRightPress?: () => void;
}

export default function Header({
  title,
  showBackButton = false,
  onBackPress,
  leftIcon,
  onLeftPress,
  rightIcon,
  onRightPress,
}: HeaderProps) {
  const router = useRouter();

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  return (
    <View style={styles.header}>
      {showBackButton && (
        <TouchableOpacity 
          style={styles.iconButton} 
          onPress={handleBackPress}
        >
          <ArrowLeft size={24} color="#1F2937" />
        </TouchableOpacity>
      )}
      
      {leftIcon && !showBackButton && (
        <TouchableOpacity 
          style={styles.iconButton} 
          onPress={onLeftPress}
        >
          {leftIcon}
        </TouchableOpacity>
      )}
      
      <Text style={styles.title}>{title}</Text>
      
      {rightIcon ? (
        <TouchableOpacity 
          style={styles.iconButton} 
          onPress={onRightPress}
        >
          {rightIcon}
        </TouchableOpacity>
      ) : (
        <View style={styles.rightPlaceholder} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    ...Platform.select({
      ios: {
        paddingTop: 16,
      },
      android: {
        paddingTop: 16,
      },
    }),
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#1F2937',
    flex: 1,
    textAlign: 'center',
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  rightPlaceholder: {
    width: 40,
  },
});