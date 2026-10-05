(function () {

    "use strict";

    /* ============================================================
       CUSTOMER JOURNEY - GLOBAL TRANSLATION
       English <-> Arabic
       Google Translate Widget
       ============================================================ */

    var TranslationManager = {

        /* --------------------------------------------------------
           CONFIGURATION
           -------------------------------------------------------- */

        config: {
            defaultLanguage: "en",
            arabicLanguage: "ar",

            /* Existing K2 button names */
            arabicButtonName: "btnArabic",
            englishButtonName: "btnEnglish",

            /* Hidden Google Translate container */
            googleContainerId: "google_translate_element",

            /* Prevent duplicate initialization */
            initialized: false,

            /* Mutation observer */
            observer: null,

            /* Prevent observer loops */
            isApplyingLanguage: false
        },


        /* ========================================================
           INITIALIZATION
           ======================================================== */

        init: function () {

            var self = this;

            if (self.config.initialized) {
                return;
            }

            self.config.initialized = true;

            self.createGoogleTranslateContainer();

            self.loadGoogleTranslate();

            self.bindLanguageButtons();

            self.applyCurrentLanguageLayout();

            self.observeK2Changes();

            console.log("[Translation] Initialized");
        },


        /* ========================================================
           CREATE HIDDEN GOOGLE TRANSLATE CONTAINER
           ======================================================== */

        createGoogleTranslateContainer: function () {

            var containerId = this.config.googleContainerId;

            if (document.getElementById(containerId)) {
                return;
            }

            var container = document.createElement("div");

            container.id = containerId;

            /*
             * Keep the Google widget completely hidden.
             * Users will use our K2 English/Arabic buttons.
             */
            container.style.position = "fixed";
            container.style.left = "-99999px";
            container.style.top = "-99999px";
            container.style.width = "1px";
            container.style.height = "1px";
            container.style.overflow = "hidden";
            container.style.opacity = "0";
            container.style.pointerEvents = "none";
            container.style.zIndex = "-1";

            document.body.appendChild(container);
        },


        /* ========================================================
           LOAD GOOGLE TRANSLATE
           ======================================================== */

        loadGoogleTranslate: function () {

            var self = this;

            /*
             * Do not load the Google script more than once.
             */
            if (document.getElementById("google-translate-script")) {
                return;
            }

            /*
             * Google calls this function after the script loads.
             */
            window.googleTranslateElementInit = function () {

                try {

                    if (
                        typeof google === "undefined" ||
                        !google.translate ||
                        !google.translate.TranslateElement
                    ) {
                        console.error(
                            "[Translation] Google Translate API unavailable."
                        );

                        return;
                    }

                    new google.translate.TranslateElement(
                        {
                            pageLanguage: "en",

                            /*
                             * Only Arabic is required in addition
                             * to the original English page.
                             */
                            includedLanguages: "ar",

                            autoDisplay: false
                        },
                        self.config.googleContainerId
                    );

                    console.log(
                        "[Translation] Google Translate loaded."
                    );

                    /*
                     * Give the Google widget time to create
                     * its internal select element.
                     */
                    setTimeout(function () {
                        self.bindLanguageButtons();
                        self.applyCurrentLanguageLayout();
                    }, 500);

                }
                catch (error) {

                    console.error(
                        "[Translation] Google Translate initialization failed:",
                        error
                    );
                }
            };


            var script = document.createElement("script");

            script.id = "google-translate-script";

            script.src =
                "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";

            script.async = true;

            script.onerror = function () {

                console.error(
                    "[Translation] Unable to load Google Translate."
                );
            };

            document.head.appendChild(script);
        },


        /* ========================================================
           FIND GOOGLE TRANSLATE SELECT
           ======================================================== */

        getGoogleLanguageSelector: function () {

            /*
             * Google creates this select dynamically.
             */
            return document.querySelector(
                ".goog-te-combo"
            );
        },


        /* ========================================================
           TRANSLATE TO ARABIC
           ======================================================== */

        translateToArabic: function () {

            var self = this;

            if (self.config.isApplyingLanguage) {
                return;
            }

            var selector = self.getGoogleLanguageSelector();

            /*
             * Google Translate may not have finished loading yet.
             */
            if (!selector) {

                console.warn(
                    "[Translation] Google Translate selector not ready."
                );

                /*
                 * Try again shortly.
                 */
                setTimeout(function () {
                    self.translateToArabic();
                }, 500);

                return;
            }

            self.config.isApplyingLanguage = true;

            try {

                selector.value = self.config.arabicLanguage;

                /*
                 * Google Translate listens to the change event.
                 */
                selector.dispatchEvent(
                    new Event("change", {
                        bubbles: true
                    })
                );

                /*
                 * Give Google Translate time to modify
                 * the K2 DOM.
                 */
                setTimeout(function () {

                    self.applyRTL();

                    self.config.isApplyingLanguage = false;

                }, 800);

            }
            catch (error) {

                self.config.isApplyingLanguage = false;

                console.error(
                    "[Translation] Arabic translation failed:",
                    error
                );
            }
        },


        /* ========================================================
           TRANSLATE TO ENGLISH
           ======================================================== */

        translateToEnglish: function () {

            var self = this;

            if (self.config.isApplyingLanguage) {
                return;
            }

            self.config.isApplyingLanguage = true;

            /*
             * Google Translate stores the selected language
             * in the googtrans cookie.
             *
             * Removing it restores the original language.
             */
            self.clearGoogleTranslationCookie();

            /*
             * Remove Google translation classes.
             */
            self.removeGoogleTranslationState();

            /*
             * Apply normal English layout.
             */
            self.applyLTR();

            /*
             * Reloading the page is the most reliable way
             * to restore the original K2 DOM after Google
             * has translated it.
             */
            setTimeout(function () {

                window.location.reload();

            }, 150);
        },


        /* ========================================================
           CLEAR GOOGLE TRANSLATION COOKIE
           ======================================================== */

        clearGoogleTranslationCookie: function () {

            var cookies = [
                "googtrans=/en/ar",
                "googtrans=/auto/ar"
            ];

            cookies.forEach(function (cookieValue) {

                var parts = cookieValue.split("=");

                var cookieName = parts[0];

                /*
                 * Current host
                 */
                document.cookie =
                    cookieName +
                    "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";

                /*
                 * Current domain
                 */
                document.cookie =
                    cookieName +
                    "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=" +
                    window.location.hostname;

                /*
                 * Parent domain
                 */
                var hostname = window.location.hostname;

                if (hostname.indexOf(".") !== -1) {

                    var domainParts = hostname.split(".");

                    var rootDomain =
                        "." +
                        domainParts.slice(-2).join(".");

                    document.cookie =
                        cookieName +
                        "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=" +
                        rootDomain;
                }

            });
        },


        /* ========================================================
           REMOVE GOOGLE TRANSLATION STATE
           ======================================================== */

        removeGoogleTranslationState: function () {

            document.documentElement.classList.remove(
                "translated-ltr"
            );

            document.documentElement.classList.remove(
                "translated-rtl"
            );

            document.body.classList.remove(
                "translated-ltr"
            );

            document.body.classList.remove(
                "translated-rtl"
            );

            document.body.removeAttribute("dir");
        },


        /* ========================================================
           APPLY RTL
           ======================================================== */

        applyRTL: function () {

            var self = this;

            self.config.isApplyingLanguage = true;

            document.documentElement.setAttribute(
                "dir",
                "rtl"
            );

            document.documentElement.setAttribute(
                "lang",
                "ar"
            );

            document.body.setAttribute(
                "dir",
                "rtl"
            );

            document.body.classList.add(
                "customer-journey-arabic"
            );

            document.body.classList.remove(
                "customer-journey-english"
            );

            /*
             * Apply direction to the K2 form as well.
             */
            var forms = document.querySelectorAll(
                ".theme-entry .form"
            );

            forms.forEach(function (form) {

                form.setAttribute(
                    "dir",
                    "rtl"
                );

                form.classList.add(
                    "customer-journey-rtl"
                );

                form.classList.remove(
                    "customer-journey-ltr"
                );
            });

            /*
             * Store language state.
             */
            try {

                sessionStorage.setItem(
                    "CustomerJourneyLanguage",
                    "ar"
                );

            }
            catch (e) {
                console.warn(
                    "[Translation] Session storage unavailable."
                );
            }

            /*
             * Update button visibility.
             */
            self.updateLanguageButtons("ar");

            setTimeout(function () {

                self.config.isApplyingLanguage = false;

            }, 300);
        },


        /* ========================================================
           APPLY LTR
           ======================================================== */

        applyLTR: function () {

            var self = this;

            document.documentElement.setAttribute(
                "dir",
                "ltr"
            );

            document.documentElement.setAttribute(
                "lang",
                "en"
            );

            document.body.setAttribute(
                "dir",
                "ltr"
            );

            document.body.classList.remove(
                "customer-journey-arabic"
            );

            document.body.classList.add(
                "customer-journey-english"
            );

            var forms = document.querySelectorAll(
                ".theme-entry .form"
            );

            forms.forEach(function (form) {

                form.setAttribute(
                    "dir",
                    "ltr"
                );

                form.classList.remove(
                    "customer-journey-rtl"
                );

                form.classList.add(
                    "customer-journey-ltr"
                );
            });

            try {

                sessionStorage.setItem(
                    "CustomerJourneyLanguage",
                    "en"
                );

            }
            catch (e) {
                console.warn(
                    "[Translation] Session storage unavailable."
                );
            }

            self.updateLanguageButtons("en");
        },


        /* ========================================================
           UPDATE LANGUAGE BUTTONS
           ======================================================== */

        updateLanguageButtons: function (language) {

            var arabicButtons = document.querySelectorAll(
                '[name="' +
                this.config.arabicButtonName +
                '"]'
            );

            var englishButtons = document.querySelectorAll(
                '[name="' +
                this.config.englishButtonName +
                '"]'
            );

            /*
             * Do not hide the buttons.
             *
             * Instead, mark the active language.
             * This is safer for K2 because hiding/showing
             * controls can interfere with K2 rendering.
             */

            arabicButtons.forEach(function (button) {

                button.classList.toggle(
                    "translation-active",
                    language === "ar"
                );

                button.setAttribute(
                    "aria-pressed",
                    language === "ar"
                        ? "true"
                        : "false"
                );
            });


            englishButtons.forEach(function (button) {

                button.classList.toggle(
                    "translation-active",
                    language === "en"
                );

                button.setAttribute(
                    "aria-pressed",
                    language === "en"
                        ? "true"
                        : "false"
                );
            });
        },


        /* ========================================================
           BIND K2 LANGUAGE BUTTONS
           ======================================================== */

        bindLanguageButtons: function () {

            var self = this;

            /*
             * Event delegation is intentional.
             *
             * K2 can recreate controls dynamically.
             */
            if (
                document.body.getAttribute(
                    "data-translation-events"
                ) === "true"
            ) {
                return;
            }

            document.body.setAttribute(
                "data-translation-events",
                "true"
            );

            document.addEventListener(
                "click",
                function (event) {

                    var target =
                        event.target.closest(
                            '[name="' +
                            self.config.arabicButtonName +
                            '"]'
                        );

                    if (target) {

                        event.preventDefault();

                        self.translateToArabic();

                        return;
                    }


                    target =
                        event.target.closest(
                            '[name="' +
                            self.config.englishButtonName +
                            '"]'
                        );

                    if (target) {

                        event.preventDefault();

                        self.translateToEnglish();

                        return;
                    }

                },
                true
            );
        },


        /* ========================================================
           DETECT CURRENT LANGUAGE
           ======================================================== */

        detectCurrentLanguage: function () {

            /*
             * First check Google Translate cookie.
             */
            var cookies =
                document.cookie.split(";");

            for (var i = 0; i < cookies.length; i++) {

                var cookie =
                    cookies[i].trim();

                if (
                    cookie.indexOf(
                        "googtrans=/en/ar"
                    ) === 0
                ) {
                    return "ar";
                }

                if (
                    cookie.indexOf(
                        "googtrans=/auto/ar"
                    ) === 0
                ) {
                    return "ar";
                }
            }


            /*
             * Check our session state.
             */
            try {

                var storedLanguage =
                    sessionStorage.getItem(
                        "CustomerJourneyLanguage"
                    );

                if (
                    storedLanguage === "ar" ||
                    storedLanguage === "en"
                ) {
                    return storedLanguage;
                }

            }
            catch (e) {
                /* Ignore */
            }


            return this.config.defaultLanguage;
        },


        /* ========================================================
           APPLY CURRENT LANGUAGE
           ======================================================== */

        applyCurrentLanguageLayout: function () {

            var language =
                this.detectCurrentLanguage();

            if (language === "ar") {

                this.applyRTL();

            }
            else {

                this.applyLTR();
            }
        },


        /* ========================================================
           OBSERVE K2 DOM CHANGES
           ======================================================== */

        observeK2Changes: function () {

            var self = this;

            if (
                typeof MutationObserver ===
                "undefined"
            ) {
                return;
            }

            var observer =
                new MutationObserver(
                    function (mutations) {

                        /*
                         * Do not continuously modify the DOM
                         * while we ourselves are changing it.
                         */
                        if (
                            self.config.isApplyingLanguage
                        ) {
                            return;
                        }

                        var relevantChange = false;

                        for (
                            var i = 0;
                            i < mutations.length;
                            i++
                        ) {

                            var mutation =
                                mutations[i];

                            if (
                                mutation.type ===
                                "childList"
                            ) {

                                if (
                                    mutation.addedNodes &&
                                    mutation.addedNodes.length
                                ) {

                                    relevantChange = true;

                                    break;
                                }
                            }
                        }

                        if (!relevantChange) {
                            return;
                        }

                        /*
                         * K2 may recreate buttons after
                         * AJAX/view refreshes.
                         */
                        self.bindLanguageButtons();

                        /*
                         * Re-apply direction to newly
                         * created K2 forms/views.
                         */
                        var language =
                            self.detectCurrentLanguage();

                        if (language === "ar") {

                            self.applyRTL();

                        }
                        else {

                            self.applyLTR();
                        }

                    }
                );


            observer.observe(
                document.body,
                {
                    childList: true,
                    subtree: true
                }
            );

            self.config.observer =
                observer;
        }

    };


    /* ============================================================
       PUBLIC FUNCTIONS
       ============================================================ */

    window.translateToArabic =
        function () {

            TranslationManager
                .translateToArabic();

        };


    window.translateToEnglish =
        function () {

            TranslationManager
                .translateToEnglish();

        };


    window.CustomerJourneyTranslation =
        TranslationManager;


    /* ============================================================
       START AFTER DOM READY
       ============================================================ */

    function startTranslation() {

        /*
         * K2 may not have completed its initial rendering
         * at DOMContentLoaded.
         */
        setTimeout(function () {

            TranslationManager.init();

        }, 500);
    }


    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            startTranslation
        );

    }
    else {

        startTranslation();
    }


})();
