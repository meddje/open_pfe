import React, { createContext, useContext, useState, useEffect } from 'react';
import { useConnection } from './ConnectionContext';
import { Platform } from 'react-native';
import { openDatabase } from '@/utils/database';
import { generateUniqueId } from '@/utils/helpers';
import { DetectedObject } from '@/types/ObjectDetection';

interface ObjectDetectionContextType {
  detectedObjects: DetectedObject[];
  selectedObject: DetectedObject | null;
  selectObject: (objectId: string | null) => void;
  tracking: boolean;
  startTracking: () => void;
  stopTracking: () => void;
  confidenceThreshold: number;
  setConfidenceThreshold: (threshold: number) => void;
  showDepthOverlay: boolean;
  setShowDepthOverlay: (show: boolean) => void;
}

const ObjectDetectionContext = createContext<ObjectDetectionContextType>({
  detectedObjects: [],
  selectedObject: null,
  selectObject: () => {},
  tracking: false,
  startTracking: () => {},
  stopTracking: () => {},
  confidenceThreshold: 0.5,
  setConfidenceThreshold: () => {},
  showDepthOverlay: true,
  setShowDepthOverlay: () => {},
});

export const useObjectDetection = () => useContext(ObjectDetectionContext);

interface ObjectDetectionProviderProps {
  children: React.ReactNode;
}

// Sample data for development and testing
const SAMPLE_OBJECTS: DetectedObject[] = [
  {
    id: '1',
    label: 'Person',
    confidence: 0.92,
    bbox: { x: 0.2, y: 0.3, width: 0.2, height: 0.4 },
    depth: 2.5,
  },
  {
    id: '2',
    label: 'Car',
    confidence: 0.88,
    bbox: { x: 0.6, y: 0.4, width: 0.3, height: 0.2 },
    depth: 5.7,
  },
  {
    id: '3',
    label: 'Dog',
    confidence: 0.78,
    bbox: { x: 0.1, y: 0.7, width: 0.15, height: 0.2 },
    depth: 1.8,
  },
];

export const ObjectDetectionProvider: React.FC<ObjectDetectionProviderProps> = ({ children }) => {
  const { isConnected, lastFrame } = useConnection();
  const [detectedObjects, setDetectedObjects] = useState<DetectedObject[]>([]);
  const [selectedObject, setSelectedObject] = useState<DetectedObject | null>(null);
  const [tracking, setTracking] = useState(false);
  const [confidenceThreshold, setConfidenceThreshold] = useState(0.5);
  const [showDepthOverlay, setShowDepthOverlay] = useState(true);

  // Initialize database and load settings when app starts
  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        const db = await openDatabase();
        
        // Create tables if they don't exist
        db.transaction(tx => {
          tx.executeSql(
            `CREATE TABLE IF NOT EXISTS settings (
              id INTEGER PRIMARY KEY NOT NULL,
              confidence_threshold REAL NOT NULL,
              show_depth_overlay INTEGER NOT NULL
            );`
          );
          
          tx.executeSql(
            `CREATE TABLE IF NOT EXISTS detected_objects (
              id TEXT PRIMARY KEY NOT NULL,
              label TEXT NOT NULL,
              confidence REAL NOT NULL,
              last_seen TEXT NOT NULL,
              times_detected INTEGER NOT NULL
            );`
          );
        });
        
        // Load settings
        db.transaction(tx => {
          tx.executeSql(
            'SELECT * FROM settings LIMIT 1',
            [],
            (_, result) => {
              if (result.rows.length > 0) {
                const settings = result.rows.item(0);
                setConfidenceThreshold(settings.confidence_threshold);
                setShowDepthOverlay(!!settings.show_depth_overlay);
              } else {
                // Insert default settings if none exist
                tx.executeSql(
                  'INSERT INTO settings (id, confidence_threshold, show_depth_overlay) VALUES (1, ?, ?)',
                  [confidenceThreshold, showDepthOverlay ? 1 : 0]
                );
              }
            }
          );
        });
      } catch (error) {
        console.error('Failed to initialize database:', error);
      }
    };
    
    initializeDatabase();
  }, []);

  // Save settings when they change
  useEffect(() => {
    const saveSettings = async () => {
      try {
        const db = await openDatabase();
        
        db.transaction(tx => {
          tx.executeSql(
            'UPDATE settings SET confidence_threshold = ?, show_depth_overlay = ? WHERE id = 1',
            [confidenceThreshold, showDepthOverlay ? 1 : 0]
          );
        });
      } catch (error) {
        console.error('Failed to save settings:', error);
      }
    };
    
    saveSettings();
  }, [confidenceThreshold, showDepthOverlay]);

  // In a real app, this would parse object data from the WebSocket
  // For now, we'll use sample data for development
  useEffect(() => {
    if (isConnected) {
      // In a real implementation, this would parse object detection results 
      // from the WebSocket messages
      
      // For development, use sample data
      const processSampleData = () => {
        // Add some randomness to the positions to simulate movement
        const updatedObjects = SAMPLE_OBJECTS.map(obj => ({
          ...obj,
          id: obj.id,
          bbox: {
            x: Math.max(0, Math.min(0.8, obj.bbox.x + (Math.random() - 0.5) * 0.02)),
            y: Math.max(0, Math.min(0.8, obj.bbox.y + (Math.random() - 0.5) * 0.02)),
            width: obj.bbox.width,
            height: obj.bbox.height,
          },
          depth: Math.max(0.5, obj.depth + (Math.random() - 0.5) * 0.2),
        }));
        
        setDetectedObjects(updatedObjects);
        
        // Update selected object if tracking
        if (tracking && selectedObject) {
          const updated = updatedObjects.find(obj => obj.id === selectedObject.id);
          if (updated) {
            setSelectedObject(updated);
          }
        }
      };
      
      // Update objects every second to simulate real-time detection
      const interval = setInterval(processSampleData, 1000);
      
      return () => clearInterval(interval);
    } else {
      setDetectedObjects([]);
    }
  }, [isConnected, tracking, selectedObject]);

  // Function to select an object by ID
  const selectObject = (objectId: string | null) => {
    if (!objectId) {
      setSelectedObject(null);
      setTracking(false);
      return;
    }
    
    const object = detectedObjects.find(obj => obj.id === objectId);
    if (object) {
      setSelectedObject(object);
    }
  };

  // Functions to start and stop tracking
  const startTracking = () => {
    if (selectedObject) {
      setTracking(true);
      
      // In a real app, you would send a command to the Jetson device
      // to start tracking the selected object
      console.log(`Started tracking ${selectedObject.label} (ID: ${selectedObject.id})`);
    }
  };
  
  const stopTracking = () => {
    setTracking(false);
    
    // In a real app, you would send a command to the Jetson device
    // to stop tracking
    console.log('Stopped tracking');
  };

  return (
    <ObjectDetectionContext.Provider
      value={{
        detectedObjects,
        selectedObject,
        selectObject,
        tracking,
        startTracking,
        stopTracking,
        confidenceThreshold,
        setConfidenceThreshold,
        showDepthOverlay,
        setShowDepthOverlay,
      }}
    >
      {children}
    </ObjectDetectionContext.Provider>
  );
};