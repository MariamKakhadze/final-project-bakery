(function () {
    const header = document.querySelector('.header');
    const toggle = document.querySelector('[data-nav-toggle]');
    const nav = document.getElementById('main-nav');

    if (!header || !toggle || !nav) {
        return;
    }

    function closeNav() {
        header.classList.remove('header--menu-open');
        document.body.classList.remove('nav-open');
        toggle.setAttribute('aria-expanded', 'false');
    }

    function openNav() {
        header.classList.add('header--menu-open');
        document.body.classList.add('nav-open');
        toggle.setAttribute('aria-expanded', 'true');
    }

    toggle.addEventListener('click', function () {
        if (header.classList.contains('header--menu-open')) {
            closeNav();
        } else {
            openNav();
        }
    });

    nav.querySelectorAll('.header__nav-link').forEach(function (link) {
        link.addEventListener('click', closeNav);
    });

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            closeNav();
        }
    });
})();
