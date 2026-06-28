(function () {
    const SUPABASE_URL = 'https://dvmveugaelelqpoiqfgg.supabase.co';
    const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_RLVeu0MZAhDG5NDHTHi5EQ_kw1pdji8';

    // Must match Supabase Dashboard → Authentication → URL Configuration
    const LOCAL_APP_URL = 'http://localhost:3000';
    const APP_URL = window.location.hostname === 'localhost'
        ? LOCAL_APP_URL
        : window.location.origin;

    if (!window.supabase) {
        console.error('[Supabase] Library not loaded. Check the CDN script tag.');
        return;
    }

    // Email links and OAuth redirects land here (PKCE ?code=... or legacy hash tokens)
    window.AUTH_CALLBACK_URL = APP_URL + '/';

    window.supabaseClient = window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY,
        {
            auth: {
                flowType: 'pkce',
                detectSessionInUrl: true,
                persistSession: true,
            },
        }
    );

    console.log('[Supabase] Client created for', SUPABASE_URL);

    function cleanAuthParamsFromUrl() {
        const url = new URL(window.location.href);

        url.searchParams.delete('code');
        url.searchParams.delete('type');
        url.searchParams.delete('error');
        url.searchParams.delete('error_description');

        const cleaned = url.pathname + url.search + url.hash.replace(/^(#)?(.*)$/, function (_, hashPrefix, hashBody) {
            if (!hashBody) {
                return '';
            }

            const hashParams = new URLSearchParams(hashBody);
            hashParams.delete('access_token');
            hashParams.delete('refresh_token');
            hashParams.delete('expires_in');
            hashParams.delete('token_type');
            hashParams.delete('type');

            const remaining = hashParams.toString();
            return remaining ? '#' + remaining : '';
        });

        window.history.replaceState({}, document.title, cleaned || url.pathname);
    }

    function showAuthBanner(message, type) {
        var banner = document.getElementById('auth-callback-banner');

        if (!banner) {
            banner = document.createElement('p');
            banner.id = 'auth-callback-banner';
            banner.className = 'auth__message auth__message--success';
            banner.setAttribute('role', 'alert');
            banner.hidden = true;
            document.body.insertBefore(banner, document.body.firstChild);
        }

        banner.textContent = message;
        banner.hidden = false;
        banner.classList.remove('auth__message--error', 'auth__message--success');
        banner.classList.add(type === 'error' ? 'auth__message--error' : 'auth__message--success');
    }

    async function handleAuthRedirect() {
        const client = window.supabaseClient;
        const url = new URL(window.location.href);
        const code = url.searchParams.get('code');
        const authError = url.searchParams.get('error_description') || url.searchParams.get('error');
        const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
        const hasHashTokens = hashParams.has('access_token');

        if (authError) {
            showAuthBanner('ავტორიზაცია ვერ მოხერხდა: ' + decodeURIComponent(authError), 'error');
            cleanAuthParamsFromUrl();
            return;
        }

        if (code) {
            const { error } = await client.auth.exchangeCodeForSession(code);

            if (error) {
                console.error('[Supabase] Email confirmation failed:', error.message);
                showAuthBanner('ელ. ფოსტის დადასტურება ვერ მოხერხდა. სცადეთ თავიდან.', 'error');
                return;
            }

            cleanAuthParamsFromUrl();
            showAuthBanner('ელ. ფოსტა დადასტურებულია — წარმატებით შეხვედით სისტემაში.', 'success');
            return;
        }

        if (hasHashTokens) {
            const { data, error } = await client.auth.getSession();

            if (error) {
                console.error('[Supabase] Could not read session from email link:', error.message);
                showAuthBanner('ელ. ფოსტის დადასტურება ვერ მოხერხდა.', 'error');
                return;
            }

            if (data.session) {
                cleanAuthParamsFromUrl();
                showAuthBanner('ელ. ფოსტა დადასტურებულია — წარმატებით შეხვედით სისტემაში.', 'success');
            }
        }
    }

    handleAuthRedirect().then(function () {
        return window.supabaseClient.auth.getSession();
    }).then(function ({ data, error }) {
        if (error) {
            console.error('[Supabase] Connection failed:', error.message);
            return;
        }

        console.log('[Supabase] Connected successfully');

        if (data.session) {
            console.log('[Supabase] Signed in as', data.session.user.email);
        } else {
            console.log('[Supabase] Not signed in (this is normal if you have not logged in yet)');
        }
    });
})();
