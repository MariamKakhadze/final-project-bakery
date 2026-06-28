(function () {
    let selectedProduct = null;
    let modalQuantity = 1;
    let lastFocusedElement = null;

    const DESCRIPTION = 'ჩვენი გემრიელი პროდუქცია მხოლოდ შენთვის, სიყვარულით შექმნილი';

    const modal = createModalElement();
    const closeBtn = modal.querySelector('.product-modal__close');
    const dialog = modal.querySelector('.product-modal__dialog');
    const imageEl = modal.querySelector('.product-modal__media img');
    const nameEl = modal.querySelector('.product-modal__name');
    const priceEl = modal.querySelector('.product-modal__price');
    const descriptionEl = modal.querySelector('.product-modal__description');
    const ingredientsEl = modal.querySelector('.product-modal__ingredients');
    const nutritionEl = modal.querySelector('.product-modal__nutrition');
    const quantityEl = modal.querySelector('.product-modal__quantity-value');

    function createModalElement() {
        const element = document.createElement('div');
        element.id = 'product-modal';
        element.className = 'product-modal';
        element.hidden = true;
        element.setAttribute('aria-hidden', 'true');

        element.innerHTML =
            '<div class="product-modal__backdrop" data-product-modal-close tabindex="-1" aria-hidden="true"></div>' +
            '<div class="product-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="product-modal-title">' +
                '<button type="button" class="product-modal__close" data-product-modal-close aria-label="დახურვა">' +
                    '<span aria-hidden="true">&times;</span>' +
                '</button>' +
                '<figure class="product-modal__media">' +
                    '<img src="" alt="" width="280" height="170">' +
                '</figure>' +
                '<div class="product-modal__body">' +
                    '<div class="product-modal__header">' +
                        '<h2 id="product-modal-title" class="product-modal__name"></h2>' +
                        '<p class="product-modal__price"></p>' +
                    '</div>' +
                    '<p class="product-modal__description"></p>' +
                    '<div class="product-modal__details">' +
                        '<div class="product-modal__detail">' +
                            '<h3 class="product-modal__detail-title">შემადგენლობა</h3>' +
                            '<p class="product-modal__detail-text product-modal__ingredients"></p>' +
                        '</div>' +
                        '<div class="product-modal__detail">' +
                            '<h3 class="product-modal__detail-title">კვებითი ღირებულება</h3>' +
                            '<p class="product-modal__detail-text product-modal__nutrition"></p>' +
                        '</div>' +
                    '</div>' +
                    '<div class="product-modal__footer">' +
                        '<div class="quantity" aria-label="რაოდენობა">' +
                            '<button type="button" class="quantity__btn" data-product-modal-decrease aria-label="შემცირება">' +
                                '<img src="assets/icons/minus.svg" alt="" width="38" height="38">' +
                            '</button>' +
                            '<span class="quantity__value product-modal__quantity-value">1</span>' +
                            '<button type="button" class="quantity__btn" data-product-modal-increase aria-label="გაზრდა">' +
                                '<img src="assets/icons/plus.svg" alt="" width="38" height="38">' +
                            '</button>' +
                        '</div>' +
                        '<button type="button" class="btn btn--buy product-modal__buy" data-product-modal-add>' +
                            '<img src="assets/icons/cart-btn.svg" alt="" width="22" height="21">' +
                            '<span>იყიდე</span>' +
                        '</button>' +
                    '</div>' +
                '</div>' +
            '</div>';

        document.body.appendChild(element);
        return element;
    }

    function getProductFromCard(card) {
        const listItem = card.closest('.products__item');
        const cardName = card.querySelector('.product-card__name');
        const cardPrice = card.querySelector('.product-card__price');
        const cardImage = card.querySelector('.product-card__media img');
        const cardQuantity = card.querySelector('.product-card__footer .quantity__value');
        const cardDescription = card.querySelector('.product-card__description');

        const id = listItem?.dataset.productId || '';
        const catalogProduct = window.BuleProducts?.getProduct(id);

        if (catalogProduct) {
            return {
                id: catalogProduct.id,
                name: catalogProduct.name,
                price: catalogProduct.price,
                image: catalogProduct.image,
                quantity: Math.max(1, parseInt(cardQuantity?.textContent, 10) || 1),
                description: catalogProduct.description,
                ingredients: catalogProduct.ingredients,
                nutrition: catalogProduct.nutrition,
            };
        }

        const name = cardName?.textContent.trim() || '';
        const priceText = cardPrice?.textContent.trim() || '0';
        const price = parseInt(priceText.replace(/[^\d]/g, ''), 10) || 0;
        const image = cardImage?.getAttribute('src') || '';
        const quantity = Math.max(1, parseInt(cardQuantity?.textContent, 10) || 1);
        const description = cardDescription?.textContent.trim() || DESCRIPTION;

        return {
            id: id || name,
            name: name,
            price: price,
            image: image,
            quantity: quantity,
            description: description,
            ingredients: listItem?.dataset.ingredients || '',
            nutrition: listItem?.dataset.nutrition || '',
        };
    }

    function renderModal() {
        if (!selectedProduct) {
            return;
        }

        imageEl.src = selectedProduct.image;
        imageEl.alt = selectedProduct.name;
        nameEl.textContent = selectedProduct.name;
        priceEl.textContent = selectedProduct.price + '₾';
        descriptionEl.textContent = selectedProduct.description;
        ingredientsEl.textContent = selectedProduct.ingredients || '—';
        nutritionEl.textContent = selectedProduct.nutrition || '—';
        quantityEl.textContent = String(modalQuantity);
    }

    function setSelectedProduct(product) {
        selectedProduct = product;

        if (product) {
            modalQuantity = product.quantity || 1;
            renderModal();
            openModal();
            return;
        }

        closeModal();
    }

    function openModal() {
        lastFocusedElement = document.activeElement;
        modal.hidden = false;
        modal.setAttribute('aria-hidden', 'false');
        modal.classList.add('product-modal--open');
        document.body.classList.add('product-modal-open');
        closeBtn.focus();
    }

    function closeModal() {
        selectedProduct = null;
        modal.classList.remove('product-modal--open');
        modal.setAttribute('aria-hidden', 'true');
        modal.hidden = true;
        document.body.classList.remove('product-modal-open');

        if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
            lastFocusedElement.focus();
        }
    }

    function updateModalQuantity(delta) {
        modalQuantity = Math.max(1, modalQuantity + delta);
        quantityEl.textContent = String(modalQuantity);
    }

    function handleAddToOrder() {
        if (!selectedProduct || !window.BuleCart) {
            return;
        }

        window.BuleCart.addToCart({
            id: selectedProduct.id,
            name: selectedProduct.name,
            price: selectedProduct.price,
            image: selectedProduct.image,
            quantity: modalQuantity,
        });

        closeModal();
        window.BuleCart.openCart();
    }

    modal.querySelectorAll('[data-product-modal-close]').forEach(function (element) {
        element.addEventListener('click', closeModal);
    });

    modal.querySelector('[data-product-modal-decrease]').addEventListener('click', function () {
        updateModalQuantity(-1);
    });

    modal.querySelector('[data-product-modal-increase]').addEventListener('click', function () {
        updateModalQuantity(1);
    });

    modal.querySelector('[data-product-modal-add]').addEventListener('click', handleAddToOrder);

    dialog.addEventListener('click', function (event) {
        event.stopPropagation();
    });

    document.addEventListener('click', function (event) {
        if (event.target.closest('.product-card__buy, .quantity__btn, .products__arrow')) {
            return;
        }

        const card = event.target.closest('.product-card');

        if (!card) {
            return;
        }

        setSelectedProduct(getProductFromCard(card));
    });

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && selectedProduct) {
            setSelectedProduct(null);
        }
    });

    window.BuleProductModal = {
        getSelectedProduct: function () {
            return selectedProduct;
        },
        setSelectedProduct: setSelectedProduct,
        close: function () {
            setSelectedProduct(null);
        },
    };
})();
