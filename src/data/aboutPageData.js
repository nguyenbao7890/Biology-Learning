import {
  Target,
  Eye,
  GraduationCap,
  Users,
  ShieldCheck,
  BookOpen,
  Brain,
  ChartColumnBig,
  Microscope,
  Laptop,
  ClipboardCheck,
} from "lucide-react";

export const aboutHeroSlides = [
  {
    badge: "Trải nghiệm trực quan",
    kicker: "Bài giảng tương tác",
    title: "Học Sinh học bằng hình ảnh, sơ đồ và mô phỏng dễ hiểu",
    desc: "Nội dung được thiết kế để học sinh tiếp cận kiến thức nhanh hơn và đỡ bị ngợp chữ hơn.",
    image:
      "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=1200&q=80",
  },
  {
    badge: "Lộ trình rõ ràng",
    kicker: "Học có định hướng",
    title: "Mỗi chương học được chia nhỏ để dễ theo dõi và dễ ôn tập",
    desc: "Học sinh biết mình đang ở đâu trong hành trình học tập và cần làm gì tiếp theo.",
    image:
      "https://images.unsplash.com/photo-1532187643603-ba119ca4109e?auto=format&fit=crop&w=1200&q=80",
  },
  {
    badge: "Theo dõi tiến độ",
    kicker: "Dashboard học tập",
    title: "Kết quả, quiz và tiến độ được hiển thị rõ ràng trên giao diện",
    desc: "Giúp cả học sinh lẫn phụ huynh đều dễ nắm bắt tình hình học tập.",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
  },
];

export const values = [
  {
    icon: Target,
    title: "Sứ mệnh",
    desc: "Mang đến trải nghiệm học tập Sinh học hiệu quả, thú vị và dễ tiếp cận cho mọi học sinh lớp 10 tại Việt Nam.",
    card: "border-emerald-200 bg-emerald-50",
    iconWrap: "bg-emerald-600",
  },
  {
    icon: Eye,
    title: "Tầm nhìn",
    desc: "Trở thành nền tảng giáo dục khoa học tự nhiên hàng đầu, kết nối học sinh, giáo viên và phụ huynh trong hành trình học tập.",
    card: "border-cyan-200 bg-cyan-50",
    iconWrap: "bg-cyan-600",
  },
];

export const lecturers = [
  {
    prefix: "TS",
    name: "Nguyễn Văn Khoa",
    role: "Tiến sĩ Sinh học tế bào",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80",
    accent: "from-emerald-500 to-teal-500",
    badge: "Cell Biology",
  },
  {
    prefix: "ThS",
    name: "Trần Thị Hoa",
    role: "Thạc sĩ Di truyền học",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80",
    accent: "from-violet-500 to-fuchsia-500",
    badge: "Genetics",
  },
  {
    prefix: "PGS",
    name: "Lê Minh Tuấn",
    role: "Phó Giáo sư Sinh lý học",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=900&q=80",
    accent: "from-cyan-500 to-sky-500",
    badge: "Physiology",
  },
];

export const stats = [
  {
    icon: GraduationCap,
    value: "10K+",
    label: "Học viên tiếp cận",
    card: "border-emerald-200 bg-emerald-50",
    iconWrap: "bg-emerald-600",
  },
  {
    icon: Users,
    value: "120+",
    label: "Lớp học hỗ trợ",
    card: "border-cyan-200 bg-cyan-50",
    iconWrap: "bg-cyan-600",
  },
  {
    icon: ShieldCheck,
    value: "98%",
    label: "Độ hài lòng",
    card: "border-violet-200 bg-violet-50",
    iconWrap: "bg-violet-600",
  },
];

export const highlights = [
  {
    icon: BookOpen,
    title: "Bài giảng bám sát chương trình",
    desc: "Nội dung được xây dựng theo mạch kiến thức Sinh học 10, giúp học sinh học đúng trọng tâm và ôn tập dễ hơn.",
    card: "border-emerald-200 bg-white",
    iconWrap: "bg-emerald-50 text-emerald-600",
    image:
      "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&w=1200&q=80",
  },
  {
    icon: Microscope,
    title: "Trình bày trực quan, dễ hiểu",
    desc: "Hình ảnh, sơ đồ và ví dụ thực tế giúp học sinh hình dung tốt hơn các khái niệm trừu tượng của môn Sinh học.",
    card: "border-cyan-200 bg-white",
    iconWrap: "bg-cyan-50 text-cyan-600",
    image:
      "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=1200&q=80",
  },
  {
    icon: Brain,
    title: "Học cá nhân hóa hơn",
    desc: "Kết hợp quiz, theo dõi tiến độ và gợi ý lộ trình để mỗi học sinh biết mình nên học gì tiếp theo.",
    card: "border-violet-200 bg-white",
    iconWrap: "bg-violet-50 text-violet-600",
    image:
      "https://images.unsplash.com/photo-1532187643603-ba119ca4109e?auto=format&fit=crop&w=1200&q=80",
  },
  {
    icon: ChartColumnBig,
    title: "Theo dõi hiệu quả rõ ràng",
    desc: "Học sinh và phụ huynh có thể nhìn thấy tiến độ, kết quả và các phần cần cải thiện theo từng giai đoạn.",
    card: "border-amber-200 bg-white",
    iconWrap: "bg-amber-50 text-amber-600",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
  },
];

export const audiences = [
  {
    icon: GraduationCap,
    title: "Học sinh cần học chắc từ gốc",
    desc: "Phù hợp với học sinh muốn hiểu bài rõ ràng, nắm được bản chất kiến thức thay vì học thuộc rời rạc.",
    card: "border-emerald-200 bg-emerald-50",
  },
  {
    icon: ClipboardCheck,
    title: "Học sinh đang ôn tập kiểm tra",
    desc: "Có thể dùng để củng cố nhanh trước bài kiểm tra 15 phút, 1 tiết hoặc thi học kỳ.",
    card: "border-cyan-200 bg-cyan-50",
  },
  {
    icon: Laptop,
    title: "Người cần môi trường học linh hoạt",
    desc: "Học ở nhà, trên điện thoại hay máy tính đều thuận tiện, phù hợp cho lịch học bận rộn.",
    card: "border-violet-200 bg-violet-50",
  },
];

export const learningFlow = [
  {
    step: "01",
    title: "Học bài giảng",
    desc: "Bắt đầu từ bài học trọng tâm với phần trình bày dễ hiểu, có sơ đồ và ví dụ trực quan.",
    color: "border-emerald-200 bg-emerald-50",
  },
  {
    step: "02",
    title: "Làm quiz và luyện tập",
    desc: "Kiểm tra lại mức độ hiểu bài ngay sau khi học để ghi nhớ chắc hơn.",
    color: "border-cyan-200 bg-cyan-50",
  },
  {
    step: "03",
    title: "Theo dõi tiến độ",
    desc: "Biết mình đang học đến đâu, phần nào còn yếu và nên ôn lại phần nào.",
    color: "border-violet-200 bg-violet-50",
  },
  {
    step: "04",
    title: "Cải thiện theo gợi ý",
    desc: "Tiếp tục học theo lộ trình được định hướng để tăng hiệu quả từng tuần.",
    color: "border-amber-200 bg-amber-50",
  },
];

export const parentBenefits = [
  "Dễ theo dõi tiến độ học và mức độ hoàn thành bài học của con.",
  "Nhìn rõ kết quả quiz, mức độ chăm chỉ và các phần kiến thức cần hỗ trợ thêm.",
  "Tăng sự yên tâm khi con có một lộ trình học trực quan và rõ ràng.",
];

export const visualSlides = [
  {
    title: "Bài giảng dạng slide trực quan",
    desc: "Hình minh họa, sơ đồ và màu sắc giúp tiếp thu nhanh hơn.",
    image:
      "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&w=1200&q=80",
    badge: "Slide bài học",
    badgeClass: "bg-emerald-500",
  },
  {
    title: "Quiz sau mỗi chuyên đề",
    desc: "Ôn tập ngay sau khi học để nhớ kiến thức chắc hơn.",
    image:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80",
    badge: "Quiz thông minh",
    badgeClass: "bg-cyan-500",
  },
  {
    title: "Bảng theo dõi tiến độ",
    desc: "Biết rõ mình đang ở đâu trong lộ trình học.",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
    badge: "Dashboard",
    badgeClass: "bg-violet-500",
  },
];