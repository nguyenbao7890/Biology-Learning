import { useState } from "react";
import DashLayout from "./components/layout/DashLayout";
import LandingPage from "./pages/public/LandingPage";
import LoginPage from "./pages/public/LoginPage";
import { PAGES_BY_ROLE } from "./routes/pageMap";
import BiopetAIChat from "./components/chatbot/BiopetAIChat";
import {
  authApi,
  clearAuthData,
  getStoredUser,
  getToken,
  setAuthData,
} from "./services/api";

export default function App() {
  const storedUser = getStoredUser();

  const [view, setView] = useState(
    getToken() && storedUser ? "dashboard" : "landing"
  );
  const [role, setRole] = useState(storedUser?.role || null);
  const [user, setUser] = useState(storedUser || null);
  const [page, setPage] = useState("home");
  const [pagePayload, setPagePayload] = useState({});
  const [loginError, setLoginError] = useState("");

  const handleNav = (nextPage, payload = {}) => {
    setPage(nextPage);
    setPagePayload(payload || {});
  };

  const handleLogin = async (selectedRole, userData) => {
    try {
      setLoginError("");

      const data = await authApi.login({
        email: userData.email,
        password: userData.password || "123456",
        role: selectedRole,
      });

      setAuthData(data.token, data.user);

      setRole(data.user.role);
      setUser(data.user);
      setPage("home");
      setPagePayload({});
      setView("dashboard");
    } catch (error) {
      setLoginError(error.message || "Đăng nhập thất bại");
      alert(error.message || "Đăng nhập thất bại");
    }
  };

  const handleLogout = () => {
    clearAuthData();
    setRole(null);
    setUser(null);
    setPage("home");
    setPagePayload({});
    setView("landing");
  };

  if (view === "landing") {
    return (
      <>
        <LandingPage onLogin={() => setView("login")} />
        <BiopetAIChat />
      </>
    );
  }

  if (view === "login") {
    return (
      <>
        <LoginPage
          onLogin={handleLogin}
          onBack={() => setView("landing")}
          error={loginError}
        />
        <BiopetAIChat />
      </>
    );
  }

  if (view === "dashboard" && (!role || !user)) {
    return <div style={{ padding: 40 }}>Đang tải...</div>;
  }

  const pages = PAGES_BY_ROLE?.[role] || {};
  const PageComponent = pages?.[page];

  return (
    <>
      <DashLayout
        role={role}
        page={page}
        onNav={handleNav}
        onLogout={handleLogout}
        user={user}
      >
        {PageComponent ? (
          <PageComponent
            onNav={handleNav}
            user={user}
            pagePayload={pagePayload}
            payload={pagePayload}
            courseId={pagePayload.courseId}
            lessonId={pagePayload.lessonId}
            quizId={pagePayload.quizId}
          />
        ) : (
          <div style={{ color: "#6b7280", padding: 40 }}>
            Trang đang phát triển...
          </div>
        )}
      </DashLayout>
      <BiopetAIChat />
    </>
  );
}