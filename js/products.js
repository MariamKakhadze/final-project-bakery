(function () {
    const CATEGORIES = ['buns', 'cakes', 'cookies', 'pastry'];

    const DESCRIPTION = 'ჩვენი გემრიელი პროდუქცია მხოლოდ შენთვის, სიყვარულით შექმნილი';

    const CATEGORY_DETAILS = {
        buns: {
            ingredients: 'ხორბალი, კვერცხი, რძე, არაყი, შაქარი, კარაქი, საფუაჟი, დარიჩინი',
            nutrition: '100 გ-ში: 320 კკალ · ცხოლიანძები 45 გ · ცილები 6 გ · ცხიმები 14 გ',
        },
        cakes: {
            ingredients: 'ხორბალი, კვერცხი, შაქარი, კარაქი, რძე, კრემი, ვანილი',
            nutrition: '100 გ-ში: 380 კკალ · ცხოლიანძები 42 გ · ცილები 5 გ · ცხიმები 20 გ',
        },
        cookies: {
            ingredients: 'ხორბალი, კარაქი, შაქარი, კვერცხი, ვანილი, შოკოლადი',
            nutrition: '100 გ-ში: 480 კკალ · ცხოლიანძები 58 გ · ცილები 6 გ · ცხიმები 24 გ',
        },
        pastry: {
            ingredients: 'ხოჭმალი ფურსტი, კარაქი, კვერცხი, რძე, მარილი, საფუაჟი',
            nutrition: '100 გ-ში: 290 კკალ · ცხოლიანძები 32 გ · ცილები 7 გ · ცხიმები 15 გ',
        },
    };

    const PRODUCT_DETAILS = {
        'დარიჩინის ფუნთუშა': {
            ingredients: 'ხორბალი, კვერცხი, რძე, დარიჩინი, კარაქი, შაქარი, არაყი',
            nutrition: '100 გ-ში: 330 კკალ · ცხოლიანძები 46 გ · ცილები 6 გ · ცხიმები 14 გ',
        },
        'შოკოლადის ფუნთუშა': {
            ingredients: 'ხორბალი, კვერცხი, რძე, შოკოლადი, კარაქი, შაქარი, კакаო',
            nutrition: '100 გ-ში: 350 კკალ · ცხოლიანძები 44 გ · ცილები 7 გ · ცხიმები 16 გ',
        },
        'ნუშის ტორტი': {
            ingredients: 'ნუში, კვერცხი, შაქარი, კარაქი, ხორბალი, კრემი, ვანილი',
            nutrition: '100 გ-ში: 395 კკალ · ცხოლიანძები 38 გ · ცილები 8 გ · ცხიმები 22 გ',
        },
        'კარამელის ტორტი': {
            ingredients: 'კარამელი, კვერცხი, შაქარი, კარაქი, რძე, კრემი, ვანილი',
            nutrition: '100 გ-ში: 410 კკალ · ცხოლიანძები 45 გ · ცილები 5 გ · ცხიმები 21 გ',
        },
        'ვანილის ნამცხვარი': {
            ingredients: 'ხორბალი, კარაქი, შაქარი, კვერცხი, ვანილი',
            nutrition: '100 გ-ში: 470 კკალ · ცხოლიანძები 56 გ · ცილები 6 გ · ცხიმები 23 გ',
        },
        'ჯანჯაფილის ნამცხვარი': {
            ingredients: 'ხორბალი, კარაქი, შაქარი, ჯანჯაფილი, კვერცხი, სანელებლები',
            nutrition: '100 გ-ში: 460 კკალ · ცხოლიანძები 55 გ · ცილები 5 გ · ცხიმები 22 გ',
        },
        'კროასანი': {
            ingredients: 'ხოჭმალი ფურსტი, კარაქი, კვერცხი, რძე, მარილი, შაქარი',
            nutrition: '100 გ-ში: 280 კკალ · ცხოლიანძები 30 გ · ცილები 6 გ · ცხიმები 16 გ',
        },
        'ხაჭაპური': {
            ingredients: 'ხოჭმალი ფურსტი, სულგუნი, კვერცხი, კარაქი, მარილი',
            nutrition: '100 გ-ში: 310 კკალ · ცხოლიანძები 28 გ · ცილები 12 გ · ცხიმები 18 გ',
        },
    };

    const FALLBACK_PRODUCTS = [
        { id: 'fallback-1', name: 'დარიჩინის ფუნთუშა', price: 10, category: 'buns', image: 'assets/images/cinnamon-roll.png' },
        { id: 'fallback-2', name: 'შოკოლადის ფუნთუშა', price: 12, category: 'buns', image: 'assets/images/chocolate-bun.png' },
        { id: 'fallback-3', name: 'ნუშის ტორტი', price: 45, category: 'cakes', image: 'assets/images/almond-cake.png' },
        { id: 'fallback-4', name: 'კარამელის ტორტი', price: 42, category: 'cakes', image: 'assets/images/caramel-cake.png' },
        { id: 'fallback-5', name: 'ვანილის ნამცხვარი', price: 8, category: 'cookies', image: 'assets/images/vanilla-cookie.png' },
        { id: 'fallback-6', name: 'ჯანჯაფილის ნამცხვარი', price: 8, category: 'cookies', image: 'assets/images/ginger-cookie.png' },
        { id: 'fallback-7', name: 'კროასანი', price: 9, category: 'pastry', image: 'assets/images/croissant.png' },
        { id: 'fallback-8', name: 'ხაჭაპური', price: 11, category: 'pastry', image: 'assets/images/khachapuri.png' },
    ];

    let productCatalog = [];

    function enrichProduct(product) {
        const byName = PRODUCT_DETAILS[product.name];
        const byCategory = CATEGORY_DETAILS[product.category] || CATEGORY_DETAILS.buns;

        return {
            id: String(product.id),
            name: product.name,
            price: Number(product.price),
            category: product.category,
            image: product.image,
            description: product.description || DESCRIPTION,
            ingredients: product.ingredients || byName?.ingredients || byCategory.ingredients,
            nutrition: product.nutrition || byName?.nutrition || byCategory.nutrition,
        };
    }

    async function loadProducts() {
        if (!window.supabaseClient) {
            console.warn('[Products] Supabase client is not available — using fallback catalog.');
            productCatalog = FALLBACK_PRODUCTS.map(enrichProduct);
            return productCatalog.slice();
        }

        const { data, error } = await window.supabaseClient
            .from('products')
            .select('id, name, price, category, image')
            .order('id');

        if (error) {
            console.error('[Products] Could not load products:', error.message);
            productCatalog = FALLBACK_PRODUCTS.map(enrichProduct);
            return productCatalog.slice();
        }

        if (!data?.length) {
            console.warn('[Products] products table is empty — using fallback catalog.');
            productCatalog = FALLBACK_PRODUCTS.map(enrichProduct);
            return productCatalog.slice();
        }

        productCatalog = data.map(function (row) {
            return enrichProduct({
                id: row.id,
                name: row.name,
                price: row.price,
                category: row.category,
                image: row.image,
            });
        });

        return productCatalog.slice();
    }

    function getProduct(id) {
        return productCatalog.find(function (product) {
            return product.id === String(id);
        }) || null;
    }

    function pickRandomItem(items) {
        return items[Math.floor(Math.random() * items.length)];
    }

    function pickPopularProducts(products, count) {
        const targetCount = count || 6;
        const selected = [];
        const usedIds = new Set();

        CATEGORIES.forEach(function (category) {
            const inCategory = products.filter(function (product) {
                return product.category === category && !usedIds.has(product.id);
            });

            if (!inCategory.length) {
                return;
            }

            const pick = pickRandomItem(inCategory);
            selected.push(pick);
            usedIds.add(pick.id);
        });

        const remaining = products.filter(function (product) {
            return !usedIds.has(product.id);
        });

        while (selected.length < targetCount && remaining.length) {
            const index = Math.floor(Math.random() * remaining.length);
            const pick = remaining.splice(index, 1)[0];
            selected.push(pick);
            usedIds.add(pick.id);
        }

        return selected.slice(0, targetCount);
    }

    function createProductCard(product) {
        const enriched = enrichProduct(product);
        const item = document.createElement('li');
        item.className = 'products__item';
        item.dataset.category = enriched.category;
        item.dataset.productId = enriched.id;
        item.dataset.ingredients = enriched.ingredients;
        item.dataset.nutrition = enriched.nutrition;

        item.innerHTML =
            '<article class="product-card">' +
                '<figure class="product-card__media">' +
                    '<img src="' + enriched.image + '" alt="' + enriched.name + '" width="312" height="170">' +
                '</figure>' +
                '<div class="product-card__body">' +
                    '<div class="product-card__header">' +
                        '<h3 class="product-card__name">' + enriched.name + '</h3>' +
                        '<p class="product-card__price">' + enriched.price + '₾</p>' +
                    '</div>' +
                    '<p class="product-card__description">' + enriched.description + '</p>' +
                    '<div class="product-card__footer">' +
                        '<div class="quantity" aria-label="რაოდენობა">' +
                            '<button type="button" class="quantity__btn" aria-label="შემცირება">' +
                                '<img src="assets/icons/minus.svg" alt="" width="38" height="38">' +
                            '</button>' +
                            '<span class="quantity__value">1</span>' +
                            '<button type="button" class="quantity__btn" aria-label="გაზრდა">' +
                                '<img src="assets/icons/plus.svg" alt="" width="38" height="38">' +
                            '</button>' +
                        '</div>' +
                        '<button type="button" class="btn btn--buy product-card__buy">' +
                            '<img src="assets/icons/cart-btn.svg" alt="" width="22" height="21">' +
                            '<span>იყიდე</span>' +
                        '</button>' +
                    '</div>' +
                '</div>' +
            '</article>';

        return item;
    }

    window.BuleProducts = {
        CATEGORIES: CATEGORIES,
        loadProducts: loadProducts,
        getProduct: getProduct,
        pickPopularProducts: pickPopularProducts,
        createProductCard: createProductCard,
    };
})();
