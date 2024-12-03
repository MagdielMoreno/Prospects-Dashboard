import React, { useEffect, useState } from "react";

interface IconProps {
  icon: string;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

const Icon: React.FC<IconProps> = ({ icon, className = '', style, onClick }) => {
  const [logo, setLogo] = useState<string | null>(null);
  const [logoFull, setLogoFull] = useState<string | null>(null);

  useEffect(() => {
    if (icon == "logo") {
      import("../svg/Logo.svg")
        .then((module) => setLogo(module.default))
        .catch((error) => console.error("Error loading SVG:", error));
    }

    if (icon == "logoFull") {
      import("../svg/LogoFull.svg")
        .then((module) => setLogoFull(module.default))
        .catch((error) => console.error("Error loading SVG:", error));
    }
  }, [icon]);
  
  if (logo) {
    return <img onClick={onClick} src={logo} alt="logo" className={className} style={style} />;
  }

  if (logoFull) {
    return <img onClick={onClick} src={logoFull} alt="logo" className={className} style={style} />;
  }

  return (
    <span onClick={onClick} className={`material-symbols-rounded ${className}`} style={style}>
      {icon}
    </span>
  );
};

export default Icon;
