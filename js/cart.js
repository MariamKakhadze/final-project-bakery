(function () {
    const STORAGE_KEY = 'bule-cart';
    const DELIVERY_FEE = 5;

    const overlay = document.getElementById('cart-overlay');
    const drawer = document.getElementById('cart-drawer');
    const itemsList = document.getElementById('cart-drawer-items');
    const emptyState = document.getElementById('cart-drawer-empty');
    const subtotalEl = document.querySelector('[data-cart-subtotal]');
    const deliveryEl = document.querySelector('[data-cart-delivery]');
    const totalEl = document.querySelector('[data-cart-total]');
    const checkoutBtn = document.querySelector('[data-cart-checkout]');

    if (!overlay || !drawer || !itemsList) {
        return;
    }

    const openButtons = document.querySelectorAll('[data-cart-open]');
    const closeButtons = overlay.querySelectorAll('[data-cart-close]');
    let lastFocusedElement = null;
    let cart = loadCart();

    function loadCart() {
        try {
            const stored = sessionStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    }

    function saveCart() {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    }

    function formatPrice(amount) {
        return amount + '₾';
    }

    function parsePrice(text) {
        return parseInt(String(text).replace(/[^\d]/g, ''), 10) || 0;
    }

    function getProductFromCard(card) {
        const listItem = card.closest('.products__item');
        const nameEl = card.querySelector('.product-card__name');
        const priceEl = card.querySelector('.product-card__price');
        const imageEl = card.querySelector('.product-card__media img');
        const quantityEl = card.querySelector('.product-card__footer .quantity__value');

        const name = nameEl?.textContent.trim() || '';
        const id = listItem?.dataset.productId || name;
        const price = parsePrice(priceEl?.textContent);
        const image = imageEl?.getAttribute('src') || 'assets/images/cinnamon-roll.png';
        const quantity = Math.max(1, parseInt(quantityEl?.textContent, 10) || 1);

        return { id, name, price, image, quantity };
    }

    function addToCart(product) {
        const existing = cart.find(function (item) {
            return item.id === product.id;
        });

        if (existing) {
            existing.quantity += product.quantity;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: product.quantity,
            });
        }

        saveCart();
        renderCart();
    }

    function updateQuantity(id, delta) {
        const item = cart.find(function (entry) {
            return entry.id === id;
        });

        if (!item) {
            return;
        }

        item.quantity += delta;

        if (item.quantity <= 0) {
            cart = cart.filter(function (entry) {
                return entry.id !== id;
            });
        }

        saveCart();
        renderCart();
    }

    function renderCartItem(item) {
        const lineTotal = item.price * item.quantity;
        const listItem = document.createElement('li');
        listItem.className = 'cart-drawer__item';
        listItem.dataset.productId = item.id;

        listItem.innerHTML =
            '<article class="cart-item">' +
                '<img class="cart-item__image" src="' + item.image + '" alt="" width="80" height="80">' +
                '<div class="cart-item__body">' +
                    '<h3 class="cart-item__name">' + item.name + '</h3>' +
                    '<div class="cart-item__footer">' +
                        '<div class="quantity" aria-label="რაოდენობა">' +
                            '<button type="button" class="quantity__btn" data-cart-decrease aria-label="შემცირება">' +
                                '<img src="assets/icons/minus.svg" alt="" width="38" height="38">' +
                            '</button>' +
                            '<span class="quantity__value">' + item.quantity + '</span>' +
                            '<button type="button" class="quantity__btn" data-cart-increase aria-label="გაზრდა">' +
                                '<img src="assets/icons/plus.svg" alt="" width="38" height="38">' +
                            '</button>' +
                        '</div>' +
                        '<p class="cart-item__price">' + formatPrice(lineTotal) + '</p>' +
                    '</div>' +
                '</div>' +
            '</article>';

        return listItem;
    }

    function renderCart() {
        itemsList.replaceChildren();

        cart.forEach(function (item) {
            itemsList.appendChild(renderCartItem(item));
        });

        const isEmpty = cart.length === 0;
        const subtotal = cart.reduce(function (sum, item) {
            return sum + item.price * item.quantity;
        }, 0);
        const delivery = isEmpty ? 0 : DELIVERY_FEE;
        const total = subtotal + delivery;

        if (emptyState) {
            emptyState.hidden = !isEmpty;
        }

        if (subtotalEl) {
            subtotalEl.textContent = formatPrice(subtotal);
        }

        if (deliveryEl) {
            deliveryEl.textContent = formatPrice(delivery);
        }

        if (totalEl) {
            totalEl.textContent = formatPrice(total);
        }

        if (checkoutBtn) {
            checkoutBtn.setAttribute('aria-disabled', String(isEmpty));
            checkoutBtn.classList.toggle('cart-drawer__checkout--disabled', isEmpty);
        }
    }

    function preventCheckout(event) {
        if (checkoutBtn?.getAttribute('aria-disabled') === 'true') {
            event.preventDefault();
        }
    }

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

    checkoutBtn?.addEventListener('click', preventCheckout);

    document.addEventListener('click', function (event) {
        const buyButton = event.target.closest('.product-card__buy');

        if (buyButton) {
            const card = buyButton.closest('.product-card');
            if (card) {
                addToCart(getProductFromCard(card));
                openCart();
            }
            return;
        }

        const decreaseBtn = event.target.closest('[data-cart-decrease]');
        if (decreaseBtn) {
            const itemEl = decreaseBtn.closest('.cart-drawer__item');
            if (itemEl) {
                updateQuantity(itemEl.dataset.productId, -1);
            }
            return;
        }

        const increaseBtn = event.target.closest('[data-cart-increase]');
        if (increaseBtn) {
            const itemEl = increaseBtn.closest('.cart-drawer__item');
            if (itemEl) {
                updateQuantity(itemEl.dataset.productId, 1);
            }
        }
    });

    renderCart();
})();
