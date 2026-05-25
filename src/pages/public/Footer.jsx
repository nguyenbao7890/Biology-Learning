import {
  BadgeInfo,
  Camera,
  Globe,
  Leaf,
  Mail,
  MapPin,
  Phone,
  PlayCircle,
  Sparkles,
} from "lucide-react";

const footerLinks = {
  "Khám phá": [
    { label: "Trang chủ" },
    { label: "Giới thiệu" },
    { label: "Thư viện bài học" },
    { label: "Marketplace" },
  ],
  "Hỗ trợ học tập": [
    { label: "Lộ trình học Sinh học 10" },
    { label: "Câu hỏi thường gặp" },
    { label: "Hướng dẫn sử dụng" },
    { label: "Chính sách học viên" },
  ],
};

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-emerald-100 bg-gradient-to-b from-emerald-50 via-white to-cyan-50">
      <div className="absolute left-[-60px] top-[-60px] h-52 w-52 rounded-full bg-emerald-200/30 blur-3xl" />
      <div className="absolute bottom-[-80px] right-[-60px] h-64 w-64 rounded-full bg-cyan-200/30 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6 py-14 lg:px-10 xl:px-12">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/20">
                <Leaf className="h-6 w-6" />
              </div>

              <div>
                <div className="text-lg font-extrabold tracking-tight text-slate-900">
                  BioLearn 10
                </div>
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">
                  Sinh học lớp 10
                </div>
              </div>
            </div>

            <p className="mt-5 max-w-md text-sm leading-7 text-slate-600">
              Nền tảng học Sinh học 10 trực quan, dễ hiểu và có lộ trình rõ ràng,
              giúp học sinh học chắc kiến thức, luyện tập hiệu quả và tự tin hơn
              trong kiểm tra.
            </p>

            <div className="mt-5 flex items-center gap-3">
              {[Globe, Camera, PlayCircle].map((Icon, index) => (
                <button
                  key={index}
                  className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:-translate-y-0.5 hover:text-emerald-600"
                >
                  <Icon className="h-4.5 w-4.5" />
                </button>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-extrabold uppercase tracking-[0.14em] text-slate-900">
                {title}
              </h3>

              <ul className="mt-4 space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <button className="text-sm text-slate-600 transition hover:text-emerald-600">
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="text-sm font-extrabold uppercase tracking-[0.14em] text-slate-900">
              Liên hệ
            </h3>

            <div className="mt-4 space-y-4 text-sm text-slate-600">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4.5 w-4.5 text-emerald-600" />
                <span>TP. Hà Nội, Việt Nam</span>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="h-4.5 w-4.5 text-emerald-600" />
                <span>0901 234 567</span>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="h-4.5 w-4.5 text-emerald-600" />
                <span>support@biolearn10.vn</span>
              </div>
            </div>

            <div className="mt-6 rounded-3xl border border-emerald-100 bg-white/80 p-4 shadow-sm">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                <Sparkles className="h-4 w-4 text-emerald-600" />
                Đăng ký nhận cập nhật mới
              </div>

              <p className="mt-1 text-xs leading-6 text-slate-500">
                Nhận thông báo về khóa học mới, tài liệu hay và ưu đãi dành cho
                học sinh.
              </p>

              <div className="mt-4 flex gap-2">
                <input
                  type="email"
                  placeholder="Email của bạn"
                  className="h-11 flex-1 rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-emerald-400"
                />
                <button className="rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:scale-[1.02]">
                  Gửi
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-slate-200 pt-6 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
          <div>© 2026 BioLearn 10. All rights reserved.</div>
          <div className="flex flex-wrap items-center gap-4">
            <button className="transition hover:text-emerald-600">
              Điều khoản
            </button>
            <button className="transition hover:text-emerald-600">
              Chính sách bảo mật
            </button>
            <button className="transition hover:text-emerald-600">
              Liên hệ
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}