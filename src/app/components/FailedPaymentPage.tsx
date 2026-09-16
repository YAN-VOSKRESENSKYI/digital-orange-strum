import { useEffect } from "react";
import { Link, useSearchParams } from "react-router";
import { trackPixelEvent } from "../pixel-config";
import { getProjectConfig } from "../project-settings";

const DESIGN_WIDTH = 393;
const MAX_WIDTH = 440;

export default function FailedPaymentPage() {
  const config = getProjectConfig();
  const [searchParams] = useSearchParams();
  const unverified = searchParams.get("paymentState") === "unverified";
  const order = searchParams.get("order");
  const dealId = searchParams.get("dealId");
  const canVerify = /^(deal-\d+-\d+|order_\d+_[a-z0-9]+)$/.test(order || "") ||
    /^\d+$/.test(dealId || "");
  const retryParams = new URLSearchParams(searchParams);
  retryParams.delete("paymentState");
  retryParams.delete("transactionStatus");
  const formParams = new URLSearchParams(retryParams);
  formParams.delete("order");
  formParams.delete("dealId");
  const formUrl = `/form${formParams.size ? `?${formParams}` : ""}`;

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
            {unverified ? "Уточнюємо статус оплати" : "Оплату не завершено"}
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
            {unverified
              ? "Платіж ще обробляється або його статус поки недоступний. Якщо кошти списано, не сплачуйте повторно. Перевірте оплату або напишіть менеджеру — допоможемо."
              : "Оплату не завершено. Якщо кошти не списано, спробуйте ще раз або оберіть інший спосіб оплати. Якщо кошти списано — напишіть менеджеру."}
          </p>
          <a
            href={unverified
              ? canVerify ? `/api/wfp-return?${retryParams}` : "https://t.me/karine_vlob"
              : formUrl}
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
            {unverified ? canVerify ? "ПЕРЕВІРИТИ ОПЛАТУ" : "НАПИСАТИ МЕНЕДЖЕРУ" : "ДО ФОРМИ ОПЛАТИ"}
          </a>
          {(!unverified || canVerify) && (
            <a href="https://t.me/karine_vlob"
              style={{ color: "#fff", marginTop: 24, fontFamily: "'Manrope', sans-serif" }}>
              Написати менеджеру
            </a>
          )}
          <Link to={`/${formParams.size ? `?${formParams}` : ""}`}
            style={{ color: "#8c8c8c", marginTop: 20, fontFamily: "'Manrope', sans-serif" }}>
            На головну
          </Link>
        </div>
      </div>
    </div>
  );
}
