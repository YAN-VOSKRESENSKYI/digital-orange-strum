const fs = require('fs');
const path = 'src/imports/VLob1.tsx';
let src = fs.readFileSync(path, 'utf8');

// ─── CHANGE 1: Replace Section8 card components with comparison table ───

// Find start of Icon23 (first card icon in old Section8)
const startMarker = 'function Icon23() {';
const idxStart = src.indexOf(startMarker);
if (idxStart === -1) { console.error('Cannot find Icon23'); process.exit(1); }

// Find end of Section8 function - the closing brace after "Section8"
const section8FuncStart = 'function Section8() {';
const idxSection8 = src.indexOf(section8FuncStart);
if (idxSection8 === -1) { console.error('Cannot find Section8'); process.exit(1); }

// Find the closing brace of Section8 - look for 2 closing braces after Section8
let braceCount = 0;
let endOfSection8 = -1;
for (let i = idxSection8; i < src.length; i++) {
  if (src[i] === '{') braceCount++;
  else if (src[i] === '}') {
    braceCount--;
    if (braceCount === 0) {
      endOfSection8 = i + 1;
      break;
    }
  }
}
if (endOfSection8 === -1) { console.error('Cannot find end of Section8'); process.exit(1); }

console.log('Section8 spans chars', idxStart, '-', endOfSection8);

const newSection8 = `const comparisonData = [
  {
    now: "Дохід напряму залежить від того скільки годин ти працюєш цього тижня.",
    after: "Міні-курс продається автоматично поки ти займаєшся іншими справами."
  },
  {
    now: "Клієнт пише о 23:00 і ти відповідаєш, бо незручно відмовити.",
    after: "Ти можеш собі дозволити вибирати з ким і коли працювати."
  },
  {
    now: "Щомісяця шукаєш нових клієнтів, доводиш свою цінність, торгуєшся.",
    after: "Реклама приводить людей в курс сама, поки ти спиш."
  },
  {
    now: "Ти «SMM-ник» або «монтажер». Продаєш свій час.",
    after: "Ти автор продукту. Твоя цінність в знаннях, а не навичках."
  }
];

function ComparisonTable() {
  return (
    <div className="relative w-[341.487px] flex flex-col gap-[15px] pt-[20px]" data-name="ComparisonTable">
      <div className="flex gap-[10px] w-full mb-[8px]">
        <div className="flex-1 flex justify-center pb-2 border-b border-[rgba(var(--primary-rgb),0.3)]">
          <p className="font-['Unbounded:Bold',sans-serif] font-bold text-[12px] text-[#999] uppercase tracking-wider">Тепер</p>
        </div>
        <div className="flex-1 flex justify-center pb-2 border-b border-[var(--primary-color)]">
          <p className="font-['Unbounded:Bold',sans-serif] font-bold text-[12px] text-[var(--primary-color)] uppercase tracking-wider">Після курсу</p>
        </div>
      </div>
      {comparisonData.map((item, idx) => (
        <div key={idx} className="flex gap-[10px] w-full">
          <div className="flex-1 flex flex-col gap-2 p-[15px] bg-[var(--bg-block)] border border-[rgba(var(--primary-rgb),0.15)] rounded-[14px]">
            <div className="shrink-0 size-[28px] rounded-[10px] bg-[rgba(255,100,100,0.08)] border border-[rgba(255,100,100,0.15)] flex items-center justify-center">
              <svg className="size-[14px] text-[#ff5c5c]" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </div>
            <p className="font-['Manrope:Regular',sans-serif] font-normal leading-[1.4] text-[12px] text-[#a6a6a6] pr-1">{item.now}</p>
          </div>
          <div className="flex-1 flex flex-col gap-2 p-[15px] bg-[rgba(var(--primary-rgb),0.05)] border border-[rgba(var(--primary-rgb),0.25)] rounded-[14px]">
            <div className="shrink-0 size-[28px] rounded-[10px] bg-[rgba(var(--primary-rgb),0.15)] flex items-center justify-center">
              <svg className="size-[16px] text-[var(--primary-color)]" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <p className="font-['Manrope:Medium',sans-serif] font-medium leading-[1.4] text-[12px] text-white pr-1">{item.after}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function Div31() {
  return (
    <div className="relative mx-auto w-[341.487px] h-auto flex flex-col pt-[40px] pb-[20px]" data-name="div">
      <div className="relative h-[80px]">
        <Container202 />
        <H8 />
      </div>
      <ComparisonTable />
    </div>
  );
}

function Section8() {
  return (
    <div id="section8" className="bg-[var(--bg-block-dark)] min-h-[572px] h-auto pb-[60px] overflow-clip relative shrink-0 w-full" data-name="section">
      <div className="b-only-spot absolute blur-[130px] rounded-full size-[420px] top-[100px] right-[-120px]" style={{ background: "rgba(var(--spot-rgb),0.22)" }} />
      <div className="b-only-spot absolute blur-[110px] rounded-full size-[300px] top-[350px] left-[-80px]" style={{ background: "rgba(var(--primary-rgb),0.18)" }} />
      <Div30 />
      <Div31 />
    </div>
  );
}
`;

src = src.slice(0, idxStart) + newSection8 + '\n' + src.slice(endOfSection8 + 1);
console.log('Change 1 (Section8 comparison table): OK');

// ─── CHANGE 2: Add SectionPrinciples ───

const principlesBlock = `
const principlesData = [
  {
    num: "01",
    title: "Спочатку попит, потім продукт",
    text: "Записувати курс до перевірки попиту — це спосіб витратити місяць роботи на продукт, який ніхто не купить. Тут спочатку дізнаєшся чи платять за ідею, і тільки тоді береш мікрофон."
  },
  {
    num: "02",
    title: "Реклама замість аудиторії",
    text: "Система не вимагає підписників. Вона вимагає оффер, який продає в рекламі. Цьому і вчать ці 5 днів: від формулювання до першого запуску трафіку."
  },
  {
    num: "03",
    title: "Міні-формат як точка входу",
    text: "Великий курс — це пастка для початківця. Спочатку міні-продукт: швидко записати, легко продати, реально масштабувати. Модель дає перші гроші до того, як настає вигорання."
  },
  {
    num: "04",
    title: "Алгоритм замість натхнення",
    text: "Кожен крок тут — це конкретний алгоритм. Є 3 критерії перевірки ніші. Є формула оффера з прикладами. А натхнення прийде після першої оплати."
  }
];

function SectionPrinciples() {
  return (
    <div className="bg-[var(--bg-block-dark)] h-auto overflow-clip relative shrink-0 w-full pb-[60px]" data-name="section-principles">
      <div className="b-only-spot absolute blur-[130px] rounded-full size-[400px] top-[-80px] left-[-120px]" style={{ background: "rgba(var(--spot-rgb),0.18)" }} />
      <div className="b-only-spot absolute blur-[100px] rounded-full size-[300px] bottom-0 right-[-80px]" style={{ background: "rgba(var(--primary-rgb),0.15)" }} />
      <div className="relative mx-auto w-[341.487px] flex flex-col pt-[40px]">
        <div className="flex gap-[7.988px] items-center justify-center mb-[36px]">
          <div className="bg-gradient-to-r flex-1 from-[rgba(0,0,0,0)] h-[0.992px] to-[var(--primary-color)]" />
          <p className="font-['Manrope:Bold',sans-serif] font-bold text-[10px] text-[var(--primary-color)] tracking-[3px] uppercase whitespace-nowrap">Система</p>
          <div className="bg-gradient-to-l flex-1 from-[rgba(0,0,0,0)] h-[0.992px] to-[var(--primary-color)]" />
        </div>
        <div className="mb-[32px]">
          <p className="font-['Unbounded:ExtraBold',sans-serif] font-extrabold leading-[1.15] text-[22px] text-center text-white tracking-[-0.5px] uppercase">4 принципи, на яких стоїть ця система</p>
        </div>
        <div className="flex flex-col w-full">
          {principlesData.map((item, idx) => (
            <div key={idx}>
              <div className="flex gap-[16px] items-start py-[22px]">
                <span
                  className="font-['Unbounded:Black',sans-serif] font-black text-[28px] leading-[1] shrink-0 w-[44px] text-right"
                  style={{ WebkitTextStroke: "1.5px var(--primary-color)", color: "transparent" }}
                >
                  {item.num}
                </span>
                <div className="flex flex-col gap-[6px] flex-1">
                  <p className="font-['Manrope:ExtraBold',sans-serif] font-extrabold text-[15px] leading-[1.3] text-white">{item.title}</p>
                  <p className="font-['Manrope:Regular',sans-serif] font-normal text-[13px] leading-[1.55] text-[#a0a0a0]">{item.text}</p>
                </div>
              </div>
              {idx < principlesData.length - 1 && (
                <div className="h-[1px] w-full" style={{ background: "linear-gradient(90deg, rgba(var(--primary-rgb),0.05) 0%, rgba(var(--primary-rgb),0.3) 50%, rgba(var(--primary-rgb),0.05) 100%)" }} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

`;

// Insert before "function Div32()"
const div32Marker = 'function Div32() {';
const idxDiv32 = src.indexOf(div32Marker);
if (idxDiv32 === -1) { console.error('Cannot find Div32'); process.exit(1); }
src = src.slice(0, idxDiv32) + principlesBlock + src.slice(idxDiv32);
console.log('Change 2a (SectionPrinciples definition): OK');

// Insert SectionPrinciples as 2nd in Div1
// search for the line with <Section1 /> and insert before it
const div1Pattern = '      <Section />';
const idxDiv1 = src.lastIndexOf(div1Pattern);
if (idxDiv1 === -1) { console.error('Cannot find Section in Div1'); process.exit(1); }
// find the newline after "<Section />"
const afterSection = idxDiv1 + div1Pattern.length;
src = src.slice(0, afterSection) + '\n      <SectionPrinciples />' + src.slice(afterSection);
console.log('Change 2b (SectionPrinciples in Div1): OK');

fs.writeFileSync(path, src, 'utf8');
const lineCount = src.split('\n').length;
console.log('All done! Total lines:', lineCount);
