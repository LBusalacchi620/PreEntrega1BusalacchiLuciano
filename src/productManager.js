import { promises as fs } from "fs";

class ProductManager {
  constructor(filePath) {
    /*
        Ubico el path como argumento de la clase ProductManager, y no fuera de la clase como hacía antes
        La diferencia es que haciendo esto, puedo utilizar varios path para distintas clases en el mismo archivo
        Estoy definiendo que este path le pertenece a esta clase. filePath es una variable
        Puedo utilizar esto:
        const productManager = new ProductManager("./src/productos.json");
        O esto:
        const filePath = "./src/productos.json";
        const productManager = new ProductManager(filePath);
        O también se puede poner como argumento this.path = "./src/productos.json" y no pasarle parámetro al constructor
        */
    this.path = filePath;
  }
  //GET--> devuelve todos los productos de products.JSON
  async getProducts() {
    const prods = JSON.parse(await fs.readFile(this.path, "utf-8"));
    return prods;
  }

  // Devuelve el producto que coincida con el id en products.JSON
  async getProductById(id) {
    const prods = JSON.parse(await fs.readFile(this.path, "utf-8"));
    const producto = prods.find((prod) => prod.id === id);

    if (producto) {
      return producto;
    } else {
      return null;
    }
  }
  // Lo mismo que el getProductById pero teniendo en cuenta el code
  async getProductByCode(code) {
    const prods = JSON.parse(await fs.readFile(this.path, "utf-8"));
    const producto = prods.find((prod) => prod.code === code);

    if (producto) {
      return producto;
    } else {
      return null;
    }
  }
  // Agrego un producto nuevo, validando que todos los campos estén llenos y que no se repita ni el ID ni el code
  async addProduct(product) {
    if (
      !product.title ||
      !product.description ||
      !product.price ||
      !product.code ||
      !product.status ||
      !product.stock ||
      !product.category ||
      !product.thumbnail
    ) {
      console.log("Todos los campos son obligatorios");
      return;
    }

    const prods = JSON.parse(await fs.readFile(this.path, "utf-8"));
    const prodId = prods.find((prod) => prod.id === product.id);
    const prodCode = prods.find((prod) => prod.code === product.code);
    if (prodId || prodCode) {
      console.log("Ya existe un producto con ese ID o código");
    } else {
      prods.push(product);
      await fs.writeFile(this.path, JSON.stringify(prods));
    }
  }

  //Borro el producto que esté ubicado en donde coincida el id con el id ingresado
  async deleteProduct(id) {
    const prods = JSON.parse(await fs.readFile(this.path, "utf-8"));
    const productoIndex = prods.findIndex((prod) => prod.id === id);

    if (productoIndex !== -1) {
      prods.splice(productoIndex, 1);
      await fs.writeFile(this.path, JSON.stringify(prods));
    } else {
      console.log("Producto no encontrado");
    }
  }
}
// defino la clase product con todos sus campos, el campo status arranca siendo true y el id no se ingresa, sino que se autogenera de manera incremental
class Product {
  constructor(
    title,
    description,
    price,
    code,
    stock,
    category,
    thumbnail,
    status = true
  ) {
    this.title = title;
    this.description = description;
    this.price = price;
    this.code = code;
    this.status = status;
    this.stock = stock;
    this.category = category;
    this.thumbnail = thumbnail;
    this.id = Product.incrementarId();
  }

  static incrementarId() {
    if (this.idIncrement) {
      this.idIncrement++;
    } else {
      this.idIncrement = 1;
    }
    return this.idIncrement;
  }
}

export default ProductManager;
