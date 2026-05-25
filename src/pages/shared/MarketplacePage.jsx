import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  CheckCircle2,
  Download,
  FileText,
  Filter,
  Layers3,
  Lock,
  PackageOpen,
  Search,
  ShoppingBag,
  Sparkles,
  Star,
  Wallet,
  Zap,
} from "lucide-react";
import { marketplaceApi } from "../../services/api";

const typeLabel = {
  document: "Tài liệu",
  flashcard: "Flashcard",
  exam: "Đề luyện tập",
  course: "Gói khóa học",
  material: "Tài liệu",
};

const typeIcon = {
  document: FileText,
  flashcard: Layers3,
  exam: BadgeCheck,
  course: BookOpen,
  material: FileText,
};

const typeColor = {
  document: "border-emerald-200 bg-emerald-50 text-emerald-700",
  flashcard: "border-cyan-200 bg-cyan-50 text-cyan-700",
  exam: "border-violet-200 bg-violet-50 text-violet-700",
  course: "border-amber-200 bg-amber-50 text-amber-700",
  material: "border-emerald-200 bg-emerald-50 text-emerald-700",
};

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
    },
  },
};

function MarketplaceSkeleton() {
  return (
    <div className="rounded-[30px] border border-white/70 bg-white p-6 shadow-sm">
      <div className="h-12 w-12 animate-pulse rounded-2xl bg-slate-100" />
      <div className="mt-6 h-5 w-3/4 animate-pulse rounded-full bg-slate-100" />
      <div className="mt-4 space-y-2">
        <div className="h-3 w-full animate-pulse rounded-full bg-slate-100" />
        <div className="h-3 w-4/5 animate-pulse rounded-full bg-slate-100" />
      </div>
      <div className="mt-6 h-11 w-full animate-pulse rounded-2xl bg-slate-100" />
    </div>
  );
}

export default function MarketplacePage({
  inDashboard = true,
  items,
  loading: externalLoading = false,
}) {
  const [localItems, setLocalItems] = useState([]);
  const [loadingLocal, setLoadingLocal] = useState(!items);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [buyingId, setBuyingId] = useState("");

  const sourceItems = Array.isArray(items) ? items : localItems;
  const loading = externalLoading || loadingLocal;

  useEffect(() => {
    if (Array.isArray(items)) return;

    async function loadMarketplace() {
      try {
        setLoadingLocal(true);
        setError("");

        const data = await marketplaceApi.getAll();
        setLocalItems(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || "Không tải được marketplace");
      } finally {
        setLoadingLocal(false);
      }
    }

    loadMarketplace();
  }, [items]);

  const types = useMemo(() => {
    const unique = Array.from(
      new Set(sourceItems.map((item) => item.type).filter(Boolean))
    );

    return ["all", ...unique];
  }, [sourceItems]);

  const filteredItems = useMemo(() => {
    const keyword = query.trim().toLowerCase();

    return sourceItems.filter((item) => {
      const matchType = filter === "all" || item.type === filter;

      const matchKeyword =
        !keyword ||
        item.title?.toLowerCase().includes(keyword) ||
        item.description?.toLowerCase().includes(keyword) ||
        item.type?.toLowerCase().includes(keyword);

      return matchType && matchKeyword;
    });
  }, [sourceItems, filter, query]);

  const stats = useMemo(() => {
    const freeItems = sourceItems.filter((item) => Number(item.price || 0) === 0);
    const paidItems = sourceItems.filter((item) => Number(item.price || 0) > 0);

    return {
      total: sourceItems.length,
      free: freeItems.length,
      paid: paidItems.length,
    };
  }, [sourceItems]);

  const handleBuy = async (item) => {
    if (!inDashboard) {
      alert("Vui lòng đăng nhập để mua hoặc tải tài nguyên.");
      return;
    }

    try {
      setBuyingId(item.id);
      await marketplaceApi.buy(item.id);
      alert("Đã mua tài nguyên thành công");
    } catch (err) {
      alert(err.message || "Không thể mua tài nguyên");
    } finally {
      setBuyingId("");
    }
  };

  return (
    <div
      className={
        inDashboard
          ? "space-y-6"
          : "min-h-screen bg-[#eef8f3] px-6 py-12 lg:px-10 xl:px-12"
      }
    >
      <div className={inDashboard ? "" : "mx-auto max-w-7xl"}>
        <section className="overflow-hidden rounded-[32px] border border-emerald-100 bg-gradient-to-br from-white via-emerald-50/70 to-cyan-50/70 p-6 shadow-sm lg:p-8">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-4 py-2 backdrop-blur">
                <Sparkles className="h-4 w-4 text-emerald-600" />
                <span className="text-sm font-semibold text-emerald-700">
                  Marketplace học tập
                </span>
              </div>

              <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
                Tài nguyên học Sinh học được chọn lọc cho học sinh
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 md:text-lg">
                Tải tài liệu, flashcard, đề luyện tập và gói học bổ trợ. Dữ liệu
                lấy từ backend MySQL, admin có thể quản lý nội dung marketplace.
              </p>

              {error && (
                <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-700">
                  {error}
                </div>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-emerald-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2 text-sm font-semibold text-emerald-700">
                  <ShoppingBag className="h-4 w-4" />
                  Tổng tài nguyên
                </div>
                <div className="mt-3 text-3xl font-extrabold text-slate-900">
                  {loading ? "..." : stats.total}
                </div>
              </div>

              <div className="rounded-3xl border border-cyan-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2 text-sm font-semibold text-cyan-700">
                  <Download className="h-4 w-4" />
                  Miễn phí
                </div>
                <div className="mt-3 text-3xl font-extrabold text-slate-900">
                  {loading ? "..." : stats.free}
                </div>
              </div>

              <div className="rounded-3xl border border-violet-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2 text-sm font-semibold text-violet-700">
                  <Wallet className="h-4 w-4" />
                  Có phí
                </div>
                <div className="mt-3 text-3xl font-extrabold text-slate-900">
                  {loading ? "..." : stats.paid}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900">
                Danh sách tài nguyên
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Lọc theo loại tài nguyên hoặc tìm nhanh theo tên.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative w-full sm:w-80">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Tìm tài nguyên..."
                  className="h-12 w-full rounded-2xl border border-white bg-white pl-11 pr-4 text-sm outline-none shadow-sm transition focus:border-emerald-300"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto rounded-2xl border border-white bg-white p-1 shadow-sm">
                {types.map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilter(type)}
                    className={`whitespace-nowrap rounded-xl px-4 py-2 text-sm font-bold transition ${
                      filter === type
                        ? "bg-emerald-50 text-emerald-700"
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    {type === "all" ? "Tất cả" : typeLabel[type] || type}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-5 flex items-center gap-2 text-sm text-slate-500">
            <Filter className="h-4 w-4" />
            Đang hiển thị{" "}
            <span className="font-bold text-slate-900">
              {loading ? "..." : filteredItems.length}
            </span>{" "}
            tài nguyên
          </div>

          {loading ? (
            <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              <MarketplaceSkeleton />
              <MarketplaceSkeleton />
              <MarketplaceSkeleton />
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="mt-6 rounded-[30px] border border-dashed border-emerald-200 bg-white p-10 text-center shadow-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <PackageOpen className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-slate-900">
                Chưa có tài nguyên phù hợp
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Thử đổi bộ lọc hoặc thêm tài nguyên mới trong admin.
              </p>
            </div>
          ) : (
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="visible"
              className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3"
            >
              {filteredItems.map((item) => {
                const Icon = typeIcon[item.type] || FileText;
                const price = Number(item.price || 0);
                const isFree = price === 0;

                return (
                  <motion.article
                    key={item.id}
                    variants={fadeUp}
                    whileHover={{ y: -8 }}
                    className="group overflow-hidden rounded-[30px] border border-white/70 bg-white shadow-sm transition hover:shadow-2xl hover:shadow-emerald-900/10"
                  >
                    <div className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-cyan-50 p-6">
                      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-emerald-200/40 blur-2xl" />

                      <div className="relative flex items-start justify-between gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-emerald-700 shadow-sm">
                          <Icon className="h-7 w-7" />
                        </div>

                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-bold ${
                            typeColor[item.type] || typeColor.document
                          }`}
                        >
                          {typeLabel[item.type] || item.type || "Tài liệu"}
                        </span>
                      </div>

                      <h3 className="relative mt-6 line-clamp-2 text-xl font-extrabold text-slate-950">
                        {item.title}
                      </h3>

                      <p className="relative mt-3 line-clamp-3 text-sm leading-7 text-slate-500">
                        {item.description ||
                          "Tài nguyên học tập hỗ trợ học sinh ôn tập hiệu quả hơn."}
                      </p>
                    </div>

                    <div className="p-6">
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="rounded-2xl bg-slate-50 p-4">
                          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                            <Star className="h-3.5 w-3.5" />
                            Đánh giá
                          </div>
                          <div className="mt-2 text-sm font-extrabold text-slate-900">
                            4.9 / 5.0
                          </div>
                        </div>

                        <div className="rounded-2xl bg-slate-50 p-4">
                          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                            <Zap className="h-3.5 w-3.5" />
                            Truy cập
                          </div>
                          <div className="mt-2 text-sm font-extrabold text-slate-900">
                            {isFree ? "Miễn phí" : "Có phí"}
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 flex items-center justify-between gap-4">
                        <div>
                          <div className="text-xs font-semibold text-slate-400">
                            Giá
                          </div>
                          <div className="text-xl font-extrabold text-slate-950">
                            {isFree
                              ? "0đ"
                              : `${price.toLocaleString("vi-VN")}đ`}
                          </div>
                        </div>

                        <button
                          onClick={() => handleBuy(item)}
                          disabled={buyingId === item.id}
                          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-600 disabled:opacity-60"
                        >
                          {inDashboard ? (
                            <>
                              {buyingId === item.id ? "Đang xử lý..." : "Lấy tài nguyên"}
                              <Download className="h-4 w-4" />
                            </>
                          ) : (
                            <>
                              Đăng nhập để lấy
                              <Lock className="h-4 w-4" />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </motion.div>
          )}
        </section>

        {!inDashboard && (
          <section className="mt-10 overflow-hidden rounded-[32px] bg-slate-950 p-8 text-white shadow-2xl shadow-slate-950/20 lg:p-10">
            <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">
                  <CheckCircle2 className="h-4 w-4" />
                  Learning resources
                </div>
                <h2 className="mt-4 text-3xl font-extrabold tracking-tight">
                  Đăng nhập để tải tài liệu, flashcard và đề luyện tập.
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
                  Tài nguyên marketplace giúp học sinh ôn tập nhanh hơn và học
                  theo đúng lộ trình.
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur">
                <div className="text-sm text-slate-300">Tổng tài nguyên</div>
                <div className="mt-2 text-4xl font-extrabold">
                  {stats.total}
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}