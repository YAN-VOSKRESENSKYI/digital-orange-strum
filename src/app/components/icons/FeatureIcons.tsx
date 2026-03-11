/**
 * Orange feature/section icons used throughout the landing page.
 * All icons use the svgPaths lookup table from the Figma import.
 */
import svgPaths from "../../../imports/svg-nu7ull5z7w";

const STROKE = "var(--stroke-0, #FF5500)";

// ─── 14.984px icons (hero badge area) ────────────────────────────────────────

/** Live support / people icon (14.984px) */
export function SupportIcon() {
  return (
    <div className="relative shrink-0 size-[14.984px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.984 14.984">
        <g clipPath="url(#feat-support-clip)" id="Icon">
          <path d={svgPaths.p35921780} stroke={STROKE} strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.936501" />
          <path d={svgPaths.p105dbf00} stroke={STROKE} strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.936501" />
          <path d={svgPaths.p20664b80} stroke={STROKE} strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.936501" />
          <path d={svgPaths.p3d8e000}  stroke={STROKE} strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.936501" />
        </g>
        <defs><clipPath id="feat-support-clip"><rect fill="white" height="14.984" width="14.984" /></clipPath></defs>
      </svg>
    </div>
  );
}

/** Chat / Q&A session icon (14.984px) */
export function QAIcon() {
  return (
    <div className="relative shrink-0 size-[14.984px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.984 14.984">
        <g clipPath="url(#feat-qa-clip)" id="Icon">
          <path d={svgPaths.p2358ee80} stroke={STROKE} strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.936501" />
        </g>
        <defs><clipPath id="feat-qa-clip"><rect fill="white" height="14.984" width="14.984" /></clipPath></defs>
      </svg>
    </div>
  );
}

/** AI module / circuit icon (14.984px) */
export function AIModuleSmIcon() {
  return (
    <div className="relative shrink-0 size-[14.984px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.984 14.984">
        <g clipPath="url(#feat-aimod-sm-clip)" id="Icon">
          <path d={svgPaths.p2357c600}                              stroke={STROKE} strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.936501" />
          <path d={svgPaths.p1c39e480}                              stroke={STROKE} strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.936501" />
          <path d="M9.365 1.24867V2.49733"                          stroke={STROKE} strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.936501" />
          <path d="M9.365 12.4867V13.7353"                         stroke={STROKE} strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.936501" />
          <path d="M1.24867 9.365H2.49733"                          stroke={STROKE} strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.936501" />
          <path d="M1.24867 5.619H2.49733"                          stroke={STROKE} strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.936501" />
          <path d="M12.4867 9.365H13.7353"                         stroke={STROKE} strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.936501" />
          <path d="M12.4867 5.619H13.7353"                         stroke={STROKE} strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.936501" />
          <path d="M5.619 1.24867V2.49733"                          stroke={STROKE} strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.936501" />
          <path d="M5.619 12.4867V13.7353"                         stroke={STROKE} strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.936501" />
        </g>
        <defs><clipPath id="feat-aimod-sm-clip"><rect fill="white" height="14.984" width="14.984" /></clipPath></defs>
      </svg>
    </div>
  );
}

// ─── 19.995px icons (card sections) ──────────────────────────────────────────

/** Lightning / fire bolt icon – "For whom" card 1 */
export function FlashIcon() {
  return (
    <div className="relative shrink-0 size-[19.995px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.9955 19.9955">
        <g id="Icon">
          <path d={svgPaths.p31ba8500} stroke={STROKE} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.24972" />
        </g>
      </svg>
    </div>
  );
}

/** Layers / graduation – "For whom" card 2 */
export function LayersIcon() {
  return (
    <div className="relative shrink-0 size-[19.995px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.9955 19.9955">
        <g id="Icon">
          <path d={svgPaths.p2333d900} stroke={STROKE} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.24972" />
          <path d={svgPaths.p12f76390} stroke={STROKE} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.24972" />
          <path d={svgPaths.pbb52528}  stroke={STROKE} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.24972" />
        </g>
      </svg>
    </div>
  );
}

/** Bar chart – "For whom" card 3 */
export function BarChartIcon() {
  return (
    <div className="relative shrink-0 size-[19.995px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.9955 19.9955">
        <g id="Icon">
          <path d="M14.9966 16.6629V8.33146" stroke={STROKE} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.24972" />
          <path d="M9.99775 16.6629V3.33258" stroke={STROKE} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.24972" />
          <path d="M4.99887 16.6629V11.664" stroke={STROKE}  strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.24972" />
        </g>
      </svg>
    </div>
  );
}

/** Fire / flame – "For whom" CTA card */
export function FlameIcon() {
  return (
    <div className="relative shrink-0 size-[19.995px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.9955 19.9955">
        <g id="Icon">
          <path d={svgPaths.p397bf7c0} stroke={STROKE} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.24972" />
        </g>
      </svg>
    </div>
  );
}

/** Trend arrow up – author stat 1 */
export function TrendArrowsIcon() {
  return (
    <div className="relative shrink-0 size-[19.995px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.9955 19.9955">
        <g id="Icon">
          <path d={svgPaths.p36efdf00} stroke={STROKE} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.24972" />
          <path d={svgPaths.p39f46500} stroke={STROKE} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.24972" />
        </g>
      </svg>
    </div>
  );
}

/** Users / group – author stat 2 */
export function UsersGroupIcon() {
  return (
    <div className="relative shrink-0 size-[19.995px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.9955 19.9955">
        <g id="Icon">
          <path d={svgPaths.p25f98a80} stroke={STROKE} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.24972" />
          <path d={svgPaths.p24390400} stroke={STROKE} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.24972" />
          <path d={svgPaths.p12bcdc00} stroke={STROKE} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.24972" />
          <path d={svgPaths.p1977c580} stroke={STROKE} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.24972" />
        </g>
      </svg>
    </div>
  );
}

/** Target / medal – author stat 3 */
export function TargetIcon() {
  return (
    <div className="relative shrink-0 size-[19.995px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.9955 19.9955">
        <g id="Icon">
          <path d={svgPaths.pffc6500}   stroke={STROKE} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.24972" />
          <path d={svgPaths.p10283bf0}  stroke={STROKE} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.24972" />
        </g>
      </svg>
    </div>
  );
}

/** Book / globe circles – course content header */
export function BookCircleIcon() {
  return (
    <div className="relative shrink-0 size-[19.995px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.9955 19.9955">
        <g id="Icon">
          <path d={svgPaths.p28b05f00} stroke={STROKE} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.24972" />
          <path d={svgPaths.p2a66c880} stroke={STROKE} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.24972" />
          <path d={svgPaths.pf579300}  stroke={STROKE} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.24972" />
        </g>
      </svg>
    </div>
  );
}

/** Plus / vertical arrow – course feature: step-by-step path */
export function PlusVerticalIcon() {
  return (
    <div className="relative shrink-0 size-[19.995px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.9955 19.9955">
        <g id="Icon">
          <path d="M9.99775 5.83202V17.4961" stroke={STROKE} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.24972" />
          <path d={svgPaths.pa5fee00}        stroke={STROKE} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.24972" />
        </g>
      </svg>
    </div>
  );
}

/** AI calendar / circuit grid – course feature: AI module */
export function AICalendarIcon() {
  return (
    <div className="relative shrink-0 size-[19.995px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.9955 19.9955">
        <g id="Icon">
          <path d={svgPaths.p1d44a40}              stroke={STROKE} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.24972" />
          <path d={svgPaths.p1a827c00}              stroke={STROKE} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.24972" />
          <path d="M12.4972 1.66629V3.33258"        stroke={STROKE} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.24972" />
          <path d="M12.4972 16.6629V18.3292"        stroke={STROKE} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.24972" />
          <path d="M1.66629 12.4972H3.33258"        stroke={STROKE} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.24972" />
          <path d="M1.66629 7.49831H3.33258"        stroke={STROKE} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.24972" />
          <path d="M16.6629 12.4972H18.3292"        stroke={STROKE} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.24972" />
          <path d="M16.6629 7.49831H18.3292"        stroke={STROKE} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.24972" />
          <path d="M7.49831 1.66629V3.33258"        stroke={STROKE} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.24972" />
          <path d="M7.49831 16.6629V18.3292"        stroke={STROKE} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.24972" />
        </g>
      </svg>
    </div>
  );
}

/** Chat bubble – course feature: curator support */
export function ChatBubbleIcon() {
  return (
    <div className="relative shrink-0 size-[19.995px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.9955 19.9955">
        <g id="Icon">
          <path d={svgPaths.p18031600} stroke={STROKE} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.24972" />
        </g>
      </svg>
    </div>
  );
}

/** Lock / rectangle – transformation: content freedom */
export function LockRectIcon() {
  return (
    <div className="relative shrink-0 size-[19.995px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.9955 19.9955">
        <g id="Icon">
          <path d={svgPaths.p39b14280} stroke={STROKE} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.24972" />
          <path d={svgPaths.p33fd9b80} stroke={STROKE} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.24972" />
        </g>
      </svg>
    </div>
  );
}

/** Bar chart (md) – transformation: income chart */
export function BarChartMdIcon() {
  return (
    <div className="relative shrink-0 size-[19.995px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.9955 19.9955">
        <g id="Icon">
          <path d="M14.9966 16.6629V8.33146" stroke={STROKE} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.24972" />
          <path d="M9.99775 16.6629V3.33258" stroke={STROKE} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.24972" />
          <path d="M4.99887 16.6629V11.664" stroke={STROKE}  strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.24972" />
        </g>
      </svg>
    </div>
  );
}

/** Medal / target (transformation: player status) */
export function TargetMdIcon() {
  return (
    <div className="relative shrink-0 size-[19.995px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.9955 19.9955">
        <g id="Icon">
          <path d={svgPaths.pffc6500}  stroke={STROKE} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.24972" />
          <path d={svgPaths.p10283bf0} stroke={STROKE} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.24972" />
        </g>
      </svg>
    </div>
  );
}

// ─── 15.993px icons (results/stats section) ───────────────────────────────────

/** Trend line with dots – results stats */
export function TrendLineIcon() {
  return (
    <div className="relative shrink-0 size-[15.993px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.993 15.993">
        <g clipPath="url(#feat-trendline-clip)" id="Icon">
          <path d={svgPaths.p310ac580} stroke={STROKE} strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.999565" />
          <path d={svgPaths.p8a0ca00}  stroke={STROKE} strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.999565" />
        </g>
        <defs><clipPath id="feat-trendline-clip"><rect fill="white" height="15.993" width="15.993" /></clipPath></defs>
      </svg>
    </div>
  );
}

/** Funnel / star rating – results stats */
export function FunnelIcon() {
  return (
    <div className="relative shrink-0 size-[15.993px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.993 15.993">
        <g clipPath="url(#feat-funnel-clip)" id="Icon">
          <path d={svgPaths.p2f6dca00} stroke={STROKE} strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.999565" />
          <path d={svgPaths.p2f707d00} stroke={STROKE} strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.999565" />
        </g>
        <defs><clipPath id="feat-funnel-clip"><rect fill="white" height="15.993" width="15.993" /></clipPath></defs>
      </svg>
    </div>
  );
}

/** People / user (results stats – clients) */
export function UsersMdIcon() {
  return (
    <div className="relative shrink-0 size-[15.993px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.993 15.993">
        <g clipPath="url(#feat-usersmd-clip)" id="Icon">
          <path d={svgPaths.p3c477c00} stroke={STROKE} strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.999565" />
          <path d={svgPaths.p20e6bc00} stroke={STROKE} strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.999565" />
        </g>
        <defs><clipPath id="feat-usersmd-clip"><rect fill="white" height="15.993" width="15.993" /></clipPath></defs>
      </svg>
    </div>
  );
}

/** Bar chart sm – results stats (income) */
export function BarChartSmIcon() {
  return (
    <div className="relative shrink-0 size-[15.993px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.993 15.993">
        <g id="Icon">
          <path d="M11.9948 13.3275V6.66376" stroke={STROKE} strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.999565" />
          <path d="M7.99652 13.3275V2.66551" stroke={STROKE} strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.999565" />
          <path d="M3.99826 13.3275V9.32927" stroke={STROKE} strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.999565" />
        </g>
      </svg>
    </div>
  );
}

/** Clock / timer – guarantee section */
export function ClockIcon() {
  return (
    <div className="relative shrink-0 size-[15.993px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.993 15.993">
        <g clipPath="url(#feat-clock-clip)" id="Icon">
          <path d={svgPaths.p180ea280} stroke={STROKE} strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.999565" />
          <path d={svgPaths.pe2a12c0}  stroke={STROKE} strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.999565" />
        </g>
        <defs><clipPath id="feat-clock-clip"><rect fill="white" height="15.993" width="15.993" /></clipPath></defs>
      </svg>
    </div>
  );
}

// ─── 17.994px icons (step-plan section) ──────────────────────────────────────

/** Globe / target circle – step plan module icon */
export function GlobeIcon() {
  return (
    <div className="relative shrink-0 size-[17.994px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.9943 17.9943">
        <g clipPath="url(#feat-globe-clip)" id="Icon">
          <path d={svgPaths.p37f66a00} stroke={STROKE} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.12464" />
          <path d={svgPaths.p34169100} stroke={STROKE} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.12464" />
        </g>
        <defs><clipPath id="feat-globe-clip"><rect fill="white" height="17.9943" width="17.9943" /></clipPath></defs>
      </svg>
    </div>
  );
}

/** Stack layers – step plan module icon */
export function StackLayersIcon() {
  return (
    <div className="relative shrink-0 size-[17.994px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.9943 17.9943">
        <g clipPath="url(#feat-stack-clip)" id="Icon">
          <path d={svgPaths.p2141ae00} stroke={STROKE} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.12464" />
          <path d={svgPaths.p1abb5b40} stroke={STROKE} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.12464" />
        </g>
        <defs><clipPath id="feat-stack-clip"><rect fill="white" height="17.9943" width="17.9943" /></clipPath></defs>
      </svg>
    </div>
  );
}

/** Trend chart (md) – step plan module icon */
export function TrendChartMdIcon() {
  return (
    <div className="relative shrink-0 size-[17.994px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.9943 17.9943">
        <g clipPath="url(#feat-trend-md-clip)" id="Icon">
          <path d={svgPaths.p33d50240} stroke={STROKE} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.12464" />
          <path d={svgPaths.p223bc780} stroke={STROKE} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.12464" />
        </g>
        <defs><clipPath id="feat-trend-md-clip"><rect fill="white" height="17.9943" width="17.9943" /></clipPath></defs>
      </svg>
    </div>
  );
}

/** Bar chart (md) – step plan module icon */
export function BarChartPlanIcon() {
  return (
    <div className="relative shrink-0 size-[17.994px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.9943 17.9943">
        <g id="Icon">
          <path d="M13.4957 14.9952V7.49761" stroke={STROKE} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.12464" />
          <path d="M8.99713 14.9952V2.99904" stroke={STROKE} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.12464" />
          <path d="M4.49857 14.9952V10.4967" stroke={STROKE} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.12464" />
        </g>
      </svg>
    </div>
  );
}

/** Star rating – step plan final module (white stroke) */
export function StarRatingIcon() {
  return (
    <div className="relative shrink-0 size-[17.994px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.9943 17.9943">
        <g clipPath="url(#feat-star-clip)" id="Icon">
          <path d={svgPaths.p2503b780} stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.12464" />
        </g>
        <defs><clipPath id="feat-star-clip"><rect fill="white" height="17.9943" width="17.9943" /></clipPath></defs>
      </svg>
    </div>
  );
}

// ─── 21.997px icons ───────────────────────────────────────────────────────────

/** Shield with checkmark – guarantee section */
export function GuaranteeShieldIcon() {
  return (
    <div className="relative shrink-0 size-[21.997px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21.9967 21.9967">
        <g id="Icon">
          <path d={svgPaths.p3d3aaa00} stroke={STROKE} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3748" />
          <path d={svgPaths.p2597fc00} stroke={STROKE} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3748" />
        </g>
      </svg>
    </div>
  );
}
