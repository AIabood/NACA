/**
 * CameraController.jsx
 *
 * A null-render component that lives INSIDE the <Canvas>.
 * It calls useCameraNavigation and exposes imperative handles
 * to the outside world via a React ref.
 *
 * Usage inside Canvas:
 *   <CameraController ref={camCtrlRef} controlsRef={orbitRef}
 *     onZoomChange={cb} onFocusChange={cb} />
 *
 * Then from outside:
 *   camCtrlRef.current.focusOnEarth()
 *   camCtrlRef.current.returnToOrbit()
 */

import { forwardRef, useImperativeHandle } from "react";
import useCameraNavigation from "../hooks/useCameraNavigation";

const CameraController = forwardRef(function CameraController(
  { controlsRef, onZoomChange, onFocusChange },
  ref
) {
  const { focusOnEarth, returnToOrbit } = useCameraNavigation({
    controlsRef,
    onZoomChange,
    onFocusChange,
  });

  // Expose methods to parent via ref
  useImperativeHandle(ref, () => ({ focusOnEarth, returnToOrbit }), [
    focusOnEarth,
    returnToOrbit,
  ]);

  return null; // renders nothing — pure logic
});

export default CameraController;
