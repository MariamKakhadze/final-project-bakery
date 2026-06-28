(function () {
    let isLoggedIn = false;

    function getDisplayName(user) {
        const meta = user.user_metadata || {};

        if (meta.full_name) {
            return meta.full_name;
        }

        if (meta.name) {
            return meta.name;
        }

        if (user.email) {
            return user.email.split('@')[0];
        }

        return 'მომხმარებელი';
    }

    function closeAllDropdowns() {
        document.querySelectorAll('[data-auth-profile-dropdown]').forEach(function (dropdown) {
            dropdown.hidden = true;
        });

        document.querySelectorAll('[data-auth-profile]').forEach(function (toggle) {
            toggle.setAttribute('aria-expanded', 'false');
        });
    }

    function toggleDropdown(toggle, dropdown) {
        const isOpen = !dropdown.hidden;

        closeAllDropdowns();

        if (!isOpen) {
            dropdown.hidden = false;
            toggle.setAttribute('aria-expanded', 'true');
        }
    }

    async function signOut() {
        const client = window.supabaseClient;

        if (!client) {
            return;
        }

        closeAllDropdowns();
        await client.auth.signOut();
    }

    function setupProfileMenus() {
        document.querySelectorAll('[data-auth-profile]').forEach(function (profileEl) {
            if (profileEl.closest('[data-auth-profile-menu]')) {
                return;
            }

            const menu = document.createElement('div');
            menu.className = 'header__profile-menu';
            menu.setAttribute('data-auth-profile-menu', '');

            const dropdown = document.createElement('div');
            dropdown.className = 'header__profile-dropdown';
            dropdown.setAttribute('data-auth-profile-dropdown', '');
            dropdown.hidden = true;

            const signOutBtn = document.createElement('button');
            signOutBtn.type = 'button';
            signOutBtn.className = 'header__profile-dropdown-item';
            signOutBtn.setAttribute('data-auth-sign-out', '');
            signOutBtn.textContent = 'გასვლა';
            dropdown.appendChild(signOutBtn);

            profileEl.parentNode.insertBefore(menu, profileEl);
            menu.appendChild(profileEl);
            menu.appendChild(dropdown);

            profileEl.setAttribute('aria-haspopup', 'true');
            profileEl.setAttribute('aria-expanded', 'false');

            profileEl.addEventListener('click', function (event) {
                if (!isLoggedIn) {
                    return;
                }

                event.preventDefault();
                toggleDropdown(profileEl, dropdown);
            });

            signOutBtn.addEventListener('click', function (event) {
                event.stopPropagation();
                signOut();
            });
        });

        document.addEventListener('click', function (event) {
            if (!event.target.closest('[data-auth-profile-menu]')) {
                closeAllDropdowns();
            }
        });

        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape') {
                closeAllDropdowns();
            }
        });
    }

    function updateProfileUI(session) {
        isLoggedIn = Boolean(session && session.user);

        document.querySelectorAll('[data-auth-profile]').forEach(function (link) {
            const nameEl = link.querySelector('[data-auth-profile-name]');

            if (!nameEl) {
                return;
            }

            if (isLoggedIn) {
                const name = getDisplayName(session.user);

                nameEl.textContent = name;
                nameEl.hidden = false;
                link.setAttribute('aria-label', name);
                link.setAttribute('href', '#');
            } else {
                nameEl.textContent = '';
                nameEl.hidden = true;
                link.setAttribute('aria-label', 'პროფილი');
                link.setAttribute('href', 'sign-in.html');
                link.setAttribute('aria-expanded', 'false');
            }
        });

        if (!isLoggedIn) {
            closeAllDropdowns();
        }
    }

    function init() {
        const client = window.supabaseClient;

        if (!client) {
            return;
        }

        setupProfileMenus();

        client.auth.getSession().then(function ({ data }) {
            updateProfileUI(data.session);
        });

        client.auth.onAuthStateChange(function (_event, session) {
            updateProfileUI(session);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
