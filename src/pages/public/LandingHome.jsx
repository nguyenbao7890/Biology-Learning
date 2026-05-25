import {
  ArrowRight,
  Atom,
  ChevronRight,
  CirclePlay,
  ScanSearch,
  Sparkles,
  Database,
  BookOpenCheck,
  ShoppingBag,
  ImagePlus,
} from "lucide-react";
import { motion } from "framer-motion";
import { CHAPTERS } from "../../data/chapters";
import ProgressBar from "../../components/common/ProgressBar";
import SectionHeader from "../../components/common/SectionHeader";
import StatsGrid from "../../components/common/StatsGrid";
import VisualSlidesSection from "../../components/common/VisualSlidesSection";
import {
  sellingPoints,
  stats,
  featuredModules,
  outcomes,
  heroSlides,
} from "../../data/landingHomeData";
import { getAssetUrl } from "../../services/api";

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const levelLabel = {
  basic: "Cơ bản",
  medium: "Trung bình",
  advanced: "Nâng cao",
};

const courseCardClass = [
  "border-emerald-200 bg-emerald-50",
  "border-cyan-200 bg-cyan-50",
  "border-violet-200 bg-violet-50",
  "border-amber-200 bg-amber-50",
  "border-rose-200 bg-rose-50",
];

export default function LandingHome({
  onLogin,
  setSection,
  courses = [],
  marketItems = [],
  loading = false,
  apiError = "",
}) {
  const totalLessons = courses.reduce((sum, course) => {
    return sum + Number(course.lesson_count || 0);
  }, 0);

  const apiStats = [
    {
      value: loading ? "..." : `${courses.length}`,
      label: "Khóa học từ hệ thống",
      card: "border-emerald-200 bg-emerald-50",
    },
    {
      value: loading ? "..." : `${totalLessons}`,
      label: "Bài học đã tạo",
      card: "border-cyan-200 bg-cyan-50",
    },
    {
      value: loading ? "..." : `${marketItems.length}`,
      label: "Tài nguyên marketplace",
      card: "border-violet-200 bg-violet-50",
    },
  ];

  const visibleCourses = courses.slice(0, 5);
  const hasApiCourses = visibleCourses.length > 0;

  return (
    <div className="text-slate-900">
      <section className="relative overflow-hidden border-b border-emerald-100 bg-[linear-gradient(180deg,_#eef8f3_0%,_#f6fcf8_45%,_#eef8f3_100%)]">
        <div className="absolute left-[-80px] top-[-80px] h-72 w-72 rounded-full bg-emerald-200/50 blur-3xl" />
        <div className="absolute bottom-[-100px] right-[-60px] h-80 w-80 rounded-full bg-cyan-200/40 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[1.02fr_0.98fr] lg:px-10 xl:px-12">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="max-w-2xl"
          >
            <motion.div
              variants={fadeUp}
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-4 py-2 backdrop-blur"
            >
              <Sparkles className="h-4 w-4 text-emerald-600" />
              <span className="text-sm font-semibold text-emerald-700">
                Khóa học Sinh học 10 dành cho học sinh muốn học chắc từ gốc
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-4xl font-extrabold leading-tight tracking-tight text-slate-900 md:text-5xl xl:text-6xl"
            >
              Học <span className="text-emerald-600">Sinh học 10</span>
              <br />
              bài bản, trực quan và dễ đạt điểm cao
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-5 max-w-xl text-base leading-8 text-slate-600 md:text-lg"
            >
              Khóa học giúp học sinh nắm vững kiến thức tế bào học, di truyền,
              chuyển hóa và vi sinh vật thông qua bài giảng trực quan, quiz
              thông minh và lộ trình học rõ ràng theo từng chương.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="mt-8 flex flex-col gap-3 sm:flex-row"
            >
              <button
                onClick={onLogin}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:scale-[1.02]"
              >
                Đăng ký học ngay
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                onClick={() => setSection("lessons")}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-emerald-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700"
              >
                Xem thử bài học
                <ChevronRight className="h-4 w-4" />
              </button>
            </motion.div>

            <motion.div variants={fadeUp}>
              <StatsGrid
                items={courses.length > 0 || marketItems.length > 0 ? apiStats : stats}
                className="mt-10 max-w-xl"
              />
            </motion.div>

            {apiError && (
              <motion.div
                variants={fadeUp}
                className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-700"
              >
                {apiError}
              </motion.div>
            )}

            <motion.div
              variants={fadeUp}
              className="mt-5 grid max-w-xl gap-3 sm:grid-cols-3"
            >
              <div className="flex items-center gap-2 rounded-2xl border border-emerald-100 bg-white/80 px-4 py-3 text-sm font-bold text-slate-700 shadow-sm">
                <Database className="h-4 w-4 text-emerald-600" />
                MySQL Data
              </div>
              <div className="flex items-center gap-2 rounded-2xl border border-cyan-100 bg-white/80 px-4 py-3 text-sm font-bold text-slate-700 shadow-sm">
                <BookOpenCheck className="h-4 w-4 text-cyan-600" />
                Lessons Ready
              </div>
              <div className="flex items-center gap-2 rounded-2xl border border-violet-100 bg-white/80 px-4 py-3 text-sm font-bold text-slate-700 shadow-sm">
                <ShoppingBag className="h-4 w-4 text-violet-600" />
                Marketplace
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 22 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="w-full"
          >
            <div className="relative">
              <div className="overflow-hidden rounded-[32px] border border-white/70 bg-white/90 shadow-2xl shadow-emerald-100/40">
                <div className="relative h-[420px]">
                  {visibleCourses[0]?.thumbnail ? (
                    <img
                      src={getAssetUrl(visibleCourses[0].thumbnail)}
                      alt={visibleCourses[0].title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <img
                      src="https://images.unsplash.com/photo-1532187643603-ba119ca4109e?auto=format&fit=crop&w=1400&q=80"
                      alt="Biology hero visual"
                      className="h-full w-full object-cover"
                    />
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-900/15 to-transparent" />

                  <div className="absolute left-5 top-5 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-emerald-700">
                    Trực quan · Dễ hiểu · Có lộ trình
                  </div>

                  <div className="absolute bottom-5 left-5 right-5">
                    <div className="text-sm text-white/80">
                      {hasApiCourses ? "Khóa học mới nhất" : "Trải nghiệm học tập mới"}
                    </div>
                    <div className="mt-2 text-2xl font-bold leading-tight text-white">
                      {visibleCourses[0]?.title ||
                        "Học Sinh học bằng hình ảnh, sơ đồ và bài luyện tập thông minh"}
                    </div>
                    {visibleCourses[0]?.description && (
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/80">
                        {visibleCourses[0].description}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="absolute -left-4 top-6 hidden w-48 rounded-3xl border border-white/70 bg-white/90 p-4 shadow-xl lg:block">
                <div className="flex items-center gap-2 text-sm font-semibold text-emerald-700">
                  <CirclePlay className="h-4 w-4" />
                  Học thử miễn phí
                </div>
                <div className="mt-3 text-2xl font-bold text-slate-900">
                  {loading ? "..." : `${Math.min(courses.length || 3, 3)} khóa`}
                </div>
                <div className="mt-1 text-sm text-slate-500">
                  Trải nghiệm nội dung trước khi đăng ký
                </div>
              </div>

              <div className="absolute -right-4 bottom-10 hidden w-52 rounded-3xl border border-white/70 bg-white/90 p-4 shadow-xl lg:block">
                <div className="flex items-center gap-2 text-sm font-semibold text-cyan-700">
                  <ScanSearch className="h-4 w-4" />
                  Theo dõi tiến độ
                </div>
                <div className="mt-3 text-2xl font-bold text-slate-900">72%</div>
                <div className="mt-1 text-sm text-slate-500">
                  Mức độ hoàn thành demo của học viên
                </div>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                {(hasApiCourses ? visibleCourses.slice(0, 3) : heroSlides).map((item, index) => {
                  const isApiCourse = Boolean(item.id && item.title && "lesson_count" in item);

                  return (
                    <motion.div
                      key={item.id || item.title}
                      whileHover={{ y: -6 }}
                      className="overflow-hidden rounded-[28px] border border-white/70 bg-white shadow-sm"
                    >
                      <div className="relative h-36">
                        {isApiCourse && item.thumbnail ? (
                          <img
                            src={getAssetUrl(item.thumbnail)}
                            alt={item.title}
                            className="h-full w-full object-cover"
                          />
                        ) : isApiCourse ? (
                          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-100 to-cyan-100">
                            <ImagePlus className="h-10 w-10 text-emerald-500" />
                          </div>
                        ) : (
                          <img
                            src={item.image}
                            alt={item.title}
                            className="h-full w-full object-cover"
                          />
                        )}

                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent" />
                        <div
                          className={`absolute left-3 top-3 rounded-full px-3 py-1 text-[11px] font-semibold text-white ${
                            isApiCourse
                              ? "bg-emerald-500"
                              : item.badgeClass
                          }`}
                        >
                          {isApiCourse
                            ? levelLabel[item.level] || "Khóa học"
                            : item.badge}
                        </div>
                      </div>

                      <div className="p-4">
                        <div className="line-clamp-1 text-sm font-bold text-slate-900">
                          {item.title}
                        </div>
                        <div className="mt-1 text-xs text-slate-500">
                          {isApiCourse
                            ? `${item.lesson_count || 0} bài học`
                            : item.subtitle}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14 lg:px-10 xl:px-12">
        <SectionHeader
          title="Vì sao học sinh chọn khóa học này?"
          desc="Không chỉ là video bài giảng, đây là một lộ trình học Sinh học được thiết kế để học sinh hiểu sâu, luyện chắc và ứng dụng tốt trong kiểm tra."
          maxWidth="max-w-2xl"
        />

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid gap-5 md:grid-cols-2 xl:grid-cols-4"
        >
          {sellingPoints.map((item) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.title}
                variants={fadeUp}
                whileHover={{ y: -6 }}
                className={`group rounded-3xl border p-6 shadow-sm transition duration-300 hover:shadow-xl ${item.card}`}
              >
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl ${item.iconWrap}`}
                >
                  <Icon className="h-7 w-7" />
                </div>

                <h3 className={`mt-5 text-lg font-bold ${item.accent}`}>
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {item.desc}
                </p>

                <div
                  className={`mt-5 flex items-center gap-2 text-sm font-medium ${item.accent}`}
                >
                  <span>Tìm hiểu thêm</span>
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      <VisualSlidesSection
        title="Trải nghiệm học tập trực quan trên nền tảng"
        desc="Không gian học được thiết kế như các slide hiện đại, giúp học sinh nhìn nhanh, hiểu nhanh và ghi nhớ kiến thức tốt hơn."
        items={heroSlides}
      />

      <section className="overflow-hidden border-y border-emerald-100 bg-gradient-to-b from-[#f6fcf8] to-[#eef8f3] py-12">
        <div className="mx-auto mb-6 max-w-7xl px-6 lg:px-10 xl:px-12">
          <SectionHeader
            title="Các module được học sinh quan tâm nhiều nhất"
            desc="Khám phá những chủ đề trọng tâm giúp học sinh xây nền kiến thức vững và học nhanh hơn."
            className="mb-0"
            maxWidth=""
          />
        </div>

        <div className="relative">
          <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-[#eef8f3] to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-[#eef8f3] to-transparent" />

          <div className="marquee flex w-max gap-5 px-6">
            {[...featuredModules, ...featuredModules].map((item, index) => {
              const Icon = item.icon;

              return (
                <div
                  key={`${item.title}-${index}`}
                  className={`w-[290px] shrink-0 rounded-3xl border p-5 shadow-sm ${item.bg}`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-slate-500">Chuyên đề nổi bật</p>
                      <h3 className="mt-1 text-lg font-bold text-slate-900">
                        {item.title}
                      </h3>
                    </div>

                    <div
                      className={`rounded-2xl bg-gradient-to-r p-3 text-white ${item.card}`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>

                  <div className="mt-6">
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="text-slate-600">Mức độ quan tâm</span>
                      <span className="font-semibold text-slate-900">
                        {item.progress}%
                      </span>
                    </div>
                    <ProgressBar value={item.progress} color="#10b981" height={8} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#eef8f3] py-14">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 xl:px-12">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              {hasApiCourses
                ? "Khóa học đang có trên hệ thống"
                : "Lộ trình khóa học Sinh học 10"}
            </h2>
            <p className="mt-2 text-slate-600">
              {hasApiCourses
                ? "Các khóa học này được admin tạo trực tiếp từ dashboard và lưu trong MySQL."
                : "Toàn bộ khóa học được chia theo chương lớn, giúp học sinh học đúng trọng tâm và tiến bộ từng bước."}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {hasApiCourses
              ? visibleCourses.map((course, index) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.06 }}
                    whileHover={{ y: -6 }}
                    className={`group overflow-hidden rounded-3xl border shadow-sm transition hover:shadow-xl ${
                      courseCardClass[index % courseCardClass.length]
                    }`}
                  >
                    <div className="h-32 overflow-hidden bg-white/70">
                      {course.thumbnail ? (
                        <img
                          src={getAssetUrl(course.thumbnail)}
                          alt={course.title}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-4xl">
                          🧬
                        </div>
                      )}
                    </div>

                    <div className="p-5">
                      <div className="line-clamp-2 text-base font-bold text-slate-900">
                        {course.title}
                      </div>

                      <div className="mt-1 text-sm text-slate-600">
                        {course.lesson_count || 0} bài học
                      </div>

                      <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-500">
                        {course.description || "Khóa học Sinh học trực quan."}
                      </p>

                      <button
                        onClick={onLogin}
                        className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-emerald-700"
                      >
                        Học ngay
                        <ChevronRight className="h-4 w-4 transition group-hover:translate-x-1" />
                      </button>
                    </div>
                  </motion.div>
                ))
              : CHAPTERS.map((ch, index) => (
                  <div
                    key={ch.id}
                    className={`group rounded-3xl border p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${
                      courseCardClass[index % courseCardClass.length]
                    }`}
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/90 text-slate-900 shadow-sm">
                      <Atom className="h-6 w-6" />
                    </div>

                    <div className="mt-4 text-base font-bold text-slate-900">
                      {ch.title}
                    </div>
                    <div className="mt-1 text-sm text-slate-600">
                      {ch.lessons} bài học
                    </div>

                    <div className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-slate-700">
                      Xem lộ trình
                      <ChevronRight className="h-4 w-4 transition group-hover:translate-x-1" />
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f6fcf8] py-14">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 xl:px-12">
          <SectionHeader
            title="Học viên sẽ nhận được gì sau khóa học?"
            desc="Không chỉ học kiến thức, học sinh còn có lộ trình rõ ràng để hiểu sâu, nhớ lâu và tự tin hơn khi làm bài kiểm tra trên lớp."
            maxWidth="max-w-2xl"
          />

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid gap-5 md:grid-cols-2 xl:grid-cols-4"
          >
            {outcomes.map((item) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={item.title}
                  variants={fadeUp}
                  whileHover={{ y: -6 }}
                  className={`rounded-3xl border p-6 shadow-sm ${item.card}`}
                >
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl text-white ${item.iconWrap}`}
                  >
                    <Icon className="h-7 w-7" />
                  </div>

                  <h3 className="mt-5 text-lg font-bold text-slate-900">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {item.desc}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      <section className="bg-[linear-gradient(135deg,_#0f172a_0%,_#111827_35%,_#0f766e_100%)] py-16 text-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 xl:px-12">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white/90">
                <Sparkles className="h-4 w-4" />
                Ưu đãi dành cho học sinh mới
              </div>

              <h2 className="mt-5 text-3xl font-bold tracking-tight md:text-4xl">
                Bắt đầu hành trình chinh phục Sinh học 10 ngay hôm nay
              </h2>

              <p className="mt-4 max-w-2xl text-base leading-8 text-slate-300">
                Đăng ký để truy cập bài giảng, quiz thông minh, tài liệu đi kèm
                và lộ trình học rõ ràng theo từng chương. Phù hợp cho cả học chắc
                kiến thức nền và ôn tập nâng cao.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={onLogin}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3.5 text-sm font-bold text-slate-900 transition hover:scale-[1.02]"
                >
                  Đăng ký học ngay
                  <ArrowRight className="h-4 w-4" />
                </button>

                <button
                  onClick={() => setSection("marketplace")}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/15"
                >
                  Xem gói học
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur">
                <div className="text-sm text-slate-300">Khóa học hiện có</div>
                <div className="mt-2 text-3xl font-extrabold">
                  {loading ? "..." : courses.length}
                </div>
                <div className="mt-1 text-sm text-slate-300">
                  Lấy trực tiếp từ backend MySQL
                </div>
              </div>

              <div className="rounded-3xl border border-emerald-300/20 bg-emerald-400/10 p-5 backdrop-blur">
                <div className="text-sm text-emerald-100">Tài nguyên</div>
                <div className="mt-2 text-3xl font-extrabold">
                  {loading ? "..." : marketItems.length}
                </div>
                <div className="mt-1 text-sm text-emerald-100">
                  Marketplace, tài liệu, đề luyện tập
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur sm:col-span-2">
                <div className="text-sm text-slate-300">Cam kết</div>
                <div className="mt-2 text-lg font-bold">
                  Nội dung bám sát chương trình, trình bày trực quan, học dễ hơn
                  và ôn tập hiệu quả hơn.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .marquee {
          animation: marquee 24s linear infinite;
        }

        .marquee:hover {
          animation-play-state: paused;
        }

        @keyframes marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}