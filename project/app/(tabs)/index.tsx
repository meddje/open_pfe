import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowRight, Camera } from 'lucide-react-native';
import Header from '@/components/Header';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Header title="Object Detection" />
      
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.heroContainer}>
          <Image 
            source={{ uri: 'https://images.pexels.com/photos/5473955/pexels-photo-5473955.jpeg' }}
            style={styles.heroImage}
          />
          <View style={styles.heroOverlay}>
            <Text style={styles.heroTitle}>Real-time Object Detection</Text>
            <Text style={styles.heroSubtitle}>Connect to Jetson Nano Orin to detect and track objects</Text>
            <TouchableOpacity 
              style={styles.heroCTA}
              onPress={() => router.push('/camera')}
            >
              <Text style={styles.heroButtonText}>Start Camera</Text>
              <Camera size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Features</Text>
        
        <View style={styles.featureCard}>
          <View style={styles.featureIcon}>
            <Camera size={24} color="#4F46E5" />
          </View>
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Real-time Object Detection</Text>
            <Text style={styles.featureDescription}>
              View live video feed with YOLOv8 object detection overlay
            </Text>
          </View>
          <TouchableOpacity style={styles.featureAction}>
            <ArrowRight size={20} color="#4F46E5" />
          </TouchableOpacity>
        </View>

        <View style={styles.featureCard}>
          <View style={styles.featureIcon}>
            <Camera size={24} color="#4F46E5" />
          </View>
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Depth Sensing</Text>
            <Text style={styles.featureDescription}>
              Visualize depth data from the Intel RealSense D457 camera
            </Text>
          </View>
          <TouchableOpacity style={styles.featureAction}>
            <ArrowRight size={20} color="#4F46E5" />
          </TouchableOpacity>
        </View>

        <View style={styles.featureCard}>
          <View style={styles.featureIcon}>
            <Camera size={24} color="#4F46E5" />
          </View>
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Object Tracking</Text>
            <Text style={styles.featureDescription}>
              Select and track specific objects detected in the video feed
            </Text>
          </View>
          <TouchableOpacity style={styles.featureAction}>
            <ArrowRight size={20} color="#4F46E5" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    padding: 16,
  },
  heroContainer: {
    height: 240,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
  },
  heroImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  heroOverlay: {
    backgroundColor: 'rgba(31, 41, 55, 0.7)',
    padding: 24,
    height: '100%',
    justifyContent: 'flex-end',
  },
  heroTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#E5E7EB',
    marginBottom: 16,
  },
  heroCTA: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  heroButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#FFFFFF',
    marginRight: 8,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#1F2937',
    marginBottom: 16,
  },
  featureCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 4,
  },
  featureDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  featureAction: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
});