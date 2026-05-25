import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import HeroCarousel from "../../components/common/HeroCarousel";
import { CHAPTERS } from "../../data/chapters";
import Chip from "../../components/common/Chip";
import { getAssetUrl } from "../../services/api";
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  ChevronRight,
  Clock3,
  Filter,
  ImagePlus,
  Layers3,
  Lock,
  Microscope,
  PlayCircle,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
} from "lucide-react";

const previewSlides = [
  {
    title: "Bài giảng dạng slide",
    desc: "Mỗi bài học được chia thành các khối nội dung ngắn, trực quan và dễ theo dõi.",
    image:
      "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=1200&q=80",
    badge: "Bài giảng",
    badgeClass: "bg-emerald-500",
  },
  {
    title: "Quiz sau bài học",
    desc: "Ôn tập ngay sau khi học để ghi nhớ kiến thức chắc hơn.",
    image:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80",
    badge: "Quiz",
    badgeClass: "bg-cyan-500",
  },
  {
    title: "Theo dõi tiến độ",
    desc: "Xem nhanh mình đang học tới đâu và cần tập trung phần nào.",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
    badge: "Dashboard",
    badgeClass: "bg-violet-500",
  },
];

const lessonsHeroSlides = [
  {
    badge: "Thư viện bài học mở",
    kicker: "Bài học · Hình minh họa · Quiz",
    title:
      "Làm quen trước với nội dung học để bước vào khóa học chính dễ dàng hơn",
    desc: "Học sinh có thể xem trước cách trình bày bài học, cấu trúc chương và trải nghiệm trực quan của nền tảng.",
    image:
      "https://images.unsplash.com/photo-1532187643603-ba119ca4109e?auto=format&fit=crop&w=1400&q=80",
  },
  {
    badge: "Slide bài học",
    kicker: "Nội dung chia nhỏ",
    title:
      "Bài học được trình bày như slide để dễ đọc, dễ xem lại và dễ ghi nhớ",
    desc: "Ưu tiên hình ảnh, badge và các điểm nhấn thay vì nhồi quá nhiều chữ.",
    image:
      "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=1200&q=80",
  },
  {
    badge: "Quiz minh họa",
    kicker: "Ôn tập nhanh",
    title:
      "Học xong có thể chuyển ngay sang dạng câu hỏi và kiểm tra mức độ hiểu bài",
    desc: "Tạo cảm giác học liên tục, không bị rời rạc giữa lý thuyết và luyện tập.",
    image:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80",
  },
];

const levelLabel = {
  basic: "Cơ bản",
  medium: "Trung bình",
  advanced: "Nâng cao",
};

const levelClass = {
  basic: "border-emerald-200 bg-emerald-50 text-emerald-700",
  medium: "border-cyan-200 bg-cyan-50 text-cyan-700",
  advanced: "border-violet-200 bg-violet-50 text-violet-700",
};

const cardColors = [
  "border-emerald-200 bg-emerald-50",
  "border-cyan-200 bg-cyan-50",
  "border-violet-200 bg-violet-50",
  "border-amber-200 bg-amber-50",
  "border-rose-200 bg-rose-50",
];

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

function CourseSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl border border-white/70 bg-white shadow-sm">
      <div className="h-52 animate-pulse bg-slate-100" />
      <div className="space-y-4 p-6">
        <div className="h-4 w-24 animate-pulse rounded-full bg-slate-100" />
        <div className="h-5 w-4/5 animate-pulse rounded-full bg-slate-100" />
        <div className="h-3 w-full animate-pulse rounded-full bg-slate-100" />
        <div className="h-3 w-3/4 animate-pulse rounded-full bg-slate-100" />
      </div>
    </div>
  );
}

export default function PublicLessons({
  courses = [],
  loading = false,
  onLogin,
}) {
  const [selChapter, setChapter] = useState(null);
  const [query, setQuery] = useState("");

  const hasApiCourses = courses.length > 0;

  const filteredCourses = useMemo(() => {
    const keyword = query.trim().toLowerCase();

    return courses.filter((course) => {
      const matchKeyword =
        !keyword ||
        course.title?.toLowerCase().includes(keyword) ||
        course.description?.toLowerCase().includes(keyword);

      const matchLevel = !selChapter || course.level === selChapter;

      return matchKeyword && matchLevel;
    });
  }, [courses, query, selChapter]);

  const filteredLessons = useMemo(() => {
    if (hasApiCourses) return [];

    return CHAPTERS.filter((ch) => !selChapter || ch.id === selChapter).flatMap(
      (ch) =>
        ch.topics.map((topic, i) => ({
          chapterId: ch.id,
          chapterTitle: ch.title,
          chapterColor: ch.color,
          chapterImage: ch.image,
          topicTitle: typeof topic === "string" ? topic : topic.title,
          topicImage:
            typeof topic === "string" ? ch.image : topic.image || ch.image,
          lessonIndex: i + 1,
          duration: 20 + i * 5,
        }))
    );
  }, [selChapter, hasApiCourses]);

  const totalApiLessons = courses.reduce((sum, course) => {
    return sum + Number(course.lesson_count || 0);
  }, 0);

  const heroSlides = hasApiCourses
    ? courses.slice(0, 3).map((course) => ({
        badge: levelLabel[course.level] || "Khóa học",
        kicker: `${course.lesson_count || 0} bài học · ${
          Number(course.price || 0) > 0
            ? `${Number(course.price || 0).toLocaleString("vi-VN")}đ`
            : "Miễn phí"
        }`,
        title: course.title,
        desc: course.description || "Khóa học Sinh học trực quan từ hệ thống.",
        image: course.thumbnail
          ? getAssetUrl(course.thumbnail)
          : "https://images.unsplash.com/photo-1532187643603-ba119ca4109e?auto=format&fit=crop&w=1400&q=80",
      }))
    : lessonsHeroSlides;

  return (
    <div className="min-h-[60vh] bg-[#eef8f3]">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-10 xl:px-12">
        <div className="overflow-hidden rounded-[32px] border border-emerald-100 bg-gradient-to-br from-white via-emerald-50/70 to-cyan-50/70 shadow-sm">
          <div className="grid gap-8 px-8 py-10 lg:grid-cols-[1.02fr_0.98fr] lg:px-12 lg:py-14">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.08 } },
              }}
            >
              <motion.div
                variants={fadeUp}
                className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-4 py-2 backdrop-blur"
              >
                <Sparkles className="h-4 w-4 text-emerald-600" />
                <span className="text-sm font-semibold text-emerald-700">
                  Thư viện học tập công khai
                </span>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                className="text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl"
              >
                Thư viện bài học{" "}
                <span className="text-emerald-600">Sinh học 10</span>
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className="mt-5 max-w-2xl text-base leading-8 text-slate-600 md:text-lg"
              >
                {hasApiCourses
                  ? "Xem trước các khóa học đang có trên hệ thống. Dữ liệu được lấy trực tiếp từ backend MySQL, bao gồm ảnh khóa học, mô tả và số bài học."
                  : "Xem trước nội dung chương trình học theo từng chương, từng chủ đề với giao diện trực quan hơn."}
              </motion.p>

              <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-3">
                <div className="inline-flex items-center gap-2 rounded-2xl border border-emerald-200 bg-white px-4 py-3 text-sm font-medium text-slate-600 shadow-sm">
                  <BookOpen className="h-4 w-4 text-emerald-600" />
                  {hasApiCourses ? courses.length : CHAPTERS.length}{" "}
                  {hasApiCourses ? "khóa học" : "chương học"}
                </div>

                <div className="inline-flex items-center gap-2 rounded-2xl border border-cyan-200 bg-white px-4 py-3 text-sm font-medium text-slate-600 shadow-sm">
                  <Filter className="h-4 w-4 text-cyan-600" />
                  {hasApiCourses ? filteredCourses.length : filteredLessons.length}{" "}
                  mục đang hiển thị
                </div>

                <div className="inline-flex items-center gap-2 rounded-2xl border border-violet-200 bg-white px-4 py-3 text-sm font-medium text-slate-600 shadow-sm">
                  <BadgeCheck className="h-4 w-4 text-violet-600" />
                  Trực quan & dễ học
                </div>
              </motion.div>

              <motion.div variants={fadeUp} className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-emerald-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center gap-2 text-sm font-semibold text-emerald-700">
                    <Star className="h-4 w-4 fill-current" />
                    Trải nghiệm dễ tiếp cận
                  </div>
                  <div className="mt-3 text-3xl font-extrabold text-slate-900">
                    {loading ? "..." : hasApiCourses ? `${courses.length}+` : "48+"}
                  </div>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    Nội dung được trình bày theo phong cách rõ ràng, ít gây ngợp chữ.
                  </p>
                </div>

                <div className="rounded-3xl border border-cyan-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center gap-2 text-sm font-semibold text-cyan-700">
                    <Users className="h-4 w-4" />
                    Lộ trình mở rộng
                  </div>
                  <div className="mt-3 text-3xl font-extrabold text-slate-900">
                    {loading ? "..." : hasApiCourses ? totalApiLessons : "5K+"}
                  </div>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    {hasApiCourses
                      ? "Bài học đã được admin tạo trực tiếp từ dashboard."
                      : "Học sinh đã tiếp cận các nội dung demo và thư viện học tập công khai."}
                  </p>
                </div>

                <div className="rounded-3xl border border-violet-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center gap-2 text-sm font-semibold text-violet-700">
                    <Layers3 className="h-4 w-4" />
                    Dạng bài học
                  </div>
                  <div className="mt-3 text-lg font-bold text-slate-900">
                    Slide · Quiz · Chủ đề minh họa
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Học sinh có thể làm quen nhanh với cấu trúc một bài học hoàn chỉnh.
                  </p>
                </div>

                <div className="rounded-3xl border border-amber-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center gap-2 text-sm font-semibold text-amber-700">
                    <ShieldCheck className="h-4 w-4" />
                    Xem trước miễn phí
                  </div>
                  <div className="mt-3 text-lg font-bold text-slate-900">
                    Trải nghiệm nội dung trước khi đăng nhập
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Khám phá giao diện, chủ đề và cách trình bày trước khi bắt đầu học đầy đủ.
                  </p>
                </div>
              </motion.div>

              <motion.div
                variants={fadeUp}
                className="mt-5 rounded-[28px] border border-emerald-200 bg-gradient-to-r from-emerald-500 to-teal-500 p-5 text-white shadow-lg shadow-emerald-600/15"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="text-sm text-white/80">Gợi ý bắt đầu</div>
                    <div className="mt-1 text-xl font-bold">
                      Xem trước bài học + chọn chủ đề bạn quan tâm
                    </div>
                    <div className="mt-1 text-sm text-white/85">
                      Bắt đầu từ phần dễ nhất hoặc nội dung bạn đang học trên lớp.
                    </div>
                  </div>

                  <button
                    onClick={() => setChapter(null)}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-emerald-700 transition hover:scale-[1.02]"
                  >
                    Xem tất cả
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            </motion.div>

            <div className="space-y-5">
              <HeroCarousel slides={heroSlides} height="h-[420px]" />

              <div className="grid gap-4 sm:grid-cols-3">
                {previewSlides.map((item) => (
                  <motion.div
                    key={item.title}
                    whileHover={{ y: -6 }}
                    className="overflow-hidden rounded-[28px] border border-white/70 bg-white shadow-sm"
                  >
                    <div className="relative h-36">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent" />
                      <div
                        className={`absolute left-3 top-3 rounded-full px-3 py-1 text-[11px] font-semibold text-white ${item.badgeClass}`}
                      >
                        {item.badge}
                      </div>
                    </div>

                    <div className="p-4">
                      <div className="text-sm font-bold text-slate-900">
                        {item.title}
                      </div>
                      <div className="mt-1 text-xs text-slate-500">
                        {item.desc}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <section className="mt-12">
          <div className="mb-6 max-w-3xl">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              {hasApiCourses
                ? "Khóa học công khai từ hệ thống"
                : "Xem nhanh trải nghiệm bài học"}
            </h2>
            <p className="mt-2 text-slate-600">
              {hasApiCourses
                ? "Các khóa học bên dưới được admin tạo trong dashboard và lấy trực tiếp từ API."
                : "Đây là những kiểu giao diện mà học sinh sẽ thấy khi bước vào thư viện học tập công khai."}
            </p>
          </div>

          {loading ? (
            <div className="grid gap-5 lg:grid-cols-3">
              <CourseSkeleton />
              <CourseSkeleton />
              <CourseSkeleton />
            </div>
          ) : hasApiCourses ? (
            <div className="grid gap-5 lg:grid-cols-3">
              {filteredCourses.slice(0, 3).map((course) => (
                <motion.div
                  key={course.id}
                  whileHover={{ y: -8 }}
                  className="overflow-hidden rounded-[30px] border border-white/70 bg-white shadow-sm transition duration-300 hover:shadow-xl"
                >
                  <div className="relative h-56">
                    {course.thumbnail ? (
                      <img
                        src={getAssetUrl(course.thumbnail)}
                        alt={course.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-100 to-cyan-100">
                        <ImagePlus className="h-12 w-12 text-emerald-500" />
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-900/10 to-transparent" />
                    <div className="absolute left-4 top-4 rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white">
                      {levelLabel[course.level] || "Khóa học"}
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <PlayCircle className="h-4 w-4" />
                      {course.lesson_count || 0} bài học
                    </div>

                    <h3 className="mt-3 line-clamp-2 text-xl font-bold text-slate-900">
                      {course.title}
                    </h3>

                    <p className="mt-2 line-clamp-3 text-sm leading-7 text-slate-600">
                      {course.description || "Khóa học Sinh học trực quan."}
                    </p>

                    <button
                      onClick={onLogin}
                      className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-600"
                    >
                      Đăng nhập để học
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="grid gap-5 lg:grid-cols-3">
              {previewSlides.map((item) => (
                <div
                  key={item.title}
                  className="overflow-hidden rounded-[30px] border border-white/70 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative h-56">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-900/10 to-transparent" />
                    <div
                      className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-semibold text-white ${item.badgeClass}`}
                    >
                      {item.badge}
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <PlayCircle className="h-4 w-4" />
                      Preview học tập
                    </div>
                    <h3 className="mt-3 text-xl font-bold text-slate-900">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-7 text-slate-600">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="mt-10">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <Chip
              label="Tất cả"
              active={!selChapter}
              onClick={() => setChapter(null)}
            />

            {hasApiCourses
              ? [
                  ["basic", "Cơ bản"],
                  ["medium", "Trung bình"],
                  ["advanced", "Nâng cao"],
                ].map(([key, label]) => (
                  <Chip
                    key={key}
                    label={label}
                    active={selChapter === key}
                    onClick={() => setChapter(key)}
                    color={
                      key === "basic"
                        ? "#10b981"
                        : key === "medium"
                        ? "#06b6d4"
                        : "#8b5cf6"
                    }
                  />
                ))
              : CHAPTERS.map((ch) => (
                  <Chip
                    key={ch.id}
                    label={ch.title}
                    active={selChapter === ch.id}
                    onClick={() => setChapter(ch.id)}
                    color={ch.color}
                  />
                ))}
          </div>

          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-600">
              Đang hiển thị{" "}
              <span className="font-semibold text-slate-800">
                {hasApiCourses ? filteredCourses.length : filteredLessons.length}
              </span>{" "}
              {hasApiCourses ? "khóa học" : "bài học"}
            </p>

            {hasApiCourses && (
              <div className="relative w-full sm:max-w-sm">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Tìm khóa học..."
                  className="h-12 w-full rounded-2xl border border-white bg-white pl-11 pr-4 text-sm outline-none shadow-sm transition focus:border-emerald-300"
                />
              </div>
            )}
          </div>

          {hasApiCourses ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredCourses.map((course, index) => {
                const level = course.level || "basic";

                return (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.04 }}
                    whileHover={{ y: -8 }}
                    className="group overflow-hidden rounded-3xl border border-white/70 bg-white shadow-sm transition duration-500 hover:shadow-2xl"
                  >
                    <div className="relative h-56 overflow-hidden">
                      {course.thumbnail ? (
                        <img
                          src={getAssetUrl(course.thumbnail)}
                          alt={course.title}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-100 to-cyan-100">
                          <Microscope className="h-14 w-14 text-emerald-500" />
                        </div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-900/10 to-transparent" />

                      <div
                        className={`absolute left-4 top-4 rounded-full border px-3 py-1 text-xs font-bold ${
                          levelClass[level] || levelClass.basic
                        }`}
                      >
                        {levelLabel[level] || level}
                      </div>

                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="line-clamp-2 text-xl font-extrabold text-white">
                          {course.title}
                        </h3>
                        <div className="mt-2 flex items-center gap-2 text-sm text-white/85">
                          <Clock3 className="h-4 w-4" />
                          {course.lesson_count || 0} bài học
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      <p className="line-clamp-3 text-sm leading-7 text-slate-600">
                        {course.description || "Khóa học Sinh học trực quan."}
                      </p>

                      <div className="mt-6 flex items-center justify-between">
                        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700">
                          <Lock className="h-4 w-4" />
                          Đăng nhập để học
                        </div>

                        <button
                          onClick={onLogin}
                          className="inline-flex items-center gap-1 text-sm font-semibold text-slate-500 transition hover:text-emerald-700"
                        >
                          Chi tiết
                          <ChevronRight className="h-4 w-4 transition group-hover:translate-x-1" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredLessons.map((lesson) => (
                <div
                  key={`${lesson.chapterId}-${lesson.lessonIndex}-${lesson.topicTitle}`}
                  className="group relative overflow-hidden rounded-3xl border border-white/70 bg-white/90 p-6 shadow-sm transition duration-500 hover:-translate-y-2 hover:shadow-2xl"
                >
                  <div
                    className="absolute inset-0 scale-110 opacity-0 transition duration-500 group-hover:scale-100 group-hover:opacity-100"
                    style={{
                      backgroundImage: `url(${lesson.topicImage})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />

                  <div className="absolute inset-0 bg-gradient-to-br from-slate-950/10 via-slate-900/20 to-slate-950/70 opacity-0 transition duration-500 group-hover:opacity-100" />
                  <div className="absolute inset-0 bg-white/0 transition duration-500 group-hover:bg-slate-900/35" />

                  <div
                    className="absolute inset-x-0 top-0 h-1"
                    style={{
                      background: `linear-gradient(90deg, ${lesson.chapterColor}, transparent)`,
                    }}
                  />

                  <div className="relative z-10">
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <div
                        className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold transition duration-500 group-hover:bg-white/15 group-hover:text-white"
                        style={{
                          backgroundColor: `${lesson.chapterColor}15`,
                          color: lesson.chapterColor,
                        }}
                      >
                        {lesson.chapterTitle}
                      </div>

                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 transition duration-500 group-hover:bg-white/15 group-hover:text-white">
                        <Microscope className="h-5 w-5" />
                      </div>
                    </div>

                    <div className="mb-3 inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-500 transition duration-500 group-hover:border-white/20 group-hover:bg-white/10 group-hover:text-white/90">
                      Chủ đề sinh học
                    </div>

                    <h3 className="text-lg font-bold leading-7 text-slate-900 transition duration-500 group-hover:text-white">
                      {lesson.topicTitle}
                    </h3>

                    <div className="mt-3 flex items-center gap-2 text-sm text-slate-500 transition duration-500 group-hover:text-white/80">
                      <Clock3 className="h-4 w-4" />
                      <span>
                        Bài học {lesson.lessonIndex} · {lesson.duration} phút
                      </span>
                    </div>

                    <div className="mt-6 flex items-center justify-between">
                      <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700 transition duration-500 group-hover:bg-white/15 group-hover:text-white">
                        <Lock className="h-4 w-4" />
                        Đăng nhập để học
                      </div>

                      <div className="inline-flex items-center gap-1 text-sm font-semibold text-slate-400 transition duration-500 group-hover:text-white">
                        Chi tiết
                        <ChevronRight className="h-4 w-4 transition group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {(hasApiCourses ? filteredCourses.length : filteredLessons.length) === 0 && (
            <div className="rounded-3xl border border-dashed border-emerald-200 bg-white p-10 text-center shadow-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <Search className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-slate-900">
                Không có nội dung phù hợp
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Hãy thử chọn bộ lọc khác hoặc quay lại chế độ tất cả.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}