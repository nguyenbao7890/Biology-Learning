import { motion } from "framer-motion";
import HeroCarousel from "../../components/common/HeroCarousel";
import SectionHeader from "../../components/common/SectionHeader";
import StatsGrid from "../../components/common/StatsGrid";
import VisualSlidesSection from "../../components/common/VisualSlidesSection";
import TeacherCarousel from "../../components/common/TeacherCarousel";
import {
  Sparkles,
  CheckCircle2,
  ArrowRight,
  HeartHandshake,
  PlayCircle,
  Layers3,
  ScanSearch,
  ShieldCheck,
  BookOpenCheck,
  Target,
  Users,
} from "lucide-react";
import {
  aboutHeroSlides,
  values,
  lecturers,
  stats,
  highlights,
  audiences,
  learningFlow,
  parentBenefits,
  visualSlides,
} from "../../data/aboutPageData";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.07,
    },
  },
};

export default function AboutPage({ setSection = () => {} }) {
  return (
    <div className="min-h-screen bg-[#eef8f3]">
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-10 xl:px-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="overflow-hidden rounded-[32px] border border-emerald-100 bg-gradient-to-br from-white via-emerald-50/70 to-cyan-50/70 shadow-sm"
        >
          <div className="grid gap-8 px-6 py-8 lg:grid-cols-[1.02fr_0.98fr] lg:px-10 lg:py-10 xl:px-12">
            <motion.div variants={stagger} initial="hidden" animate="visible">
              <motion.div
                variants={fadeUp}
                className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-4 py-2 backdrop-blur"
              >
                <Sparkles className="h-4 w-4 text-emerald-600" />
                <span className="text-sm font-semibold text-emerald-700">
                  Giới thiệu nền tảng BioLearn 10
                </span>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                className="text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl"
              >
                Về <span className="text-emerald-600">BioLearn 10</span>
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className="mt-5 max-w-3xl text-base leading-8 text-slate-600 md:text-lg"
              >
                BioLearn 10 là nền tảng học trực tuyến chuyên biệt cho môn Sinh
                học lớp 10, được phát triển với mục tiêu giúp học sinh học đúng
                trọng tâm, hiểu bài nhanh hơn và duy trì hứng thú học tập trong
                suốt năm học.
              </motion.p>

              <motion.p
                variants={fadeUp}
                className="mt-4 max-w-3xl text-base leading-8 text-slate-600"
              >
                Thay vì chỉ cung cấp bài học đơn lẻ, BioLearn 10 kết hợp nội
                dung học thuật, thiết kế trực quan và công nghệ theo dõi tiến độ
                để tạo nên một hành trình học tập rõ ràng, hiện đại và phù hợp
                với nhu cầu của học sinh phổ thông.
              </motion.p>

              <motion.div variants={fadeUp}>
                <StatsGrid items={stats} className="mt-8" />
              </motion.div>

              <motion.div
                variants={fadeUp}
                className="mt-6 grid gap-3 sm:grid-cols-3"
              >
                <div className="rounded-3xl border border-emerald-200 bg-white p-4 shadow-sm">
                  <ShieldCheck className="h-5 w-5 text-emerald-600" />
                  <div className="mt-3 text-sm font-bold text-slate-900">
                    Nội dung chuẩn
                  </div>
                  <div className="mt-1 text-xs leading-5 text-slate-500">
                    Bám sát chương trình Sinh học lớp 10.
                  </div>
                </div>

                <div className="rounded-3xl border border-cyan-200 bg-white p-4 shadow-sm">
                  <BookOpenCheck className="h-5 w-5 text-cyan-600" />
                  <div className="mt-3 text-sm font-bold text-slate-900">
                    Học có lộ trình
                  </div>
                  <div className="mt-1 text-xs leading-5 text-slate-500">
                    Chia nhỏ bài học, dễ theo dõi.
                  </div>
                </div>

                <div className="rounded-3xl border border-violet-200 bg-white p-4 shadow-sm">
                  <Target className="h-5 w-5 text-violet-600" />
                  <div className="mt-3 text-sm font-bold text-slate-900">
                    Theo dõi tiến bộ
                  </div>
                  <div className="mt-1 text-xs leading-5 text-slate-500">
                    Học, làm quiz, xem kết quả rõ ràng.
                  </div>
                </div>
              </motion.div>
            </motion.div>

            <div className="space-y-4">
              <HeroCarousel slides={aboutHeroSlides} height="h-[430px]" />

              <div className="grid gap-4 sm:grid-cols-2">
                <motion.div
                  whileHover={{ y: -6 }}
                  className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm"
                >
                  <div className="flex items-center gap-2 text-sm font-semibold text-emerald-700">
                    <PlayCircle className="h-4 w-4" />
                    Học tập trực quan
                  </div>
                  <div className="mt-3 text-lg font-bold text-slate-900">
                    Bài học dạng slide dễ theo dõi
                  </div>
                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    Các nội dung được chia theo khối nhỏ, dễ học, dễ ôn tập và
                    dễ xem lại.
                  </p>
                </motion.div>

                <motion.div
                  whileHover={{ y: -6 }}
                  className="rounded-3xl border border-cyan-200 bg-cyan-50 p-5 shadow-sm"
                >
                  <div className="flex items-center gap-2 text-sm font-semibold text-cyan-700">
                    <Layers3 className="h-4 w-4" />
                    Học có lộ trình
                  </div>
                  <div className="mt-3 text-lg font-bold text-slate-900">
                    Từng chương được chia rõ ràng
                  </div>
                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    Học sinh biết chính xác mình đang học phần nào và cần đi
                    tiếp ra sao.
                  </p>
                </motion.div>
              </div>

              <motion.div
                whileHover={{ y: -6 }}
                className="rounded-3xl border border-violet-200 bg-violet-50 p-5 shadow-sm"
              >
                <div className="flex items-center gap-2 text-sm font-semibold text-violet-700">
                  <ScanSearch className="h-4 w-4" />
                  Theo dõi kết quả
                </div>
                <div className="mt-3 text-lg font-bold text-slate-900">
                  Nhìn thấy tiến độ học tập theo thời gian thực
                </div>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  Kết quả quiz, mức độ hoàn thành và gợi ý học tiếp được hiển
                  thị rõ ràng trên giao diện.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="rounded-[28px] border border-emerald-200 bg-gradient-to-r from-emerald-500 to-teal-500 p-5 text-white shadow-lg shadow-emerald-600/15"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="text-sm text-white/80">Gợi ý bắt đầu</div>
                    <div className="mt-1 text-xl font-bold">
                      Xem trước bài học + chọn chương bạn quan tâm
                    </div>
                    <div className="mt-1 text-sm text-white/85">
                      Bắt đầu từ chương dễ nhất hoặc phần bạn đang học trên lớp
                    </div>
                  </div>

                  <button
                    onClick={() => setSection("lessons")}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-emerald-700 transition hover:scale-[1.02]"
                  >
                    Xem tất cả
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        <VisualSlidesSection items={visualSlides} />

        <section className="mt-12">
          <SectionHeader
            title="BioLearn 10 hoạt động như thế nào?"
            desc="Nền tảng được thiết kế để học sinh có thể bắt đầu từ bài giảng, tiếp tục với bài luyện tập, theo dõi tiến độ và điều chỉnh cách học theo kết quả thực tế."
          />

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid gap-5 md:grid-cols-2 xl:grid-cols-4"
          >
            {highlights.map((item) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={item.title}
                  variants={fadeUp}
                  whileHover={{ y: -6 }}
                  className={`overflow-hidden rounded-3xl border shadow-sm transition duration-300 hover:shadow-lg ${item.card}`}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-40 w-full object-cover"
                  />
                  <div className="p-6">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl ${item.iconWrap}`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-4 text-lg font-bold text-slate-900">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-7 text-slate-600">
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </section>

        <section className="mt-12">
          <SectionHeader
            title="BioLearn 10 phù hợp với ai?"
            desc="Nền tảng được xây dựng để phục vụ nhiều nhu cầu học tập khác nhau của học sinh lớp 10."
          />

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid gap-5 lg:grid-cols-3"
          >
            {audiences.map((item) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={item.title}
                  variants={fadeUp}
                  whileHover={{ y: -6 }}
                  className={`rounded-3xl border p-6 shadow-sm ${item.card}`}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-900 shadow-sm">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-slate-900">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    {item.desc}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </section>

        <section className="mt-12">
          <SectionHeader
            title="Hành trình học tập trên nền tảng"
            desc="Một quy trình đơn giản nhưng hiệu quả để giúp học sinh duy trì nhịp học đều và tiến bộ rõ ràng."
          />

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid gap-5 md:grid-cols-2 xl:grid-cols-4"
          >
            {learningFlow.map((item) => (
              <motion.div
                key={item.step}
                variants={fadeUp}
                whileHover={{ y: -6 }}
                className={`rounded-3xl border p-6 shadow-sm ${item.color}`}
              >
                <div className="text-sm font-extrabold tracking-[0.2em] text-slate-500">
                  STEP {item.step}
                </div>
                <h3 className="mt-3 text-lg font-bold text-slate-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        <section className="mt-12">
          <SectionHeader
            title="Giá trị định hướng"
            desc="Hai nền tảng cốt lõi định hình trải nghiệm học tập của BioLearn 10."
            maxWidth=""
          />

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid gap-6 lg:grid-cols-2"
          >
            {values.map((item) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={item.title}
                  variants={fadeUp}
                  whileHover={{ y: -6 }}
                  className={`group rounded-3xl border p-7 shadow-sm transition duration-300 hover:shadow-xl ${item.card}`}
                >
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl text-white transition group-hover:scale-105 ${item.iconWrap}`}
                  >
                    <Icon className="h-7 w-7" />
                  </div>

                  <h3 className="mt-5 text-xl font-bold text-slate-900">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {item.desc}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </section>

        <section className="mt-12">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="overflow-hidden rounded-[32px] border border-emerald-100 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 p-8 text-white shadow-lg"
          >
            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white/90">
                  <HeartHandshake className="h-4 w-4" />
                  Dành cho phụ huynh
                </div>

                <h2 className="mt-5 text-3xl font-bold tracking-tight">
                  Phụ huynh nhận được gì khi đồng hành cùng BioLearn 10?
                </h2>

                <p className="mt-4 max-w-2xl text-base leading-8 text-white/85">
                  Không chỉ giúp con học tốt hơn, nền tảng còn mang lại sự minh
                  bạch trong quá trình học và tạo điều kiện để phụ huynh đồng
                  hành sát hơn mà không gây áp lực.
                </p>
              </div>

              <div className="space-y-3">
                {parentBenefits.map((item) => (
                  <div
                    key={item}
                    className="flex gap-3 rounded-2xl bg-white/10 p-4 backdrop-blur"
                  >
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-white" />
                    <div className="text-sm leading-7 text-white/90">
                      {item}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </section>

        <TeacherCarousel lecturers={lecturers} />

        <section className="mt-12">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm"
          >
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700">
                <Users className="h-4 w-4" />
                Cam kết học tập
              </div>

              <h2 className="mt-5 text-3xl font-bold tracking-tight text-slate-900">
                Cam kết của BioLearn 10
              </h2>
              <p className="mt-3 text-base leading-8 text-slate-600">
                Chúng tôi theo đuổi một trải nghiệm học tập không chỉ đẹp về
                giao diện mà còn thực sự hữu ích về học thuật: nội dung rõ ràng,
                trình bày trực quan, lộ trình mạch lạc và có khả năng hỗ trợ học
                sinh tiến bộ qua từng tuần học.
              </p>
              <p className="mt-4 text-base leading-8 text-slate-600">
                Mỗi cải tiến trên nền tảng đều hướng tới một mục tiêu duy nhất:
                giúp học sinh lớp 10 học Sinh học nhẹ nhàng hơn, hiểu sâu hơn và
                tự tin hơn.
              </p>

              <button
                onClick={() => setSection("lessons")}
                className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:scale-[1.02]"
              >
                Khám phá khóa học
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  );
}