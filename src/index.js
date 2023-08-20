import express from "express";
import prodsRouter from "./routes/products.routes.js";
import multer from "multer";
import { __dirname } from "./path.js";
import path from "path";

const PORT = 4000;
const app = express();

//configuracion de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/public/img"); //null hace referencia a que no envia errores
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${file.originalname}`); //Concateno el nombre original de mi archivo con milisegundos con Date.now()
  },
});

//Middleware
app.use(express.json()); //permite trabajar con archivos JSON
app.use(express.urlencoded({ extended: true })); //permite trabajar con multiples consultas a la vez
const upload = multer({ storage: storage });

//Routes
app.use("/api/products", prodsRouter);
app.use("/static", express.static(path.join(__dirname, "/public"))); //con este truquito sorteo el problema de que los diferentes SI usan las barras para direcciones invertidas
app.post("/upload", upload.single("product"), (req, res) => {
  console.log(req.file);
  console.log(req.body);
  res.status(200).send("Imagen cargada");
});
console.log(
  "Esta es mi dirección en el path:" + path.join(__dirname, "/public")
);

app.listen(PORT, () => {
  console.log(`Server on port ${PORT}`);
});
