const CATEGORY_LABELS = {
    buns: 'ფუნთუშები',
    cakes: 'ტორტები',
    cookies: 'ნამცხვრები',
    pastry: 'ცომეული',
};

async function initMenuPage() {
    const title = document.getElementById('menu-title');
    const grid = document.getElementById('menu-products');
    const emptyState = document.getElementById('menu-empty');
    const searchInput = document.getElementById('menu-search');
    const filterPanel = document.getElementById('menu-filter-panel');
    const filterOpenBtn = document.querySelector('[data-filter-open]');
    const filterApplyBtn = document.querySelector('[data-filter-apply]');
    const inlineFilterBtns = document.querySelectorAll('.menu-filters__btn');
    const panelFilterBtns = document.querySelectorAll('.menu-filter-panel__btn');

    if (!grid || !window.BuleProducts) {
        return;
    }

    const products = await window.BuleProducts.loadProducts();

    let activeCategory = 'buns';
    let pendingCategory = 'buns';
    let searchQuery = '';

    products.forEach((product) => {
        grid.appendChild(window.BuleProducts.createProductCard(product));
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

        return products.filter((product) => {
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
