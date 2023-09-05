import CategoryView from "./CategoryView.js";
import ProductView from "./ProductView.js";

class SortProducts {
  constructor() {
    this.customSelect = document.getElementsByClassName("custom-select");
  }
  sortProducts(products, value) {
    if (value === "Price: Low to High") {
      return products.sort((a, b) => a.price - b.price);
    } else if (value === "Price: High to Low") {
      return products.sort((a, b) => b.price - a.price);
    } else if (value === "Most Popular") {
      return products.sort((a, b) => b.rating.rate - a.rating.rate);
    } else {
      return products;
    }
  }
  customSelectSetup() {
    for (let i = 0; i < this.customSelect.length; i++) {
      const select = document.querySelector(".select");
      //* Create Select Selected Start
      const selectSelected = document.createElement("DIV");
      selectSelected.classList.add("select-selected");
      selectSelected.innerHTML = select[0].innerHTML;
      this.customSelect[i].appendChild(selectSelected);
      //* Create Select Items
      const selectItems = document.createElement("DIV");
      selectItems.classList.add("select-items", "select-hide");
      for (let i = 1; i < select.length; i++) {
        //* Create options
        const option = document.createElement("DIV");
        option.innerHTML = select.options[i].innerHTML;
        option.addEventListener("click", (e) => {
          for (let i = 0; i < select.length; i++) {
            if (select.options[i].innerHTML == e.target.innerHTML) {
              select.selectedIndex = i;
              e.target.parentNode.previousSibling.innerHTML =
                e.target.innerHTML;
              const sameAsSelected =
                document.querySelectorAll(".same-as-selected");
              for (let i = 0; i < sameAsSelected.length; i++) {
                sameAsSelected[i].classList.remove("same-as-selected");
              }
              e.target.classList.add("same-as-selected");
            }
          }
          this.selectHide();
          if (CategoryView.filteredDataForSearch.length) {
            ProductView.showProducts(
              this.sortProducts(
                CategoryView.filteredDataForSearch,
                e.target.innerHTML
              )
            );
          } else {
            ProductView.showProducts(
              this.sortProducts(ProductView.productsData, e.target.innerHTML)
            );
          }
        });
        selectItems.appendChild(option);
      }
      this.customSelect[i].appendChild(selectItems);
    }

    document
      .querySelector(".select-selected")
      .addEventListener("click", (e) => {
        e.stopPropagation();
        this.selectHide();
      });
  }
  selectHide() {
    document.querySelector(".select-items").classList.toggle("select-hide");
  }
}

export default new SortProducts();