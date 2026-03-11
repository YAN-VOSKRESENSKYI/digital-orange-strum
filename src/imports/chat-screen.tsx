import { useState } from "react";
import { ChevronLeft, MoreHorizontal, Send, Mic, RotateCcw, Copy, ThumbsUp, ThumbsDown } from "lucide-react";

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

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative flex flex-col overflow-hidden" style={{ width: "390px", height: "844px", background: "#ECEAE1", fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif", borderRadius: "0", boxShadow: "none" }}>
      {/* Status Bar */}
      <div className="flex items-center justify-between px-6 z-40 relative" style={{ height: "28px", background: "#1A1A18", paddingTop: "4px", paddingBottom: "4px" }}>
        <span style={{ fontSize: "12px", fontWeight: 600, color: "#fff" }}>9:41</span>
        <div className="flex items-center gap-[5px]">
          <svg width="13" height="9" viewBox="0 0 17 12" fill="none">
            <rect x="0" y="6" width="3" height="6" rx="1" fill="white" fillOpacity="0.4" />
            <rect x="4.5" y="4" width="3" height="8" rx="1" fill="white" fillOpacity="0.6" />
            <rect x="9" y="2" width="3" height="10" rx="1" fill="white" fillOpacity="0.8" />
            <rect x="13.5" y="0" width="3" height="12" rx="1" fill="white" />
          </svg>
          <svg width="13" height="9" viewBox="0 0 16 12" fill="none">
            <path d="M8 9.5C8.83 9.5 9.5 10.17 9.5 11S8.83 12.5 8 12.5 6.5 11.83 6.5 11 7.17 9.5 8 9.5z" fill="white" />
            <path d="M8 6C9.93 6 11.68 6.78 12.95 8.05L14.07 6.93C12.52 5.38 10.37 4.5 8 4.5S3.48 5.38 1.93 6.93L3.05 8.05C4.32 6.78 6.07 6 8 6z" fill="white" />
            <path d="M8 2.5C11.02 2.5 13.73 3.73 15.66 5.75L16.78 4.63C14.56 2.32 11.44 1 8 1S1.44 2.32-.78 4.63L.34 5.75C2.27 3.73 4.98 2.5 8 2.5z" fill="white" />
          </svg>
          <div style={{ width: "19px", height: "9px", border: "1px solid rgba(255,255,255,0.35)", borderRadius: "2.5px", padding: "1.5px" }}>
            <div style={{ width: "80%", height: "100%", background: "#fff", borderRadius: "1.5px" }} />
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 z-40 relative" style={{ background: "#1A1A18" }}>
        <button className="flex items-center justify-center w-9 h-9 rounded-full" style={{ background: "rgba(255,255,255,0.1)" }}>
          <ChevronLeft size={20} strokeWidth={2.5} color="#fff" />
        </button>
        <div className="flex flex-col items-center gap-0.5">
          <div className="flex items-center gap-2">
            <RocketIcon size={28} />
            <span style={{ fontSize: "14px", fontWeight: 700, color: "#fff", letterSpacing: "-0.3px", fontFamily: "'Unbounded', sans-serif" }}>AI Platform Ed.System</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#CBFF4D" }} />
            <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", fontWeight: 400 }}>онлайн · активний</span>
          </div>
        </div>
        <button className="flex items-center justify-center w-9 h-9 rounded-full" style={{ background: "rgba(255,255,255,0.1)" }}>
          <MoreHorizontal size={18} color="#fff" />
        </button>
      </div>

      {/* Curved transition */}
      <div style={{ height: "16px", background: "#1A1A18", position: "relative" }}>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "16px", background: "#ECEAE1", borderRadius: "16px 16px 0 0" }} />
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-4 px-4 pt-2 pb-3" style={{ background: "#ECEAE1" }}>
        <div className="flex justify-center">
          <span className="px-3 py-1 rounded-full" style={{ fontSize: "11px", color: "#7A7A6E", fontWeight: 500, background: "rgba(0,0,0,0.07)" }}>Сьогодні, 14:32</span>
        </div>

        <div className="flex justify-end" style={{ opacity: 0.3 }}>
          <div className="px-4 py-3 max-w-[78%]" style={{ background: "#1A1A18", borderRadius: "20px 20px 5px 20px" }}>
            <p style={{ fontSize: "15px", color: "#fff", lineHeight: "1.45" }}>Привіт! Мені потрібні заголовки для мого онлайн-курсу...</p>
          </div>
        </div>

        <div className="flex justify-start items-end gap-2">
          <div style={{ flexShrink: 0 }}><RocketIcon size={26} /></div>
          <div className="px-4 py-3 max-w-[75%]" style={{ background: "#fff", borderRadius: "20px 20px 20px 5px", border: "1px solid rgba(0,0,0,0.06)" }}>
            <p style={{ fontSize: "15px", color: "#1A1A18", lineHeight: "1.45" }}>Звісно! Розкажіть більше про вашу нішу, і я підготую найкращі офери.</p>
          </div>
        </div>

        <div className="flex justify-end">
          <div className="px-4 py-3 max-w-[82%]" style={{ background: "#1A1A18", borderRadius: "20px 20px 5px 20px", boxShadow: "0 4px 16px rgba(0,0,0,0.15)" }}>
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
          <div className="px-4 py-3 max-w-[82%]" style={{ background: "#1A1A18", borderRadius: "20px 20px 5px 20px", boxShadow: "0 4px 16px rgba(0,0,0,0.2)" }}>
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
              <p style={{ fontSize: "12px", color: "#7A7A6E", marginBottom: "12px" }}>🎁 БОНУСИ</p>
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
          <div className="px-4 py-3 max-w-[78%]" style={{ background: "#1A1A18", borderRadius: "20px 20px 5px 20px", boxShadow: "0 4px 16px rgba(0,0,0,0.15)" }}>
            <p style={{ fontSize: "15px", color: "#fff", lineHeight: "1.45" }}>Клас! Забираю в роботу!</p>
          </div>
        </div>
        <div className="h-2" />
      </div>

      {/* Input Area */}
      <div className="px-4 pt-3 pb-9" style={{ background: "#ECEAE1", borderTop: "1px solid rgba(0,0,0,0.08)" }}>
        <div className="flex items-end gap-3 px-4 py-3 rounded-[26px]" style={{ background: "#fff", boxShadow: "0 2px 12px rgba(0,0,0,0.08)", border: "1px solid rgba(0,0,0,0.06)" }}>
          <textarea value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="Повідомлення..." rows={1} className="flex-1 resize-none outline-none bg-transparent" style={{ fontSize: "15px", color: "#1A1A18", lineHeight: "1.4", maxHeight: "100px", fontFamily: "inherit", paddingTop: "2px", paddingBottom: "2px" }} />
          <button className="flex items-center justify-center rounded-full flex-shrink-0" style={{ width: "34px", height: "34px", background: inputValue.trim() ? "#CBFF4D" : "#1A1A18" }}>
            {inputValue.trim() ? <Send size={15} color="#0A0A0A" strokeWidth={2.5} /> : <Mic size={15} color="#fff" strokeWidth={2} />}
          </button>
        </div>
      </div>
    </div>
  );
}