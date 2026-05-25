import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function HeroCarousel({
  slides = [],
  autoPlay = true,
  interval = 4000,
  height = "h-[390px]",
  rounded = "rounded-[32px]",
  overlay = "from-slate-950/75 via-slate-900/10 to-transparent",
}) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const goNext = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const goPrev = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    if (!autoPlay || paused || slides.length <= 1) return;

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, paused, interval, slides.length]);

  if (!slides.length) return null;

  return (
    <div
      className={`group relative overflow-hidden border border-white/70 bg-white/90 shadow-2xl shadow-emerald-100/40 ${rounded}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className={`relative ${height}`}>
        {slides.map((slide, index) => {
          const active = index === current;

          return (
            <div
              key={`${slide.title}-${index}`}
              className={`absolute inset-0 transition-all duration-700 ${
                active
                  ? "pointer-events-auto opacity-100 scale-100"
                  : "pointer-events-none opacity-0 scale-[1.03]"
              }`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="h-full w-full object-cover"
              />

              <div className={`absolute inset-0 bg-gradient-to-t ${overlay}`} />

              {slide.badge && (
                <div className="absolute left-5 top-5 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-emerald-700">
                  {slide.badge}
                </div>
              )}

              <div className="absolute bottom-5 left-5 right-5">
                {slide.kicker && (
                  <div className="text-sm text-white/80">{slide.kicker}</div>
                )}
                <div className="mt-2 text-2xl font-bold leading-tight text-white md:text-3xl">
                  {slide.title}
                </div>
                {slide.desc && (
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-white/85 md:text-base">
                    {slide.desc}
                  </p>
                )}
              </div>
            </div>
          );
        })}

        {slides.length > 1 && (
          <>
            <button
              onClick={goPrev}
              className="absolute left-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-slate-700 shadow-lg transition hover:bg-white"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <button
              onClick={goNext}
              className="absolute right-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-slate-700 shadow-lg transition hover:bg-white"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full bg-slate-950/25 px-3 py-2 backdrop-blur">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`h-2.5 rounded-full transition-all ${
                index === current ? "w-8 bg-white" : "w-2.5 bg-white/50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}