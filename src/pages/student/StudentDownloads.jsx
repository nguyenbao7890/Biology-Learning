import SectionTitle from "../../components/common/SectionTitle";
import Card from "../../components/common/Card";
import Badge from "../../components/common/Badge";

export default function StudentHistory() {
  return (
    <div>
      <SectionTitle title="Lịch sử hoạt động" sub="Toàn bộ lịch sử học tập của bạn" />

      <Card style={{ padding: 0, overflow: "hidden" }}>
        <div
          style={{
            padding: "16px 24px",
            background: "#f9fafb",
            borderBottom: "1px solid #e5e7eb",
            display: "flex",
            gap: 16,
            fontSize: 13,
          }}
        >
          {["Hôm nay", "Tuần này", "Tháng này", "Tất cả"].map((t, i) => (
            <button
              key={t}
              style={{
                padding: "6px 14px",
                borderRadius: 8,
                border: "none",
                cursor: "pointer",
                background: i === 1 ? "#0d9488" : "white",
                color: i === 1 ? "white" : "#6b7280",
                fontWeight: i === 1 ? 600 : 400,
              }}
            >
              {t}
            </button>
          ))}
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f9fafb" }}>
              {["Thời gian", "Hoạt động", "Bài học", "Thời lượng", "Kết quả"].map((h) => (
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
              ["20/04 08:30", "Học bài", "DNA & RNA", "35 phút", "Hoàn thành"],
              ["20/04 09:15", "Làm quiz", "Tế bào học", "15 phút", "9.0/10"],
              ["19/04 14:00", "Xem video", "Phân bào", "20 phút", "Đang học"],
              ["19/04 10:30", "Tải tài liệu", "Enzyme", "–", "Đã tải"],
              ["18/04 16:45", "Học bài", "Màng tế bào", "40 phút", "Hoàn thành"],
            ].map(([time, act, lesson, dur, res], i) => (
              <tr key={i} style={{ borderBottom: "1px solid #f3f4f6" }}>
                <td style={{ padding: "12px 20px", fontSize: 13, color: "#6b7280" }}>{time}</td>
                <td style={{ padding: "12px 20px", fontSize: 13 }}>{act}</td>
                <td style={{ padding: "12px 20px", fontSize: 13, fontWeight: 600 }}>{lesson}</td>
                <td style={{ padding: "12px 20px", fontSize: 13, color: "#6b7280" }}>{dur}</td>
                <td style={{ padding: "12px 20px" }}>
                  <Badge label={res} color="#0d9488" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}