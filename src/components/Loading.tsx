import Lottie from "lottie-react";
import loading from "@/anim/Loading.json";
import React from "react";

interface LoadingProps {
  visible: boolean;
}

const Loading: React.FC<LoadingProps> = ({ visible }) => {
  return (
    <div
      className={`flex items-center justify-center fixed z-50 inset-0 overflow-y-auto ${!visible ? "opacity-0 pointer-events-none" : "opacity-100 pointer-events-auto"}`}
      style={{
        transition: 'visibility 0.3s ease-in-out',
        backdropFilter: "blur(10px)",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      }}
    >
      <Lottie animationData={loading} loop={true} style={{ maxWidth: "80%", maxHeight: "80%" }} />
    </div>
  );
};

export default Loading;
