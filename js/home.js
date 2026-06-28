(function () {
    async function initPopularProducts() {
        const grid = document.getElementById('popular-products');
        const viewport = document.querySelector('[data-popular-viewport]');
        const prevBtn = document.querySelector('[data-popular-prev]');
        const nextBtn = document.querySelector('[data-popular-next]');

        if (!grid || !viewport || !prevBtn || !nextBtn || !window.BuleProducts) {
            return;
        }

        const products = await window.BuleProducts.loadProducts();
        const popularProducts = window.BuleProducts.pickPopularProducts(products, 6);

        grid.replaceChildren();

        popularProducts.forEach(function (product) {
            grid.appendChild(window.BuleProducts.createProductCard(product));
        });

        function syncItemWidths() {
            const gap = window.matchMedia('(min-width: 1024px)').matches ? 25 : 24;
            const perPage = window.matchMedia('(min-width: 1024px)').matches ? 3 : 1;
            const itemWidth = (viewport.clientWidth - gap * (perPage - 1)) / perPage;

            viewport.style.setProperty('--popular-item-width', itemWidth + 'px');
            updateButtons();
        }

        function updateButtons() {
            const maxScroll = viewport.scrollWidth - viewport.clientWidth;
            prevBtn.disabled = viewport.scrollLeft <= 4;
            nextBtn.disabled = viewport.scrollLeft >= maxScroll - 4;
        }

        function scrollByPage(direction) {
            viewport.scrollBy({
                left: direction * viewport.clientWidth,
                behavior: 'smooth',
            });
        }

        prevBtn.addEventListener('click', function () {
            scrollByPage(-1);
        });

        nextBtn.addEventListener('click', function () {
            scrollByPage(1);
        });

        viewport.addEventListener('scroll', updateButtons, { passive: true });
        window.addEventListener('resize', syncItemWidths);

        syncItemWidths();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPopularProducts);
    } else {
        initPopularProducts();
    }
})();
