import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Switch, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Alert 
} from 'react-native';
import { Save, RefreshCcw } from 'lucide-react-native';
import Header from '@/components/Header';
import { useConnection } from '@/context/ConnectionContext';
import { useObjectDetection } from '@/context/ObjectDetectionContext';

export default function SettingsScreen() {
  const { serverUrl, setServerUrl, isConnected, connect } = useConnection();
  const { confidenceThreshold, setConfidenceThreshold, showDepthOverlay, setShowDepthOverlay } = useObjectDetection();
  
  const [tempServerUrl, setTempServerUrl] = useState(serverUrl);
  const [tempConfidence, setTempConfidence] = useState(confidenceThreshold.toString());

  const saveSettings = () => {
    // Validate server URL
    if (!tempServerUrl.startsWith('ws://') && !tempServerUrl.startsWith('wss://')) {
      Alert.alert(
        'Invalid URL',
        __DEV__
          ? 'Server URL must start with ws:// or wss://'
          : 'Server URL must start with wss:// in production'
      );
      return;
    }

    // In production, enforce wss://
    if (!__DEV__ && tempServerUrl.startsWith('ws://')) {
      Alert.alert('Security Warning', 'Using ws:// in production is not secure. Please use wss:// instead.');
      return;
    }

    // Validate confidence threshold
    const confidenceValue = parseFloat(tempConfidence);
    if (isNaN(confidenceValue) || confidenceValue < 0 || confidenceValue > 1) {
      Alert.alert('Invalid Value', 'Confidence threshold must be between 0 and 1');
      return;
    }

    // Save settings
    setServerUrl(tempServerUrl);
    setConfidenceThreshold(confidenceValue);
    
    Alert.alert('Success', 'Settings saved successfully');
    
    // Reconnect if URL changed and we were previously connected
    if (tempServerUrl !== serverUrl && isConnected) {
      connect();
    }
  };

  const resetToDefaults = () => {
    Alert.alert(
      'Reset Settings',
      'Are you sure you want to reset all settings to default values?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Reset',
          onPress: () => {
            setTempServerUrl(__DEV__ ? 'ws://192.168.1.100:8765' : 'wss://192.168.1.100:8765');
            setTempConfidence('0.5');
            setShowDepthOverlay(true);
          },
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Settings" />
      
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Connection</Text>
          
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Server URL</Text>
            <TextInput
              style={styles.input}
              value={tempServerUrl}
              onChangeText={setTempServerUrl}
              placeholder={__DEV__ ? "ws://device-ip:port" : "wss://device-ip:port"}
              placeholderTextColor="#9CA3AF"
            />
            <Text style={styles.settingHint}>
              {__DEV__ 
                ? "WebSocket URL to connect to the Jetson Nano Orin (ws:// or wss://)"
                : "Secure WebSocket URL to connect to the Jetson Nano Orin (wss:// required)"}
            </Text>
          </View>

          <View style={styles.connectionStatus}>
            <View style={[
              styles.statusIndicator, 
              { backgroundColor: isConnected ? '#10B981' : '#EF4444' }
            ]} />
            <Text style={styles.statusText}>
              {isConnected ? 'Connected' : 'Disconnected'}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detection Settings</Text>
          
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Confidence Threshold</Text>
            <TextInput
              style={styles.input}
              value={tempConfidence}
              onChangeText={setTempConfidence}
              placeholder="0.5"
              placeholderTextColor="#9CA3AF"
              keyboardType="decimal-pad"
            />
            <Text style={styles.settingHint}>
              Minimum confidence level (0-1) for detected objects
            </Text>
          </View>

          <View style={styles.settingItem}>
            <View style={styles.switchContainer}>
              <Text style={styles.settingLabel}>Show Depth Overlay</Text>
              <Switch
                value={showDepthOverlay}
                onValueChange={setShowDepthOverlay}
                trackColor={{ false: '#D1D5DB', true: '#818CF8' }}
                thumbColor={showDepthOverlay ? '#4F46E5' : '#F9FAFB'}
              />
            </View>
            <Text style={styles.settingHint}>
              Display depth information from the RealSense camera
            </Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.saveButton}
            onPress={saveSettings}
          >
            <Save size={20} color="#FFFFFF" />
            <Text style={styles.buttonText}>Save Settings</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.resetButton}
            onPress={resetToDefaults}
          >
            <RefreshCcw size={20} color="#FFFFFF" />
            <Text style={styles.buttonText}>Reset to Defaults</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.aboutText}>
            Object Detection App v1.0.0
          </Text>
          <Text style={styles.aboutDescription}>
            This application connects to a Jetson Nano Orin device running YOLOv8 object detection with an Intel RealSense D457 camera. It allows real-time object detection, tracking, and depth visualization.
          </Text>
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
  section: {
    marginBottom: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#1F2937',
    marginBottom: 16,
  },
  settingItem: {
    marginBottom: 16,
  },
  settingLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 12,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#1F2937',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  settingHint: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  connectionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  statusText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#1F2937',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 16,
  },
  saveButton: {
    backgroundColor: '#4F46E5',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  resetButton: {
    backgroundColor: '#6B7280',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  buttonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 8,
  },
  aboutText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 8,
  },
  aboutDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
});