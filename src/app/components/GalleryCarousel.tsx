import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function GalleryCarousel({ images }: { images: string[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const scrollToIndex = (index: number) => {
    if (scrollContainerRef.current) {
      const scrollWidth = scrollContainerRef.current.clientWidth;
      scrollContainerRef.current.scrollTo({
        left: scrollWidth * index,
        behavior: 'smooth'
      });
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      scrollToIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < images.length - 1) {
      scrollToIndex(currentIndex + 1);
    }
  };

  const resetAutoPlay = () => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    autoPlayRef.current = setInterval(() => {
      setCurrentIndex(prev => {
        const next = prev < images.length - 1 ? prev + 1 : 0;
        scrollToIndex(next);
        return next;
      });
    }, 3000);
  };

  useEffect(() => {
    resetAutoPlay();
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [images.length]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const width = container.clientWidth;
      const newIndex = Math.round(scrollLeft / width);
      if (newIndex !== currentIndex) {
        setCurrentIndex(newIndex);
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [currentIndex]);

  const handleManualPrev = () => {
    resetAutoPlay();
    handlePrev();
  };

  const handleManualNext = () => {
    resetAutoPlay();
    handleNext();
  };

  return (
    <div className="absolute h-[386px] left-0 top-[163.55px] w-[341.5px] flex flex-col gap-[15px]">
      {/* Image Container with CSS Snap */}
      <div 
        ref={scrollContainerRef}
        className="relative h-[298px] w-full rounded-2xl border border-[rgba(255,85,0,0.18)] flex overflow-x-auto snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <style>{`.snap-mandatory::-webkit-scrollbar { display: none; }`}</style>
        {images.map((src, idx) => (
          <div key={idx} className="relative h-full w-full flex-shrink-0 snap-center">
            <img src={src} alt={`Case ${idx + 1}`} className="absolute inset-0 w-full h-full object-cover" />
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between w-full h-[42px]">
        <button 
          onClick={handleManualPrev}
          disabled={currentIndex === 0}
          className="flex items-center justify-center w-[42px] h-[42px] rounded-xl bg-[rgba(255,255,255,0.06)] border border-[rgba(255,85,0,0.18)] transition-colors hover:bg-[rgba(255,255,255,0.1)] z-10 disabled:opacity-50"
        >
          <ChevronLeft color="white" size={20} />
        </button>

        {/* Progress Dots Area */}
        <div className="flex items-center justify-center w-[125px]">
           <div className="h-[6px] w-full bg-[rgba(255,255,255,0.18)] rounded-full overflow-hidden flex">
              <div 
                className="h-full bg-gradient-to-r from-[#f50] to-[#ff8c00] transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / images.length) * 100}%` }}
              />
           </div>
        </div>

        <button 
          onClick={handleManualNext}
          disabled={currentIndex === images.length - 1}
          className="flex items-center justify-center w-[42px] h-[42px] rounded-xl border border-[rgba(255,85,0,0.18)] shadow-[0_4px_16px_0_rgba(255,85,0,0.4)] transition-opacity hover:opacity-90 z-10 disabled:opacity-50 disabled:shadow-none"
          style={{ backgroundImage: "linear-gradient(135deg, rgb(255, 85, 0) 0%, rgb(255, 140, 0) 100%)" }}
        >
          <ChevronRight color="white" size={20} />
        </button>
      </div>

      {/* Pagination Text */}
      <p className="text-center text-[#666] text-[12px] font-semibold leading-[18px]">
        {currentIndex + 1} / {images.length}
      </p>
    </div>
  );
}