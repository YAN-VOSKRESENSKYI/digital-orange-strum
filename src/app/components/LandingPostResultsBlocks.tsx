import type { CSSProperties } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";

/** Скріншоти відгуків: v1…v8 у `src/assets` — порядок у слайдері «Відгуки учасників» */
import reviewV1 from "../../assets/v1.jpg";
import reviewV2 from "../../assets/v2.png";
import reviewV3 from "../../assets/v3.png";
import reviewV4 from "../../assets/v4.png";
import reviewV5 from "../../assets/v5.jpg";
import reviewV6 from "../../assets/v6.jpg";
import reviewV7 from "../../assets/v7.png";
import reviewV8 from "../../assets/v8.jpg";

/** watch, youtu.be, shorts або 11-символьний ID — порядок = порядок у каруселі */
const REVIEW_YOUTUBE_SOURCES: string[] = [
  "https://www.youtube.com/shorts/78SDKGHSFkI",
  "https://www.youtube.com/watch?v=ah4w8iwhEOc",
  "https://www.youtube.com/shorts/9dBbqxA5pII",
  "https://www.youtube.com/shorts/sgdbhjpUGRY",
  "https://www.youtube.com/shorts/UOd7NyuvRzc",
  "https://www.youtube.com/watch?v=1kQNhAy_Iho",
];

const REVIEW_SCREENSHOT_SLIDER = [reviewV1, reviewV2, reviewV3, reviewV4, reviewV5, reviewV6, reviewV7, reviewV8] as const;

function youtubeVideoIdFromInput(raw: string): string | null {
  const s = raw.trim();
  if (!s) return null;
  if (/^[a-zA-Z0-9_-]{11}$/.test(s)) return s;
  try {
    const u = new URL(s.startsWith("http") ? s : `https://${s}`);
    if (u.hostname === "youtu.be" || u.hostname.endsWith(".youtu.be")) {
      const id = u.pathname.replace(/^\//, "").split("/")[0];
      return /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
    }
    const v = u.searchParams.get("v");
    if (v && /^[a-zA-Z0-9_-]{11}$/.test(v)) return v;
    const shorts = u.pathname.match(/\/shorts\/([a-zA-Z0-9_-]{11})(?:\/|[?#]|$)/);
    if (shorts?.[1]) return shorts[1];
    const embed = u.pathname.match(/\/embed\/([a-zA-Z0-9_-]{11})/);
    return embed?.[1] ?? null;
  } catch {
    return null;
  }
}

/** Верх секції як у VLob1: дві лінії до primary, мітка посередині, заголовок без лінії під ним */
function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="flex w-full flex-col items-center px-5 pt-2 pb-1">
      <div className="mb-3 flex w-full max-w-[341px] items-center gap-[7.988px] sm:mb-4">
        <div
          className="h-[0.992px] min-h-px min-w-px flex-[1_0_0] bg-gradient-to-r from-[rgba(0,0,0,0)] to-[var(--primary-color)]"
          aria-hidden
        />
        <p className="shrink-0 whitespace-nowrap font-['Manrope:Bold',sans-serif] text-[10px] font-bold uppercase leading-[15px] tracking-[3px] text-[var(--primary-color)]">
          {eyebrow}
        </p>
        <div
          className="h-[0.992px] min-h-px min-w-px flex-[1_0_0] bg-gradient-to-l from-[rgba(0,0,0,0)] to-[var(--primary-color)]"
          aria-hidden
        />
      </div>
      <p className="max-w-[340px] text-center font-['Unbounded:ExtraBold',sans-serif] text-[22px] font-extrabold uppercase leading-tight tracking-[-0.5px] text-white sm:text-[24px]">
        {title}
      </p>
    </div>
  );
}

const navBtnClass =
  "flex size-[52px] shrink-0 items-center justify-center rounded-full shadow-lg transition-all hover:brightness-110 active:scale-95";

function NavChevronLeft() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function NavChevronRight() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function gradientNavStyle(): CSSProperties {
  return {
    background: "linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)",
    boxShadow: "0 4px 18px rgba(var(--primary-rgb),0.45)",
  };
}

/** 1. Відеовідгуки клієнтів (можна вставляти окремо, наприклад перед блоком програми) */
export function VideoReviewsBlock() {
  const [index, setIndex] = useState(0);
  const videoIds = useMemo(() => REVIEW_YOUTUBE_SOURCES.map((s) => youtubeVideoIdFromInput(s)), []);
  const total = Math.max(1, videoIds.length);

  useEffect(() => {
    setIndex((i) => Math.min(i, total - 1));
  }, [total]);

  const next = useCallback(() => setIndex((i) => (i + 1) % total), [total]);
  const prev = useCallback(() => setIndex((i) => (i - 1 + total) % total), [total]);

  return (
    <section
      id="section-video-reviews"
      className="relative w-full shrink-0 flex flex-col gap-4 pt-12 pb-6 px-0"
      style={{ background: "linear-gradient(180deg, var(--bg-block-dark) 0%, var(--background) 100%)" }}
      data-name="VideoReviewsSection"
    >
      <SectionHeading eyebrow="Відео" title="Відеовідгуки клієнтів" />
      <div className="flex w-full flex-col gap-3 mt-1">
        <div className="relative w-full overflow-hidden">
          <div
            className="flex transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {videoIds.map((id, i) => (
              <div key={i} className="min-w-full flex justify-center px-2.5 py-2 shrink-0">
                <div className="w-full max-w-[350px] h-[300px] max-h-[min(300px,55vh)] rounded-[20px] shadow-2xl overflow-hidden border-[3px] border-[rgba(var(--primary-rgb),0.35)] relative bg-[#0a0a0a]">
                  {!id ? (
                    <div className="flex h-full w-full items-center justify-center px-4 text-center font-['Manrope:Regular',sans-serif] text-[13px] text-[#999]">
                      Додай посилання або ID YouTube у масив{" "}
                      <span className="font-mono px-1" style={{ color: "var(--primary-color)" }}>
                        REVIEW_YOUTUBE_SOURCES
                      </span>{" "}
                      (позиція {i + 1})
                    </div>
                  ) : i === index ? (
                    <iframe
                      title={`Відеовідгук ${i + 1}`}
                      className="absolute inset-0 h-full w-full border-0"
                      src={`https://www.youtube-nocookie.com/embed/${id}?modestbranding=1&rel=0&playsinline=1`}
                      allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      loading="lazy"
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIndex(i)}
                      className="relative h-full w-full cursor-pointer border-0 p-0"
                      aria-label={`Відкрити відеовідгук ${i + 1}`}
                    >
                      <img src={`https://img.youtube.com/vi/${id}/hqdefault.jpg`} alt="" className="h-full w-full object-cover" />
                      <span className="absolute inset-0 flex items-center justify-center bg-black/40">
                        <span className="flex size-[64px] items-center justify-center rounded-full bg-white/95 shadow-lg">
                          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="ml-[3px]" aria-hidden>
                            <path d="M8 5v14l11-7L8 5z" fill="var(--primary-color)" />
                          </svg>
                        </span>
                      </span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-row justify-center w-full gap-6 pb-0">
          <button type="button" onClick={prev} className={navBtnClass} style={gradientNavStyle()} aria-label="Попереднє відео">
            <NavChevronLeft />
          </button>
          <button type="button" onClick={next} className={navBtnClass} style={gradientNavStyle()} aria-label="Наступне відео">
            <NavChevronRight />
          </button>
        </div>
      </div>
    </section>
  );
}

/** 2. Темний блок зі скріншотами відгуків */
function BlackReviewsBlock() {
  const [index, setIndex] = useState(0);
  const images = REVIEW_SCREENSHOT_SLIDER;
  const total = images.length;

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % total);
    }, 5000);
    return () => clearInterval(timer);
  }, [total]);

  const next = () => setIndex((i) => (i + 1) % total);
  const prev = () => setIndex((i) => (i - 1 + total) % total);

  return (
    <section
      className="relative w-full shrink-0 flex flex-col gap-8 pt-12 pb-12 px-5 sm:px-6"
      style={{ backgroundColor: "#0a0604" }}
      data-name="BlackReviewsSection"
    >
      <SectionHeading eyebrow="Відгуки" title="Відгуки учасників" />

      {/* Одна картинка по центру; інші лише після перемикання (opacity, як у блоці кейсів) */}
      <div className="relative w-full max-w-[333px] mx-auto">
        <div className="relative w-full h-[min(520px,70vh)] min-h-[240px] overflow-hidden rounded-[16px] bg-black/40 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
          {images.map((img, i) => (
            <div
              key={i}
              className={`absolute inset-0 flex items-center justify-center p-3 transition-opacity duration-500 ease-out ${
                i === index ? "z-10 opacity-100" : "z-0 opacity-0 pointer-events-none"
              }`}
              aria-hidden={i !== index}
            >
              <img
                src={img}
                alt={`Скріншот відгуку ${i + 1}`}
                className="max-h-full max-w-full object-contain rounded-[10px] shadow-[0_4px_24px_rgba(0,0,0,0.35)]"
              />
            </div>
          ))}
        </div>

        <div className="pointer-events-none absolute left-0 right-0 top-1/2 z-20 flex -translate-y-1/2 justify-between px-1">
          <button
            type="button"
            onClick={prev}
            className={`${navBtnClass} pointer-events-auto shrink-0 scale-90 sm:scale-100`}
            style={gradientNavStyle()}
            aria-label="Попередній відгук"
          >
            <NavChevronLeft />
          </button>
          <button
            type="button"
            onClick={next}
            className={`${navBtnClass} pointer-events-auto shrink-0 scale-90 sm:scale-100`}
            style={gradientNavStyle()}
            aria-label="Наступний відгук"
          >
            <NavChevronRight />
          </button>
        </div>
      </div>
    </section>
  );
}

/**
 * Скріншоти відгуків «Відгуки учасників» — у VLob1 після Section8 та Section2 (раніше одразу після Section4).
 * «Відеовідгуки клієнтів» — окремо в `VideoReviewsBlock` (перед блоком бонусів і `LandingMoneySection` у VLob1). Карусель кейсів прибрана як дублікат блоку зверху.
 */
export function LandingPostResultsBlocks() {
  return (
    <div className="relative w-full shrink-0 flex flex-col items-stretch">
      <BlackReviewsBlock />
    </div>
  );
}
