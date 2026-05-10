import { useEffect, useRef, useState } from "react";

import img221 from "../../assets/money/505abc891f1bc112a6a6cf0b1e554874488557d7.png";
import img921 from "../../assets/money/27d3afefc5013dd87e9029403424489c7f6811cb.png";
import img731 from "../../assets/money/af14687e3c1161316d3f1c95dc24d0104fbb581a.png";
import img832 from "../../assets/money/6cb9e3465856f78d8d32b5b4855913fc36868bd7.png";
import img151 from "../../assets/money/4416c5dcb584b94ffd7fd12976135bde48c1c05a.png";
import img531 from "../../assets/money/e9a9e3f0277ca801e30bfbbbb8eb70f1e018eb5e.png";
import imgScreenshot2612 from "../../assets/money/1c971357d979ad0cb0f39cc0bca48e266789055c.png";
import moneyChart from "../../assets/money/chart.jpg";

const cardBorder = "border-2 border-solid border-[var(--primary-color)]";

function MoneyEyebrow() {
  return (
    <div
      className="absolute left-0 right-0 top-0 flex w-full flex-col items-center px-5 pt-2 pb-0"
      data-name="MoneyEyebrow"
    >
      <div className="mb-3 flex w-full max-w-[341px] items-center gap-[7.988px] sm:mb-4">
        <div
          className="h-[0.992px] min-h-px min-w-px flex-[1_0_0] bg-gradient-to-r from-[rgba(0,0,0,0)] to-[var(--primary-color)]"
          aria-hidden
        />
        <p className="shrink-0 whitespace-nowrap font-['Manrope:Bold',sans-serif] text-[10px] font-bold uppercase leading-[15px] tracking-[3px] text-[var(--primary-color)]">
          твій перший прибуток
        </p>
        <div
          className="h-[0.992px] min-h-px min-w-px flex-[1_0_0] bg-gradient-to-l from-[rgba(0,0,0,0)] to-[var(--primary-color)]"
          aria-hidden
        />
      </div>
    </div>
  );
}

function MoneyTitle() {
  return (
    <div
      className="absolute left-0 right-0 top-[40px] w-full px-4 pb-0.5"
      data-name="MoneyTitle"
    >
      <p className="text-center font-['Unbounded:ExtraBold',sans-serif] font-extrabold uppercase text-white">
        <span className="block text-[22px] leading-[30px] tracking-[-0.5px]">дохід учнів</span>
        <span className="mt-0.5 block text-[22px] leading-[30px] tracking-[-0.5px] text-[var(--secondary-color)]">
          за перший місяць
        </span>
      </p>
    </div>
  );
}

function Frame22() {
  return (
    <div
      className={`relative h-[63.241px] w-[280.407px] rounded-[10px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] ${cardBorder}`}
    >
      <div className="pointer-events-none absolute left-[-2px] top-[-2px] h-[63.837px] w-[280.407px] rounded-[7.159px]" data-name="card-1">
        <img alt="" className="absolute inset-0 size-full max-w-none rounded-[7.159px] object-cover" src={img221} />
        <div aria-hidden className={`absolute inset-0 rounded-[7.159px] ${cardBorder}`} />
      </div>
    </div>
  );
}

function Frame16() {
  return (
    <div className={`relative h-[63.241px] w-[280.407px] overflow-clip rounded-[10px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] ${cardBorder}`}>
      <div className="absolute left-[-2px] top-[-2px] h-[63.837px] w-[280.407px] rounded-[7.159px]" data-name="card-2">
        <img alt="" className="pointer-events-none absolute inset-0 size-full max-w-none rounded-[7.159px] object-cover" src={img921} />
      </div>
    </div>
  );
}

function Frame17() {
  return (
    <div className={`relative h-[63.241px] w-[280.407px] overflow-clip rounded-[10px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] ${cardBorder}`}>
      <div className="absolute left-[-2px] top-[-2px] h-[63.837px] w-[280.407px] rounded-[7.159px]" data-name="card-3">
        <img alt="" className="pointer-events-none absolute inset-0 size-full max-w-none rounded-[7.159px] object-cover" src={img731} />
      </div>
    </div>
  );
}

function Frame18() {
  return (
    <div
      className={`absolute left-[25px] top-[222.01px] h-[63.837px] w-[280.407px] overflow-clip rounded-[10px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] ${cardBorder}`}
    >
      <div className="absolute left-[-2px] top-[-2px] h-[63.837px] w-[280.407px] rounded-[7.159px]" data-name="card-4">
        <img alt="" className="pointer-events-none absolute inset-0 size-full max-w-none rounded-[7.159px] object-cover" src={img832} />
      </div>
    </div>
  );
}

function Frame21() {
  return (
    <div
      className={`absolute left-[48px] top-[393.01px] h-[63.241px] w-[280.407px] overflow-clip rounded-[10px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] ${cardBorder}`}
    >
      <div className="absolute left-[-2px] top-[-2px] h-[63.837px] w-[280.407px] rounded-[7.159px]" data-name="card-5">
        <img alt="" className="pointer-events-none absolute inset-0 size-full max-w-none rounded-[7.159px] object-cover" src={img151} />
      </div>
    </div>
  );
}

function Frame20() {
  return (
    <div className={`relative h-[63.241px] w-[280.407px] overflow-clip rounded-[10px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] ${cardBorder}`}>
      <div className="absolute left-[-2px] top-[-2px] h-[63.837px] w-[280.407px] rounded-[7.159px]" data-name="card-6">
        <img alt="" className="pointer-events-none absolute inset-0 size-full max-w-none rounded-[7.159px] object-cover" src={img531} />
      </div>
    </div>
  );
}

function Frame19() {
  return (
    <div className={`relative h-[63.241px] w-[280.407px] overflow-clip rounded-[10px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] ${cardBorder}`}>
      <div className="absolute left-[-2px] top-[-4.39px] h-[69.207px] w-[281.933px] rounded-[7.159px]" data-name="card-7">
        <img alt="" className="pointer-events-none absolute inset-0 size-full max-w-none rounded-[7.159px] object-cover" src={imgScreenshot2612} />
      </div>
    </div>
  );
}

function MoneyChartImage({ inv }: { inv: number }) {
  return (
    <div
      className="absolute left-[40px] right-[40px] overflow-hidden rounded-[15px] shadow-[0_8px_28px_rgba(0,0,0,0.35)]"
      style={{
        top: "496px",
        transform: `translateY(${inv * 480}px)`,
      }}
    >
      <img
        src={moneyChart}
        alt="Графік доходу"
        className="block h-auto w-full rounded-[15px]"
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}

function MoneyCardsStage({ progress }: { progress: number }) {
  const inv = 1 - progress;

  return (
    <div
      className="relative mx-auto h-[1843px] w-full max-w-[440px] shrink-0"
      data-name="MoneyCardsStage"
    >
      <MoneyEyebrow />
      <MoneyTitle />

      <div className="absolute left-[22.02px] top-[118.34px] flex h-[72.573px] w-[282.363px] items-center justify-center">
        <div className="flex-none rotate-[1.91deg]">
          <Frame22 />
        </div>
      </div>

      <div
        className="absolute left-[-0.6px] top-[260.76px] flex h-[121.579px] w-[287.443px] items-center justify-center"
        style={{ transform: `translateY(${inv * 240}px)` }}
      >
        <div className="flex-none rotate-[-12.31deg]">
          <Frame16 />
        </div>
      </div>

      <div
        className="absolute left-[106px] top-[129.01px] flex h-[116.745px] w-[287.357px] items-center justify-center"
        style={{ transform: `translateY(${inv * 180}px)` }}
      >
        <div className="flex-none rotate-[-11.25deg]">
          <Frame17 />
        </div>
      </div>

      <div style={{ transform: `translateY(${inv * 300}px)` }}>
        <Frame18 />
      </div>

      <div style={{ transform: `translateY(${inv * 480}px)` }}>
        <Frame21 />
      </div>

      <div
        className="absolute left-[155px] top-[234.01px] flex h-[82.943px] w-[284.182px] items-center justify-center"
        style={{ transform: `translateY(${inv * 350}px)` }}
      >
        <div className="flex-none rotate-[-4.06deg]">
          <Frame20 />
        </div>
      </div>

      <div
        className="absolute left-[131px] top-[310.01px] flex h-[115.033px] w-[287.303px] items-center justify-center"
        style={{ transform: `translateY(${inv * 400}px)` }}
      >
        <div className="flex-none rotate-[10.88deg]">
          <Frame19 />
        </div>
      </div>

      <MoneyChartImage inv={inv} />
    </div>
  );
}

/**
 * Блок Money (`data-name="Money"`): «Дохід учнів за перший місяць» — анімація карток при скролі.
 */
export function LandingMoneySection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const viewH = window.innerHeight;
      const start = viewH;
      const end = viewH * 0.15;
      const raw = (start - rect.top) / (start - end);
      setProgress(Math.min(1, Math.max(0, raw)));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const finalH = 950;
  const startH = finalH + 480;
  const currentH = finalH + (startH - finalH) * (1 - progress);

  return (
    <section
      ref={sectionRef}
      id="section-money"
      className="relative flex w-full shrink-0 flex-col items-center pt-12"
      style={{
        height: `${currentH}px`,
        overflow: "hidden",
        background: "radial-gradient(ellipse 130% 90% at 50% 18%, rgba(var(--primary-rgb), 0.28) 0%, var(--bg-block-dark) 52%, var(--bg-block) 100%)",
      }}
      data-name="Money"
    >
      <MoneyCardsStage progress={progress} />
    </section>
  );
}
