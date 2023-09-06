import Storage from "./Storage.js";
import CartView from "./CartView.js";
import CategoryView from "./CategoryView.js";

class ProductView {
  constructor() {
    this.cards = document.querySelector(".cards");
    this.cardTemplate = document.getElementById("card-template");
    this.searchInput = document.getElementById("search");
    this.notFound = document.querySelector(".not-found");

    this.productsData = [];

    this.searchInput.addEventListener("input", (e) => {
      this.searchProducts(e.target.value);
    });
  }
  showProductsLoading() {
    for (let i = 0; i < 10; i++) {
      this.cards.append(this.cardTemplate.content.cloneNode(true));
    }
  }
  showProducts(products) {
    this.cards.innerHTML = "";
    products.forEach((p) => {
      const div = this.cardTemplate.content.cloneNode(true);
      div.querySelector(".card__title").textContent = p.title;
      div.querySelector(
        ".card__header"
      ).innerHTML = ` <img src="${p.image}"class="card__img" />`;
      div.querySelector(".rating").innerHTML = `<svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  class="icon"
                >
                  <path
                    d="M5.73998 16C5.84998 15.51 5.64998 14.81 5.29998 14.46L2.86998 12.03C2.10998 11.27 1.80998 10.46 2.02998 9.76C2.25998 9.06 2.96998 8.58 4.02998 8.4L7.14998 7.88C7.59998 7.8 8.14998 7.4 8.35998 6.99L10.08 3.54C10.58 2.55 11.26 2 12 2C12.74 2 13.42 2.55 13.92 3.54L15.64 6.99C15.77 7.25 16.04 7.5 16.33 7.67L5.55998 18.44C5.41998 18.58 5.17998 18.45 5.21998 18.25L5.73998 16Z"
                    fill="currentColor"
                  />
                  <path
                    d="M18.7 14.4599C18.34 14.8199 18.14 15.5099 18.26 15.9999L18.95 19.0099C19.24 20.2599 19.06 21.1999 18.44 21.6499C18.19 21.8299 17.89 21.9199 17.54 21.9199C17.03 21.9199 16.43 21.7299 15.77 21.3399L12.84 19.5999C12.38 19.3299 11.62 19.3299 11.16 19.5999L8.23005 21.3399C7.12005 21.9899 6.17005 22.0999 5.56005 21.6499C5.33005 21.4799 5.16005 21.2499 5.05005 20.9499L17.21 8.7899C17.67 8.3299 18.32 8.1199 18.95 8.2299L19.96 8.3999C21.02 8.5799 21.73 9.0599 21.96 9.7599C22.18 10.4599 21.88 11.2699 21.12 12.0299L18.7 14.4599Z"
                    fill="currentColor"
                  />
                </svg>
                <div class="">
                  <span class="rate">${p.rating.rate}</span>
                  <span class="count">(${p.rating.count})</span>
                </div>`;
      div.querySelector(".card__price").textContent = `$ ${p.price}`;
      div.querySelector(".card__price").setAttribute("data-id", p.id);
      div.querySelector(
        ".card__footer-btns"
      ).innerHTML = `<button class="btn btn--primary add-to-cart-btn" data-id=${p.id}>Add To Cart</button>`;
      this.cards.append(div);
    });
    this.addToCart();
  }
  addToCart() {
    const addToCartBtn = document.querySelectorAll(".add-to-cart-btn");
    const cardPrice = [...document.querySelectorAll(".card__price")];
    addToCartBtn.forEach((btn) => {
      if (Storage.getProduct(btn.dataset.id)) {
        btn.innerText = "In Cart";
        btn.disabled = true;
      }
      btn.addEventListener("click", (e) => {
        console.log();
        if (Storage.getCarts().length < 5) {
          CartView.cartWrapper.classList.remove("hide-loading");
          e.target.innerText = "In Cart";
          e.target.disabled = true;
          const res = cardPrice
            .find((cp) => e.target.dataset.id === cp.dataset.id)
            .textContent.split(" ")[1];
          Storage.saveCarts([
            ...Storage.getCarts(),
            {
              id: e.target.dataset.id,
              price: res,
              quantity: 1,
            },
          ]);
          CartView.updateCartCount();
          Toastify({
            text: "Added to cart",
            className: "success",
            gravity: "top",
            position: "center",
          }).showToast();
        } else {
          Toastify({
            text: `You have ${Storage.getCarts().length} uncompleted orders`,
            className: "info",
            gravity: "top",
            position: "center",
          }).showToast();
        }
      });
    });
  }
  updateProductBtn(id) {
    const addToCartBtn = document.querySelectorAll(".add-to-cart-btn");
    addToCartBtn.forEach((btn) => {
      if (btn.dataset.id === id) {
        btn.innerText = "Add To Cart";
        btn.disabled = false;
      }
    });
  }
  searchProducts(value) {
    if (CategoryView.filteredDataForSearch.length) {
      const res = CategoryView.filteredDataForSearch.filter((p) =>
        p.title.toLowerCase().includes(value.toLowerCase())
      );
      if (res.length) {
        this.notFound.classList.add("hide");
        this.cards.classList.remove("hide");
        this.showProducts(res);
      } else {
        this.notFound.classList.remove("hide");
        this.cards.classList.add("hide");
      }
    } else {
      const res = this.productsData.filter((p) =>
        p.title.toLowerCase().includes(value.toLowerCase())
      );
      if (res.length) {
        this.notFound.classList.add("hide");
        this.cards.classList.remove("hide");
        this.showProducts(res);
      } else {
        this.notFound.classList.remove("hide");
        this.cards.classList.add("hide");
      }
    }
  }
}

export default new ProductView();
