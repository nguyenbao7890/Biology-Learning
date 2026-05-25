const API_URL = process.env.REACT_APP_API_URL || "/api";
const SERVER_URL = process.env.REACT_APP_SERVER_URL || "";

export function getToken() {
  return localStorage.getItem("token");
}

export function setAuthData(token, user) {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
}

export function clearAuthData() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

export function getStoredUser() {
  const raw = localStorage.getItem("user");

  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function getAssetUrl(path) {
  if (!path) return "";

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  return `${SERVER_URL}${path}`;
}

export async function apiRequest(path, options = {}) {
  const token = getToken();

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.message || "API error");
  }

  return data;
}

export async function uploadRequest(path, formData) {
  const token = getToken();

  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.message || "Upload error");
  }

  return data;
}

export const authApi = {
  register: (payload) =>
    apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  login: (payload) =>
    apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  me: () => apiRequest("/auth/me"),
};

export const courseApi = {
  getAll: () => apiRequest("/courses"),

  getMy: () => apiRequest("/courses/my"),

  getById: (id) => apiRequest(`/courses/${id}`),

  create: (payload) =>
    apiRequest("/courses", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  update: (id, payload) =>
    apiRequest(`/courses/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  delete: (id) =>
    apiRequest(`/courses/${id}`, {
      method: "DELETE",
    }),

  enroll: (id) =>
    apiRequest(`/courses/${id}/enroll`, {
      method: "POST",
    }),
};

export const lessonApi = {
  getById: (id) => apiRequest(`/lessons/${id}`),

  create: (payload) =>
    apiRequest("/lessons", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  update: (id, payload) =>
    apiRequest(`/lessons/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  delete: (id) =>
    apiRequest(`/lessons/${id}`, {
      method: "DELETE",
    }),

  updateProgress: (id, payload) =>
    apiRequest(`/lessons/${id}/progress`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};

export const quizApi = {
  getAll: () => apiRequest("/quizzes"),

  getByCourse: (courseId) => apiRequest(`/quizzes?courseId=${courseId}`),

  getById: (id) => apiRequest(`/quizzes/${id}`),

  history: () => apiRequest("/quizzes/history/my"),

  create: (payload) =>
    apiRequest("/quizzes", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  submit: (id, payload) =>
    apiRequest(`/quizzes/${id}/submit`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  delete: (id) =>
    apiRequest(`/quizzes/${id}`, {
      method: "DELETE",
    }),
};

export const uploadApi = {
  image: (type, file) => {
    const formData = new FormData();
    formData.append("file", file);

    return uploadRequest(`/uploads/${type}`, formData);
  },

  file: (type, file) => {
    const formData = new FormData();
    formData.append("file", file);

    return uploadRequest(`/uploads/${type}`, formData);
  },
};

export const marketplaceApi = {
  getAll: () => apiRequest("/marketplace"),

  getById: (id) => apiRequest(`/marketplace/${id}`),

  create: (payload) =>
    apiRequest("/marketplace", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  update: (id, payload) =>
    apiRequest(`/marketplace/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  delete: (id) =>
    apiRequest(`/marketplace/${id}`, {
      method: "DELETE",
    }),

  buy: (id) =>
    apiRequest(`/marketplace/${id}/buy`, {
      method: "POST",
    }),

  myPurchases: () => apiRequest("/marketplace/purchases/my"),
};

export const parentApi = {
  children: () => apiRequest("/parent/children"),

  overview: (childId) =>
    apiRequest(childId ? `/parent/overview?childId=${childId}` : "/parent/overview"),

  scores: (childId) =>
    apiRequest(childId ? `/parent/scores?childId=${childId}` : "/parent/scores"),

  attendance: (childId) =>
    apiRequest(
      childId ? `/parent/attendance?childId=${childId}` : "/parent/attendance"
    ),
};

export const adminApi = {
  analytics: () => apiRequest("/admin/analytics"),

  tracking: () => apiRequest("/admin/tracking"),

  users: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(query ? `/users?${query}` : "/users");
  },

  createUser: (payload) =>
    apiRequest("/users", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  updateUser: (id, payload) =>
    apiRequest(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  deleteUser: (id) =>
    apiRequest(`/users/${id}`, {
      method: "DELETE",
    }),

  createAttendance: (payload) =>
    apiRequest("/admin/attendance", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  createScore: (payload) =>
    apiRequest("/admin/scores", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};
export const studentApi = {
  overview: () => apiRequest("/student/overview"),

  activities: (range = "all") => apiRequest(`/student/activities?range=${range}`),

  createActivity: (payload) =>
    apiRequest("/student/activities", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  continueLearning: () => apiRequest("/student/continue-learning"),
};

export const chatbotApi = {
  sendMessage: (message) => {
    const text =
      typeof message === "string"
        ? message
        : message?.message || message?.text || message?.content || "";

    return apiRequest("/chatbot/message", {
      method: "POST",
      body: JSON.stringify({ message: text }),
    });
  },
};
