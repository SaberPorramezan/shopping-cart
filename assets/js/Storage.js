export default class Storage {
  static getProduct(id) {
    return this.getCarts().find((p) => Number(p.id) === Number(id));
  }

  static saveCarts(cart) {
    localStorage.setItem("carts", JSON.stringify(cart));
  }

  static getCarts() {
    return JSON.parse(localStorage.getItem("carts")) || [];
  }

  static removeFromCart(id) {
    this.saveCarts(
      this.getCarts().filter((cartItem) => Number(cartItem.id) !== Number(id))
    );
  }
}
