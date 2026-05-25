const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { createClient } = require("@supabase/supabase-js");
const { authMiddleware, allowRoles } = require("../middleware/auth.middleware");

const router = express.Router();

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB

const IMAGE_TYPES = ["courses", "lessons"];
const DOCUMENT_TYPES = ["lesson-documents"];
const SLIDE_TYPES = ["lesson-slides"];

const allowedMimeTypesByUploadType = {
  courses: ["image/jpeg", "image/png", "image/webp", "image/gif"],
  lessons: ["image/jpeg", "image/png", "image/webp", "image/gif"],

  "lesson-documents": [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "application/zip",
    "application/x-zip-compressed",
    "application/x-rar-compressed",
    "text/plain",
    "text/csv",
  ],

  "lesson-slides": [
    "application/pdf",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ],
};

const allowedExtByUploadType = {
  courses: [".jpg", ".jpeg", ".png", ".webp", ".gif"],
  lessons: [".jpg", ".jpeg", ".png", ".webp", ".gif"],

  "lesson-documents": [
    ".pdf",
    ".doc",
    ".docx",
    ".xls",
    ".xlsx",
    ".ppt",
    ".pptx",
    ".zip",
    ".rar",
    ".txt",
    ".csv",
  ],

  "lesson-slides": [".pdf", ".ppt", ".pptx"],
};

function normalizeUploadType(type) {
  const allowedTypes = [
    ...IMAGE_TYPES,
    ...DOCUMENT_TYPES,
    ...SLIDE_TYPES,
  ];

  return allowedTypes.includes(type) ? type : null;
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter(req, file, cb) {
    const type = normalizeUploadType(req.params.type);
    const ext = path.extname(file.originalname || "").toLowerCase();

    if (!type) {
      return cb(new Error("Invalid upload type"));
    }

    const allowedMimes = allowedMimeTypesByUploadType[type] || [];
    const allowedExts = allowedExtByUploadType[type] || [];

    const mimeOk = allowedMimes.includes(file.mimetype);
    const extOk = allowedExts.includes(ext);

    if (!mimeOk && !extOk) {
      if (IMAGE_TYPES.includes(type)) {
        return cb(new Error("Only image files are allowed"));
      }

      if (SLIDE_TYPES.includes(type)) {
        return cb(new Error("Only PDF, PPT, or PPTX slide files are allowed"));
      }

      return cb(new Error("File type is not allowed"));
    }

    return cb(null, true);
  },
});

function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) return null;

  return createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

function safeFileName(name) {
  return String(name || "file")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]/g, "-");
}

router.post(
  "/:type",
  authMiddleware,
  allowRoles("admin"),
  upload.single("file"),
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const type = normalizeUploadType(req.params.type);

      if (!type) {
        return res.status(400).json({ message: "Invalid upload type" });
      }

      const ext = path.extname(req.file.originalname) || "";
      const originalName = safeFileName(req.file.originalname);
      const fileName = `${type}/${Date.now()}-${Math.round(
        Math.random() * 1e9
      )}-${originalName || `upload${ext}`}`;

      const supabase = getSupabaseAdmin();
      const bucket = process.env.SUPABASE_STORAGE_BUCKET || "biology-elearning";

      if (supabase) {
        const { error } = await supabase.storage
          .from(bucket)
          .upload(fileName, req.file.buffer, {
            contentType: req.file.mimetype,
            upsert: false,
          });

        if (error) throw error;

        const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);

        return res.status(201).json({
          message: "Upload success",
          url: data.publicUrl,
        });
      }

      const uploadDir = path.join(process.cwd(), "uploads", type);
      fs.mkdirSync(uploadDir, { recursive: true });
      fs.writeFileSync(path.join(uploadDir, path.basename(fileName)), req.file.buffer);

      return res.status(201).json({
        message: "Upload success",
        url: `/uploads/${type}/${path.basename(fileName)}`,
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;