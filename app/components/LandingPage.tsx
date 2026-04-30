import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router";
import { trackPixelEvent } from "../pixel-config";
import VLob from "../../imports/VLob1_green";
import { GlintEffect } from "./GlintEffect";

const DESIGN_WIDTH = 373.473;
const MAX_WIDTH = 440;

export default function LandingPage() {
  const navigate = useNavigate();
  const [scale, setScale] = useState(1);
  const [scaledHeight, setScaledHeight] = useState<number | undefined>(undefined);
  const [showStickyButton, setShowStickyButton] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [btnLeft, setBtnLeft] = useState(0);
  const [btnWidth, setBtnWidth] = useState(335);

  // Meta Pixel PageView (зелений піксель)
  useEffect(() => {
    trackPixelEvent('PageView');
  }, []);

  // Scale calculation
  useEffect(() => {
    const update = () => {
      if (!containerRef.current) return;
      const actualWidth = containerRef.current.offsetWidth;
      const s = actualWidth / DESIGN_WIDTH;
      setScale(s);

      if (innerRef.current) {
        const h = innerRef.current.scrollHeight;
        setScaledHeight(Math.ceil(h * s));
      }

      const rect = containerRef.current.getBoundingClientRect();
      const pad = 20;
      const w = Math.min(rect.width - pad * 2, 400);
      setBtnLeft(rect.left + (rect.width - w) / 2);
      setBtnWidth(w);
    };
    update();
    const timer = setTimeout(update, 500);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("resize", update);
      clearTimeout(timer);
    };
  }, []);

  // Sticky button visibility via IntersectionObserver
  useEffect(() => {
    const setup = () => {
      const section2 = document.getElementById("section2");
      const priceBtn = document.getElementById("price-button-anchor");
      if (!section2 || !priceBtn) return;

      let section2NearBottom = false;
      let priceBtnVisible = false;

      const update = () => {
        setShowStickyButton(section2NearBottom && !priceBtnVisible);
      };

      const s2Observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) {
            if (entry.boundingClientRect.top < 0) {
              section2NearBottom = true;
            } else {
              section2NearBottom = false;
            }
          } else {
            const rect = entry.boundingClientRect;
            const vh = window.innerHeight;
            section2NearBottom = rect.bottom < vh + 250;
          }
          update();
        },
        {
          threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
        }
      );

      const btnObserver = new IntersectionObserver(
        ([entry]) => {
          priceBtnVisible = entry.isIntersecting;
          update();
        },
        {
          threshold: 0.1,
          rootMargin: "150px 0px 0px 0px",
        }
      );

      s2Observer.observe(section2);
      btnObserver.observe(priceBtn);

      const onScroll = () => {
        const r2 = section2.getBoundingClientRect();
        const rb = priceBtn.getBoundingClientRect();
        const vh = window.innerHeight;
        const near = r2.bottom < vh + 250;
        const ending = rb.top < vh + 150;
        setShowStickyButton(near && !ending);
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      document.addEventListener("scroll", onScroll, { passive: true });
      onScroll();

      return () => {
        s2Observer.disconnect();
        btnObserver.disconnect();
        window.removeEventListener("scroll", onScroll);
        document.removeEventListener("scroll", onScroll);
      };
    };

    const timer = setTimeout(setup, 600);
    return () => clearTimeout(timer);
  }, [scale]);

  return (
    // theme-green вже задано як основна тема для всього цього проекту
    <div
      className="theme-green"
      style={
        {
          background: "var(--background)",
          minHeight: "100vh",
          width: "100%",
          overflowX: "hidden",
        } as React.CSSProperties
      }
    >
      <div
        ref={containerRef}
        style={{
          width: "100%",
          maxWidth: MAX_WIDTH,
          height: scaledHeight,
          margin: "0 auto",
          overflow: "hidden",
        }}
      >
        <div
          ref={innerRef}
          style={{
            width: DESIGN_WIDTH,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        >
          <VLob />
        </div>
      </div>

      {/* Portal: sticky кнопка фіксована до body */}
      {createPortal(
        <div
          className="theme-green"
          style={{
            position: "fixed",
            bottom: 20,
            left: btnLeft,
            width: btnWidth,
            zIndex: 9999,
            transition:
              "transform 0.38s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease",
            transform: showStickyButton
              ? "translateY(0)"
              : "translateY(calc(100% + 32px))",
            opacity: showStickyButton ? 1 : 0,
            pointerEvents: showStickyButton ? "auto" : "none",
          }}
        >
          <button
            onClick={() => navigate("/form" + window.location.search)}
            style={{
              position: "relative",
              overflow: "hidden",
              width: "100%",
              height: 52,
              borderRadius: 16,
              border: "none",
              backgroundImage:
                `linear-gradient(171.428deg, var(--primary-color) 0%, var(--secondary-color) 100%)`,
              boxShadow:
                `0px 8px 32px 0px rgba(var(--primary-rgb),0.55), 0px 2px 8px 0px rgba(0,0,0,0.4)`,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              color: "white",
              fontFamily: "'Unbounded', sans-serif",
              fontWeight: "bold",
              fontSize: 12,
              letterSpacing: "0.5px",
              whiteSpace: "nowrap",
            }}
          >
            <GlintEffect delay={0.6} />
            ПРИЄДНАТИСЬ ЗА 390 грн&nbsp;→
          </button>
        </div>,
        document.body
      )}
    </div>
  );
}
