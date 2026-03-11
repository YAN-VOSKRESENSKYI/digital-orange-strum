/**
 * Generic UI icons used for navigation, actions, and feedback elements.
 */
import svgPaths from "../../../imports/svg-nu7ull5z7w";

// ─── Arrow Right (3 size variants) ───────────────────────────────────────────

/** Small arrow right (14.984px) – main CTA button */
export function ArrowRightSmIcon() {
  return (
    <div className="absolute left-[272.77px] size-[14.984px] top-[17.51px]" data-name="ArrowRight">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.984 14.984">
        <g id="ArrowRight">
          <path d="M3.12167 7.492H11.8623"  stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.56083" />
          <path d={svgPaths.pc1522f0}        stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.56083" />
        </g>
      </svg>
    </div>
  );
}

/** Medium arrow right (17.994px) – results carousel prev button */
export function ArrowRightMdIcon() {
  return (
    <div className="relative size-[17.994px]" data-name="ArrowRight">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.9943 17.9943">
        <g id="ArrowRight">
          <path d="M3.7488 8.99713H14.2455"  stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.49952" />
          <path d={svgPaths.p2ef24480}        stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.49952" />
        </g>
      </svg>
    </div>
  );
}

/** Medium arrow right v2 (17.994px, shrink-0) – results carousel next button */
export function ArrowRightMdIcon2() {
  return (
    <div className="relative shrink-0 size-[17.994px]" data-name="ArrowRight">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.9943 17.9943">
        <g id="ArrowRight">
          <path d="M3.7488 8.99713H14.2455"  stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.49952" />
          <path d={svgPaths.p2ef24480}        stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.49952" />
        </g>
      </svg>
    </div>
  );
}

// ─── Chevron Down ─────────────────────────────────────────────────────────────

/** FAQ accordion expand chevron (15.993px) – open variant */
export function ChevronDownOpenIcon() {
  return (
    <div className="relative shrink-0 size-[15.993px]" data-name="ChevronDown">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.993 15.993">
        <g id="ChevronDown">
          <path d={svgPaths.p9644080}  stroke="var(--stroke-0, #FF5500)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33275" />
        </g>
      </svg>
    </div>
  );
}

/** FAQ accordion expand chevron (15.993px) – closed/collapsed variant */
export function ChevronDownClosedIcon() {
  return (
    <div className="relative shrink-0 size-[15.993px]" data-name="ChevronDown">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.993 15.993">
        <g id="ChevronDown">
          <path d={svgPaths.p13bcc600} stroke="var(--stroke-0, #FF5500)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33275" />
        </g>
      </svg>
    </div>
  );
}

// ─── Chevron Left ─────────────────────────────────────────────────────────────

/** Chevron left (19.995px) – AI chat back button */
export function ChevronLeftIcon() {
  return (
    <div className="relative shrink-0 size-[19.995px]" data-name="ChevronLeft">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.9955 19.9955">
        <g id="ChevronLeft">
          <path d={svgPaths.p3e812370} stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.08286" />
        </g>
      </svg>
    </div>
  );
}

// ─── Check Circle ─────────────────────────────────────────────────────────────

/** Check circle (10.998px) – plan "you will do" badge */
export function CheckCircleIcon() {
  return (
    <div className="absolute left-[7.99px] size-[10.998px] top-[3.99px]" data-name="CheckCircle">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.9984 10.9984">
        <g clipPath="url(#ui-check-circle-clip)" id="CheckCircle">
          <path d={svgPaths.p3866a500} stroke="var(--stroke-0, #FF5500)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.687398" />
          <path d={svgPaths.p3867b900} stroke="var(--stroke-0, #FF5500)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.687398" />
        </g>
        <defs>
          <clipPath id="ui-check-circle-clip">
            <rect fill="white" height="10.9984" width="10.9984" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

// ─── Copy ─────────────────────────────────────────────────────────────────────

/** Copy icon small (9.832px) – AI chat copy button */
export function CopySmIcon() {
  return (
    <div className="relative shrink-0 size-[9.832px]" data-name="Copy">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.83227 9.83234">
        <g clipPath="url(#ui-copy-sm-clip)" id="Copy">
          <path d={svgPaths.p16b4ee50} stroke="var(--stroke-0, #7A7A6E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.819356" />
          <path d={svgPaths.p330c8100} stroke="var(--stroke-0, #7A7A6E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.819356" />
        </g>
        <defs>
          <clipPath id="ui-copy-sm-clip">
            <rect fill="white" height="9.83234" width="9.83227" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

/** Copy icon medium (11.991px) – AI chat copy button v2 */
export function CopyMdIcon() {
  return (
    <div className="relative shrink-0 size-[11.991px]" data-name="Copy">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.9906 11.9906">
        <g clipPath="url(#ui-copy-md-clip)" id="Copy">
          <path d={svgPaths.p3f70ae40} stroke="var(--stroke-0, #7A7A6E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.999214" />
          <path d={svgPaths.p3bc9cd80} stroke="var(--stroke-0, #7A7A6E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.999214" />
        </g>
        <defs>
          <clipPath id="ui-copy-md-clip">
            <rect fill="white" height="11.9906" width="11.9906" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

// ─── Rotate CCW ───────────────────────────────────────────────────────────────

/** Rotate counter-clockwise (9.832px) – AI chat refresh button */
export function RotateCcwIcon() {
  return (
    <div className="relative shrink-0 size-[9.832px]" data-name="RotateCcw">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.83225 9.83234">
        <g clipPath="url(#ui-rotate-clip)" id="RotateCcw">
          <path d={svgPaths.p1ba77a80} stroke="var(--stroke-0, #7A7A6E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.819354" />
          <path d={svgPaths.p24198d00} stroke="var(--stroke-0, #7A7A6E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.819354" />
        </g>
        <defs>
          <clipPath id="ui-rotate-clip">
            <rect fill="white" height="9.83234" width="9.83225" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

// ─── Thumbs ───────────────────────────────────────────────────────────────────

/** Thumbs up (10.66px) */
export function ThumbsUpIcon() {
  return (
    <div className="relative shrink-0 size-[10.66px]" data-name="ThumbsUp">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.6597 10.6597">
        <g clipPath="url(#ui-thumbsup-clip)" id="ThumbsUp">
          <path d="M3.10908 4.44152V9.77135"  stroke="var(--stroke-0, #7A7A6E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.888305" />
          <path d={svgPaths.p200a8180}         stroke="var(--stroke-0, #7A7A6E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.888305" />
        </g>
        <defs>
          <clipPath id="ui-thumbsup-clip">
            <rect fill="white" height="10.6597" width="10.6597" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

/** Thumbs down (10.66px) */
export function ThumbsDownIcon() {
  return (
    <div className="relative shrink-0 size-[10.66px]" data-name="ThumbsDown">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.6597 10.6597">
        <g clipPath="url(#ui-thumbsdown-clip)" id="ThumbsDown">
          <path d="M7.55061 6.21813V0.888305" stroke="var(--stroke-0, #7A7A6E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.888305" />
          <path d={svgPaths.p14c47e00}         stroke="var(--stroke-0, #7A7A6E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.888305" />
        </g>
        <defs>
          <clipPath id="ui-thumbsdown-clip">
            <rect fill="white" height="10.6597" width="10.6597" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

// ─── Microphone ───────────────────────────────────────────────────────────────

/** Mic small (12.287px) – AI chat send button */
export function MicSmIcon() {
  return (
    <div className="relative shrink-0 size-[12.287px]" data-name="Mic">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12.2869 12.2869">
        <g id="Mic">
          <path d={svgPaths.p2bcf4d00}            stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.02391" />
          <path d={svgPaths.p37676800}            stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.02391" />
          <path d="M6.14344 9.72712V11.263"       stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.02391" />
        </g>
      </svg>
    </div>
  );
}

/** Mic medium (14.984px) – AI chat send button v2 */
export function MicMdIcon() {
  return (
    <div className="relative shrink-0 size-[14.984px]" data-name="Mic">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.984 14.984">
        <g clipPath="url(#ui-mic-md-clip)" id="Mic">
          <path d={svgPaths.p11f45500}            stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.24867" />
          <path d={svgPaths.p1997af80}            stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.24867" />
          <path d="M7.492 11.8623V13.7353"        stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.24867" />
        </g>
        <defs>
          <clipPath id="ui-mic-md-clip">
            <rect fill="white" height="14.984" width="14.984" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

// ─── Shield Check ─────────────────────────────────────────────────────────────

/** Shield with checkmark (13.992px) – guarantee/CTA section */
export function ShieldCheckIcon() {
  return (
    <div className="relative shrink-0 size-[13.992px]" data-name="ShieldCheck">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.9918 13.9918">
        <g clipPath="url(#ui-shield-clip)" id="ShieldCheck">
          <path d={svgPaths.p30cf4980} stroke="var(--stroke-0, #FF5500)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.874488" />
          <path d={svgPaths.p1a680600} stroke="var(--stroke-0, #FF5500)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.874488" />
        </g>
        <defs>
          <clipPath id="ui-shield-clip">
            <rect fill="white" height="13.9918" width="13.9918" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}
