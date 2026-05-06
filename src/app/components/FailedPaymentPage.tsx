import { useEffect } from "react";
import { Link } from "react-router";
import { trackPixelEvent } from "../pixel-config";
import { getProjectConfig } from "../project-settings";

const DESIGN_WIDTH = 393;
const MAX_WIDTH = 440;

export default function FailedPaymentPage() {
  const config = getProjectConfig();

  useEffect(() => {
    trackPixelEvent("PageView");
  }, []);

  return (
    <div
      className={config.theme}
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
          paddingTop: 100,
          paddingBottom: 48,
          paddingLeft: 20,
          paddingRight: 20,
        }}
      >
        <div
          style={{
            width: DESIGN_WIDTH,
            maxWidth: "100%",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontFamily: "'Unbounded', sans-serif",
              fontWeight: 800,
              fontSize: 22,
              lineHeight: "30px",
              color: "#fff",
              marginBottom: 12,
            }}
          >
            Оплату не завершено
          </p>
          <p
            style={{
              fontFamily: "'Manrope', sans-serif",
              fontWeight: 400,
              fontSize: 15,
              lineHeight: "22.5px",
              color: "#8c8c8c",
              marginBottom: 28,
              maxWidth: 300,
            }}
          >
            Платіж не підтверджено або ще обробляється. Спробуйте ще раз або оберіть інший спосіб оплати.
          </p>
          <Link
            to="/form"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: 53,
              borderRadius: 16,
              background: "linear-gradient(171.462deg, var(--primary-color) 0%, var(--secondary-color) 100%)",
              boxShadow: "0px 10px 36px 0px rgba(var(--primary-rgb),0.55)",
              textDecoration: "none",
              fontFamily: "'Unbounded', sans-serif",
              fontWeight: 700,
              fontSize: 13,
              color: "#fff",
              letterSpacing: "0.5px",
            }}
          >
            ДО ФОРМИ ОПЛАТИ
          </Link>
        </div>
      </div>
    </div>
  );
}
