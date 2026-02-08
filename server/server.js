import express from "express";
import multer from "multer";
import cors from "cors";
import fs from "fs";
import path from "path";
import db from "./db.js";

const app = express();
app.use(cors());
app.use(express.json());

// folder uploads
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// supaya file bisa diakses via URL
app.use("/uploads", express.static(uploadDir));

// multer simpan file ke lokal
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// ✅ CREATE (upload + simpan DB)
app.post("/api/documents", upload.single("file"), (req, res) => {
  const { category, uploader } = req.body;

  if (!req.file || !category || !uploader) {
    return res.status(400).json({
      success: false,
      message: "file, category, uploader wajib diisi",
    });
  }

  const fileName = req.file.originalname;
  const fileType = (fileName.split(".").pop() || "").toUpperCase();
  const filePath = `/uploads/${req.file.filename}`;
  const uploadDate = new Date().toISOString();
  const status = "pending";

  db.run(
    `INSERT INTO documents (fileName, fileType, category, uploader, uploadDate, status, filePath)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [fileName, fileType, category, uploader, uploadDate, status, filePath],
    function (err) {
      if (err) return res.status(500).json({ success: false, error: err.message });

      return res.status(201).json({
        success: true,
        data: {
          id: this.lastID,
          fileName,
          fileType,
          category,
          uploader,
          uploadDate,
          status,
          filePath,
        },
      });
    }
  );
});

// ✅ READ ALL
app.get("/api/documents", (req, res) => {
  db.all(`SELECT * FROM documents ORDER BY id DESC`, [], (err, rows) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    res.json({ success: true, data: rows });
  });
});

// ✅ DOWNLOAD by id (biar nama file rapi)
app.get("/api/documents/:id/download", (req, res) => {
  db.get(`SELECT * FROM documents WHERE id = ?`, [req.params.id], (err, doc) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    if (!doc) return res.status(404).json({ success: false, message: "Not found" });

    const abs = path.join(process.cwd(), doc.filePath.replace("/uploads/", "uploads/"));
    if (!fs.existsSync(abs)) return res.status(404).json({ success: false, message: "File missing" });

    res.download(abs, doc.fileName);
  });
});

// ✅ UPDATE STATUS
app.patch("/api/documents/:id/status", (req, res) => {
  const { status } = req.body;
  const allowed = ["pending", "reviewing", "approved"];
  if (!allowed.includes(status)) {
    return res.status(400).json({ success: false, message: "status tidak valid" });
  }

  db.run(`UPDATE documents SET status = ? WHERE id = ?`, [status, req.params.id], function (err) {
    if (err) return res.status(500).json({ success: false, error: err.message });
    if (this.changes === 0) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true });
  });
});

// ✅ DELETE (hapus DB + file)
app.delete("/api/documents/:id", (req, res) => {
  db.get(`SELECT * FROM documents WHERE id = ?`, [req.params.id], (err, doc) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    if (!doc) return res.status(404).json({ success: false, message: "Not found" });

    const abs = path.join(process.cwd(), doc.filePath.replace("/uploads/", "uploads/"));
    if (fs.existsSync(abs)) fs.unlinkSync(abs);

    db.run(`DELETE FROM documents WHERE id = ?`, [req.params.id], (err2) => {
      if (err2) return res.status(500).json({ success: false, error: err2.message });
      res.json({ success: true });
    });
  });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Server berjalan di port ${PORT}`));
