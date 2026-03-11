import { useState, useRef, useEffect } from "react";
import { ChevronLeft, MoreHorizontal, Send, RotateCcw, Copy, ThumbsUp, ThumbsDown } from "lucide-react";

function RocketIcon({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="orangeGrad" x1="10" y1="10" x2="46" y2="46" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FF9A3C" />
          <stop offset="100%" stopColor="#FF4E1A" />
        </linearGradient>
      </defs>
      <rect width="56" height="56" rx="16" fill="url(#orangeGrad)" />
      <g transform="translate(28, 28) rotate(-40) translate(-12, -14)">
        <path d="M12 2C12 2 6 7 6 17H18C18 7 12 2 12 2Z" fill="white" />
        <circle cx="12" cy="13" r="2.5" fill="url(#orangeGrad)" />
        <path d="M6 17L2 22H6V17Z" fill="white" />
        <path d="M18 17L22 22H18V17Z" fill="white" />
        <rect x="9.5" y="17" width="5" height="3" rx="1" fill="white" opacity="0.85" />
        <path d="M9.5 20C9.5 20 9 23.5 12 24.5C15 23.5 14.5 20 14.5 20H9.5Z" fill="#FFD93D" opacity="0.9" />
        <path d="M10.5 20.5C10.5 20.5 10.2 22.5 12 23C13.8 22.5 13.5 20.5 13.5 20.5H10.5Z" fill="white" opacity="0.7" />
      </g>
    </svg>
  );
}

export function ChatScreen() {
  const [inputValue, setInputValue] = useState("");
  const [copied, setCopied] = useState(false);

  // Refs for scroll hijacking
  const screenRef = useRef<HTMLDivElement>(null);
  const chatAreaRef = useRef<HTMLDivElement>(null);
  const touchStartYRef = useRef(0);
  const lastDeltaRef = useRef(0);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    const screen = screenRef.current;
    const chatArea = chatAreaRef.current;
    if (!screen || !chatArea) return;

    // ─── Helpers ────────────────────────────────────────────────
    const chatCanScroll = (deltaY: number) => {
      const { scrollTop, scrollHeight, clientHeight } = chatArea;
      const atBottom = scrollTop + clientHeight >= scrollHeight - 2;
      const atTop = scrollTop <= 0;
      return (deltaY > 0 && !atBottom) || (deltaY < 0 && !atTop);
    };

    // Use getBoundingClientRect — works correctly even with CSS scale()
    const isPointOnPhone = (clientX: number, clientY: number) => {
      const rect = screen.getBoundingClientRect();
      return (
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom
      );
    };

    // ─── Wheel (desktop) ─────────────────────────────────────────
    const handleWindowWheel = (e: WheelEvent) => {
      if (!isPointOnPhone(e.clientX, e.clientY)) return;
      e.preventDefault();
      if (chatCanScroll(e.deltaY)) {
        chatArea.scrollTop += e.deltaY;
      } else {
        // Chat is at its boundary → pass scroll through to the page
        window.scrollBy(0, e.deltaY);
      }
    };

    // ─── Touch (mobile) ─────────────────────────────────────────
    const handleWindowTouchStart = (e: TouchEvent) => {
      touchStartYRef.current = e.touches[0].clientY;
      lastDeltaRef.current = 0;
    };

    const handleWindowTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (!isPointOnPhone(touch.clientX, touch.clientY)) return;

      const deltaY = touchStartYRef.current - touch.clientY;
      touchStartYRef.current = touch.clientY;
      lastDeltaRef.current = deltaY;

      // touch-action: none on the screen container prevents the browser from
      // claiming this gesture natively, so window.scrollBy executes immediately
      // without any iOS delay. No need to call e.preventDefault() here.
      if (chatCanScroll(deltaY)) {
        chatArea.scrollTop += deltaY;
      } else {
        // Chat reached its boundary → scroll the landing page instead
        window.scrollBy(0, deltaY);
      }
    };

    window.addEventListener("wheel", handleWindowWheel, { passive: false });
    window.addEventListener("touchstart", handleWindowTouchStart, { passive: true });
    window.addEventListener("touchmove", handleWindowTouchMove, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWindowWheel);
      window.removeEventListener("touchstart", handleWindowTouchStart);
      window.removeEventListener("touchmove", handleWindowTouchMove);
    };
  }, []);

  return (
    <div
      ref={screenRef}
      className="relative flex flex-col overflow-hidden w-full h-full"
      style={{
        background: "#ECEAE1",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif",
        borderRadius: "0",
        boxShadow: "none",
        touchAction: "none",
      }}
    >
      {/* Header — compact, no status bar */}
      <div className="flex items-center justify-between px-4 py-2 z-40 relative" style={{ background: "#1A1A18" }}>
        <button className="flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0" style={{ background: "rgba(255,255,255,0.1)" }}>
          <ChevronLeft size={18} strokeWidth={2.5} color="#fff" />
        </button>
        <div className="flex flex-col items-center gap-0.5 min-w-0 flex-1 px-2">
          <span style={{ fontSize: "13px", fontWeight: 700, color: "#fff", letterSpacing: "-0.3px", fontFamily: "'Unbounded', sans-serif", whiteSpace: "nowrap" }}>
            AI Platform Ed.System
          </span>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#CBFF4D" }} />
            <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.5)", fontWeight: 400, whiteSpace: "nowrap" }}>онлайн · активний</span>
          </div>
        </div>
        <button className="flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0" style={{ background: "rgba(255,255,255,0.1)" }}>
          <MoreHorizontal size={16} color="#fff" />
        </button>
      </div>

      {/* Curved transition */}
      <div style={{ height: "16px", background: "#1A1A18", position: "relative" }}>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "16px", background: "#ECEAE1", borderRadius: "16px 16px 0 0" }} />
      </div>

      {/* Chat Area — scrollable container */}
      <div
        ref={chatAreaRef}
        className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col gap-4 px-4 pt-2 pb-3"
        style={{ background: "#ECEAE1" }}
      >
        <div className="flex justify-center">
          <span className="px-3 py-1 rounded-full" style={{ fontSize: "11px", color: "#7A7A6E", fontWeight: 500, background: "rgba(0,0,0,0.07)" }}>Сьогодні, 14:32</span>
        </div>

        <div className="flex justify-end" style={{ opacity: 0.3 }}>
          <div className="px-4 py-3 max-w-[92%]" style={{ background: "#1A1A18", borderRadius: "20px 20px 5px 20px" }}>
            <p style={{ fontSize: "15px", color: "#fff", lineHeight: "1.45" }}>Привіт! Мені потрібні заголовки для мого онлайн-курсу...</p>
          </div>
        </div>

        <div className="flex justify-start items-end gap-2">
          <div style={{ flexShrink: 0 }}><RocketIcon size={26} /></div>
          <div className="px-4 py-3 max-w-[88%]" style={{ background: "#fff", borderRadius: "20px 20px 20px 5px", border: "1px solid rgba(0,0,0,0.06)" }}>
            <p style={{ fontSize: "15px", color: "#1A1A18", lineHeight: "1.45" }}>Звісно! Розкажіть більше про вашу нішу, і я підготую найкращі офери.</p>
          </div>
        </div>

        <div className="flex justify-end">
          <div className="px-4 py-3 max-w-[92%]" style={{ background: "#1A1A18", borderRadius: "20px 20px 5px 20px", boxShadow: "0 4px 16px rgba(0,0,0,0.15)" }}>
            <p style={{ fontSize: "15px", color: "#fff", lineHeight: "1.45" }}>Я художниця, пишу гірські пейзажі олією. Моя аудиторія — жінки 35+, які мріють навчитися малювати з нуля, але переконані, що без таланту це неможливо. Курс — 5 днів онлайн, без художньої освіти. Допоможи створити офери.</p>
          </div>
        </div>

        <div className="flex justify-start items-start gap-2">
          <div className="flex-shrink-0 mt-1"><RocketIcon size={28} /></div>
          <div className="rounded-2xl px-4 py-4 flex-1" style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <p style={{ fontSize: "12px", color: "#7A7A6E", lineHeight: "1.6", marginBottom: "2px" }}>Оффер 1</p>
            <p style={{ fontSize: "13px", color: "#1A1A18", lineHeight: "1.65" }}><span style={{ fontWeight: 700 }}>НАЗВА:</span> ПЕРША КАРТИНА ОЛІЄЮ</p>
            <p style={{ fontSize: "13px", color: "#1A1A18", lineHeight: "1.65" }}><span style={{ fontWeight: 700 }}>ЗАГОЛОВОК:</span> Напишіть свій перший об'ємний гірський пейзаж за один вечір</p>
            <p style={{ fontSize: "13px", color: "#1A1A18", lineHeight: "1.65" }}><span style={{ fontWeight: 700 }}>ДЕСКРИПТОР:</span> Відчуйте себе впевненим художником через покрокове малювання олією без страху чистого полотна.</p>
            <p style={{ fontSize: "13px", color: "#1A1A18", lineHeight: "1.65" }}><span style={{ fontWeight: 700 }}>БУЛІТИ:</span> 1 готова картина | 7 чітких кроків | Економія на дорогих офлайн-студіях</p>
            <div style={{ height: "1px", background: "rgba(0,0,0,0.08)", margin: "10px 0" }} />
            <p style={{ fontSize: "12px", color: "#7A7A6E", lineHeight: "1.6", marginBottom: "2px" }}>Оффер 2</p>
            <p style={{ fontSize: "13px", color: "#1A1A18", lineHeight: "1.65" }}><span style={{ fontWeight: 700 }}>НАЗВА:</span> МАЛЮВАННЯ БЕЗ СТРЕСУ</p>
            <p style={{ fontSize: "13px", color: "#1A1A18", lineHeight: "1.65" }}><span style={{ fontWeight: 700 }}>ЗАГОЛОВОК:</span> Створюйте картини олією без художньої освіти та складної теорії</p>
            <p style={{ fontSize: "13px", color: "#1A1A18", lineHeight: "1.65" }}><span style={{ fontWeight: 700 }}>ДЕСКРИПТОР:</span> Звільніться від хаотичних спроб завдяки авторському методу роботи з мінімальною палітрою кольорів.</p>
            <p style={{ fontSize: "13px", color: "#1A1A18", lineHeight: "1.65" }}><span style={{ fontWeight: 700 }}>БУЛІТИ:</span> Жодних зайвих фарб | Секрети довговічності пензлів | Впевненість з першого мазка</p>
          </div>
        </div>

        <div className="flex justify-end">
          <div className="px-4 py-3 max-w-[92%]" style={{ background: "#1A1A18", borderRadius: "20px 20px 5px 20px", boxShadow: "0 4px 16px rgba(0,0,0,0.2)" }}>
            <p style={{ fontSize: "15px", color: "#fff", lineHeight: "1.45" }}>Супер! А тепер напиши тексти для блоку Програма курсу</p>
          </div>
        </div>

        <div className="flex justify-start items-start gap-2">
          <div className="flex-shrink-0 mt-1"><RocketIcon size={28} /></div>
          <div className="flex flex-col gap-2.5 flex-1 min-w-0">
            <div className="rounded-2xl px-4 py-4" style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
              <p style={{ fontSize: "13px", color: "#1A1A18", lineHeight: "1.7", marginBottom: "16px" }}>📌 <span style={{ fontWeight: 700 }}>ПРОГРАМА КУРСУ</span><br /><span style={{ color: "#7A7A6E" }}>5 днів. Від чистого полотна до картини, якою пишаєшся.</span></p>
              <p style={{ fontSize: "13px", color: "#1A1A18", lineHeight: "1.65" }}><span style={{ fontWeight: 700 }}>ДЕНЬ 1. Перший мазок без страху</span></p>
              <p style={{ fontSize: "13px", color: "#1A1A18", lineHeight: "1.65", marginBottom: "14px" }}>Ти розкладеш матеріали, відчуєш фарбу в руках і зробиш перший мазок.</p>
              <div style={{ height: "1px", background: "rgba(0,0,0,0.06)", marginBottom: "14px" }} />
              <p style={{ fontSize: "13px", color: "#1A1A18", lineHeight: "1.65" }}><span style={{ fontWeight: 700 }}>ДЕНЬ 2. Колір, що живе</span></p>
              <p style={{ fontSize: "13px", color: "#1A1A18", lineHeight: "1.65", marginBottom: "14px" }}>Як змішати теплий захід з холодною тінню так, щоб пейзаж дихав.</p>
              <div style={{ height: "1px", background: "rgba(0,0,0,0.06)", marginBottom: "14px" }} />
              <p style={{ fontSize: "13px", color: "#1A1A18", lineHeight: "1.65" }}><span style={{ fontWeight: 700 }}>ДЕНЬ 3. Об'єм і глибина</span></p>
              <p style={{ fontSize: "13px", color: "#1A1A18", lineHeight: "1.65", marginBottom: "14px" }}>Три техніки, які перетворюють пласке зображення на живий простір.</p>
              <div style={{ height: "1px", background: "rgba(0,0,0,0.06)", marginBottom: "14px" }} />
              <p style={{ fontSize: "13px", color: "#1A1A18", lineHeight: "1.65" }}><span style={{ fontWeight: 700 }}>ДЕНЬ 4. Характер і деталі</span></p>
              <p style={{ fontSize: "13px", color: "#1A1A18", lineHeight: "1.65", marginBottom: "14px" }}>Додаємо світло, деталі, підпис. Це вже твій стиль.</p>
              <div style={{ height: "1px", background: "rgba(0,0,0,0.06)", marginBottom: "14px" }} />
              <p style={{ fontSize: "13px", color: "#1A1A18", lineHeight: "1.65" }}><span style={{ fontWeight: 700 }}>ДЕНЬ 5. Готова картина</span></p>
              <p style={{ fontSize: "13px", color: "#1A1A18", lineHeight: "1.65", marginBottom: "16px" }}>Ти тримаєш у руках власний гірський пейзаж, написаний олією.</p>
              <div style={{ height: "1px", background: "rgba(0,0,0,0.1)", marginBottom: "16px" }} />
              <p style={{ fontSize: "12px", color: "#7A7A6E", marginBottom: "12px" }}>🎁 ОНУСИ</p>
              <p style={{ fontSize: "13px", color: "#1A1A18", lineHeight: "1.65" }}><span style={{ fontWeight: 700 }}>БОНУС 1. Відеобібліотека технік</span></p>
              <p style={{ fontSize: "13px", color: "#1A1A18", lineHeight: "1.65", marginBottom: "12px" }}>8 додаткових відеоуроків назавжди у твоєму доступі.</p>
              <p style={{ fontSize: "13px", color: "#1A1A18", lineHeight: "1.65" }}><span style={{ fontWeight: 700 }}>БОНУС 2. Закрита спільнота художників</span></p>
              <p style={{ fontSize: "13px", color: "#1A1A18", lineHeight: "1.65", marginBottom: "12px" }}>Місце, де тебе розуміють. Без критики. Тільки ріст і тепло.</p>
              <p style={{ fontSize: "13px", color: "#1A1A18", lineHeight: "1.65" }}><span style={{ fontWeight: 700 }}>БОНУС 3. Особистий розбір твоєї картини</span></p>
              <p style={{ fontSize: "13px", color: "#1A1A18", lineHeight: "1.65" }}>Голосове повідомлення з конкретним розбором саме твоєї картини.</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={handleCopy} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: copied ? "#CBFF4D" : "rgba(0,0,0,0.08)" }}>
                <Copy size={12} color={copied ? "#0A0A0A" : "#7A7A6E"} />
                <span style={{ fontSize: "12px", color: copied ? "#0A0A0A" : "#7A7A6E", fontWeight: 600 }}>{copied ? "Скопійовано" : "Копіювати"}</span>
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: "rgba(0,0,0,0.08)" }}>
                <RotateCcw size={12} color="#7A7A6E" />
                <span style={{ fontSize: "12px", color: "#7A7A6E", fontWeight: 600 }}>Оновити</span>
              </button>
              <div className="flex items-center gap-1 ml-auto">
                <button className="w-7 h-7 flex items-center justify-center rounded-full" style={{ background: "rgba(0,0,0,0.08)" }}><ThumbsUp size={13} color="#7A7A6E" /></button>
                <button className="w-7 h-7 flex items-center justify-center rounded-full" style={{ background: "rgba(0,0,0,0.08)" }}><ThumbsDown size={13} color="#7A7A6E" /></button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <div className="px-4 py-3 max-w-[92%]" style={{ background: "#1A1A18", borderRadius: "20px 20px 5px 20px", boxShadow: "0 4px 16px rgba(0,0,0,0.15)" }}>
            <p style={{ fontSize: "15px", color: "#fff", lineHeight: "1.45" }}>Клас! Забираю в роботу!</p>
          </div>
        </div>
        <div className="h-2" />
      </div>

      {/* Input Area */}
      <div className="px-3 pt-2 pb-2" style={{ background: "#ECEAE1", borderTop: "1px solid rgba(0,0,0,0.08)" }}>
        <div className="flex items-center gap-2 px-3 py-2 rounded-[20px]" style={{ background: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", border: "1px solid rgba(0,0,0,0.06)" }}>
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Повідомлення..."
            rows={1}
            className="flex-1 resize-none outline-none bg-transparent"
            style={{ fontSize: "13px", color: "#1A1A18", lineHeight: "1.4", maxHeight: "60px", fontFamily: "inherit", paddingTop: "1px", paddingBottom: "1px", minWidth: 0, overflowX: "hidden" }}
          />
          <button className="flex items-center justify-center rounded-full flex-shrink-0" style={{ width: "28px", height: "28px", background: "#1A1A18" }}>
            <Send size={13} color="#fff" strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
}