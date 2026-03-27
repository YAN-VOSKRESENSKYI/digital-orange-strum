import { useEffect } from "react";
import { useNavigate } from "react-router";
import svgPaths from "../../imports/svg-51s9xntxol";

// ── Bot link ──────────────────────────────────────────────────────────────────
const BOT_LINK = "https://t.me/vlob_voskresensky_bot?start=ykOT0ckyNajdwQpv";

// ── SVG icons ─────────────────────────────────────────────────────────────────

function RocketIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 23.998 23.998" fill="none">
      <path d={svgPaths.p30d4b300} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99983" />
      <path d={svgPaths.p1fa3c80} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99983" />
      <path d={svgPaths.p9772980} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99983" />
      <path d={svgPaths.p2ae9a000} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99983" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 15.993 15.993" fill="none">
      <path d="M3.33188 7.99652H12.6612" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66594" />
      <path d={svgPaths.p60a0a00} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66594" />
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 13.9918 13.9918" fill="none">
      <path d="M11.0768 6.9959H2.91496" stroke="#999999" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16598" />
      <path d="M6.9959 2.91496L2.91496 6.9959L6.9959 11.0768" stroke="#999999" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16598" />
    </svg>
  );
}

// ── Checkmark circle ──────────────────────────────────────────────────────────

function CheckCircle() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <circle cx="14" cy="14" r="13" stroke="white" strokeWidth="1.8" />
      <path d="M8.5 14.5L12 18L19.5 10" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

const DESIGN_WIDTH = 393;
const MAX_WIDTH = 440;

export default function ThankYouPage() {
  const navigate = useNavigate();
  const isV2 = new URLSearchParams(window.location.search).get("v") === "2";

  useEffect(() => {
    if (typeof window !== "undefined" && typeof (window as any).fbq === "function") {
      (window as any).fbq('track', 'PageView');
      (window as any).fbq('track', 'Purchase');
    }
  }, []);

  return (
    <div
      className={isV2 ? "theme-green" : ""}
      style={{
        background: "#0d0d0d",
        minHeight: "100vh",
        width: "100%",
        overflowX: "hidden",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: MAX_WIDTH,
          margin: "0 auto",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Top orange glow streaks (from FormPage) */}
        <div
          className="absolute pointer-events-none"
          style={{
            left: -332,
            top: -155,
            width: 936,
            height: 582,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 0,
          }}
        >
          <div
            className="glow-streak"
            style={{
              transform: "rotate(30deg)",
              width: 1040,
              height: 144,
              borderRadius: 80,
              background: "linear-gradient(to right, rgba(var(--spot-rgb),0.95), rgba(var(--secondary-rgb),0.45) 50%, rgba(0,0,0,0))",
              filter: "blur(88px)",
            }}
          />
        </div>



        {/* Content */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            width: DESIGN_WIDTH,
            maxWidth: "100%",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingTop: 100,
            paddingBottom: 48,
            paddingLeft: 20,
            paddingRight: 20,
            gap: 0,
          }}
        >
          {/* Icon */}
          <div
            style={{
              width: 68,
              height: 68,
              borderRadius: 20,
              background: "linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)",
              boxShadow: "0px 0px 40px 0px rgba(var(--primary-rgb),0.55)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 28,
            }}
          >
            <RocketIcon />
          </div>

          {/* Heading */}
          <p
            style={{
              fontFamily: "'Unbounded', sans-serif",
              fontWeight: 800,
              fontSize: 26,
              lineHeight: "34px",
              color: "#fff",
              textAlign: "center",
              marginBottom: 12,
            }}
          >
            Вітаємо! 🎉
          </p>

          {/* Subtext */}
          <p
            style={{
              fontFamily: "'Manrope', sans-serif",
              fontWeight: 400,
              fontSize: 15,
              lineHeight: "22.5px",
              color: "#8c8c8c",
              textAlign: "center",
              marginBottom: 36,
              maxWidth: 300,
            }}
          >
            Оплата пройшла успішно. Переходьте до бота — там на вас вже чекає доступ до курсу.
          </p>

          {/* Bot button */}
          <a
            href={BOT_LINK}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              width: "100%",
              height: 53,
              borderRadius: 16,
              background: "linear-gradient(171.462deg, var(--primary-color) 0%, var(--secondary-color) 100%)",
              boxShadow: "0px 10px 36px 0px rgba(var(--primary-rgb),0.55)",
              textDecoration: "none",
              marginBottom: 16,
            }}
          >
            <span
              style={{
                fontFamily: "'Unbounded', sans-serif",
                fontWeight: 700,
                fontSize: 13,
                color: "#fff",
                letterSpacing: "0.5px",
              }}
            >
              ПОЧАТИ КУРС
            </span>
            <ArrowRightIcon />
          </a>

          {/* Footer info */}
          <div
            style={{
              marginTop: 24,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 6,
              textAlign: "center",
            }}
          >
            <p style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: 12, color: "#fff", lineHeight: "18px" }}>
              prodazhvlob@gmail.com
            </p>
            <p style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: 11, color: "#fff", lineHeight: "17px" }}>
              ФОП Малій Олена Станіславівна
            </p>
            <p style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: 11, color: "#fff", lineHeight: "17px" }}>
              ЄДРПОУ 3241518346
            </p>
            <p style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: 10, color: "#fff", lineHeight: "16px", maxWidth: 280, marginTop: 4 }}>
              Всі права захищені. Будь-яке копіювання матеріалів дозволяється тільки з погодження правовласників
            </p>
            <div style={{ marginTop: 6, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <p style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: 11, color: "#fff" }}>
                +380666348780
              </p>
              <div style={{ display: "flex", gap: 16, marginTop: 2 }}>
                <a href="/privacy" target="_blank" rel="noopener noreferrer" style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: 11, color: "var(--primary-color)", textDecoration: "none" }}>
                  Політика конфіденційності
                </a>
                <a href="/oferta" target="_blank" rel="noopener noreferrer" style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: 11, color: "var(--primary-color)", textDecoration: "none" }}>
                  Публічна оферта
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom orange glow streak (from FormPage) */}
        <div
          className="absolute pointer-events-none"
          style={{
            left: 22,
            bottom: 80,
            width: 468,
            height: 291,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 0,
          }}
        >
          <div
            className="glow-streak"
            style={{
              transform: "rotate(30deg)",
              width: 520,
              height: 72,
              borderRadius: 40,
              background: "linear-gradient(to left, rgba(var(--spot-rgb),0.95), rgba(var(--secondary-rgb),0.45) 50%, rgba(0,0,0,0))",
              filter: "blur(60px)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
