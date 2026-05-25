import { useState } from "react";
import { ChevronLeft, ChevronRight, GraduationCap } from "lucide-react";

export default function TeacherCarousel({ lecturers = [] }) {
  const [activeLecturer, setActiveLecturer] = useState(0);

  if (!lecturers.length) return null;

  const totalLecturers = lecturers.length;
  const currentLecturer = lecturers[activeLecturer];

  const handlePrevLecturer = () => {
    setActiveLecturer((prev) => (prev - 1 + totalLecturers) % totalLecturers);
  };

  const handleNextLecturer = () => {
    setActiveLecturer((prev) => (prev + 1) % totalLecturers);
  };

  const getLecturerOffset = (index) => {
    const diff = (index - activeLecturer + totalLecturers) % totalLecturers;

    if (diff === 0) return 0;
    if (diff === 1) return 1;
    if (diff === totalLecturers - 1) return -1;

    return 99;
  };

  const getLecturerLayout = (offset) => {
    if (offset === 0) {
      return {
        wrapper:
          "left-1/2 z-30 h-[230px] w-[170px] -translate-x-1/2 md:h-[290px] md:w-[215px] xl:h-[330px] xl:w-[245px]",
        image: "scale-100 opacity-100 grayscale-0",
        ring: "ring-2 ring-white/70",
      };
    }

    if (offset === -1) {
      return {
        wrapper:
          "left-[27%] z-20 h-[175px] w-[125px] -translate-x-1/2 md:left-[30%] md:h-[225px] md:w-[165px] xl:left-[32%] xl:h-[255px] xl:w-[185px]",
        image: "scale-90 opacity-70 grayscale",
        ring: "",
      };
    }

    if (offset === 1) {
      return {
        wrapper:
          "left-[73%] z-20 h-[175px] w-[125px] -translate-x-1/2 md:left-[70%] md:h-[225px] md:w-[165px] xl:left-[68%] xl:h-[255px] xl:w-[185px]",
        image: "scale-90 opacity-70 grayscale",
        ring: "",
      };
    }

    return {
      wrapper: "pointer-events-none left-1/2 z-0 h-0 w-0 opacity-0",
      image: "",
      ring: "",
    };
  };

  return (
    <section className="mt-10">
      <div className="mb-4">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
          Đội ngũ giảng viên
        </h2>
        <p className="mt-1.5 text-sm md:text-base text-slate-600">
          Đội ngũ chuyên môn đồng hành cùng học sinh trong suốt quá trình học tập.
        </p>
      </div>

      <div className="overflow-hidden rounded-[28px] border border-emerald-100 bg-gradient-to-br from-white via-emerald-50/60 to-cyan-50/60 px-3 py-4 shadow-sm md:px-5 md:py-5">
        <div className="relative mx-auto max-w-5xl">
          <button
            type="button"
            onClick={handlePrevLecturer}
            aria-label="Giảng viên trước"
            className="absolute left-0 top-[42%] z-40 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-white/90 text-slate-700 shadow-md backdrop-blur transition hover:scale-105 hover:bg-white md:left-2 md:h-10 md:w-10"
          >
            <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
          </button>

          <button
            type="button"
            onClick={handleNextLecturer}
            aria-label="Giảng viên tiếp theo"
            className="absolute right-0 top-[42%] z-40 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-white/90 text-slate-700 shadow-md backdrop-blur transition hover:scale-105 hover:bg-white md:right-2 md:h-10 md:w-10"
          >
            <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
          </button>

          <div className="relative h-[250px] overflow-hidden md:h-[315px] xl:h-[355px]">
            {lecturers.map((item, index) => {
              const offset = getLecturerOffset(index);
              const layout = getLecturerLayout(offset);

              return (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => setActiveLecturer(index)}
                  className={`absolute top-1/2 -translate-y-1/2 transition-all duration-500 ease-out ${layout.wrapper}`}
                >
                  <div
                    className={`relative h-full w-full overflow-hidden rounded-[24px] border border-white/70 bg-white shadow-[0_14px_40px_rgba(15,23,42,0.14)] transition-all duration-500 ${layout.ring}`}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className={`h-full w-full object-cover transition duration-700 ${layout.image}`}
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-900/10 to-transparent" />

                    <div
                      className={`absolute left-3 top-3 rounded-full bg-gradient-to-r px-2.5 py-1 text-[10px] md:text-xs font-semibold text-white shadow-sm ${item.accent}`}
                    >
                      {item.badge}
                    </div>

                    <div className="absolute bottom-3 left-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] md:text-xs font-semibold text-slate-800 shadow-sm backdrop-blur">
                      {item.prefix}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-3 rounded-2xl border border-white/70 bg-white/80 px-4 py-3 shadow-sm backdrop-blur">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
              <div className="text-center xl:text-left">
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                  <GraduationCap className="h-3.5 w-3.5" />
                  Giảng viên nổi bật
                </div>

                <h3 className="mt-2 text-lg md:text-xl xl:text-2xl font-bold text-slate-900">
                  {currentLecturer.name}
                </h3>

                <p className="mt-1 text-[11px] md:text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                  {currentLecturer.role}
                </p>
              </div>

              <div className="flex flex-col items-center gap-3 xl:items-end">
                <div className="flex flex-wrap items-center justify-center gap-2 xl:justify-end">
                  <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-700">
                    BioLearn Faculty
                  </span>
                  <span className="inline-flex items-center rounded-full bg-slate-900 px-3 py-1 text-[11px] font-semibold text-white">
                    Mentor học tập
                  </span>
                  <span
                    className={`inline-flex items-center rounded-full bg-gradient-to-r px-3 py-1 text-[11px] font-semibold text-white ${currentLecturer.accent}`}
                  >
                    {currentLecturer.badge}
                  </span>
                </div>

                <div className="flex items-center justify-center gap-2">
                  {lecturers.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setActiveLecturer(index)}
                      aria-label={`Chọn giảng viên ${index + 1}`}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        activeLecturer === index
                          ? "w-7 bg-emerald-600"
                          : "w-2 bg-slate-300 hover:bg-slate-400"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}