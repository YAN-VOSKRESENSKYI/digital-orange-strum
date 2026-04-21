const fs = require('fs');
const path = 'src/imports/VLob1.tsx';
let content = fs.readFileSync(path, 'utf8').split('\n');

const newContent = `
const comparisonData = [
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
        <div key={idx} className="flex gap-[10px] w-full stretch">
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
}`;

const startIndex = content.findIndex(line => line.startsWith('function Icon23() {'));
let actualEndIndex = -1;
if (startIndex !== -1) {
  for (let i = startIndex; i < content.length; i++) {
    if (content[i].startsWith('function Section8() {')) {
      for (let j = i; j < content.length; j++) {
        if (content[j].startsWith('}')) {
          actualEndIndex = j;
          break;
        }
      }
      break;
    }
  }
}

if (startIndex !== -1 && actualEndIndex !== -1) {
  content.splice(startIndex, actualEndIndex - startIndex + 1, ...newContent.split('\n'));
  fs.writeFileSync(path, content.join('\n'), 'utf8');
  console.log('Successfully replaced code array components.');
} else {
  console.log('Failed to find start or end index:', startIndex, actualEndIndex);
}
