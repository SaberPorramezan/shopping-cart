import App from "./Axios.js";
import ProductView from "./ProductView.js";
import CartView from "./CartView.js";
import CategoryView from "./CategoryView.js";

class Api {
  async getAllProducts() {
    try {
      const { data } = await App.get("/products");
      ProductView.productsData = data;
      ProductView.showProducts(data);
    } catch (error) {
      console.log(error.message);
    }
  }
  async getAllCategories() {
    try {
      const { data } = await App.get("/products/categories");
      CategoryView.showCategories(data);
    } catch (error) {
      console.log(error.message);
    }
  }
  async getCartItems() {
    try {
      const { data } = await App.get("/products");
      CartView.showCartItems(data);
    } catch (error) {
      console.log(error.message);
    }
  }
}
export default new Api();
