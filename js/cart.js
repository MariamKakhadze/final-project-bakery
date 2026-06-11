(function () {
    const overlay = document.getElementById('cart-overlay');
    const drawer = document.getElementById('cart-drawer');

    if (!overlay || !drawer) {
        return;
    }

    const openButtons = document.querySelectorAll('[data-cart-open]');
    const closeButtons = overlay.querySelectorAll('[data-cart-close]');
    let lastFocusedElement = null;

    function openCart() {
        lastFocusedElement = document.activeElement;
        overlay.hidden = false;
        drawer.setAttribute('aria-hidden', 'false');
        overlay.classList.add('cart-overlay--open');
        document.body.classList.add('cart-open');

        const closeButton = overlay.querySelector('.cart-drawer__close');
        if (closeButton) {
            closeButton.focus();
        }
    }

    function closeCart() {
        overlay.classList.remove('cart-overlay--open');
        drawer.setAttribute('aria-hidden', 'true');
        overlay.hidden = true;
        document.body.classList.remove('cart-open');

        if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
            lastFocusedElement.focus();
        }
    }

    openButtons.forEach(function (button) {
        button.addEventListener('click', openCart);
    });

    closeButtons.forEach(function (button) {
        button.addEventListener('click', closeCart);
    });

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && !overlay.hidden) {
            closeCart();
        }
    });
})();
