import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf, Menu, Sparkles, X } from "lucide-react";
import LandingHome from "./LandingHome";
import AboutPage from "./AboutPage";
import PublicLessons from "./PublicLessons";
import MarketplacePage from "../shared/MarketplacePage";
import Footer from "./Footer";
import { courseApi, marketplaceApi } from "../../services/api";

const navItems = [
  ["home", "Trang chủ"],
  ["about", "Giới thiệu"],
  ["lessons", "Thư viện bài học"],
  ["marketplace", "Marketplace"],
];

const pageVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

export default function LandingPage({ onLogin }) {
  const [activeSection, setSection] = useState("home");
  const [mobileOpen, setMobileOpen] = useState(false);

  const [courses, setCourses] = useState([]);
  const [marketItems, setMarketItems] = useState([]);
  const [loadingLanding, setLoadingLanding] = useState(true);
  const [landingError, setLandingError] = useState("");

  useEffect(() => {
    async function loadLandingData() {
      try {
        setLoadingLanding(true);
        setLandingError("");

        const [courseData, marketplaceData] = await Promise.all([
          courseApi.getAll(),
          marketplaceApi.getAll(),
        ]);

        setCourses(Array.isArray(courseData) ? courseData : []);
        setMarketItems(Array.isArray(marketplaceData) ? marketplaceData : []);
      } catch (error) {
        setLandingError(
          "Không kết nối được backend. Kiểm tra API /api hoặc biến môi trường Render."
        );
      } finally {
        setLoadingLanding(false);
      }
    }

    loadLandingData();
  }, []);

  const handleNav = (key) => {
    setSection(key);
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#eef8f3] font-sans text-slate-900">
      <nav className="sticky top-0 z-50 border-b border-emerald-100/80 bg-[#eef8f3]/85 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-10 xl:px-12">
          <button
            onClick={() => handleNav("home")}
            className="group flex items-center gap-3"
          >
            <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/25 transition group-hover:scale-105">
              <Leaf className="h-6 w-6" />
              <div className="absolute -right-1 -top-1 rounded-full bg-white p-1 text-emerald-600 shadow">
                <Sparkles className="h-3 w-3" />
              </div>
            </div>

            <div className="text-left">
              <div className="text-base font-extrabold tracking-tight text-slate-900">
                BioLearn 10
              </div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-600">
                Sinh học lớp 10
              </div>
            </div>
          </button>

          <div className="hidden items-center gap-2 rounded-full border border-emerald-100 bg-white/75 p-1 shadow-sm md:flex">
            {navItems.map(([key, label]) => {
              const active = activeSection === key;

              return (
                <button
                  key={key}
                  onClick={() => handleNav(key)}
                  className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                    active
                      ? "bg-gradient-to-r from-emerald-500/15 to-cyan-500/15 text-emerald-700 shadow-sm"
                      : "text-slate-600 hover:bg-white hover:text-slate-900"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen((prev) => !prev)}
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-100 bg-white text-slate-600 shadow-sm md:hidden"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            <button
              onClick={onLogin}
              className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-600/25 transition hover:scale-[1.02] hover:from-emerald-700 hover:to-teal-700 sm:px-6"
            >
              Đăng nhập
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="border-t border-emerald-100 bg-white/90 px-4 py-4 shadow-sm backdrop-blur-xl md:hidden"
            >
              <div className="mx-auto grid max-w-7xl gap-2">
                {navItems.map(([key, label]) => {
                  const active = activeSection === key;

                  return (
                    <button
                      key={key}
                      onClick={() => handleNav(key)}
                      className={`rounded-2xl px-4 py-3 text-left text-sm font-semibold transition ${
                        active
                          ? "bg-emerald-50 text-emerald-700"
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <AnimatePresence mode="wait">
        {activeSection === "home" && (
          <motion.div
            key="home"
            variants={pageVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.25 }}
          >
            <LandingHome
              onLogin={onLogin}
              setSection={handleNav}
              courses={courses}
              marketItems={marketItems}
              loading={loadingLanding}
              apiError={landingError}
            />
            <Footer />
          </motion.div>
        )}

        {activeSection === "about" && (
          <motion.div
            key="about"
            variants={pageVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.25 }}
          >
            <AboutPage setSection={handleNav} />
            <Footer />
          </motion.div>
        )}

        {activeSection === "lessons" && (
          <motion.div
            key="lessons"
            variants={pageVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.25 }}
          >
            <PublicLessons
              courses={courses}
              loading={loadingLanding}
              onLogin={onLogin}
            />
            <Footer />
          </motion.div>
        )}

        {activeSection === "marketplace" && (
          <motion.div
            key="marketplace"
            variants={pageVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.25 }}
          >
            <MarketplacePage
              inDashboard={false}
              items={marketItems}
              loading={loadingLanding}
            />
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}