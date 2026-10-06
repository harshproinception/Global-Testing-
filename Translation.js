// =========================================================
// GOOGLE TRANSLATE LOGIC
// =========================================================
function initGlobalGoogleTranslate() {
    if (!document.getElementById('google_translate_element')) {
        let gtDiv = document.createElement('div');
        gtDiv.id = 'google_translate_element';
        gtDiv.style.display = 'none';
        document.body.appendChild(gtDiv);

        window.googleTranslateElementInit = function () {
            new google.translate.TranslateElement({
                pageLanguage: 'en',
                includedLanguages: 'ar',
                autoDisplay: false
            }, 'google_translate_element');
        };

        let gtScript = document.createElement('script');
        gtScript.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        document.body.appendChild(gtScript);
    }
}

function applyCurrentLanguageLayout() {
    let cookieStr = decodeURIComponent(document.cookie);

    let isArabic = cookieStr.includes('googtrans=/en/ar') || cookieStr.includes('googtrans=/auto/ar');

    let btnEnglish = document.querySelector('a[name="btnEnglish"]');
    let btnArabic = document.querySelector('a[name="btnArabic"]');

    if (isArabic) {
        document.body.style.setProperty('direction', 'rtl', 'important');
        document.body.style.setProperty('text-align', 'right', 'important');

        if (btnEnglish) btnEnglish.classList.remove('hidden');
        if (btnArabic) btnArabic.classList.add('hidden');
    } else {
        document.body.style.setProperty('direction', 'ltr', 'important');
        document.body.style.setProperty('text-align', 'left', 'important');

        if (btnArabic) btnArabic.classList.remove('hidden');
        if (btnEnglish) btnEnglish.classList.add('hidden');
    }
}

// ==========================================
// GLOBAL TRANSLATION FUNCTIONS
// ==========================================
window.translateToArabic = function () {
    let combo = document.querySelector('.goog-te-combo');
    if (combo) {
        combo.value = 'ar';
        combo.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));

        if (typeof document.createEvent === 'function') {
            let evt = document.createEvent('HTMLEvents');
            evt.initEvent('change', true, true);
            combo.dispatchEvent(evt);
        }
    }

    setTimeout(applyCurrentLanguageLayout, 50);
};

window.translateToEnglish = function () {
    var host = location.hostname;
    var baseDomain = host.includes('.') ? "." + host.split('.').slice(-2).join('.') : host;

    document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=" + baseDomain;
    document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=" + host;
    document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    document.documentElement.classList.remove('translated-rtl', 'translated-ltr');

    setTimeout(function () {
        window.location.reload(); // Removed 'true' parameter as it is deprecated in modern browsers
    }, 100);
};



setInterval(function () {
    
    initGlobalGoogleTranslate();
    setInterval(function () {
        applyCurrentLanguageLayout();
    }, 500);

    // ==========================================
    // EVENT LISTENER FOR MANUAL CLICKS
    // ==========================================
    document.addEventListener('click', function (e) {
        if (e.target.closest('[name="btnArabic"]')) {
            window.translateToArabic();
        }
        else if (e.target.closest('[name="btnEnglish"]')) {
            window.translateToEnglish();
        }
    });

});
