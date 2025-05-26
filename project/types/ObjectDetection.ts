export interface BoundingBox {
  x: number;      // Normalized x-coordinate (0-1) of the top-left corner
  y: number;      // Normalized y-coordinate (0-1) of the top-left corner
  width: number;  // Normalized width (0-1) of the bounding box
  height: number; // Normalized height (0-1) of the bounding box
}

export interface DetectedObject {
  id: string;              // Unique identifier for the object
  label: string;           // Class label (e.g., "person", "car")
  confidence: number;      // Detection confidence (0-1)
  bbox: BoundingBox;       // Bounding box coordinates
  depth?: number;          // Optional depth in meters from the camera
  tracking?: boolean;      // Whether this object is being actively tracked
}

export interface DetectionResults {
  frame: string;           // Base64 encoded image frame
  objects: DetectedObject[]; // Array of detected objects
  timestamp: number;       // Unix timestamp of the detection
}

export interface TrackingCommand {
  command: 'start_tracking' | 'stop_tracking';
  objectId?: string;       // ID of the object to track (for start_tracking)
}