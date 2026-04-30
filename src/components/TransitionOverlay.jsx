import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function TransitionOverlay({ active }) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            background: "radial-gradient(circle at center, #0a1128 0%, #000000 100%)",
            pointerEvents: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          {/* Subtle logo or pulse could go here */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{
              width: 100,
              height: 100,
              borderRadius: "50%",
              background: "rgba(79, 163, 224, 0.2)",
              boxShadow: "0 0 50px rgba(79, 163, 224, 0.1)"
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
