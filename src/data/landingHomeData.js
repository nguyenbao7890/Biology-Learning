import {
  Target,
  Brain,
  Trophy,
  MonitorSmartphone,
  Dna,
  FlaskConical,
  Microscope,
  Atom,
  GraduationCap,
  CheckCircle2,
  BadgeCheck,
} from "lucide-react";

export const sellingPoints = [
  {
    icon: Target,
    title: "Bám sát chương trình lớp 10",
    desc: "Bài giảng được xây dựng theo đúng mạch kiến thức Sinh học 10, dễ học và dễ ôn tập.",
    card: "border-emerald-200 bg-gradient-to-br from-emerald-100 via-emerald-50 to-white",
    iconWrap: "bg-emerald-600 text-white",
    accent: "text-emerald-700",
  },
  {
    icon: Brain,
    title: "Học dễ hiểu, nhớ lâu hơn",
    desc: "Hình ảnh trực quan, sơ đồ hóa kiến thức và bài luyện tập giúp học sinh nắm bản chất vấn đề.",
    card: "border-cyan-200 bg-gradient-to-br from-cyan-100 via-sky-50 to-white",
    iconWrap: "bg-cyan-600 text-white",
    accent: "text-cyan-700",
  },
  {
    icon: Trophy,
    title: "Tối ưu cho kiểm tra và thi cử",
    desc: "Có quiz, bộ câu hỏi trọng tâm và lộ trình luyện tập theo từng mức độ từ cơ bản đến nâng cao.",
    card: "border-violet-200 bg-gradient-to-br from-violet-100 via-fuchsia-50 to-white",
    iconWrap: "bg-violet-600 text-white",
    accent: "text-violet-700",
  },
  {
    icon: MonitorSmartphone,
    title: "Học mọi lúc trên mọi thiết bị",
    desc: "Theo dõi bài học, tiến độ và kết quả thuận tiện trên máy tính, tablet và điện thoại.",
    card: "border-amber-200 bg-gradient-to-br from-amber-100 via-orange-50 to-white",
    iconWrap: "bg-amber-500 text-white",
    accent: "text-amber-700",
  },
];

export const stats = [
  {
    value: "5,200+",
    label: "Học sinh theo học",
    card: "border-emerald-200 bg-emerald-50",
  },
  {
    value: "48",
    label: "Bài giảng & chuyên đề",
    card: "border-cyan-200 bg-cyan-50",
  },
  {
    value: "98%",
    label: "Phản hồi tích cực",
    card: "border-violet-200 bg-violet-50",
  },
];

export const featuredModules = [
  {
    title: "DNA & RNA",
    progress: 72,
    icon: Dna,
    card: "from-emerald-500 to-teal-500",
    bg: "bg-emerald-50 border-emerald-200",
  },
  {
    title: "Trao đổi chất",
    progress: 64,
    icon: FlaskConical,
    card: "from-cyan-500 to-sky-500",
    bg: "bg-cyan-50 border-cyan-200",
  },
  {
    title: "Tế bào nhân thực",
    progress: 81,
    icon: Microscope,
    card: "from-violet-500 to-fuchsia-500",
    bg: "bg-violet-50 border-violet-200",
  },
  {
    title: "Enzyme sinh học",
    progress: 58,
    icon: Brain,
    card: "from-amber-500 to-orange-500",
    bg: "bg-amber-50 border-amber-200",
  },
  {
    title: "Phân bào nguyên nhiễm",
    progress: 76,
    icon: Atom,
    card: "from-rose-500 to-pink-500",
    bg: "bg-rose-50 border-rose-200",
  },
];

export const outcomes = [
  {
    icon: GraduationCap,
    title: "Nắm chắc kiến thức nền",
    desc: "Hiểu rõ các chuyên đề trọng tâm như tế bào, di truyền, vi sinh vật và phân bào.",
    card: "border-emerald-200 bg-emerald-50",
    iconWrap: "bg-emerald-600",
  },
  {
    icon: CheckCircle2,
    title: "Luyện tập có hệ thống",
    desc: "Quiz, câu hỏi ôn tập và bài kiểm tra theo từng chương để củng cố ngay sau khi học.",
    card: "border-cyan-200 bg-cyan-50",
    iconWrap: "bg-cyan-600",
  },
  {
    icon: BadgeCheck,
    title: "Theo dõi tiến độ rõ ràng",
    desc: "Biết mình đang mạnh ở đâu, yếu ở đâu để cải thiện đúng phần cần thiết.",
    card: "border-violet-200 bg-violet-50",
    iconWrap: "bg-violet-600",
  },
  {
    icon: Brain,
    title: "Học thông minh hơn",
    desc: "Tận dụng lộ trình học trực quan để tiết kiệm thời gian mà vẫn đạt hiệu quả cao.",
    card: "border-amber-200 bg-amber-50",
    iconWrap: "bg-amber-500",
  },
];

export const heroSlides = [
  {
    title: "Bài giảng dạng slide",
    subtitle: "Sơ đồ hóa kiến thức",
    desc: "Sơ đồ hóa kiến thức. Giao diện ưu tiên hình ảnh, badge, progress và các điểm nhấn để học sinh không bị ngợp chữ.",
    image:
      "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=1200&q=80",
    badge: "Bài giảng trực quan",
    badgeClass: "bg-emerald-500",
    card: "border-emerald-200 bg-emerald-50",
  },
  {
    title: "Quiz theo từng chương",
    subtitle: "Luyện tập ngay sau khi học",
    desc: "Luyện tập ngay sau khi học. Giao diện ưu tiên hình ảnh, badge, progress và các điểm nhấn để học sinh không bị ngợp chữ.",
    image:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80",
    badge: "Quiz thông minh",
    badgeClass: "bg-cyan-500",
    card: "border-cyan-200 bg-cyan-50",
  },
  {
    title: "Dashboard tiến độ",
    subtitle: "Theo dõi kết quả rõ ràng",
    desc: "Theo dõi kết quả rõ ràng. Giao diện ưu tiên hình ảnh, badge, progress và các điểm nhấn để học sinh không bị ngợp chữ.",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
    badge: "Theo dõi học tập",
    badgeClass: "bg-violet-500",
    card: "border-violet-200 bg-violet-50",
  },
];