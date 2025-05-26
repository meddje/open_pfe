import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Camera, Award } from 'lucide-react-native';
import { DetectedObject } from '@/types/ObjectDetection';

interface ObjectListItemProps {
  object: DetectedObject;
  isSelected: boolean;
  onPress: () => void;
}

// Object icon mapping - add more as needed
const getObjectIcon = (label: string) => {
  const commonObjects: Record<string, string> = {
    person: 'https://images.pexels.com/photos/1089438/pexels-photo-1089438.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&dpr=1',
    car: 'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&dpr=1',
    dog: 'https://images.pexels.com/photos/58997/pexels-photo-58997.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&dpr=1',
    cat: 'https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&dpr=1',
  };
  
  return commonObjects[label.toLowerCase()];
};

export default function ObjectListItem({ object, isSelected, onPress }: ObjectListItemProps) {
  const objectIcon = getObjectIcon(object.label);
  
  return (
    <TouchableOpacity 
      style={[
        styles.container,
        isSelected && styles.selectedContainer
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        {objectIcon ? (
          <Image 
            source={{ uri: objectIcon }} 
            style={styles.objectImage}
          />
        ) : (
          <Camera size={24} color="#4F46E5" />
        )}
      </View>
      
      <View style={styles.contentContainer}>
        <Text style={styles.label}>{object.label}</Text>
        <View style={styles.detailsContainer}>
          <Award size={14} color="#6B7280" />
          <Text style={styles.confidence}>
            {(object.confidence * 100).toFixed(1)}%
          </Text>
          
          {object.depth && (
            <>
              <View style={styles.separator} />
              <Text style={styles.distance}>
                {object.depth.toFixed(2)}m
              </Text>
            </>
          )}
        </View>
      </View>
      
      {isSelected && (
        <View style={styles.selectedIndicator} />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
    marginBottom: 8,
  },
  selectedContainer: {
    backgroundColor: '#EEF2FF',
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E0E7FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    overflow: 'hidden',
  },
  objectImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  contentContainer: {
    flex: 1,
  },
  label: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 4,
  },
  detailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  confidence: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
  },
  separator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D1D5DB',
    marginHorizontal: 8,
  },
  distance: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
  },
  selectedIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4F46E5',
  },
});