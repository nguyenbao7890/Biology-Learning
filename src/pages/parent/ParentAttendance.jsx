import SectionTitle from "../../components/common/SectionTitle";
import StatCard from "../../components/common/StatCard";
import Card from "../../components/common/Card";
import Badge from "../../components/common/Badge";

export default function ParentScores() {
  return (
    <div>
      <SectionTitle title="Điểm kiểm tra" sub="Kết quả toàn bộ bài kiểm tra" />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
        <StatCard label="Điểm trung bình" value="8.2" color="#7c3aed" />
        <StatCard label="Điểm cao nhất" value="9.5" color="#059669" />
        <StatCard label="Số bài đã thi" value="12" color="#0891b2" />
      </div>

      <Card style={{ padding: 0, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f9fafb" }}>
              {["Ngày", "Bài kiểm tra", "Chương", "Điểm", "Xếp hạng", "Đánh giá"].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "12px 20px",
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#6b7280",
                    textAlign: "left",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {[
              ["18/04", "Kiểm tra 15 phút", "Tế bào học", "9.0", "3/32", "Xuất sắc", "#059669"],
              ["15/04", "Giữa kỳ", "Chuyển hóa", "7.5", "12/32", "Khá", "#d97706"],
              ["10/04", "Kiểm tra thường xuyên", "Di truyền", "8.5", "6/32", "Giỏi", "#0d9488"],
              ["05/04", "Kiểm tra 1 tiết", "Phân bào", "6.0", "20/32", "Trung bình", "#f59e0b"],
            ].map(([date, name, ch, score, rank, eval_, color], i) => (
              <tr key={i} style={{ borderBottom: "1px solid #f3f4f6" }}>
                <td style={{ padding: "12px 20px", fontSize: 13, color: "#6b7280" }}>{date}</td>
                <td style={{ padding: "12px 20px", fontSize: 13, fontWeight: 600 }}>{name}</td>
                <td style={{ padding: "12px 20px", fontSize: 13, color: "#4b5563" }}>{ch}</td>
                <td style={{ padding: "12px 20px", fontSize: 16, fontWeight: 800, color }}>{score}</td>
                <td style={{ padding: "12px 20px", fontSize: 13, color: "#6b7280" }}>{rank}</td>
                <td style={{ padding: "12px 20px" }}>
                  <Badge label={eval_} color={color} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}