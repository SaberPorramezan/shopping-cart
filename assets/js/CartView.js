import Api from "./Api.js";
import Storage from "./Storage.js";
import ProductView from "./ProductView.js";
import Toast from "./Toast.js";

class CartView {
  constructor() {
    // Header
    this.cartCountItems = document.querySelector(".cart-items");
    this.cartItemsCount = document.querySelector(".cart-items__count");
    // Cart
    this.cartWrapper = document.querySelector(".cart-wrapper");
    this.backdrop = document.querySelector(".backdrop");
    this.cartItems = document.querySelector(".cart__items");
    this.cartItemTemplate = document.getElementById("cart__item-template");
    this.cartTotalPrice = document.querySelector(".cart__total-price");
    // Event
    this.cartCountItems.addEventListener("click", () => {
      this.#showCart();
      this.showCartLoading();
    });
    this.backdrop.addEventListener("click", () => this.#backDrop());
  }
  updateCartCount() {
    let tempCartItems = 0;
    const totalPrice = Storage.getCarts().reduce((acc, curr) => {
      tempCartItems += curr.quantity;
      return acc + curr.quantity * curr.price;
    }, 0);
    this.cartTotalPrice.innerText = `Total Price: $ ${totalPrice.toFixed(2)}`;
    this.cartItemsCount.innerText = tempCartItems;
  }
  showCartLoading() {
    const isCart = Storage.getCarts().length;
    if (isCart) {
      if (!this.cartWrapper.classList.contains("hide-loading")) {
        this.cartWrapper.classList.add("hide-loading");
        for (let i = 0; i < isCart; i++) {
          this.cartItems.append(this.cartItemTemplate.content.cloneNode(true));
        }
        Api.getCartItems();
      } else {
        Api.getCartItems();
      }
    }
  }
  showCartItems(cart) {
    this.cartItems.innerHTML = "";
    Storage.getCarts().forEach(({ id: cId, quantity }) => {
      const { image, title, price, id } = cart.find(({ id }) => id == cId);
      const div = this.cartItemTemplate.content.cloneNode(true);
      div.querySelector(".cart__item").setAttribute("data-id", id);
      div.querySelector(
        ".cart__item-left"
      ).innerHTML = `<img src="${image}" class="cart__item-img" loading="lazy" />`;
      div.querySelector(".cart__item-title").textContent = title;
      div.querySelector(".cart__item-price").textContent = `$ ${price}`;
      div.querySelector(".cart__item-count").textContent = quantity;
      div.querySelector(".cart__item-count").setAttribute("data-id", id);
      div.querySelector(".up").setAttribute("data-id", id);
      div.querySelector(".down").setAttribute("data-id", id);
      div.querySelector(".delete").setAttribute("data-id", id);
      this.cartItems.append(div);
    });
    this.#cartController();
    this.#clearCart();
  }
  #cartController() {
    document.querySelectorAll(".cart__item-controller").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const {
          target: {
            classList,
            dataset: { id },
          },
        } = e;
        if (classList.contains("up")) {
          this.#cartProcessing(id, this.#up);
        } else if (classList.contains("down")) {
          const { quantity } = Storage.getCarts().find(
            ({ id: pId }) => pId == id
          );
          if (quantity > 1) {
            this.#cartProcessing(id, this.#down);
          } else {
            this.#deleteFormCart(id);
            Toast.show("Removed from cart", "warning");
          }
        } else {
          this.#deleteFormCart(id);
          Toast.show("Removed from cart", "warning");
        }
      });
    });
  }
  #cartProcessing(dataId, operation) {
    let cart = Storage.getCarts();
    let res = cart.find(({ id }) => id == dataId);
    res.quantity = operation(res.quantity);
    document.querySelectorAll(".cart__item-count").forEach((item) => {
      if (item.dataset.id === dataId) {
        item.innerText = res.quantity;
      }
    });
    Storage.saveCarts(cart);
    this.updateCartCount();
  }
  #up(quantity) {
    return quantity + 1;
  }
  #down(quantity) {
    return quantity - 1;
  }
  #deleteFormCart(id) {
    document.querySelectorAll(".cart__item").forEach((item) => {
      if (item.dataset.id === id) item.remove();
    });
    ProductView.updateProductBtn(id);
    Storage.removeFromCart(id);
    this.updateCartCount();
    this.#closeCart();
  }
  #clearCart() {
    document.getElementById("clear-cart-btn").addEventListener("click", () => {
      const cart = Storage.getCarts();
      if (cart.length) {
        cart.forEach(({ id }) => {
          Storage.removeFromCart(id);
          ProductView.updateProductBtn(id);
        });
        this.showCartItems();
        this.updateCartCount();
        this.#closeCart();
        Toast.show("The cart has been removed", "warning");
      }
    });
  }
  #showCart() {
    if (Storage.getCarts().length) this.cartWrapper.classList.remove("hide");
  }
  #closeCart() {
    if (!Storage.getCarts().length) this.cartWrapper.classList.add("hide");
  }
  #backDrop() {
    this.cartWrapper.classList.add("hide");
  }
}

export default new CartView();
