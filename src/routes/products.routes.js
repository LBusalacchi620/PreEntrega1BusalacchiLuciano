import { Router } from "express";
const prodsRouter = Router();

import ProductManager from "../productManager.js";
const productManager = new ProductManager("./src/products.json");

//GET para ver todos los productos de products.json, indicando un límite y validándolo
//Ejemplo para probar la ruta localhost:4000/api/products?limit=1
prodsRouter.get("/", async (req, res) => {
  try {
    const { limit } = req.query;

    //Validación del límite
    const parsedLimit = parseInt(limit);
    if (isNaN(parsedLimit) || parsedLimit <= 0) {
      return res.status(400).json({ error: "Indique un número válido" });
    }

    const allProducts = await productManager.getProducts();

    const limitedProducts = allProducts.slice(0, parsedLimit);

    res.status(200).json(limitedProducts);
  } catch (error) {
    //mando un mensaje de error a la terminal y a Postman
    console.error("Hubo un error al procesar la solicitud:", error);
    res.status(500).json({ error: "Hubo un error al procesar la solicitud" });
  }
});

//GET(pid = product id)
//lista el producto indicado por su id
//Ejemplo para probar la ruta localhost:4000/api/products/1
prodsRouter.get("/:pid", async (req, res) => {
  try {
    const pid = req.params.pid;
    //Error en caso de que ingrese letras
    if (!/^\d+$/.test(pid)) {
      return res.status(400).json({ error: "Ingrese un ID numérico y válido" });
    }
    const pidAsNumber = parseInt(pid);
    const product = await productManager.getProductById(pidAsNumber);

    if (product) {
      res.status(200).json(product);
    } else {
      res
        .status(404)
        .json({ message: "El ID no corresponde a un producto existente" });
    }
  } catch (error) {
    console.error("Hubo un error al procesar la solicitud:", error);
    res.status(500).json({ error: "Hubo un error al procesar la solicitud" });
  }
});

//POST
//Agregar un producto desde Postman. Escribir el producto entero con todos sus atributos en Postman
//Ejemplo para probar la ruta: localhost:4000/api/products
prodsRouter.post("/", async (req, res) => {
  try {
    //Creo una variable newProduct y le envío los datos estándar del cuerpo (Es decir, los datos que tendrán TODOS los productos)
    //Tengo que crear esta variable newProduct porque estoy agregando el nuevo producto desde afuera, desde Postman
    const newProduct = req.body;
    const existingProductById = await productManager.getProductById(
      newProduct.id
    );
    const existingProductByCode = await productManager.getProductByCode(
      newProduct.code
    );

    if (existingProductById || existingProductByCode) {
      res
        .status(400)
        .json({ error: "Ya existe un producto con ese ID o código" });
    } else {
      await productManager.addProduct(newProduct);
      res.status(201).json({ message: "Producto agregado exitosamente" });
    }
  } catch (error) {
    console.error("Hubo un error al procesar la solicitud:", error);
    res.status(500).json({ error: "Hubo un error al procesar la solicitud" });
  }
});
//PUT(pid = product id)
//Método para actualizar todos los atributos de un producto, utilizando su id
//Ejemplo para probar la ruta: localhost:4000/api/products/1
prodsRouter.put("/:pid", async (req, res) => {
  try {
    const pid = req.params.pid;
    if (!/^\d+$/.test(pid)) {
      return res
        .status(400)
        .json({ error: "El ID del producto debe ser un número" });
    }

    //Ahora sí parseo, para que Postman me tome como número el pid, y no como string. Sino no me encuentra el producto
    const pidAsNumber = parseInt(pid);
    const product = await productManager.getProductById(pidAsInt);

    if (product) {
      await productManager.updateProduct(pidAsNumber, req.body);
      res.status(200).json({ message: "Producto actualizado" });
    } else {
      res
        .status(404)
        .json({ message: "No se encontró un producto con ese ID" });
    }
  } catch (error) {
    console.error("Hubo un error al procesar la solicitud:", error);
    res.status(500).json({ error: "Hubo un error al procesar la solicitud" });
  }
});
//5) DELETE(pid = product id)
//Poner esto en la ruta: localhost:4000/api/products/1
prodsRouter.delete("/:pid", async (req, res) => {
  try {
    const pid = req.params.pid;
    if (!/^\d+$/.test(pid)) {
      return res
        .status(400)
        .json({ error: "El ID del producto debe ser un número" });
    }
    const pidAsNumber = parseInt(pid);
    const product = await productManager.getProductById(pidAsNumber);
    if (product) {
      await productManager.deleteProduct(pidAsNumber);
      res.status(200).json({ message: "Producto eliminado" });
    } else {
      res
        .status(404)
        .json({ message: "No se encontró un producto con ese ID" });
    }
  } catch (error) {
    console.error("Hubo un error al procesar la solicitud:", error);
    res.status(500).json({ error: "Hubo un error al procesar la solicitud" });
  }
});
export default prodsRouter;
