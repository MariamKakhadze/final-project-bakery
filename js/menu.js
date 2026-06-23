const CATEGORY_LABELS = {
    buns: 'ფუნთუშები',
    cakes: 'ტორტები',
    cookies: 'ნამცხვრები',
    pastry: 'ცომეული',
};

const PRODUCTS = [
    { id: 'bun-1', name: 'დარიჩინის ფუნთუშა', price: 10, category: 'buns', image: 'assets/images/cinnamon-roll.png' },
    { id: 'bun-2', name: 'შოკოლადის ფუნთუშა', price: 12, category: 'buns', image: 'assets/images/cinnamon-roll.png' },
    { id: 'bun-3', name: 'ყვის ფუნთუშა', price: 9, category: 'buns', image: 'assets/images/cinnamon-roll.png' },
    { id: 'bun-4', name: 'კრემის ფუნთუშა', price: 11, category: 'buns', image: 'assets/images/cinnamon-roll.png' },
    { id: 'bun-5', name: 'ჯანჯაფილის ფუნთუშა', price: 10, category: 'buns', image: 'assets/images/cinnamon-roll.png' },
    { id: 'bun-6', name: 'თაფლის ფუნთუშა', price: 13, category: 'buns', image: 'assets/images/cinnamon-roll.png' },
    { id: 'cake-1', name: 'შოკოლადის ტორტი', price: 45, category: 'cakes', image: 'assets/images/cinnamon-roll.png' },
    { id: 'cake-2', name: 'ვანილის ტორტი', price: 42, category: 'cakes', image: 'assets/images/cinnamon-roll.png' },
    { id: 'cake-3', name: 'ყავის ტორტი', price: 48, category: 'cakes', image: 'assets/images/cinnamon-roll.png' },
    { id: 'cake-4', name: 'ყვის ტორტი', price: 40, category: 'cakes', image: 'assets/images/cinnamon-roll.png' },
    { id: 'cake-5', name: 'კარამელის ტორტი', price: 46, category: 'cakes', image: 'assets/images/cinnamon-roll.png' },
    { id: 'cake-6', name: 'ნუშის ტორტი', price: 44, category: 'cakes', image: 'assets/images/cinnamon-roll.png' },
    { id: 'cookie-1', name: 'შოკოლადის ნამცხვარი', price: 8, category: 'cookies', image: 'assets/images/cinnamon-roll.png' },
    { id: 'cookie-2', name: 'ყვის ნამცხვარი', price: 7, category: 'cookies', image: 'assets/images/cinnamon-roll.png' },
    { id: 'cookie-3', name: 'ჯანჯაფილის ნამცხვარი', price: 8, category: 'cookies', image: 'assets/images/cinnamon-roll.png' },
    { id: 'cookie-4', name: 'თაფლის ნამცხვარი', price: 9, category: 'cookies', image: 'assets/images/cinnamon-roll.png' },
    { id: 'cookie-5', name: 'კარამელის ნამცხვარი', price: 8, category: 'cookies', image: 'assets/images/cinnamon-roll.png' },
    { id: 'cookie-6', name: 'ვანილის ნამცხვარი', price: 7, category: 'cookies', image: 'assets/images/cinnamon-roll.png' },
    { id: 'pastry-1', name: 'კროასანი', price: 6, category: 'pastry', image: 'assets/images/cinnamon-roll.png' },
    { id: 'pastry-2', name: 'ეკლერი', price: 5, category: 'pastry', image: 'assets/images/cinnamon-roll.png' },
    { id: 'pastry-3', name: 'ბულკა', price: 4, category: 'pastry', image: 'assets/images/cinnamon-roll.png' },
    { id: 'pastry-4', name: 'მაფინი', price: 5, category: 'pastry', image: 'assets/images/cinnamon-roll.png' },
    { id: 'pastry-5', name: 'დონატი', price: 6, category: 'pastry', image: 'assets/images/cinnamon-roll.png' },
    { id: 'pastry-6', name: 'ბრიოში', price: 7, category: 'pastry', image: 'assets/images/cinnamon-roll.png' },
];

const DESCRIPTION = 'ჩვენი გემრიელი პროდუქცია მხოლოდ შენთვის, სიყვარულით შექმნილი';

function createProductCard(product) {
    const item = document.createElement('li');
    item.className = 'products__item';
    item.dataset.category = product.category;
    item.dataset.productId = product.id;

    item.innerHTML = `
        <article class="product-card">
            <figure class="product-card__media">
                <img
                    src="${product.image}"
                    alt="${product.name}"
                    width="312"
                    height="170"
                >
            </figure>

            <div class="product-card__body">
                <div class="product-card__header">
                    <h3 class="product-card__name">${product.name}</h3>
                    <p class="product-card__price">${product.price}₾</p>
                </div>

                <p class="product-card__description">${DESCRIPTION}</p>

                <div class="product-card__footer">
                    <div class="quantity" aria-label="რაოდენობა">
                        <button type="button" class="quantity__btn" aria-label="შემცირება">
                            <img src="assets/icons/minus.svg" alt="" width="38" height="38">
                        </button>
                        <span class="quantity__value">1</span>
                        <button type="button" class="quantity__btn" aria-label="გაზრდა">
                            <img src="assets/icons/plus.svg" alt="" width="38" height="38">
                        </button>
                    </div>

                    <button type="button" class="btn btn--buy product-card__buy">
                        <img src="assets/icons/cart-btn.svg" alt="" width="22" height="21">
                        <span>იყიდე</span>
                    </button>
                </div>
            </div>
        </article>
    `;

    return item;
}

function initMenuPage() {
    const title = document.getElementById('menu-title');
    const grid = document.getElementById('menu-products');
    const emptyState = document.getElementById('menu-empty');
    const searchInput = document.getElementById('menu-search');
    const filterPanel = document.getElementById('menu-filter-panel');
    const filterOpenBtn = document.querySelector('[data-filter-open]');
    const filterApplyBtn = document.querySelector('[data-filter-apply]');
    const inlineFilterBtns = document.querySelectorAll('.menu-filters__btn');
    const panelFilterBtns = document.querySelectorAll('.menu-filter-panel__btn');

    if (!grid) {
        return;
    }

    let activeCategory = 'buns';
    let pendingCategory = 'buns';
    let searchQuery = '';

    PRODUCTS.forEach((product) => {
        grid.appendChild(createProductCard(product));
    });

    function setActiveCategoryButtons(category) {
        inlineFilterBtns.forEach((button) => {
            const isActive = button.dataset.category === category;
            button.classList.toggle('menu-filters__btn--active', isActive);
            button.setAttribute('aria-selected', String(isActive));
        });

        panelFilterBtns.forEach((button) => {
            const isActive = button.dataset.category === category;
            button.classList.toggle('menu-filter-panel__btn--active', isActive);
            button.setAttribute('aria-selected', String(isActive));
        });
    }

    function getFilteredProducts() {
        const normalizedQuery = searchQuery.trim().toLowerCase();

        return PRODUCTS.filter((product) => {
            const matchesCategory = product.category === activeCategory;
            const matchesSearch = normalizedQuery === ''
                || product.name.toLowerCase().includes(normalizedQuery);

            return matchesCategory && matchesSearch;
        });
    }

    function renderProducts() {
        const filteredProducts = getFilteredProducts();
        const visibleIds = new Set(filteredProducts.map((product) => product.id));

        grid.querySelectorAll('.products__item').forEach((item) => {
            const isVisible = visibleIds.has(item.dataset.productId);
            item.hidden = !isVisible;
        });

        if (title) {
            title.textContent = searchQuery.trim()
                ? 'ძებნის შედეგები'
                : CATEGORY_LABELS[activeCategory];
        }

        if (emptyState) {
            const hasResults = filteredProducts.length > 0;
            emptyState.hidden = hasResults;
            grid.hidden = !hasResults;
        }
    }

    function setCategory(category) {
        activeCategory = category;
        pendingCategory = category;
        setActiveCategoryButtons(category);
        renderProducts();
    }

    function openFilterPanel() {
        pendingCategory = activeCategory;
        setActiveCategoryButtons(pendingCategory);

        filterPanel.hidden = false;
        document.body.classList.add('menu-filter-open');

        if (filterOpenBtn) {
            filterOpenBtn.setAttribute('aria-expanded', 'true');
        }
    }

    function closeFilterPanel() {
        filterPanel.hidden = true;
        document.body.classList.remove('menu-filter-open');

        if (filterOpenBtn) {
            filterOpenBtn.setAttribute('aria-expanded', 'false');
        }
    }

    inlineFilterBtns.forEach((button) => {
        button.addEventListener('click', () => {
            setCategory(button.dataset.category);
        });
    });

    panelFilterBtns.forEach((button) => {
        button.addEventListener('click', () => {
            pendingCategory = button.dataset.category;
            setActiveCategoryButtons(pendingCategory);
        });
    });

    if (filterOpenBtn) {
        filterOpenBtn.addEventListener('click', openFilterPanel);
    }

    if (filterApplyBtn) {
        filterApplyBtn.addEventListener('click', () => {
            setCategory(pendingCategory);
            closeFilterPanel();
        });
    }

    filterPanel?.querySelectorAll('[data-filter-close]').forEach((element) => {
        element.addEventListener('click', closeFilterPanel);
    });

    searchInput?.addEventListener('input', (event) => {
        searchQuery = event.target.value;
        renderProducts();
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && !filterPanel.hidden) {
            closeFilterPanel();
        }
    });

    setCategory(activeCategory);
}

initMenuPage();
