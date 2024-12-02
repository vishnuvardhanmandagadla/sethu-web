import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF, Html, useProgress } from "@react-three/drei";
import { motion } from "framer-motion";
import './ContactUs.css';
import Footer from './footer';

const slideIn = (direction, type, delay, duration) => ({
  hidden: {
    x: direction === "left" ? "-100%" : direction === "right" ? "100%" : 0,
    y: direction === "up" ? "100%" : direction === "down" ? "100%" : 0,
  },
  show: {
    x: 0,
    y: 0,
    transition: { type, delay, duration, ease: "easeOut" },
  },
});

const Earth = () => {
  const earth = useGLTF("/planet/scene.gltf");
  return <primitive object={earth.scene} scale={2.5} position-y={0} rotation-y={0} />;
};

const EarthCanvas = () => (
  <Canvas
    shadows
    frameloop="demand"
    dpr={[1, 2]}
    gl={{ preserveDrawingBuffer: true }}
    camera={{ fov: 45, near: 0.1, far: 200, position: [-4, 3, 6] }}
  >
    <Suspense fallback={<CanvasLoader />}>
      <OrbitControls autoRotate enableZoom={false} maxPolarAngle={Math.PI / 2} minPolarAngle={Math.PI / 2} />
      <Earth />
      <Preload all />
    </Suspense>
  </Canvas>
);

const CanvasLoader = () => {
  const { progress } = useProgress();
  return (
    <Html as="div" center style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
      <span className="canvas-loader"></span>
      <p style={{ fontSize: 16, color: "#F1F1F1", fontWeight: 800, marginTop: 40 }}>{progress.toFixed(2)}%</p>
    </Html>
  );
};

const Contact = () => {
  return (
    <div>
      <div className="contact-container">
        <motion.div variants={slideIn("right", "tween", 0.2, 1)} className="earth-canvas">
          <EarthCanvas />
        </motion.div>

        <motion.div variants={slideIn("left", "tween", 0.2, 1)} className="contact-details">
          <p className="text-blue-300">Get in Touch</p>
          <h3 className="text-blue-100">Contact Us</h3>

          <div className="contact-details mt-8">
            {/* Address Section */}
            <div className="contact-info mb-6">
              <h3><i className="fas fa-map-marker-alt mr-2"></i> Address</h3>
              <p>Patha Thunga Padu Ramalayam Street, East Godavari</p>
            </div>

            {/* Phone Section */}
            <div className="contact-info mb-6">
              <h3><i className="fas fa-phone-alt mr-2"></i> Phone</h3>
              <p><a href="tel:+919515343071">(+91) 9515343071</a></p>
              <p><a href="tel:+919603614667">(+91) 9603614667</a></p>
            </div>

            {/* Email Section */}
            <div className="contact-info">
              <h3><i className="fas fa-envelope mr-2"></i> Email</h3>
              <p><a href="mailto:sethuteam3071@gmail.com">sethuteam3071@gmail.com</a></p>
              <p><a href="mailto:koneramlalsuresh@gmail.com">koneramlalsuresh@gmail.com</a></p>
              <p><a href="mailto:sanjaykotha678@gmail.com">sanjaykotha678@gmail.com</a></p>
            </div>
          </div>
        </motion.div>
      </div>
      {/* Footer placed outside the contact container */}
      <Footer />
    </div>
  );
};

export default Contact;
