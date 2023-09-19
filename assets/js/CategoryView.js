import Api from "./Api.js";
import ProductView from "./ProductView.js";
import SortProducts from "./SortProducts.js";

class CategoryView {
  constructor() {
    this.categories = document.querySelector(".categories");
    this.categoryTemplate = document.getElementById("category-template");
    this.filteredDataForSearch = [];
  }
  showCategoriesLoading() {
    for (let i = 0; i < 4; i++) {
      this.categories.append(this.categoryTemplate.content.cloneNode(true));
    }
    Api.getAllCategories();
  }
  showCategories(categoriesData) {
    this.categories.innerHTML = "";
    categoriesData.forEach((c) => {
      const div = this.categoryTemplate.content.cloneNode(true);
      div.querySelector(".category-btn").textContent = c;
      this.categories.append(div);
    });
    this.#filterByCategory();
  }
  #filterByCategory() {
    [...document.querySelectorAll(".category-btn")].forEach((btn) =>
      btn.addEventListener("click", () => {
        const { classList } = btn;
        classList.toggle("active");
        let filteredData = [];
        [...document.querySelectorAll(".category-btn")].forEach(
          ({ classList, textContent }) => {
            if (classList.contains("active")) {
              const filtered = ProductView.productsData.filter(
                ({ category }) => category === textContent
              );
              for (const item of filtered) {
                filteredData.push(item);
              }
            }
          }
        );
        const sameAsSelected = document.querySelector(".same-as-selected");
        if (sameAsSelected)
          SortProducts.sortProducts(filteredData, sameAsSelected.textContent);
        this.filteredDataForSearch = filteredData;
        filteredData.length
          ? ProductView.showProducts(filteredData)
          : ProductView.showProducts(ProductView.productsData);
      })
    );
  }
}

export default new CategoryView();
