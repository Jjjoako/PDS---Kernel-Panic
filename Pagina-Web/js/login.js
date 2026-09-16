/* ==========================================================================
   Lígneo Carpintería — Login
   Mostrar/ocultar contraseña, validación del formulario y envío.
   ========================================================================== */

// Todo el archivo va dentro de una IIFE para no filtrar variables/funciones
// al ámbito global de la página (evita choques con otros scripts).
(function () {
    "use strict";

    // Referencias a los elementos del DOM que usa este script (ver login.html).
    // Si login.html cambiara algún id, solo hay que tocar estas líneas.
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
       Cambia el type del input entre "password" y "text" y alterna la
       clase "is-visible" del botón, que es lo que decide en login.css
       qué icono (ojo abierto / ojo tachado) se muestra.
       ---------------------------------------------------------------- */
    if (togglePasswordBtn && passwordInput) {
        togglePasswordBtn.addEventListener("click", function () {
            // Si ahora mismo está en modo "password", este clic la va a mostrar
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
       Como el <form> lleva "novalidate" (ver login.html), estas
       funciones sustituyen la validación nativa del navegador para
       controlar nosotros el texto y el estilo de los errores.
       ---------------------------------------------------------------- */

    // Escribe (o limpia, si message es "") el error de un campo concreto
    function setFieldError(inputEl, errorEl, message) {
        errorEl.textContent = message;
        inputEl.setAttribute("aria-invalid", message ? "true" : "false");
    }

    // Devuelve true/false según si el usuario/email es válido, y de paso
    // actualiza el mensaje de error bajo el campo
    function validateUsername() {
        const value = usernameInput.value.trim();
        if (!value) {
            setFieldError(usernameInput, usernameError, "Introduce tu nombre de usuario o email.");
            return false;
        }
        setFieldError(usernameInput, usernameError, "");
        return true;
    }

    // Igual que validateUsername pero para la contraseña (obligatoria y >= 6 caracteres)
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

    // Valida cada campo también al salir de él (blur), no solo al enviar el formulario
    if (usernameInput) {
        usernameInput.addEventListener("blur", validateUsername);
    }
    if (passwordInput) {
        passwordInput.addEventListener("blur", validatePassword);
    }

    // Muestra un mensaje general encima del botón "Acceder" (éxito o error).
    // type: "success" | "error" | null (null solo limpia el estilo, sin texto)
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
            event.preventDefault(); // evita la recarga de página por defecto del <form>

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

            // Feedback visual de "cargando" mientras se resuelve authenticate()
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
                    // Se ejecute lo que se ejecute arriba, el botón debe volver a su estado normal
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
     * De momento solo simula una espera de red y siempre "acierta".
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
