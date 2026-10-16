(function () {
    "use strict";

    var config = {
        containerId: "google_translate_element",
        scriptId: "google_translate_script",
        arabicButton: '[name="btnArabic"]',
        englishButton: '[name="btnEnglish"]',
        maxWidgetChecks: 40,
        widgetCheckInterval: 150
    };

    var state = {
        initialized: false,
        scriptLoading: false,
        widgetCreated: false,
        googleLoaded: false,
        translationRequested: false,
        clickBound: false,
        observer: null,
        observerTimer: null,
        widgetPollActive: false,
        applyingLayout: false
    };

    function createGoogleContainer() {
        if (document.getElementById(config.containerId)) return;

        var container = document.createElement("div");
        container.id = config.containerId;
        container.style.display = "none";
        document.body.appendChild(container);
    }

    function getGoogleSelector() {
        return document.querySelector(".goog-te-combo");
    }

    function initGoogleTranslate() {
        if (state.googleLoaded || state.scriptLoading) return;

        if (state.widgetCreated) {
            waitForTranslateWidget(0);
            return;
        }

        createGoogleContainer();
        state.scriptLoading = true;

        window.googleTranslateElementInit = function () {
            if (
                !window.google ||
                !google.translate ||
                !google.translate.TranslateElement
            ) {
                state.scriptLoading = false;
                console.error("[Translation] Google Translate API is unavailable.");
                return;
            }

            try {
                new google.translate.TranslateElement({
                    pageLanguage: "en",
                    includedLanguages: "ar",
                    autoDisplay: false
                }, config.containerId);

                state.widgetCreated = true;
                waitForTranslateWidget(0);
            } catch (error) {
                state.scriptLoading = false;
                console.error("[Translation] Initialization failed:", error);
            }
        };

        var script = document.getElementById(config.scriptId);

        if (script) {
            if (
                window.google &&
                google.translate &&
                google.translate.TranslateElement
            ) {
                window.googleTranslateElementInit();
            } else {
                state.scriptLoading = false;
                console.error(
                    "[Translation] Script exists but Google Translate is not ready."
                );
            }
            return;
        }

        script = document.createElement("script");
        script.id = config.scriptId;
        script.src =
            "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
        script.async = true;

        script.onerror = function () {
            state.scriptLoading = false;
            console.error("[Translation] Failed to load Google Translate.");
        };

        document.body.appendChild(script);
    }

    function waitForTranslateWidget(startAttempt) {
        if (state.widgetPollActive) return;

        state.widgetPollActive = true;
        var attempts = startAttempt || 0;

        function check() {
            var combo = getGoogleSelector();

            if (combo) {
                state.widgetPollActive = false;
                state.googleLoaded = true;
                state.scriptLoading = false;

                if (state.translationRequested) {
                    applyArabicSelection();
                } else {
                    setTimeout(applyLanguageLayout, 500);
                }
                return;
            }

            if (attempts < config.maxWidgetChecks) {
                attempts++;
                setTimeout(check, config.widgetCheckInterval);
            } else {
                state.widgetPollActive = false;
                state.scriptLoading = false;

                console.error(
                    "[Translation] Google Translate widget did not become ready."
                );
            }
        }

        check();
    }

    function applyArabicSelection() {
        var combo = getGoogleSelector();

        if (!combo) {
            waitForTranslateWidget(0);
            return;
        }

        state.translationRequested = false;

        combo.value = "ar";
        combo.dispatchEvent(new Event("change", {
            bubbles: true
        }));

        setTimeout(applyLanguageLayout, 800);
    }

    window.translateToArabic = function () {
        state.translationRequested = true;

        if (!state.googleLoaded) {
            initGoogleTranslate();
            return;
        }

        applyArabicSelection();
    };

    function clearTranslationCookie() {
        var host = location.hostname;
        var parts = host.split(".");
        var domain = parts.length > 2
            ? "." + parts.slice(-2).join(".")
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

        document.body.style.setProperty(
            "direction", "ltr", "important"
        );

        document.body.style.setProperty(
            "text-align", "left", "important"
        );

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
                "dir", arabic ? "rtl" : "ltr"
            );

            document.documentElement.setAttribute(
                "lang", arabic ? "ar" : "en"
            );

            document.body.style.setProperty(
                "direction", arabic ? "rtl" : "ltr", "important"
            );

            document.body.style.setProperty(
                "text-align", arabic ? "right" : "left", "important"
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
            } else if (event.target.closest(config.englishButton)) {
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
                    mutation.addedNodes.length > 0
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

        if (isArabic()) {
            initGoogleTranslate();
        }

        bindLanguageButtons();
        observeK2();

        setTimeout(applyLanguageLayout, 500);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init, {
            once: true
        });
    } else {
        init();
    }
})();
