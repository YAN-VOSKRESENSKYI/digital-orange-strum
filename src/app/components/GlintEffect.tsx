import { useEffect } from "react";

const STYLE_ID = "btn-glint-keyframes";
const CSS = `
@keyframes btn-glint {
  0%, 62% {
    left: -55%;
    opacity: 0;
  }
  63% {
    opacity: 1;
  }
  79% {
    left: 115%;
    opacity: 1;
  }
  80%, 100% {
    left: 115%;
    opacity: 0;
  }
}
`;

interface GlintEffectProps {
  delay?: number;
}

export function GlintEffect({ delay = 0 }: GlintEffectProps) {
  useEffect(() => {
    if (!document.getElementById(STYLE_ID)) {
      const style = document.createElement("style");
      style.id = STYLE_ID;
      style.textContent = CSS;
      document.head.appendChild(style);
    }
  }, []);

  return (
    <span
      aria-hidden="true"
      style={{
        position: "absolute",
        top: "-5%",
        left: "-55%",
        width: "45%",
        height: "110%",
        background:
          "linear-gradient(to right, transparent 0%, rgba(255,255,255,0.08) 25%, rgba(255,255,255,0.72) 50%, rgba(255,255,255,0.08) 75%, transparent 100%)",
        transform: "skewX(-20deg)",
        animation: `btn-glint 3.8s ease-in-out ${delay}s infinite`,
        pointerEvents: "none",
        zIndex: 10,
        display: "block",
      }}
    />
  );
}
