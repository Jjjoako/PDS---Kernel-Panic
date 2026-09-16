/* ==========================================================================
   Lígneo Carpintería — Login
   Mostrar/ocultar contraseña, validación del formulario y envío.
   ========================================================================== */

(function () {
    "use strict";

    const form = document.getElementById("login-form");
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const usernameError = document.getElementById("username-error");
    const passwordError = document.getElementById("password-error");
    const formMessage = document.getElementById("form-message");
    const togglePasswordBtn = document.getElementById("toggle-password");
    const googleBtn = document.getElementById("google-login");
    const submitBtn = form ? form.querySelector('button[type="submit"]') : null;

    /* ----------------------------------------------------------------
       Mostrar / ocultar contraseña
       ---------------------------------------------------------------- */
    if (togglePasswordBtn && passwordInput) {
        togglePasswordBtn.addEventListener("click", function () {
            const willShowPassword = passwordInput.type === "password";

            passwordInput.type = willShowPassword ? "text" : "password";
            togglePasswordBtn.classList.toggle("is-visible", willShowPassword);
            togglePasswordBtn.setAttribute("aria-pressed", String(willShowPassword));
            togglePasswordBtn.setAttribute(
                "aria-label",
                willShowPassword ? "Ocultar contraseña" : "Mostrar contraseña"
            );
        });
    }

    /* ----------------------------------------------------------------
       Validación
       ---------------------------------------------------------------- */
    function setFieldError(inputEl, errorEl, message) {
        errorEl.textContent = message;
        inputEl.setAttribute("aria-invalid", message ? "true" : "false");
    }

    function validateUsername() {
        const value = usernameInput.value.trim();
        if (!value) {
            setFieldError(usernameInput, usernameError, "Introduce tu nombre de usuario o email.");
            return false;
        }
        setFieldError(usernameInput, usernameError, "");
        return true;
    }

    function validatePassword() {
        const value = passwordInput.value;
        if (!value) {
            setFieldError(passwordInput, passwordError, "Introduce tu contraseña.");
            return false;
        }
        if (value.length < 6) {
            setFieldError(passwordInput, passwordError, "La contraseña debe tener al menos 6 caracteres.");
            return false;
        }
        setFieldError(passwordInput, passwordError, "");
        return true;
    }

    if (usernameInput) {
        usernameInput.addEventListener("blur", validateUsername);
    }
    if (passwordInput) {
        passwordInput.addEventListener("blur", validatePassword);
    }

    function showFormMessage(text, type) {
        formMessage.textContent = text;
        formMessage.classList.remove("is-success", "is-error");
        if (type) {
            formMessage.classList.add(type === "success" ? "is-success" : "is-error");
        }
    }

    /* ----------------------------------------------------------------
       Envío del formulario
       ---------------------------------------------------------------- */
    if (form) {
        form.addEventListener("submit", function (event) {
            event.preventDefault();

            const isUsernameValid = validateUsername();
            const isPasswordValid = validatePassword();

            if (!isUsernameValid || !isPasswordValid) {
                showFormMessage("Revisa los campos marcados en rojo.", "error");
                return;
            }

            showFormMessage("", null);

            const credentials = {
                username: usernameInput.value.trim(),
                password: passwordInput.value,
            };

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = "Accediendo…";
            }

            // TODO: sustituir por la llamada real al backend de autenticación,
            // por ejemplo: fetch('/api/login', { method: 'POST', body: JSON.stringify(credentials) })
            authenticate(credentials)
                .then(function () {
                    showFormMessage("¡Bienvenido de nuevo!", "success");
                    // window.location.href = "./index.html";
                })
                .catch(function (error) {
                    showFormMessage(error.message || "No se ha podido iniciar sesión.", "error");
                })
                .finally(function () {
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.textContent = "Acceder";
                    }
                });
        });
    }

    /**
     * Placeholder de autenticación. Sustituir por la integración real
     * (API propia, Firebase Auth, etc.) cuando el backend esté disponible.
     * @param {{username: string, password: string}} credentials
     * @returns {Promise<void>}
     */
    function authenticate(credentials) {
        return new Promise(function (resolve) {
            window.setTimeout(resolve, 600);
        });
    }

    /* ----------------------------------------------------------------
       Continuar con Google (placeholder hasta integrar OAuth)
       ---------------------------------------------------------------- */
    if (googleBtn) {
        googleBtn.addEventListener("click", function () {
            // TODO: sustituir por la integración real de Google Identity Services.
            showFormMessage("El acceso con Google todavía no está disponible.", "error");
        });
    }
})();
