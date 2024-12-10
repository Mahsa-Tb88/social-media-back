import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";

const allowedExtensions = ["png", "jpg", "webp", "jpeg", "svg"];

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const extension = file.originalname.toLowerCase().split(".").pop();
    if (!allowedExtensions.includes(extension)) {
      cb({ code: "INVALID_EXTENSION" });
    } else {
      cb(null, path.join(__dirname, "../", "uploads"));

      //   if (file.originalname.toLowerCase().includes("blog")) {
      //     req.folder = "blogs";
      //     cb(null, path.join(__dirname, "../", "uploads/blogs"));
      //   } else if (file.originalname.toLowerCase().includes("product")) {
      //     req.folder = "products";
      //     cb(null, path.join(__dirname, "../", "uploads/products"));
      //   } else {
      //     req.folder = "others";
      //     cb(null, path.join(__dirname, "../", "uploads/others"));
      //   }
    }
  },
  filename: function (req, file, cb) {
    const extension = file.originalname.toLowerCase().split(".").pop();
    const fullname =
      file.originalname.split(".")[0] + Date.now() + "." + extension;
    cb(null, fullname);
  },
});

const uploader = multer({ storage, limits: { fileSize: 1 * 1024 * 1204 } });

export default uploader.single("file");
