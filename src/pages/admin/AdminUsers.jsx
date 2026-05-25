import { useEffect, useMemo, useState } from "react";
import {
  Eye,
  EyeOff,
  Pencil,
  Plus,
  Search,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import { ROLE_COLORS, ROLE_LABELS } from "../../data/nav";
import SectionTitle from "../../components/common/SectionTitle";
import Card from "../../components/common/Card";
import Avatar from "../../components/common/Avatar";
import Badge from "../../components/common/Badge";
import { adminApi } from "../../services/api";

const fallbackRoleLabels = {
  student: "Học sinh",
  parent: "Phụ huynh",
  teacher: "Giáo viên",
  admin: "Admin",
};

const fallbackRoleColors = {
  student: "#10b981",
  parent: "#8b5cf6",
  teacher: "#059669",
  admin: "#dc2626",
};

const emptyCreateForm = {
  name: "",
  email: "",
  password: "",
  role: "student",
  phone: "",
  status: "active",
  parentId: "",
};

function formatDate(value) {
  if (!value) return "-";

  try {
    return new Date(value).toLocaleDateString("vi-VN");
  } catch {
    return "-";
  }
}

function getInitials(user) {
  if (user.avatar) return user.avatar;

  return (
    user.name
      ?.split(" ")
      .slice(-2)
      .map((x) => x[0])
      .join("")
      .toUpperCase() || "U"
  );
}

export default function AdminUsers() {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [parents, setParents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");

  const [creating, setCreating] = useState(false);
  const [createForm, setCreateForm] = useState(emptyCreateForm);
  const [showCreatePassword, setShowCreatePassword] = useState(false);

  const [editingUser, setEditingUser] = useState(null);
  const [editRole, setEditRole] = useState("student");
  const [editParentId, setEditParentId] = useState("");
  const [saving, setSaving] = useState(false);

  async function fetchUsers(keyword = "") {
    try {
      setLoading(true);
      setError("");

      const data = await adminApi.users(
        keyword.trim() ? { keyword: keyword.trim() } : {}
      );

      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Admin users error:", err);
      setError(err.message || "Không thể tải danh sách người dùng");
    } finally {
      setLoading(false);
    }
  }

  async function fetchParents() {
    try {
      const data = await adminApi.users({ role: "parent" });
      setParents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Load parents error:", err);
      setParents([]);
    }
  }

  useEffect(() => {
    fetchUsers();
    fetchParents();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers(search);
    }, 350);

    return () => clearTimeout(timer);
  }, [search]);

  function openCreateModal() {
    setCreateForm(emptyCreateForm);
    setShowCreatePassword(false);
    setCreating(true);
    fetchParents();
  }

  function closeCreateModal() {
    if (saving) return;

    setCreating(false);
    setCreateForm(emptyCreateForm);
    setShowCreatePassword(false);
  }

  function updateCreateForm(field, value) {
    setCreateForm((prev) => {
      const next = {
        ...prev,
        [field]: value,
      };

      if (field === "role" && value !== "student") {
        next.parentId = "";
      }

      return next;
    });
  }

  async function handleCreateUser() {
    const name = createForm.name.trim();
    const email = createForm.email.trim();
    const password = createForm.password.trim();

    if (!name) {
      alert("Vui lòng nhập tên người dùng");
      return;
    }

    if (!email) {
      alert("Vui lòng nhập email");
      return;
    }

    if (!password) {
      alert("Vui lòng nhập mật khẩu");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        name,
        email,
        password,
        role: createForm.role,
        phone: createForm.phone.trim() || null,
        status: createForm.status || "active",
      };

      if (createForm.role === "student") {
        payload.parentId = createForm.parentId || null;
      }

      const createdUser = await adminApi.createUser(payload);

      setUsers((prev) => [createdUser, ...prev]);
      await fetchParents();
      closeCreateModal();
    } catch (err) {
      console.error("Create user error:", err);
      alert(err.message || "Không thể thêm người dùng");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(user) {
    const ok = window.confirm(`Xóa người dùng "${user.name}"?`);

    if (!ok) return;

    try {
      setDeletingId(user.id);
      await adminApi.deleteUser(user.id);
      setUsers((prev) => prev.filter((item) => item.id !== user.id));

      if (user.role === "parent") {
        await fetchParents();
      }
    } catch (err) {
      console.error("Delete user error:", err);
      alert(err.message || "Không thể xóa người dùng");
    } finally {
      setDeletingId(null);
    }
  }

  async function openEditModal(user) {
    setEditingUser(user);
    setEditRole(user.role || "student");
    setEditParentId(user.parent_id || "");
    await fetchParents();
  }

  function closeEditModal() {
    if (saving) return;

    setEditingUser(null);
    setEditRole("student");
    setEditParentId("");
  }

  async function handleUpdateUser() {
    if (!editingUser) return;

    try {
      setSaving(true);

      const payload = {
        name: editingUser.name,
        email: editingUser.email,
        role: editRole,
        status: editingUser.status || "active",
      };

      if (editRole === "student") {
        payload.parentId = editParentId || null;
      } else {
        payload.parentId = null;
      }

      const updatedUser = await adminApi.updateUser(editingUser.id, payload);

      setUsers((prev) =>
        prev.map((user) =>
          user.id === editingUser.id
            ? {
                ...user,
                ...updatedUser,
                role: updatedUser?.role || editRole,
                parent_id:
                  updatedUser?.parent_id ??
                  updatedUser?.parentId ??
                  payload.parentId ??
                  null,
              }
            : user
        )
      );

      await fetchParents();
      closeEditModal();
    } catch (err) {
      console.error("Update user error:", err);
      alert(err.message || "Không thể cập nhật người dùng");
    } finally {
      setSaving(false);
    }
  }

  const allUsers = useMemo(() => {
    return users.map((user) => ({
      ...user,
      status: user.status || "active",
    }));
  }, [users]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <SectionTitle
          title="Quản lý người dùng"
          sub="Theo dõi, tìm kiếm và quản trị tài khoản trên hệ thống"
        />

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm kiếm người dùng..."
              className="h-11 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-sm outline-none transition focus:border-emerald-400 sm:w-64"
            />
          </div>

          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 px-5 text-sm font-semibold text-white shadow-lg shadow-rose-600/20 transition hover:scale-[1.02]"
          >
            <Plus className="h-4 w-4" />
            Thêm người dùng
          </button>
        </div>
      </div>

      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50">
                {[
                  "Người dùng",
                  "Email",
                  "Vai trò",
                  "Phụ huynh",
                  "Trạng thái",
                  "Ngày tạo",
                  "Hành động",
                ].map((h) => (
                  <th
                    key={h}
                    className="border-b border-slate-200 px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-8 text-center text-sm text-slate-500"
                  >
                    Đang tải danh sách người dùng...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-8 text-center text-sm font-medium text-rose-600"
                  >
                    {error}
                  </td>
                </tr>
              ) : allUsers.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <div className="px-6 py-12 text-center">
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                        <Search className="h-6 w-6" />
                      </div>

                      <h3 className="mt-4 text-lg font-bold text-slate-900">
                        Không tìm thấy người dùng
                      </h3>

                      <p className="mt-2 text-sm text-slate-500">
                        Thử nhập từ khóa khác để tìm kiếm chính xác hơn.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                allUsers.map((u) => {
                  const initials = getInitials(u);
                  const roleLabel =
                    ROLE_LABELS?.[u.role] ||
                    fallbackRoleLabels[u.role] ||
                    u.role;

                  const roleColor =
                    ROLE_COLORS?.[u.role] ||
                    fallbackRoleColors[u.role] ||
                    "#64748b";

                  const parentName =
                    u.parent_name ||
                    u.parentName ||
                    parents.find((p) => String(p.id) === String(u.parent_id))
                      ?.name ||
                    "-";

                  return (
                    <tr
                      key={u.id}
                      className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/70"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar
                            initials={initials}
                            size={36}
                            color={roleColor}
                          />

                          <div className="min-w-0">
                            <div className="truncate text-sm font-semibold text-slate-900">
                              {u.name}
                            </div>

                            <div className="mt-0.5 flex items-center gap-1 text-xs text-slate-400">
                              <UserRound className="h-3.5 w-3.5" />
                              ID #{u.id}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-500">
                        {u.email || "-"}
                      </td>

                      <td className="px-5 py-4">
                        <Badge label={roleLabel} color={roleColor} />
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-500">
                        {u.role === "student" ? parentName : "-"}
                      </td>

                      <td className="px-5 py-4">
                        <Badge
                          label={u.status === "active" ? "Hoạt động" : "Không HĐ"}
                          color={u.status === "active" ? "#059669" : "#6b7280"}
                        />
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-500">
                        {formatDate(u.created_at)}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => openEditModal(u)}
                            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>

                          <button
                            type="button"
                            disabled={deletingId === u.id}
                            onClick={() => handleDelete(u)}
                            className="flex h-9 w-9 items-center justify-center rounded-xl border border-rose-200 bg-rose-50 text-rose-600 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {creating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Thêm người dùng
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Tạo tài khoản mới cho học sinh, phụ huynh, giáo viên hoặc admin.
                </p>
              </div>

              <button
                type="button"
                onClick={closeCreateModal}
                disabled={saving}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Họ tên
                </label>

                <input
                  value={createForm.name}
                  onChange={(e) => updateCreateForm("name", e.target.value)}
                  placeholder="Nhập họ tên"
                  className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Email
                </label>

                <input
                  value={createForm.email}
                  onChange={(e) => updateCreateForm("email", e.target.value)}
                  placeholder="email@example.com"
                  className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Mật khẩu
                </label>

                <div className="relative">
                  <input
                    type={showCreatePassword ? "text" : "password"}
                    value={createForm.password}
                    onChange={(e) =>
                      updateCreateForm("password", e.target.value)
                    }
                    placeholder="Nhập mật khẩu"
                    className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 pr-11 text-sm text-slate-700 outline-none transition focus:border-emerald-400"
                  />

                  <button
                    type="button"
                    onClick={() => setShowCreatePassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                  >
                    {showCreatePassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Số điện thoại
                </label>

                <input
                  value={createForm.phone}
                  onChange={(e) => updateCreateForm("phone", e.target.value)}
                  placeholder="Có thể bỏ trống"
                  className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Vai trò
                </label>

                <select
                  value={createForm.role}
                  onChange={(e) => updateCreateForm("role", e.target.value)}
                  className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-emerald-400"
                >
                  <option value="student">Học sinh</option>
                  <option value="parent">Phụ huynh</option>
                  <option value="teacher">Giáo viên</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {createForm.role === "student" && (
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Phụ huynh
                  </label>

                  <select
                    value={createForm.parentId}
                    onChange={(e) =>
                      updateCreateForm("parentId", e.target.value)
                    }
                    className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-emerald-400"
                  >
                    <option value="">Chưa gán phụ huynh</option>

                    {parents.map((parent) => (
                      <option key={parent.id} value={parent.id}>
                        {parent.name} - {parent.email}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Trạng thái
                </label>

                <select
                  value={createForm.status}
                  onChange={(e) => updateCreateForm("status", e.target.value)}
                  className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-emerald-400"
                >
                  <option value="active">Hoạt động</option>
                  <option value="inactive">Không hoạt động</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeCreateModal}
                disabled={saving}
                className="h-11 rounded-2xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Hủy
              </button>

              <button
                type="button"
                onClick={handleCreateUser}
                disabled={saving}
                className="h-11 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 px-5 text-sm font-semibold text-white shadow-lg shadow-rose-600/20 transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Đang tạo..." : "Tạo người dùng"}
              </button>
            </div>
          </div>
        </div>
      )}

      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Sửa người dùng
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Cập nhật vai trò và phụ huynh cho {editingUser.name}
                </p>
              </div>

              <button
                type="button"
                onClick={closeEditModal}
                disabled={saving}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Người dùng
                </label>

                <input
                  value={editingUser.name || ""}
                  disabled
                  className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-500 outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Email
                </label>

                <input
                  value={editingUser.email || ""}
                  disabled
                  className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-500 outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Vai trò
                </label>

                <select
                  value={editRole}
                  onChange={(e) => {
                    setEditRole(e.target.value);

                    if (e.target.value !== "student") {
                      setEditParentId("");
                    }
                  }}
                  className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-emerald-400"
                >
                  <option value="student">Học sinh</option>
                  <option value="parent">Phụ huynh</option>
                  <option value="teacher">Giáo viên</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {editRole === "student" && (
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Phụ huynh
                  </label>

                  <select
                    value={editParentId}
                    onChange={(e) => setEditParentId(e.target.value)}
                    className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-emerald-400"
                  >
                    <option value="">Chưa gán phụ huynh</option>

                    {parents.map((parent) => (
                      <option key={parent.id} value={parent.id}>
                        {parent.name} - {parent.email}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeEditModal}
                disabled={saving}
                className="h-11 rounded-2xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Hủy
              </button>

              <button
                type="button"
                onClick={handleUpdateUser}
                disabled={saving}
                className="h-11 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 px-5 text-sm font-semibold text-white shadow-lg shadow-rose-600/20 transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}