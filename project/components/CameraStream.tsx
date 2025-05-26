import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, Text, Dimensions } from 'react-native';
import { useConnection } from '@/context/ConnectionContext';
import { useObjectDetection } from '@/context/ObjectDetectionContext';

const { width, height } = Dimensions.get('window');

export default function CameraStream() {
  const { isConnected, lastFrame } = useConnection();
  const { detectedObjects, selectedObject, showDepthOverlay } = useObjectDetection();
  const [aspectRatio, setAspectRatio] = useState(16 / 9);
  
  // Calculate the dimensions of the camera view
  const streamHeight = width / aspectRatio;
  
  // When we get the first frame, update the aspect ratio
  useEffect(() => {
    if (lastFrame) {
      const img = new Image();
      img.onload = () => {
        setAspectRatio(img.width / img.height);
      };
      img.src = lastFrame;
    }
  }, [lastFrame]);

  return (
    <View style={styles.container}>
      {isConnected && lastFrame ? (
        <View style={styles.streamContainer}>
          <Image 
            source={{ uri: lastFrame }} 
            style={[styles.videoStream, { height: streamHeight }]}
            resizeMode="contain"
          />
          
          {/* Object detection bounding boxes */}
          <View style={[styles.detectionsOverlay, { height: streamHeight }]}>
            {detectedObjects.map(obj => (
              <View 
                key={obj.id}
                style={[
                  styles.boundingBox,
                  {
                    left: obj.bbox.x * width,
                    top: obj.bbox.y * streamHeight,
                    width: obj.bbox.width * width,
                    height: obj.bbox.height * streamHeight,
                    borderColor: selectedObject?.id === obj.id ? '#FF0000' : '#4F46E5',
                    borderWidth: selectedObject?.id === obj.id ? 3 : 2,
                    opacity: selectedObject ? (selectedObject.id === obj.id ? 1 : 0.4) : 1,
                  }
                ]}
              >
                <View style={[
                  styles.labelContainer,
                  { backgroundColor: selectedObject?.id === obj.id ? '#FF0000' : '#4F46E5' }
                ]}>
                  <Text style={styles.labelText}>
                    {obj.label} ({(obj.confidence * 100).toFixed(0)}%)
                  </Text>
                </View>
                
                {showDepthOverlay && obj.depth && (
                  <View style={styles.depthContainer}>
                    <Text style={styles.depthText}>
                      {obj.depth.toFixed(2)}m
                    </Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>
      ) : (
        <View style={[styles.placeholderContainer, { height: streamHeight }]}>
          <Text style={styles.placeholderText}>
            {isConnected 
              ? 'Waiting for video stream...' 
              : 'Not connected to Jetson device'}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#000',
    position: 'relative',
  },
  streamContainer: {
    position: 'relative',
  },
  videoStream: {
    width: '100%',
  },
  detectionsOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  boundingBox: {
    position: 'absolute',
    borderRadius: 4,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  labelContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginTop: -24,
    marginLeft: -2,
  },
  labelText: {
    color: 'white',
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  depthContainer: {
    position: 'absolute',
    bottom: -24,
    right: -2,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  depthText: {
    color: 'white',
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  placeholderContainer: {
    width: '100%',
    backgroundColor: '#1F2937',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
});