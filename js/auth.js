(function () {
    const REDIRECT_URL = 'index.html';

    function getClient() {
        if (!window.supabaseClient) {
            console.error('[Auth] Supabase client is not available.');
            return null;
        }
        return window.supabaseClient;
    }

    function translateError(message) {
        const normalized = (message || '').toLowerCase();

        if (normalized.includes('invalid login credentials')) {
            return 'არასწორი ელ. ფოსტა ან პაროლი.';
        }
        if (normalized.includes('user already registered')) {
            return 'ეს ელ. ფოსტა უკვე რეგისტრირებულია.';
        }
        if (normalized.includes('password') && normalized.includes('6')) {
            return 'პაროლი უნდა იყოს მინიმუმ 6 სიმბოლო.';
        }
        if (normalized.includes('email not confirmed')) {
            return 'გთხოვთ, დაადასტუროთ ელ. ფოსტა შესვლამდე. შეამოწმეთ inbox და spam ფოლდერი.';
        }
        if (normalized.includes('valid email')) {
            return 'შეიყვანეთ სწორი ელ. ფოსტის მისამართი.';
        }

        return message || 'დაფიქსირდა შეცდომა. სცადეთ თავიდან.';
    }

    function showMessage(element, text, type) {
        if (!element) {
            return;
        }

        element.textContent = text;
        element.hidden = !text;
        element.classList.remove('auth__message--error', 'auth__message--success');

        if (type === 'success') {
            element.classList.add('auth__message--success');
        } else if (type === 'error') {
            element.classList.add('auth__message--error');
        }
    }

    function setSubmitting(form, isSubmitting) {
        const submitBtn = form.querySelector('[type="submit"]');

        if (!submitBtn) {
            return;
        }

        submitBtn.disabled = isSubmitting;
        submitBtn.setAttribute('aria-busy', String(isSubmitting));
    }

    function formatIsoToDisplay(isoDate) {
        const parts = isoDate.split('-');

        if (parts.length !== 3) {
            return '';
        }

        return parts[2] + '/' + parts[1] + '/' + parts[0];
    }

    function parseDisplayDate(value) {
        const match = value.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);

        if (!match) {
            return null;
        }

        const day = Number(match[1]);
        const month = Number(match[2]);
        const year = Number(match[3]);

        if (month < 1 || month > 12 || day < 1 || day > 31 || year < 1900) {
            return null;
        }

        const date = new Date(year, month - 1, day);

        if (
            date.getFullYear() !== year ||
            date.getMonth() !== month - 1 ||
            date.getDate() !== day
        ) {
            return null;
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (date > today) {
            return null;
        }

        return (
            String(year) + '-' +
            String(month).padStart(2, '0') + '-' +
            String(day).padStart(2, '0')
        );
    }

    function initDatePickers() {
        const birthdateInput = document.getElementById('sign-up-birthdate');
        const pickerInput = document.getElementById('sign-up-birthdate-picker');

        if (birthdateInput && pickerInput) {
            const today = new Date();
            const maxDate = today.toISOString().split('T')[0];
            const minDate = new Date(
                today.getFullYear() - 120,
                today.getMonth(),
                today.getDate()
            ).toISOString().split('T')[0];

            pickerInput.max = maxDate;
            pickerInput.min = minDate;

            pickerInput.addEventListener('change', function () {
                if (!pickerInput.value) {
                    return;
                }

                birthdateInput.value = formatIsoToDisplay(pickerInput.value);
                birthdateInput.setCustomValidity('');
            });

            birthdateInput.addEventListener('blur', function () {
                const rawValue = birthdateInput.value.trim();

                if (!rawValue) {
                    birthdateInput.setCustomValidity('');
                    return;
                }

                const isoDate = parseDisplayDate(rawValue);

                if (!isoDate) {
                    birthdateInput.setCustomValidity('invalid');
                    return;
                }

                birthdateInput.setCustomValidity('');
                pickerInput.value = isoDate;
                birthdateInput.value = formatIsoToDisplay(isoDate);
            });
        }

        document.querySelectorAll('[data-date-picker]').forEach(function (button) {
            button.addEventListener('click', function () {
                const control = button.closest('.form-field__control');
                const picker = control?.querySelector('.form-field__date-picker');

                if (!picker) {
                    return;
                }

                if (typeof picker.showPicker === 'function') {
                    picker.showPicker();
                    return;
                }

                picker.focus();
                picker.click();
            });
        });
    }

    function initPasswordToggles() {
        document.querySelectorAll('.form-field__toggle').forEach(function (button) {
            button.addEventListener('click', function () {
                const input = button.closest('.form-field__control')?.querySelector('input');

                if (!input) {
                    return;
                }

                const isPassword = input.type === 'password';
                input.type = isPassword ? 'text' : 'password';
                button.setAttribute(
                    'aria-label',
                    isPassword ? 'პაროლის დამალვა' : 'პაროლის ჩვენება'
                );
            });
        });
    }

    async function redirectIfSignedIn() {
        const client = getClient();

        if (!client) {
            return;
        }

        const { data } = await client.auth.getSession();

        if (data.session) {
            window.location.href = REDIRECT_URL;
        }
    }

    function initSignIn() {
        const form = document.querySelector('[data-auth-form="sign-in"]');
        const message = document.getElementById('auth-message');
        const googleBtn = document.querySelector('[data-auth-google]');

        if (!form) {
            return;
        }

        redirectIfSignedIn();

        form.addEventListener('submit', async function (event) {
            event.preventDefault();

            const client = getClient();

            if (!client) {
                showMessage(message, 'Supabase კავშირი ვერ მოიძებნა.', 'error');
                return;
            }

            const email = form.email.value.trim();
            const password = form.password.value;

            showMessage(message, '', '');
            setSubmitting(form, true);

            const { data, error } = await client.auth.signInWithPassword({
                email: email,
                password: password,
            });

            setSubmitting(form, false);

            if (error) {
                showMessage(message, translateError(error.message), 'error');
                return;
            }

            if (data.session) {
                window.location.href = REDIRECT_URL;
            }
        });

        googleBtn?.addEventListener('click', function () {
            signInWithGoogle();
        });
    }

    function initSignUp() {
        const form = document.querySelector('[data-auth-form="sign-up"]');
        const message = document.getElementById('auth-message');
        const googleBtn = document.querySelector('[data-auth-google]');

        if (!form) {
            return;
        }

        redirectIfSignedIn();

        form.addEventListener('submit', async function (event) {
            event.preventDefault();

            const client = getClient();

            if (!client) {
                showMessage(message, 'Supabase კავშირი ვერ მოიძებნა.', 'error');
                return;
            }

            const name = form.name.value.trim();
            const birthdateRaw = form.birthdate.value.trim();
            const birthdateIso = parseDisplayDate(birthdateRaw);
            const email = form.email.value.trim();
            const password = form.password.value;

            if (!birthdateIso) {
                showMessage(message, 'შეიყვანეთ სწორი თარიღი (dd/mm/yyyy).', 'error');
                return;
            }

            const birthdate = formatIsoToDisplay(birthdateIso);

            showMessage(message, '', '');
            setSubmitting(form, true);

            const { data, error } = await client.auth.signUp({
                email: email,
                password: password,
                options: {
                    emailRedirectTo: window.AUTH_CALLBACK_URL,
                    data: {
                        full_name: name,
                        birthdate: birthdate,
                    },
                },
            });

            setSubmitting(form, false);

            if (error) {
                showMessage(message, translateError(error.message), 'error');
                return;
            }

            if (data.session) {
                window.location.href = REDIRECT_URL;
                return;
            }

            showMessage(
                message,
                'რეგისტრაცია წარმატებულია. შეამოწმეთ ელ. ფოსტა (spam ფოლდერიც) და დაადასტურეთ ანგარიში.',
                'success'
            );
            form.reset();
        });

        googleBtn?.addEventListener('click', function () {
            signInWithGoogle();
        });
    }

    async function signInWithGoogle() {
        const client = getClient();
        const message = document.getElementById('auth-message');

        if (!client) {
            showMessage(message, 'Supabase კავშირი ვერ მოიძებნა.', 'error');
            return;
        }

        const { error } = await client.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.AUTH_CALLBACK_URL,
            },
        });

        if (error) {
            showMessage(message, translateError(error.message), 'error');
        }
    }

    initPasswordToggles();
    initDatePickers();
    initSignIn();
    initSignUp();
})();
