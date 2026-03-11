import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import svgPaths from "../../imports/svg-51s9xntxol";

// ── WayforPay config ──────────────────────────────────────────────────────────
const WFP_MERCHANT = "online_ed_fun";
const WFP_DOMAIN = window.location.hostname || "localhost";
const WFP_AMOUNT = "2";
const WFP_CURRENCY = "UAH";
const WFP_PRODUCT = "5-ти денний марафон";

function makeOrderRef(): string {
  return "order_" + Date.now() + "_" + Math.random().toString(36).slice(2, 7);
}

// ── helpers ────────────────────────────────────────────────────────────────

function getTomorrowDate(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  return `${day}.${month}`;
}

function getMidnightDeadline(): Date {
  const d = new Date();
  d.setHours(23, 59, 59, 0);
  return d;
}

function getTimeLeft(deadline: Date) {
  const diff = Math.max(0, deadline.getTime() - Date.now());
  const h = Math.floor(diff / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  const s = Math.floor((diff % 60_000) / 1_000);
  return {
    h: String(h).padStart(2, "0"),
    m: String(m).padStart(2, "0"),
    s: String(s).padStart(2, "0"),
  };
}

// ── SVG icon components ────────────────────────────────────────────────────

function RocketIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 23.998 23.998" fill="none">
      <path d={svgPaths.p30d4b300} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99983" />
      <path d={svgPaths.p1fa3c80} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99983" />
      <path d={svgPaths.p9772980} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99983" />
      <path d={svgPaths.p2ae9a000} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99983" />
    </svg>
  );
}

function ShieldCheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 15.993 15.993" fill="none">
      <g clipPath="url(#shield-clip)">
        <path d={svgPaths.p3baa8d00} stroke="#FF5500" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.999565" />
        <path d={svgPaths.p3c2cc900} stroke="#FF5500" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.999565" />
      </g>
      <defs>
        <clipPath id="shield-clip">
          <rect width="15.993" height="15.993" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 10.9984 10.9984" fill="none">
      <g clipPath="url(#lock-clip)">
        <path d={svgPaths.p1b8480} stroke="#4D4D4D" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.91653" />
        <path d={svgPaths.p2b7f3840} stroke="#4D4D4D" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.91653" />
      </g>
      <defs>
        <clipPath id="lock-clip">
          <rect width="10.9984" height="10.9984" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

function ArrowRightIcon({ color = "white", size = 16 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 15.993 15.993" fill="none">
      <path d="M3.33188 7.99652H12.6612" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66594" />
      <path d={svgPaths.p60a0a00} stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66594" />
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 13.9918 13.9918" fill="none">
      {/* mirrored arrow */}
      <path d="M11.0768 6.9959H2.91496" stroke="#999999" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16598" />
      <path d="M6.9959 2.91496L2.91496 6.9959L6.9959 11.0768" stroke="#999999" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16598" />
    </svg>
  );
}

// ── Countdown block ──────────────────────────────────────────────────────────

function CountdownBlock({ value, label }: { value: string; label: string }) {
  return (
    <div
      className="flex-1 flex flex-col items-center justify-center gap-[4px] rounded-[16px] py-[12px] relative"
      style={{ background: "#1c1c1c", border: "1.076px solid rgba(255,85,0,0.18)" }}
    >
      <span
        style={{
          fontFamily: "'Unbounded', sans-serif",
          fontWeight: 800,
          fontSize: 28,
          lineHeight: "28px",
          color: "#fff",
        }}
      >
        {value}
      </span>
      <span
        style={{
          fontFamily: "'Manrope', sans-serif",
          fontWeight: 600,
          fontSize: 9,
          lineHeight: "13.5px",
          letterSpacing: "1.5px",
          color: "#666",
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>
    </div>
  );
}

// ── Main form content ──────────────────────────────────────────────────────

function FormContent() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const tomorrow = getTomorrowDate();
  const [deadline] = useState(() => getMidnightDeadline());
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(deadline));

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(getTimeLeft(deadline)), 1000);
    return () => clearInterval(id);
  }, [deadline]);

  // ── divider with date ─────────────────────────────────────────────────────
  const Divider = () => (
    <div className="flex items-center gap-[8px] w-full">
      <div style={{ flex: 1, height: "1px", background: "linear-gradient(to right, transparent, rgba(255,85,0,0.18))" }} />
      <p
        style={{
          fontFamily: "'Manrope', sans-serif",
          fontWeight: 700,
          fontSize: 11,
          letterSpacing: "1.5px",
          textTransform: "uppercase",
          color: "#808080",
          whiteSpace: "nowrap",
        }}
      >
        ДАТА СТАРТУ КУРСУ{" "}
        <span style={{ color: "#ff5500" }}>{tomorrow}</span>
      </p>
      <div style={{ flex: 1, height: "1px", background: "linear-gradient(to left, transparent, rgba(255,85,0,0.18))" }} />
    </div>
  );

  return (
    <div className="flex flex-col gap-0 w-full px-[20px]" style={{ paddingTop: 32 }}>

      {/* Description */}
      <p
        className="text-center"
        style={{
          fontFamily: "'Manrope', sans-serif",
          fontWeight: 700,
          fontSize: 17,
          lineHeight: "24.65px",
          color: "#fff",
          marginBottom: 16,
        }}
      >
        Заповніть форму та отримайте доступ до унікальної системи продажу інфопродуктів.{" "}
        <span style={{ color: "#8c8c8c", fontWeight: 400 }}>
          Від мінікурсів за $9 до преміум-навчання за $1000
        </span>
      </p>

      {/* Date divider */}
      <div style={{ marginBottom: 16 }}>
        <Divider />
      </div>

      {/* Price */}
      <div
        className="flex items-center justify-center gap-[12px]"
        style={{ marginBottom: 20 }}
      >
        <span
          style={{
            fontFamily: "'Manrope', sans-serif",
            fontWeight: 400,
            fontSize: 13,
            color: "#4d4d4d",
            textDecoration: "line-through",
          }}
        >
          2970 грн
        </span>
        <span
          style={{
            fontFamily: "'Unbounded', sans-serif",
            fontWeight: 800,
            fontSize: 34,
            lineHeight: "34px",
            color: "#ff5500",
          }}
        >
          390 грн
        </span>
      </div>

      {/* Form Content Wrapper */}
      <form
        className="mSoft-integration"
        onSubmit={async (e) => {
          e.preventDefault();
          if (!email || !phone) {
            alert("Будь ласка, заповніть усі поля");
            return;
          }

          setIsSubmitting(true);
          try {
            // 1. Відправляємо дані у CRM (pipepanel)
            const getUtm = (p: string) => new URLSearchParams(window.location.search).get(p) ?? "";
            const crmPayload = JSON.stringify({
              email,
              phone,
              reqId: "online_ed_fun",
              stage: "8",
              deal_name: "DS_3.0_LILI-TEST_390UA",
              up_stage: "12",
              product: "5-ти денний марафон",
              payment: "wayforpay",
              currency: "UAH",
              amount: "390",
              utm_source: getUtm("utm_source"),
              utm_medium: getUtm("utm_medium"),
              utm_campaign: getUtm("utm_campaign"),
              utm_content: getUtm("utm_content"),
              utm_term: getUtm("utm_term"),
            });

            await fetch("https://scripts.voskresensky.com/pipepanel/forms.php?req=online_ed_fun", {
              method: "POST",
              body: crmPayload,
              mode: "no-cors"
            }).catch(e => console.error("CRM sync error:", e));

            // 2. Тепер формуємо платіж WayForPay
            const orderRef = makeOrderRef();
            const orderDate = Math.floor(Date.now() / 1000);

            // Запит до серверної функції (Vercel) для отримання підпису
            const res = await fetch("/api/wayforpay-signature", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                merchantAccount: WFP_MERCHANT,
                merchantDomainName: WFP_DOMAIN,
                orderReference: orderRef,
                orderDate: orderDate,
                amount: WFP_AMOUNT,
                currency: WFP_CURRENCY,
                productName: WFP_PRODUCT,
                productCount: "1",
                productPrice: WFP_AMOUNT,
              }),
            });

            if (!res.ok) throw new Error("Помилка генерації підпису");

            const data = await res.json();

            // Динамічно створюємо форму і відправляємо на WayforPay
            const wfpForm = document.createElement("form");
            wfpForm.method = "POST";
            wfpForm.action = "https://secure.wayforpay.com/pay";
            wfpForm.acceptCharset = "utf-8";

            const appendInput = (name: string, value: string) => {
              const input = document.createElement("input");
              input.type = "hidden";
              input.name = name;
              input.value = value;
              wfpForm.appendChild(input);
            };

            appendInput("merchantAccount", WFP_MERCHANT);
            appendInput("merchantDomainName", WFP_DOMAIN);
            appendInput("orderReference", orderRef);
            appendInput("orderDate", String(orderDate));
            appendInput("amount", WFP_AMOUNT);
            appendInput("currency", WFP_CURRENCY);
            appendInput("productName[]", WFP_PRODUCT);
            appendInput("productPrice[]", WFP_AMOUNT);
            appendInput("productCount[]", "1");
            appendInput("merchantSignature", data.signature);
            appendInput("language", "UA");
            appendInput("clientEmail", email);
            appendInput("clientPhone", phone);
            appendInput("returnUrl", "https://" + window.location.host + "/api/wfp-return");
            // Змінюємо serviceUrl на наш новий ендпоінт
            appendInput("serviceUrl", "https://" + window.location.host + "/api/wfp-webhook");

            document.body.appendChild(wfpForm);
            wfpForm.submit();

          } catch (err) {
            console.error(err);
            alert("Сталася помилка при підготовці платежу. Спробуйте пізніше.");
            setIsSubmitting(false);
          }
        }}
      >

        {/* Email input */}
        <div style={{ marginBottom: 10 }}>
          <div
            className="flex items-center px-[18px]"
            style={{
              background: "#1a1a1a",
              borderRadius: 14,
              height: 54,
              border: "1.076px solid rgba(255,255,255,0.1)",
            }}
          >
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ваш E-mail"
              className="bg-transparent w-full outline-none"
              style={{
                fontFamily: "'Manrope', sans-serif",
                fontWeight: 400,
                fontSize: 15,
                color: "#fff",
              }}
              required
            />
          </div>
        </div>

        {/* Phone input */}
        <div style={{ marginBottom: 20 }}>
          <div
            className="flex items-center px-[18px]"
            style={{
              background: "#1a1a1a",
              borderRadius: 14,
              height: 54,
              border: "1.076px solid rgba(255,255,255,0.1)",
            }}
          >
            <input
              type="tel"
              name="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Ваш телефон"
              className="bg-transparent w-full outline-none"
              style={{
                fontFamily: "'Manrope', sans-serif",
                fontWeight: 400,
                fontSize: 15,
                color: "#fff",
              }}
              required
            />
          </div>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center justify-center relative overflow-hidden rounded-[16px] shadow-[0px_10px_36px_0px_rgba(255,85,0,0.55)] w-full"
          style={{
            height: 53,
            background: "linear-gradient(171.462deg, rgb(255,85,0) 0%, rgb(255,140,0) 100%)",
            border: "none",
            cursor: isSubmitting ? "not-allowed" : "pointer",
            opacity: isSubmitting ? 0.7 : 1,
            marginBottom: 20,
          }}
        >
          <span
            style={{
              fontFamily: "'Unbounded', sans-serif",
              fontWeight: 700,
              fontSize: 14,
              color: "#fff",
              letterSpacing: "0.5px",
              marginRight: 10,
            }}
          >
            {isSubmitting ? "ОБРОБКА..." : "ОТРИМАТИ ДОСТУП"}
          </span>
          <ArrowRightIcon />
        </button>
      </form>

      {/* Guarantee */}
      <div
        className="flex items-start gap-[8px] w-full"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1.076px solid rgba(255,85,0,0.18)",
          borderRadius: 14,
          padding: "13px",
          marginBottom: 24,
        }}
      >
        <div className="shrink-0 mt-[1px]">
          <ShieldCheckIcon />
        </div>
        <p
          style={{
            fontFamily: "'Manrope', sans-serif",
            fontWeight: 600,
            fontSize: 12,
            lineHeight: "19.2px",
            color: "#ccc",
          }}
        >
          P.S.{" "}
          <span style={{ fontWeight: 400, color: "#8c8c8c" }}>
            Ви нічим не ризикуєте! Гарантія повернення коштів — 7 днів, якщо курс вам не підійде
          </span>
        </p>
      </div>

      {/* Countdown label */}
      <p
        className="text-center"
        style={{
          fontFamily: "'Manrope', sans-serif",
          fontWeight: 700,
          fontSize: 11,
          letterSpacing: "1.5px",
          textTransform: "uppercase",
          color: "#808080",
          marginBottom: 12,
        }}
      >
        ДО ЗАКІНЧЕННЯ АКЦІЇ ЗАЛИШИЛОСЬ:
      </p>

      {/* Countdown timer */}
      <div className="flex gap-[8px] w-full" style={{ marginBottom: 24 }}>
        <CountdownBlock value={timeLeft.h} label="ГОДИН" />
        <CountdownBlock value={timeLeft.m} label="ХВИЛИН" />
        <CountdownBlock value={timeLeft.s} label="СЕКУНД" />
      </div>

      {/* Privacy note */}
      <div className="flex items-center justify-center gap-[6px]" style={{ marginBottom: 32 }}>
        <LockIcon />
        <p
          className="text-center"
          style={{
            fontFamily: "'Manrope', sans-serif",
            fontWeight: 400,
            fontSize: 11,
            lineHeight: "16.5px",
            color: "#4d4d4d",
            maxWidth: 267,
          }}
        >
          Всі дані конфіденційні і потрібні тільки для зв'язку з менеджером
        </p>
      </div>
    </div>
  );
}

// ── Scaled form page ─────────────────────────────────────────────────────────

const DESIGN_WIDTH = 393;
const MAX_WIDTH = 440;

export default function FormPage() {
  const navigate = useNavigate();
  const [scale, setScale] = useState(1);
  const [scaledHeight, setScaledHeight] = useState<number | undefined>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const update = () => {
      if (!containerRef.current) return;
      const actualWidth = containerRef.current.offsetWidth;
      const s = actualWidth / DESIGN_WIDTH;
      setScale(s);
      if (innerRef.current) {
        setScaledHeight(Math.ceil(innerRef.current.scrollHeight * s));
      }
    };
    update();
    const timer = setTimeout(update, 500);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("resize", update);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div
      style={{
        background: "#0d0d0d",
        minHeight: "100vh",
        width: "100%",
        overflowX: "hidden",
      }}
    >
      <div
        ref={containerRef}
        style={{
          width: "100%",
          maxWidth: MAX_WIDTH,
          height: scaledHeight,
          margin: "0 auto",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div
          ref={innerRef}
          style={{
            width: DESIGN_WIDTH,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            background: "#0d0d0d",
            position: "relative",
          }}
        >
          {/* Top orange glow streaks */}
          <div
            className="absolute pointer-events-none"
            style={{
              left: -98,
              top: -10,
              width: 468,
              height: 291,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 0,
            }}
          >
            <div
              style={{
                transform: "rotate(30deg)",
                width: 520,
                height: 36,
                borderRadius: 40,
                background: "linear-gradient(to right, rgba(255,100,0,0.95), rgba(255,140,0,0.45) 50%, rgba(0,0,0,0))",
                filter: "blur(22px)",
              }}
            />
          </div>
          <div
            className="absolute pointer-events-none"
            style={{
              left: 22,
              top: -10,
              width: 468,
              height: 291,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 0,
            }}
          >
            <div
              style={{
                transform: "rotate(-30deg)",
                width: 520,
                height: 36,
                borderRadius: 40,
                background: "linear-gradient(to left, rgba(255,100,0,0.95), rgba(255,140,0,0.45) 50%, rgba(0,0,0,0))",
                filter: "blur(22px)",
              }}
            />
          </div>

          {/* Radial glow at top */}
          <div
            className="absolute pointer-events-none"
            style={{
              left: 46,
              top: -80,
              width: 300,
              height: 200,
              filter: "blur(40px)",
              background:
                "radial-gradient(ellipse at center, rgba(255,85,0,0.35) 0%, rgba(128,43,0,0.175) 35%, rgba(0,0,0,0) 70%)",
              zIndex: 0,
            }}
          />

          {/* Form content */}
          <div style={{ position: "relative", zIndex: 1 }}>
            <FormContent />
          </div>

          {/* Bottom orange glow streaks */}
          <div
            className="absolute pointer-events-none"
            style={{
              left: -98,
              bottom: 0,
              width: 468,
              height: 291,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 0,
            }}
          >
            <div
              style={{
                transform: "rotate(-30deg)",
                width: 520,
                height: 36,
                borderRadius: 40,
                background: "linear-gradient(to right, rgba(255,100,0,0.95), rgba(255,140,0,0.45) 50%, rgba(0,0,0,0))",
                filter: "blur(22px)",
              }}
            />
          </div>
          <div
            className="absolute pointer-events-none"
            style={{
              left: 22,
              bottom: 0,
              width: 468,
              height: 291,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 0,
            }}
          >
            <div
              style={{
                transform: "rotate(30deg)",
                width: 520,
                height: 36,
                borderRadius: 40,
                background: "linear-gradient(to left, rgba(255,100,0,0.95), rgba(255,140,0,0.45) 50%, rgba(0,0,0,0))",
                filter: "blur(22px)",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}