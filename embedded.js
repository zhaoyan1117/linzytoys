var onCheckoutPage = location.pathname == "/one-page-checkout.asp") ||
  (location.pathname.indexOf("/one-page-checkout.asp") != -1);

if (onCheckoutPage) {
  alert('haha');
}