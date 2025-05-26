import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Dimensions, 
  Animated, 
  FlatList 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Menu, X, Focus, Play, Square, RotateCw } from 'lucide-react-native';
import { useConnection } from '@/context/ConnectionContext';
import { useObjectDetection } from '@/context/ObjectDetectionContext';
import CameraStream from '@/components/CameraStream';
import ObjectListItem from '@/components/ObjectListItem';
import Header from '@/components/Header';

const { width } = Dimensions.get('window');
const DRAWER_WIDTH = width * 0.75;

export default function CameraScreen() {
  const { isConnected, connect, disconnect } = useConnection();
  const { detectedObjects, selectObject, selectedObject, tracking, startTracking, stopTracking } = useObjectDetection();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Attempt to connect when the component mounts
    if (!isConnected) {
      connect();
    }

    // Clean up connection on unmount
    return () => {
      if (isConnected) {
        disconnect();
      }
    };
  }, []);

  const toggleDrawer = () => {
    const toValue = drawerOpen ? 0 : 1;
    
    Animated.timing(drawerAnim, {
      toValue,
      duration: 300,
      useNativeDriver: true,
    }).start();
    
    setDrawerOpen(!drawerOpen);
  };

  const translateX = drawerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-DRAWER_WIDTH, 0],
  });

  const mainTranslateX = drawerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, DRAWER_WIDTH],
  });

  const handleObjectPress = (objectId: string) => {
    selectObject(objectId);
    if (drawerOpen) {
      toggleDrawer();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Main Content */}
      <Animated.View 
        style={[
          styles.mainContainer, 
          { transform: [{ translateX: mainTranslateX }] }
        ]}
      >
        <Header 
          title="Camera View" 
          leftIcon={<Menu size={24} color="#1F2937" />}
          onLeftPress={toggleDrawer}
        />
        
        <View style={styles.cameraContainer}>
          <CameraStream />

          {selectedObject && (
            <View style={styles.objectInfoOverlay}>
              <Text style={styles.objectInfoText}>
                {selectedObject.label} - Confidence: {(selectedObject.confidence * 100).toFixed(1)}%
              </Text>
              <Text style={styles.objectInfoText}>
                Distance: {selectedObject.depth?.toFixed(2)}m
              </Text>
            </View>
          )}
        </View>

        <View style={styles.controlsContainer}>
          {selectedObject ? (
            <>
              <TouchableOpacity 
                style={[styles.controlButton, tracking ? styles.activeButton : null]}
                onPress={tracking ? stopTracking : startTracking}
              >
                {tracking ? (
                  <Square size={24} color="#FFFFFF" />
                ) : (
                  <Play size={24} color="#FFFFFF" />
                )}
                <Text style={styles.controlButtonText}>
                  {tracking ? 'Stop Tracking' : 'Track Object'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.controlButton}
                onPress={() => selectObject(null)}
              >
                <X size={24} color="#FFFFFF" />
                <Text style={styles.controlButtonText}>Clear Selection</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity 
              style={styles.controlButton}
              onPress={toggleDrawer}
            >
              <Focus size={24} color="#FFFFFF" />
              <Text style={styles.controlButtonText}>Select Object</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity 
            style={[styles.controlButton, !isConnected ? styles.connectButton : null]}
            onPress={isConnected ? disconnect : connect}
          >
            <RotateCw size={24} color="#FFFFFF" />
            <Text style={styles.controlButtonText}>
              {isConnected ? 'Disconnect' : 'Connect'}
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Drawer */}
      <Animated.View 
        style={[
          styles.drawer, 
          { transform: [{ translateX }] }
        ]}
      >
        <View style={styles.drawerHeader}>
          <Text style={styles.drawerTitle}>Detected Objects</Text>
          <TouchableOpacity onPress={toggleDrawer}>
            <X size={24} color="#1F2937" />
          </TouchableOpacity>
        </View>

        <FlatList
          data={detectedObjects}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <ObjectListItem 
              object={item} 
              isSelected={selectedObject?.id === item.id}
              onPress={() => handleObjectPress(item.id)}
            />
          )}
          contentContainerStyle={styles.drawerContent}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No objects detected</Text>
          }
        />
      </Animated.View>

      {/* Backdrop when drawer is open */}
      {drawerOpen && (
        <TouchableOpacity 
          style={styles.backdrop} 
          onPress={toggleDrawer}
          activeOpacity={1}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  mainContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  cameraContainer: {
    flex: 1,
    position: 'relative',
  },
  objectInfoOverlay: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(31, 41, 55, 0.8)',
    borderRadius: 8,
    padding: 16,
  },
  objectInfoText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  controlsContainer: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    gap: 8,
  },
  controlButton: {
    backgroundColor: '#4F46E5',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    flex: 1,
    minWidth: 150,
  },
  activeButton: {
    backgroundColor: '#DC2626',
  },
  connectButton: {
    backgroundColor: '#059669',
  },
  controlButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#FFFFFF',
    marginLeft: 8,
  },
  drawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 1000,
  },
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  drawerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#1F2937',
  },
  drawerContent: {
    padding: 8,
  },
  emptyText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 24,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999,
  },
});