import React from "react";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  GraduationCap,
  ShieldCheck,
  UserPlus,
  Users,
  UserRound,
} from "lucide-react";
import Card from "../../components/common/Card";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const ROLE_OPTIONS = [
  [
    "student",
    "Học sinh",
    GraduationCap,
    "Tạo tài khoản để học tập, làm quiz, xem tiến độ và tài nguyên cá nhân hóa.",
  ],
  [
    "parent",
    "Phụ huynh",
    Users,
    "Tạo tài khoản để theo dõi điểm số, chuyên cần và nhịp học tập của con.",
  ],
  [
    "admin",
    "Quản trị",
    UserRound,
    "Dành cho tài khoản quản trị đã được tạo sẵn trong hệ thống.",
  ],
];

async function registerAccount(payload) {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Đăng ký thất bại");
  }

  return data;
}

function saveAuthSession(data) {
  if (!data) return;

  if (data.token) {
    localStorage.setItem("token", data.token);
  }

  if (data.user) {
    localStorage.setItem("user", JSON.stringify(data.user));
  }
}

export default function LoginPage({ onLogin, onRegister, onBack, error }) {
  const [mode, setMode] = React.useState("login");
  const [role, setRole] = React.useState("student");
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [pass, setPass] = React.useState("");
  const [confirmPass, setConfirmPass] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [localError, setLocalError] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const isRegister = mode === "register";
  const availableRoles = isRegister
    ? ROLE_OPTIONS.filter(([key]) => key !== "admin")
    : ROLE_OPTIONS;

  React.useEffect(() => {
    if (isRegister && role === "admin") {
      setRole("student");
    }
  }, [isRegister, role]);

  const resetMessages = () => {
    setLocalError("");
  };

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setPass("");
    setConfirmPass("");
    resetMessages();
  };

  const handleRole = (nextRole) => {
    setRole(nextRole);
    resetMessages();
  };

  const validateRegister = () => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!name.trim()) return "Vui lòng nhập họ tên.";
    if (!normalizedEmail) return "Vui lòng nhập email.";
    if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
      return "Email không hợp lệ.";
    }
    if (pass.length < 6) return "Mật khẩu phải có ít nhất 6 ký tự.";
    if (pass !== confirmPass) return "Mật khẩu nhập lại không khớp.";

    return "";
  };

  const handleSubmit = async () => {
    resetMessages();

    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      if (isRegister) {
        const validationError = validateRegister();

        if (validationError) {
          setLocalError(validationError);
          return;
        }

        const payload = {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password: pass,
          role,
          phone: phone.trim() || null,
        };

        let result;

        if (typeof onRegister === "function") {
          result = await onRegister(payload);
        } else {
          result = await registerAccount(payload);
        }

        saveAuthSession(result);

        // Sau đăng ký, đăng nhập luôn tài khoản vừa tạo.
        // Reload giúp App đọc lại token/user từ localStorage nếu component cha chưa truyền onRegister.
        window.location.reload();
        return;
      }

      if (!email.trim() || !pass) {
        setLocalError("Vui lòng nhập email và mật khẩu.");
        return;
      }

      await onLogin(role, {
        email: email.trim().toLowerCase(),
        password: pass,
        role,
      });
    } catch (err) {
      setLocalError(err.message || "Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const visibleError = localError || error;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,_rgba(16,185,129,0.14),_transparent_28%),linear-gradient(180deg,_#f7fffb,_#f8fafc)] px-4 py-8 lg:px-8">
      <div className="mx-auto grid min-h-[92vh] max-w-7xl items-center gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-8">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại landing
          </button>

          <div className="max-w-2xl">
            <div className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">
              Secure learning access
            </div>

            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-950 lg:text-6xl">
              {isRegister
                ? "Tạo tài khoản học tập bằng email của bạn"
                : "Đăng nhập vào nền tảng Sinh học thế hệ mới"}
            </h1>

            <p className="mt-5 text-lg leading-8 text-slate-600">
              {isRegister
                ? "Bạn đăng ký tài khoản với vai trò phù hợp để tiếp tục trải nghiệm hành trình sinh học kỳ diệu cùng BioSphere nhé!"
                : "Sử dụng email và mật khẩu đã đăng ký để truy cập dashboard phù hợp với vai trò của bạn."}
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {ROLE_OPTIONS.map(([key, label, Icon, desc]) => (
                <Card
                  key={key}
                  className={`p-5 transition ${
                    role === key ? "ring-2 ring-emerald-500" : ""
                  } ${isRegister && key === "admin" ? "opacity-60" : ""}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="font-semibold text-slate-900">{label}</div>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    {desc}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </div>

        <Card glow className="mx-auto w-full max-w-xl p-8 lg:p-10">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 text-white shadow-float">
              {isRegister ? (
                <UserPlus className="h-5 w-5" />
              ) : (
                <ShieldCheck className="h-5 w-5" />
              )}
            </div>

            <div>
              <div className="text-xl font-semibold text-slate-950">
                {isRegister ? "Đăng ký BioSphere" : "Đăng nhập BioSphere"}
              </div>
              <div className="text-sm text-slate-500">
                {isRegister
                  ? "Tạo tài khoản mới bằng email thật"
                  : "Đăng nhập bằng tài khoản đã đăng ký"}
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 rounded-2xl bg-slate-100 p-1 text-sm font-bold">
            <button
              type="button"
              onClick={() => switchMode("login")}
              className={`rounded-xl px-4 py-3 transition ${
                !isRegister ? "bg-white text-slate-950 shadow-sm" : "text-slate-500"
              }`}
            >
              Đăng nhập
            </button>
            <button
              type="button"
              onClick={() => switchMode("register")}
              className={`rounded-xl px-4 py-3 transition ${
                isRegister ? "bg-white text-slate-950 shadow-sm" : "text-slate-500"
              }`}
            >
              Đăng ký
            </button>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {availableRoles.map(([key, label, Icon]) => (
              <button
                key={key}
                type="button"
                onClick={() => handleRole(key)}
                className={`rounded-2xl border px-4 py-4 text-left transition ${
                  role === key
                    ? "border-emerald-500 bg-emerald-50"
                    : "border-slate-200 bg-white hover:bg-slate-50"
                }`}
              >
                <Icon
                  className={`h-5 w-5 ${
                    role === key ? "text-emerald-700" : "text-slate-500"
                  }`}
                />
                <div className="mt-3 font-semibold text-slate-900">
                  {label}
                </div>
              </button>
            ))}
          </div>

          <div className="mt-8 space-y-4">
            {isRegister && (
              <label className="block">
                <div className="mb-2 text-sm font-medium text-slate-700">
                  Họ tên
                </div>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ví dụ: Nguyễn Minh Anh"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none ring-0 transition focus:border-emerald-400 focus:bg-white"
                />
              </label>
            )}

            <label className="block">
              <div className="mb-2 text-sm font-medium text-slate-700">
                Email
              </div>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="you@example.com"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none ring-0 transition focus:border-emerald-400 focus:bg-white"
              />
            </label>

            {isRegister && (
              <label className="block">
                <div className="mb-2 text-sm font-medium text-slate-700">
                  Số điện thoại <span className="text-slate-400">(không bắt buộc)</span>
                </div>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Ví dụ: 0912345678"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none ring-0 transition focus:border-emerald-400 focus:bg-white"
                />
              </label>
            )}

            <label className="block">
              <div className="mb-2 text-sm font-medium text-slate-700">
                Mật khẩu
              </div>
              <div className="relative">
                <input
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  placeholder={isRegister ? "Ít nhất 6 ký tự" : "Nhập mật khẩu"}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 pr-12 outline-none ring-0 transition focus:border-emerald-400 focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </label>

            {isRegister && (
              <label className="block">
                <div className="mb-2 text-sm font-medium text-slate-700">
                  Nhập lại mật khẩu
                </div>
                <input
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  placeholder="Nhập lại mật khẩu"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none ring-0 transition focus:border-emerald-400 focus:bg-white"
                />
              </label>
            )}
          </div>

          {visibleError && (
            <div className="mt-5 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
              {visibleError}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="mt-6 w-full rounded-2xl bg-slate-950 px-5 py-4 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting
              ? "Đang xử lý..."
              : isRegister
              ? "Tạo tài khoản"
              : "Vào dashboard"}
          </button>

          <div className="mt-4 text-center text-xs text-slate-500">
            {isRegister
              ? "Tài khoản quản trị nên được tạo riêng trong database hoặc bởi admin hiện có."
              : "Không dùng tài khoản demo? Chuyển sang tab Đăng ký để tạo tài khoản mới."}
          </div>
        </Card>
      </div>
    </div>
  );
}
