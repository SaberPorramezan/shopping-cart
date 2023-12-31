import ProductView from "./ProductView.js";
import CategoryView from "./CategoryView.js";
import CartView from "./CartView.js";
import SortProducts from "./SortProducts.js";

// DOM Content Loaded
document.addEventListener("DOMContentLoaded", (e) => {
  CategoryView.showCategoriesLoading();
  ProductView.showProductsLoading();
  CartView.updateCartCount();
  SortProducts.customSelectSetup();
});
