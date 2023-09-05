import ProductView from "./ProductView.js";
import SortProducts from "./SortProducts.js";

class CategoryView {
  constructor() {
    this.category = document.querySelector(".category");
    this.categoryTemplate = document.getElementById("category-template");

    this.filteredDataForSearch = [];
  }
  showCategoriesLoading() {
    for (let i = 0; i < 4; i++) {
      this.category.append(this.categoryTemplate.content.cloneNode(true));
    }
  }
  showCategories(categories) {
    this.category.innerHTML = "";
    categories.forEach((c) => {
      const div = this.categoryTemplate.content.cloneNode(true);
      div.querySelector(".category-btn").textContent = c;
      this.category.append(div);
    });
    this.filterByCategory();
  }
  filterByCategory() {
    [...document.querySelectorAll(".category-btn")].forEach((btn) =>
      btn.addEventListener("click", (e) => {
        btn.classList.toggle("active");
        let filteredData = [];
        [...document.querySelectorAll(".category-btn")].forEach((btn) => {
          if (btn.classList.contains("active")) {
            const filtered = ProductView.productsData.filter(
              (p) => p.category === btn.textContent
            );
            for (const iterator of filtered) {
              filteredData.push(iterator);
            }
          }
        });
        const sameAsSelected = document.querySelector(".same-as-selected");
        if (sameAsSelected) {
          SortProducts.sortProducts(filteredData, sameAsSelected.textContent);
        }
        this.filteredDataForSearch = filteredData;
        if (filteredData.length) {
          ProductView.showProducts(filteredData);
        } else {
          ProductView.showProducts(ProductView.productsData);
        }

        // btn.classList.toggle("active");
        // let filteredData = [];
        // [...document.querySelectorAll(".category-btn")].forEach((btn) => {
        //   if (btn.classList.contains("active")) {
        //     const filtered = ProductView.productsData.filter(
        //       (p) => p.category === btn.textContent
        //     );
        //     for (const iterator of filtered) {
        //       filteredData.push(iterator);
        //     }
        //   }
        // });
        // this.filteredDataForSearch = filteredData;
        // if (filteredData.length) {
        //   ProductView.showProducts(filteredData);
        // } else {
        //   ProductView.showProducts(ProductView.productsData);
        // }
      })
    );
  }
}

export default new CategoryView();
