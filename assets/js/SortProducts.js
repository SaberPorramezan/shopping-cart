import CategoryView from "./CategoryView.js";
import ProductView from "./ProductView.js";

class SortProducts {
  constructor() {
    this.customSelect = document.getElementsByClassName("custom-select");
  }
  sortProducts(products, value) {
    if (value === "Price: Low to High")
      this.#sortProcessing(products, this.#asc);
    if (value === "Price: High to Low")
      this.#sortProcessing(products, this.#desc);
    if (value === "Most Popular")
      this.#sortProcessing(products, this.#desc, true);

    return products;
  }
  #sortProcessing(products, operation, other = false) {
    if (!other) {
      return products.sort((a, b) => operation(a.price, b.price));
    } else {
      return products.sort((a, b) => operation(a.rating.rate, b.rating.rate));
    }
  }
  #asc(a, b) {
    return a - b;
  }
  #desc(a, b) {
    return b - a;
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
          let {
            target: {
              innerHTML,
              classList,
              parentNode: { previousSibling },
            },
          } = e;
          for (let i = 0; i < select.length; i++) {
            if (select.options[i].innerHTML == innerHTML) {
              select.selectedIndex = i;
              previousSibling.innerHTML = innerHTML;
              const sameAsSelected =
                document.querySelectorAll(".same-as-selected");
              for (let i = 0; i < sameAsSelected.length; i++) {
                sameAsSelected[i].classList.remove("same-as-selected");
              }
              classList.add("same-as-selected");
            }
          }
          this.#selectHide();
          let sortData = CategoryView.filteredDataForSearch.length
            ? CategoryView.filteredDataForSearch
            : ProductView.productsData;
          ProductView.showProducts(this.sortProducts(sortData, innerHTML));
        });
        selectItems.appendChild(option);
      }
      this.customSelect[i].appendChild(selectItems);
    }
    document
      .querySelector(".select-selected")
      .addEventListener("click", (e) => {
        e.stopPropagation();
        this.#selectHide();
      });
  }
  #selectHide() {
    document.querySelector(".select-items").classList.toggle("select-hide");
  }
}

export default new SortProducts();
