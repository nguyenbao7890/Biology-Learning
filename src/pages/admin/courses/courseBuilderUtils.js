export const levelOptions = [
  { label: "Cơ bản", value: "basic" },
  { label: "Trung bình", value: "medium" },
  { label: "Nâng cao", value: "advanced" },
];

export const levelLabel = {
  basic: "Cơ bản",
  medium: "Trung bình",
  advanced: "Nâng cao",
};

export const emptyLesson = () => ({
  title: "",
  content: "",
  videoUrl: "",
  imageUrl: "",
  documentUrl: "",
  slideUrl: "",
  model3dUrl: "",
  externalLink: "",
  durationMinutes: "",
  isFree: false,
});

export const emptyQuestion = () => ({
  question: "",
  optionA: "",
  optionB: "",
  optionC: "",
  optionD: "",
  correctOption: "A",
  explanation: "",
});

export const emptyCourseForm = () => ({
  title: "",
  description: "",
  level: "basic",
  price: "",
  status: "published",
  thumbnail: "",
});
