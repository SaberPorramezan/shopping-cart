export default class Toast {
  static show(msg, type) {
    Toastify({
      text: msg,
      className: type,
      gravity: "top",
      position: "center",
    }).showToast();
  }
}
