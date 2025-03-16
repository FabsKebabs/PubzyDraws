import { motion } from "framer-motion";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    // Initialize particles
    if (window.particlesJS) {
      window.particlesJS('particles-js', {
        particles: {
          number: { value: 50, density: { enable: true, value_area: 1000 } },
          color: { value: "#1e90ff" },
          shape: { type: "circle" },
          opacity: {
            value: 0.5,
            random: true,
            animation: { enable: true, speed: 1, minimumValue: 0.1, sync: false }
          },
          size: {
            value: 3,
            random: true,
            animation: { enable: true, speed: 2, minimumValue: 0.1, sync: false }
          },
          line_linked: {
            enable: true,
            distance: 150,
            color: "#1e90ff",
            opacity: 0.2,
            width: 1
          },
          move: {
            enable: true,
            speed: 1.5,
            direction: "none",
            random: true,
            straight: false,
            out_mode: "out",
            bounce: false,
          }
        },
        interactivity: {
          detect_on: "canvas",
          events: {
            onhover: { enable: true, mode: "grab" },
            onclick: { enable: true, mode: "push" },
            resize: true
          }
        },
        retina_detect: true
      });
    }
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-background flex items-center justify-center overflow-hidden px-4">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

      {/* Content container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-20 text-center space-y-8 max-w-4xl mx-auto py-16"
      >
        {/* Main title */}
        <motion.h1 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
          className="text-6xl md:text-8xl font-orbitron font-bold"
        >
          Welcome to{" "}
          <span className="inline-block bg-gradient-to-r from-primary via-purple-500 to-pink-500 text-transparent bg-clip-text animate-glow">
            PubzyDraws
          </span>
        </motion.h1>


        {/* Decorative elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/20 rounded-full filter blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-500/20 rounded-full filter blur-3xl animate-pulse" />
        </div>
      </motion.div>
    </div>
  );
}