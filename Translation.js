(function () {
    "use strict";

    var config = {
        containerId: "google_translate_element",
        scriptId: "google_translate_script",
        arabicButton: '[name="btnArabic"]',
        englishButton: '[name="btnEnglish"]',
        retryCount: 0,
        maxRetries: 10
    };

    var state = {
        initialized: false,
        googleLoaded: false,
        clickBound: false,
        observer: null,
        observerTimer: null,
        applyingLayout: false
    };

    function createGoogleContainer() {
        if (document.getElementById(config.containerId)) return;

        var div = document.createElement("div");
        div.id = config.containerId;
        div.style.display = "none";
        document.body.appendChild(div);
    }

    function initGoogleTranslate() {
        if (state.googleLoaded) return;

        createGoogleContainer();

        if (document.getElementById(config.scriptId)) return;

        window.googleTranslateElementInit = function () {
            if (
                typeof google === "undefined" ||
                !google.translate ||
                !google.translate.TranslateElement
            ) return;

            try {
                new google.translate.TranslateElement({
                    pageLanguage: "en",
                    includedLanguages: "ar",
                    autoDisplay: false
                }, config.containerId);

                state.googleLoaded = true;

                setTimeout(applyLanguageLayout, 500);
            } catch (error) {
                console.error("[Translation] Initialization failed:", error);
            }
        };

        var script = document.createElement("script");
        script.id = config.scriptId;
        script.src =
            "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
        script.async = true;

        script.onerror = function () {
            console.error("[Translation] Failed to load Google Translate.");
        };

        document.body.appendChild(script);
    }

    function getGoogleSelector() {
        return document.querySelector(".goog-te-combo");
    }

    window.translateToArabic = function () {
        var combo = getGoogleSelector();

        if (!combo) {
            if (config.retryCount < config.maxRetries) {
                config.retryCount++;

                setTimeout(window.translateToArabic, 500);
            } else {
                config.retryCount = 0;
                console.error("[Translation] Google Translate is not ready.");
            }

            return;
        }

        config.retryCount = 0;

        try {
            combo.value = "ar";
            combo.dispatchEvent(new Event("change", { bubbles: true }));

            setTimeout(applyLanguageLayout, 800);
        } catch (error) {
            console.error("[Translation] Arabic translation failed:", error);
        }
    };

    function clearTranslationCookie() {
        var host = location.hostname;
        var domain = host.split(".").length > 2
            ? "." + host.split(".").slice(-2).join(".")
            : host;

        document.cookie =
            "googtrans=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";

        document.cookie =
            "googtrans=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=" + host;

        document.cookie =
            "googtrans=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=" + domain;
    }

    window.translateToEnglish = function () {
        clearTranslationCookie();

        document.documentElement.classList.remove(
            "translated-rtl",
            "translated-ltr"
        );

        document.body.classList.remove(
            "translated-rtl",
            "translated-ltr"
        );

        document.documentElement.style.direction = "ltr";
        document.body.style.setProperty("direction", "ltr", "important");
        document.body.style.setProperty("text-align", "left", "important");

        setTimeout(function () {
            window.location.reload();
        }, 100);
    };

    function isArabic() {
        var cookies = decodeURIComponent(document.cookie || "");

        return (
            cookies.indexOf("googtrans=/en/ar") !== -1 ||
            cookies.indexOf("googtrans=/auto/ar") !== -1
        );
    }

    function applyLanguageLayout() {
        if (state.applyingLayout) return;

        state.applyingLayout = true;

        try {
            var arabic = isArabic();
            var englishButton = document.querySelector(config.englishButton);
            var arabicButton = document.querySelector(config.arabicButton);
            var forms = document.querySelectorAll(".theme-entry .form");

            document.documentElement.setAttribute(
                "dir",
                arabic ? "rtl" : "ltr"
            );

            document.documentElement.setAttribute(
                "lang",
                arabic ? "ar" : "en"
            );

            document.body.style.setProperty(
                "direction",
                arabic ? "rtl" : "ltr",
                "important"
            );

            document.body.style.setProperty(
                "text-align",
                arabic ? "right" : "left",
                "important"
            );

            if (arabic) {
                if (englishButton) englishButton.classList.remove("hidden");
                if (arabicButton) arabicButton.classList.add("hidden");

                forms.forEach(function (form) {
                    form.setAttribute("dir", "rtl");
                    form.classList.add("customer-journey-rtl");
                    form.classList.remove("customer-journey-ltr");
                });
            } else {
                if (arabicButton) arabicButton.classList.remove("hidden");
                if (englishButton) englishButton.classList.add("hidden");

                forms.forEach(function (form) {
                    form.setAttribute("dir", "ltr");
                    form.classList.add("customer-journey-ltr");
                    form.classList.remove("customer-journey-rtl");
                });
            }
        } finally {
            setTimeout(function () {
                state.applyingLayout = false;
            }, 50);
        }
    }

    function bindLanguageButtons() {
        if (state.clickBound) return;

        document.addEventListener("click", function (event) {
            if (!event.target || !event.target.closest) return;

            if (event.target.closest(config.arabicButton)) {
                event.preventDefault();
                window.translateToArabic();
                return;
            }

            if (event.target.closest(config.englishButton)) {
                event.preventDefault();
                window.translateToEnglish();
            }
        }, true);

        state.clickBound = true;
    }

    function observeK2() {
        if (
            typeof MutationObserver === "undefined" ||
            state.observer
        ) return;

        state.observer = new MutationObserver(function (mutations) {
            if (state.applyingLayout) return;

            var changed = mutations.some(function (mutation) {
                return (
                    mutation.type === "childList" &&
                    mutation.addedNodes.length
                );
            });

            if (!changed) return;

            clearTimeout(state.observerTimer);

            state.observerTimer = setTimeout(
                applyLanguageLayout,
                150
            );
        });

        state.observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    function init() {
        if (state.initialized) return;

        state.initialized = true;

        initGoogleTranslate();
        bindLanguageButtons();
        observeK2();

        setTimeout(applyLanguageLayout, 500);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
