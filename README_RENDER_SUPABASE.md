# Biology E-learning — bản gộp Frontend + Backend để deploy Render + Supabase

Bản này đã được chỉnh từ code cũ theo hướng:

- Frontend React và backend Express nằm chung một project.
- Render chạy 1 Web Service duy nhất.
- Backend dùng Supabase PostgreSQL qua `DATABASE_URL`, không dùng XAMPP/MySQL nữa.
- Upload ảnh dùng Supabase Storage nếu có `SUPABASE_URL` và `SUPABASE_SERVICE_ROLE_KEY`.
- Frontend gọi API bằng `/api`, không hard-code `localhost:5000`.

## 1. Tạo database Supabase

Vào Supabase > SQL Editor, chạy lần lượt:

```sql
backend/src/sql/supabase_schema.sql
```

Sau đó nếu muốn có tài khoản demo và dữ liệu mẫu:

```sql
backend/src/sql/supabase_seed.sql
```

Tài khoản demo trong seed:

- Admin: `admin@example.com`
- Parent: `parent@example.com`
- Student: `student@example.com`
- Mật khẩu demo thường là `123456` nếu seed cũ của bạn đang dùng hash đó.

## 2. Tạo Supabase Storage bucket

Tạo bucket tên:

```text
biology-elearning
```

Để frontend xem ảnh trực tiếp, bucket nên public. Nếu không public, bạn cần sửa upload route để tạo signed URL.

## 3. Chạy local

Tạo file `backend/.env` từ `backend/.env.example`, rồi điền:

```env
DATABASE_URL=postgresql://...
DB_SSL=true
JWT_SECRET=your_long_secret
SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_STORAGE_BUCKET=biology-elearning
GEMINI_API_KEY=your_gemini_api_key
```

Terminal 1 chạy backend:

```bash
cd backend
npm install
npm run dev
```

Terminal 2 chạy frontend:

```bash
npm install
npm run dev
```

Frontend local dùng `.env` ngoài root nếu muốn chạy port 3001:

```env
PORT=3001
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SERVER_URL=http://localhost:5000
```

## 4. Deploy Render bằng 1 Web Service

Tạo Web Service mới, trỏ tới repo này.

Build Command:

```bash
npm run render-build
```

Start Command:

```bash
npm start
```

Environment Variables trên Render:

```env
NODE_ENV=production
DATABASE_URL=postgresql://...
DB_SSL=true
JWT_SECRET=your_long_random_secret
JWT_EXPIRES_IN=7d
SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_STORAGE_BUCKET=biology-elearning
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash
```

Không cần đặt `REACT_APP_API_URL` khi deploy chung trên Render, vì frontend sẽ gọi `/api` cùng domain.

## 5. Các file quan trọng đã sửa

- `backend/src/config/db.js`: đổi MySQL sang PostgreSQL/Supabase.
- `backend/src/app.js`: serve React build và API trong cùng Express app.
- `backend/src/routes/upload.routes.js`: upload ảnh lên Supabase Storage.
- `src/services/api.js`: bỏ hard-code `localhost:5000`.
- `backend/src/sql/supabase_schema.sql`: schema PostgreSQL mới.
- `backend/src/sql/supabase_seed.sql`: dữ liệu demo PostgreSQL.

## 6. Lưu ý bảo mật

Không commit file `.env` thật. Không đưa `SUPABASE_SERVICE_ROLE_KEY` vào frontend. Key này chỉ được đặt trong backend/Render Environment Variables.
