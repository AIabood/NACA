import React, { useEffect, useRef } from "react";
import { FilesetResolver, HandLandmarker } from "@mediapipe/tasks-vision";

/**
 * HandTracker - Headless component for processing hand landmarks.
 * 
 * @param {Object} props
 * @param {React.MutableRefObject} props.handDataRef - Ref to store shared hand data.
 * @param {boolean} props.enabled - Whether tracking is active.
 */
export default function HandTracker({ handDataRef, enabled }) {
  const videoRef = useRef(null);
  const landmarkerRef = useRef(null);
  const requestRef = useRef(null);

  useEffect(() => {
    let landmarker;

    const initLandmarker = async () => {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
      );
      
      landmarker = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
          delegate: "GPU"
        },
        runningMode: "VIDEO",
        numHands: 1
      });
      
      landmarkerRef.current = landmarker;
      startCamera();
    };

    const startCamera = async () => {
      if (!videoRef.current) return;
      
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480 }
        });
        videoRef.current.srcObject = stream;
        videoRef.current.addEventListener("loadeddata", predictWebcam);
      } catch (err) {
        console.error("Camera access denied:", err);
      }
    };

    const predictWebcam = () => {
      if (!landmarkerRef.current || !videoRef.current || !enabled) return;

      const startTimeMs = performance.now();
      const results = landmarkerRef.current.detectForVideo(videoRef.current, startTimeMs);

      if (results.landmarks && results.landmarks.length > 0) {
        const landmarks = results.landmarks[0];
        
        // Landmark 8 is Index Finger Tip, Landmark 4 is Thumb Tip
        const indexTip = landmarks[8];
        const thumbTip = landmarks[4];
        
        // 1. Calculate "pinch" distance
        const dx = indexTip.x - thumbTip.x;
        const dy = indexTip.y - thumbTip.y;
        const dz = indexTip.z - thumbTip.z;
        const pinchDist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        const isPinching = pinchDist < 0.045;

        // 2. Calculate "Push" (z depth)
        const depth = indexTip.z;

        // Update shared ref (normalized coordinates)
        handDataRef.current = {
          x: 1 - indexTip.x,  // Mirrored for natural mapping
          y: indexTip.y,
          z: depth,           // Depth for "Push"
          pinch: pinchDist,
          isPinching: isPinching,
          detected: true,
          lastUpdate: startTimeMs
        };
      } else {
        handDataRef.current.detected = false;
      }

      if (enabled) {
        requestRef.current = requestAnimationFrame(predictWebcam);
      }
    };

    if (enabled) {
      initLandmarker();
    }

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, [enabled, handDataRef]);

  return (
    <div className="hand-tracker-preview">
      <video 
        ref={videoRef} 
        autoPlay 
        playsInline 
        muted 
        style={{ 
          width: "160px", 
          height: "120px", 
          borderRadius: "8px",
          border: "2px solid var(--c-primary)",
          transform: "scaleX(-1)", // Mirror effect
          background: "#000"
        }} 
      />
      <div className="hand-tracker-status">
        {enabled ? "AI Tracking Active" : "AI Tracking Paused"}
      </div>
    </div>
  );
}
