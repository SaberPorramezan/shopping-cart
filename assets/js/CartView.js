import Api from "./Api.js";
import Storage from "./Storage.js";
import ProductView from "./ProductView.js";

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

    this.cartCountItems.addEventListener("click", () => {
      this.showCart();
      this.showCartLoading();
    });
    this.backdrop.addEventListener("click", () => {
      this.backDrop();
    });
  }
  updateCartCount() {
    const allCarts = Storage.getCarts();
    let tempCartItems = 0;
    const totalPrice = allCarts.reduce((acc, curr) => {
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
        for (let i = 0; i < isCart; i++) {
          this.cartItems.append(this.cartItemTemplate.content.cloneNode(true));
        }
        this.cartWrapper.classList.add("hide-loading");
        Api.getCartItems();
      } else {
        Api.getCartItems();
      }
    }
  }
  showCartItems(cart) {
    const allCarts = Storage.getCarts();
    this.cartItems.innerHTML = "";
    allCarts.forEach((c) => {
      const res = cart.find((p) => p.id == c.id);
      const div = this.cartItemTemplate.content.cloneNode(true);
      div.querySelector(
        ".cart__item-left"
      ).innerHTML = `<img src="${res.image}" class="cart__item-img" />`;
      div.querySelector(".cart__item-title").textContent = res.title;
      div.querySelector(".cart__item-price").textContent = `$ ${res.price}`;
      div.querySelector(".cart__item-count").textContent = c.quantity;
      div.querySelector(".cart__item-count").setAttribute("data-id", res.id);
      div.querySelector(".up").setAttribute("data-id", res.id);
      div.querySelector(".down").setAttribute("data-id", res.id);
      div.querySelector(".delete").setAttribute("data-id", res.id);
      this.cartItems.append(div);
    });
    this.cartLogic();
    this.clearCart();
  }
  cartLogic() {
    const cartItemController = document.querySelectorAll(
      ".cart__item-controller"
    );
    let cart = Storage.getCarts();
    cartItemController.forEach((cic) => {
      cic.addEventListener("click", (e) => {
        const res = cart.find((c) => c.id == cic.dataset.id);
        if (cic.classList.contains("up")) {
          res.quantity++;
          cic.parentElement.querySelector(".cart__item-count").innerText =
            res.quantity;
          Storage.saveCarts(cart);
          this.updateCartCount();
        } else if (cic.classList.contains("down")) {
          const res = cart.find((c) => c.id == cic.dataset.id);
          if (res.quantity === 1) {
            Api.getCartItems();
            ProductView.updateProductBtn(res.id);
            Storage.removeFromCart(res.id);
            this.updateCartCount();
            this.closeCart();
            // Show Toast
            Toastify({
              text: "Removed from cart",
              className: "warning",
              gravity: "top",
              position: "center",
            }).showToast();
          } else {
            res.quantity--;
            cic.parentElement.querySelector(".cart__item-count").innerText =
              res.quantity;
            Storage.saveCarts(cart);
            this.updateCartCount();
          }
        } else if (cic.classList.contains("delete")) {
          Api.getCartItems();
          ProductView.updateProductBtn(res.id);
          Storage.removeFromCart(res.id);
          this.updateCartCount();
          this.closeCart();
          // Show Toast
          Toastify({
            text: "Removed from cart",
            className: "warning",
            gravity: "top",
            position: "center",
          }).showToast();
        }
      });
    });
  }
  clearCart() {
    const clearCartBtn = document.getElementById("clear-cart-btn");
    clearCartBtn.addEventListener("click", () => {
      const cart = Storage.getCarts();
      if (cart.length) {
        cart.forEach((c) => {
          Storage.removeFromCart(c.id);
          ProductView.updateProductBtn(c.id);
        });
        this.showCartItems();
        this.updateCartCount();
        this.closeCart();
        // Show Toast
        Toastify({
          text: "The cart has been removed",
          className: "warning",
          gravity: "top",
          position: "center",
        }).showToast();
      }
    });
  }
  showCart() {
    if (Storage.getCarts().length) this.cartWrapper.classList.remove("hide");
  }
  closeCart() {
    if (!Storage.getCarts().length) this.cartWrapper.classList.add("hide");
  }
  backDrop() {
    this.cartWrapper.classList.add("hide");
  }
}

export default new CartView();
