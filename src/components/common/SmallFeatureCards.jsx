import { Layers3, PlayCircle, ScanSearch } from "lucide-react";

export default function SmallFeatureCards() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold text-emerald-700">
            <PlayCircle className="h-4 w-4" />
            Học tập trực quan
          </div>
          <div className="mt-3 text-lg font-bold text-slate-900">Bài học dạng slide dễ theo dõi</div>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            Các nội dung được chia theo khối nhỏ, dễ học, dễ ôn tập và dễ xem lại.
          </p>
        </div>

        <div className="rounded-3xl border border-cyan-200 bg-cyan-50 p-5 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold text-cyan-700">
            <Layers3 className="h-4 w-4" />
            Học có lộ trình
          </div>
          <div className="mt-3 text-lg font-bold text-slate-900">Từng chương được chia rõ ràng</div>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            Học sinh biết chính xác mình đang học phần nào và cần đi tiếp ra sao.
          </p>
        </div>
      </div>

      <div className="rounded-3xl border border-violet-200 bg-violet-50 p-5 shadow-sm">
        <div className="flex items-center gap-2 text-sm font-semibold text-violet-700">
          <ScanSearch className="h-4 w-4" />
          Theo dõi kết quả
        </div>
        <div className="mt-3 text-lg font-bold text-slate-900">Nhìn thấy tiến độ học tập theo thời gian thực</div>
        <p className="mt-2 text-sm leading-7 text-slate-600">
          Kết quả quiz, mức độ hoàn thành và gợi ý học tiếp được hiển thị rõ ràng trên giao diện.
        </p>
      </div>
    </div>
  );
}