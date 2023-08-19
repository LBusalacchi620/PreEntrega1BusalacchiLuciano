import express from "express";

import prodsRouter from "./routes/products.routes";

const app = express();
app.use(express.json()); //permite trabajar con archivos JSON
app.use(express.urlencoded({ extended: true })); //permite trabajar con multiples consultas a la vez
//Routes
app.use("api/products", prodsRouter);
app.listen(PORT, () => {
  console.log("server on port ${PORT}");
});
