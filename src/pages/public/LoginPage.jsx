import React from "react";
import { ArrowLeft, GraduationCap, ShieldCheck, Users, UserRound } from "lucide-react";
import Card from "../../components/common/Card";

const USERS = {
  student: {
    name: "Nguyễn Minh Anh",
    email: "student@example.com",
    role: "student",
  },
  parent: {
    name: "Phụ huynh Minh Anh",
    email: "parent@example.com",
    role: "parent",
  },
  admin: {
    name: "Admin Biology",
    email: "admin@example.com",
    role: "admin",
  },
};

export default function LoginPage({ onLogin, onBack }) {
  const roles = [
    [
      "student",
      "Học sinh",
      GraduationCap,
      "Dành cho học sinh học tập, làm quiz, xem tiến độ và tài nguyên cá nhân hóa.",
    ],
    [
      "parent",
      "Phụ huynh",
      Users,
      "Theo dõi điểm số, chuyên cần, nhịp học tập và hoạt động gần đây của con.",
    ],
    [
      "admin",
      "Quản trị",
      UserRound,
      "Kiểm soát nội dung, phân quyền, analytics toàn hệ thống và governance.",
    ],
  ];

  const [role, setRole] = React.useState("student");
  const [email, setEmail] = React.useState(USERS.student.email);
  const [pass, setPass] = React.useState("123456");

  const handleRole = (nextRole) => {
    setRole(nextRole);
    setEmail(USERS[nextRole].email);
    setPass("123456");
  };

  const handleLogin = () => {
    onLogin(role, {
      ...USERS[role],
      email,
      password: pass,
      role,
    });
  };

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
              Đăng nhập vào nền tảng Sinh học thế hệ mới
            </h1>

            <p className="mt-5 text-lg leading-8 text-slate-600">
              Giao diện đăng nhập được làm lại theo style SaaS hiện đại, có demo vai trò rõ ràng và sẵn sàng cho onboarding tốt hơn.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {roles.map(([key, label, Icon, desc]) => (
                <Card
                  key={key}
                  className={`p-5 transition ${
                    role === key ? "ring-2 ring-emerald-500" : ""
                  }`}
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
              <ShieldCheck className="h-5 w-5" />
            </div>

            <div>
              <div className="text-xl font-semibold text-slate-950">
                Đăng nhập BioSphere
              </div>
              <div className="text-sm text-slate-500">
                Demo tài khoản nhiều vai trò cho giao diện mới
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {roles.map(([key, label, Icon]) => (
              <button
                key={key}
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
            <label className="block">
              <div className="mb-2 text-sm font-medium text-slate-700">
                Email
              </div>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none ring-0 transition focus:border-emerald-400 focus:bg-white"
              />
            </label>

            <label className="block">
              <div className="mb-2 text-sm font-medium text-slate-700">
                Mật khẩu
              </div>
              <input
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                type="password"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none ring-0 transition focus:border-emerald-400 focus:bg-white"
              />
            </label>
          </div>

          <button
            onClick={handleLogin}
            className="mt-6 w-full rounded-2xl bg-slate-950 px-5 py-4 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5"
          >
            Vào dashboard
          </button>

          <div className="mt-4 text-center text-xs text-slate-500">
            Demo credentials đã được điền sẵn để test UI nhanh.
          </div>
        </Card>
      </div>
    </div>
  );
}