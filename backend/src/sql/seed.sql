-- Optional demo data for Supabase PostgreSQL

INSERT INTO users (id, name, email, password, role, avatar, phone, status)
VALUES
(
  '11111111-1111-1111-1111-111111111111',
  'Admin Biology',
  'admin@example.com',
  '$2a$10$8K1p/a0dURgBzUqflP.9.eY39XzQY0H1snA.MS42duVdqmPBgK5gC',
  'admin',
  'AD',
  '0900000001',
  'active'
),
(
  '22222222-2222-2222-2222-222222222222',
  'Phụ huynh Minh Anh',
  'parent@example.com',
  '$2a$10$8K1p/a0dURgBzUqflP.9.eY39XzQY0H1snA.MS42duVdqmPBgK5gC',
  'parent',
  'PH',
  '0900000002',
  'active'
),
(
  '33333333-3333-3333-3333-333333333333',
  'Nguyễn Minh Anh',
  'student@example.com',
  '$2a$10$8K1p/a0dURgBzUqflP.9.eY39XzQY0H1snA.MS42duVdqmPBgK5gC',
  'student',
  'MA',
  '0900000003',
  'active'
);

UPDATE users
SET parent_id = '22222222-2222-2222-2222-222222222222'
WHERE id = '33333333-3333-3333-3333-333333333333';

INSERT INTO courses (id, title, description, thumbnail, level, price, status, created_by)
VALUES
(
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'Sinh học tế bào',
  'Khám phá cấu trúc tế bào, màng sinh chất, bào quan và chức năng sống.',
  '',
  'basic',
  0,
  'published',
  '11111111-1111-1111-1111-111111111111'
),
(
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  'Di truyền học',
  'Tìm hiểu DNA, gene, nhiễm sắc thể và quy luật di truyền.',
  '',
  'medium',
  99000,
  'published',
  '11111111-1111-1111-1111-111111111111'
),
(
  'cccccccc-cccc-cccc-cccc-cccccccccccc',
  'Sinh thái học',
  'Quần thể, quần xã, hệ sinh thái và cân bằng tự nhiên.',
  '',
  'advanced',
  149000,
  'published',
  '11111111-1111-1111-1111-111111111111'
);

INSERT INTO lessons (id, course_id, title, content, video_url, duration_minutes, sort_order, is_free)
VALUES
(
  'l1111111-1111-1111-1111-111111111111',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'Cấu trúc tế bào',
  'Tế bào là đơn vị cấu trúc và chức năng cơ bản của mọi cơ thể sống.',
  '',
  18,
  1,
  TRUE
),
(
  'l2222222-2222-2222-2222-222222222222',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'Màng sinh chất',
  'Màng sinh chất kiểm soát quá trình trao đổi chất giữa tế bào và môi trường.',
  '',
  22,
  2,
  FALSE
),
(
  'l3333333-3333-3333-3333-333333333333',
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  'DNA và Gene',
  'DNA lưu trữ thông tin di truyền dưới dạng trình tự nucleotide.',
  '',
  20,
  1,
  TRUE
),
(
  'l4444444-4444-4444-4444-444444444444',
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  'Quy luật Mendel',
  'Mendel đặt nền móng cho di truyền học hiện đại thông qua các thí nghiệm trên đậu Hà Lan.',
  '',
  26,
  2,
  FALSE
);

INSERT INTO course_enrollments (id, user_id, course_id, progress_percent)
VALUES
(
  gen_random_uuid()::text,
  '33333333-3333-3333-3333-333333333333',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  50
),
(
  gen_random_uuid()::text,
  '33333333-3333-3333-3333-333333333333',
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  20
);

INSERT INTO lesson_progress (id, user_id, lesson_id, is_completed, last_position_seconds, completed_at)
VALUES
(
  gen_random_uuid()::text,
  '33333333-3333-3333-3333-333333333333',
  'l1111111-1111-1111-1111-111111111111',
  TRUE,
  1080,
  CURRENT_TIMESTAMP
),
(
  gen_random_uuid()::text,
  '33333333-3333-3333-3333-333333333333',
  'l2222222-2222-2222-2222-222222222222',
  FALSE,
  420,
  NULL
);

INSERT INTO quizzes (id, course_id, title, description, time_limit_minutes)
VALUES
(
  'q1111111-1111-1111-1111-111111111111',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'Quiz Sinh học tế bào',
  'Kiểm tra kiến thức cơ bản về tế bào.',
  15
),
(
  'q2222222-2222-2222-2222-222222222222',
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  'Quiz Di truyền học',
  'Kiểm tra kiến thức về DNA và di truyền.',
  20
);

INSERT INTO quiz_questions (
  id, quiz_id, question,
  option_a, option_b, option_c, option_d,
  correct_option, explanation, sort_order
)
VALUES
(
  gen_random_uuid()::text,
  'q1111111-1111-1111-1111-111111111111',
  'Đơn vị cấu trúc cơ bản của cơ thể sống là gì?',
  'Mô',
  'Cơ quan',
  'Tế bào',
  'Hệ cơ quan',
  'C',
  'Tế bào là đơn vị cấu trúc và chức năng cơ bản của sự sống.',
  1
),
(
  gen_random_uuid()::text,
  'q1111111-1111-1111-1111-111111111111',
  'Bào quan nào tham gia tạo ATP trong tế bào?',
  'Nhân',
  'Ti thể',
  'Ribosome',
  'Lưới nội chất',
  'B',
  'Ti thể là nơi diễn ra hô hấp tế bào, tạo ATP.',
  2
),
(
  gen_random_uuid()::text,
  'q2222222-2222-2222-2222-222222222222',
  'DNA được cấu tạo từ đơn phân nào?',
  'Amino acid',
  'Glucose',
  'Nucleotide',
  'Acid béo',
  'C',
  'DNA được cấu tạo từ các nucleotide.',
  1
);

INSERT INTO scores (id, student_id, subject, score, max_score, type, note)
VALUES
(gen_random_uuid()::text, '33333333-3333-3333-3333-333333333333', 'Sinh học tế bào', 8.5, 10, 'quiz', 'Làm bài tốt'),
(gen_random_uuid()::text, '33333333-3333-3333-3333-333333333333', 'Di truyền học', 7.8, 10, 'quiz', 'Cần ôn thêm phần Mendel'),
(gen_random_uuid()::text, '33333333-3333-3333-3333-333333333333', 'Sinh thái học', 8.1, 10, 'assignment', 'Hoàn thành đầy đủ');

INSERT INTO attendance (id, student_id, date, status, note)
VALUES
(gen_random_uuid()::text, '33333333-3333-3333-3333-333333333333', '2026-05-01', 'present', ''),
(gen_random_uuid()::text, '33333333-3333-3333-3333-333333333333', '2026-05-02', 'present', ''),
(gen_random_uuid()::text, '33333333-3333-3333-3333-333333333333', '2026-05-03', 'absent', 'Nghỉ có phép'),
(gen_random_uuid()::text, '33333333-3333-3333-3333-333333333333', '2026-05-04', 'late', 'Vào lớp trễ 10 phút');

INSERT INTO marketplace_items (
  id, title, description, type, price, image_url, file_url, rating, status
)
VALUES
(
  'm1111111-1111-1111-1111-111111111111',
  'Bộ đề luyện thi Sinh học',
  'Tổng hợp đề luyện thi Sinh học có đáp án chi tiết.',
  'exam',
  99000,
  '',
  '/downloads/bo-de-sinh-hoc.pdf',
  4.8,
  'active'
),
(
  'm2222222-2222-2222-2222-222222222222',
  'Flashcard Sinh học 12',
  'Bộ flashcard giúp ghi nhớ nhanh kiến thức Sinh học 12.',
  'flashcard',
  59000,
  '',
  '/downloads/flashcard-sinh-hoc-12.pdf',
  4.7,
  'active'
),
(
  'm3333333-3333-3333-3333-333333333333',
  'Khóa học DNA nâng cao',
  'Khóa học chuyên sâu về DNA, gene và công nghệ sinh học.',
  'course',
  199000,
  '',
  '',
  4.9,
  'active'
);