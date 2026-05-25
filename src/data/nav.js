import {
  Home,
  BookOpen,
  PlayCircle,
  FilePenLine,
  History,
  Download,
  ShoppingCart,
  Trophy,
  BarChart3,
  Clock3,
  Users,
  Search,
  NotebookPen,
  Compass,
} from "lucide-react";

export const NAV_ITEMS = {
  student: [
    { id: "home", label: "Tổng quan", icon: Home },
    { id: "courses", label: "Khóa học của tôi", icon: BookOpen },
    { id: "explore-courses", label: "Khám phá khóa học", icon: Compass },
    { id: "lesson", label: "Xem bài học", icon: PlayCircle },
    { id: "quiz", label: "Làm bài kiểm tra", icon: FilePenLine },
    { id: "marketplace", label: "Marketplace", icon: ShoppingCart },
  ],

  parent: [
    { id: "home", label: "Tổng quan", icon: Home },
    { id: "scores", label: "Điểm kiểm tra", icon: Trophy },
    { id: "attendance", label: "Thời gian & Truy cập", icon: Clock3 },
  ],

  admin: [
    { id: "home", label: "Tổng quan", icon: Home },
    { id: "users", label: "Quản lý người dùng", icon: Users },
    { id: "courses", label: "Quản lý khóa học", icon: NotebookPen },
    { id: "analytics", label: "Thống kê & Báo cáo", icon: BarChart3 },
    { id: "tracking", label: "Theo dõi hoạt động", icon: Search },
    { id: "marketplace", label: "Marketplace", icon: ShoppingCart },
  ],
};

export const ROLE_THEMES = {
  student: {
    primary: "#10b981",
    soft: "#d1fae5",
    ring: "#6ee7b7",
    gradient: "from-emerald-500 to-teal-500",
  },
  parent: {
    primary: "#8b5cf6",
    soft: "#ede9fe",
    ring: "#c4b5fd",
    gradient: "from-violet-500 to-fuchsia-500",
  },
  teacher: {
    primary: "#06b6d4",
    soft: "#cffafe",
    ring: "#67e8f9",
    gradient: "from-cyan-500 to-sky-500",
  },
  admin: {
    primary: "#f97316",
    soft: "#ffedd5",
    ring: "#fdba74",
    gradient: "from-orange-500 to-rose-500",
  },
};

export const ROLE_COLORS = {
  student: "#10b981",
  parent: "#8b5cf6",
  teacher: "#06b6d4",
  admin: "#f97316",
};

export const ROLE_LABELS = {
  student: "Học sinh",
  parent: "Phụ huynh",
  teacher: "Giáo viên",
  admin: "Admin",
};