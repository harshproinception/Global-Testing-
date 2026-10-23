/* =========================================================================
   1. MARKERS ENGINE: Automatically adds .pi-has-* to parent ancestors
   ========================================================================= */
(function () {
    var MARKERS = [
        ["[name=\"Add_cust_style_dlb\"]", "pi-has-add-cust"],
        ["span[name=\"Projects_tab_List_dlb\"]", "pi-has-projects-list"],
        ["span[name=\"MyCustomer_List_Style_dlb\"]", "pi-has-mycust-list"],
        ["span[name=\"Ops_cards_style_dlb\"]", "pi-has-ops-cards"],
        ["span[name=\"card_style_dlb\"]", "pi-has-card-style"],
        ["[name=\"CustomerLeadDetailsStyleDlb\"]", "pi-has-cld-style"],
        ["a[name=\"Home btn\"]", "pi-has-home-btn"],
        [".retal-custom-header-layout", "pi-has-header-layout"],
        ["span[name=\"space_style_dlb\"]", "pi-has-space-style"],
        ["[name=\"header_name_label\"]", "pi-has-header-name"],
        ["[name=\"Header_style_dbl\"]", "pi-has-header-style"],
        ["[name=\"PortalSelectionStyleDlb\"]", "pi-has-portal-selection"]
    ];

    function sync() {
        for (var m = 0; m < MARKERS.length; m++) {
            var sel = MARKERS[m][0];
            var cls = MARKERS[m][1];
            var want = [];
            var nodes = document.querySelectorAll(sel);

            for (var i = 0; i < nodes.length; i++) {
                var el = nodes[i].parentElement;
                while (el && want.indexOf(el) === -1) {
                    want.push(el);
                    el = el.parentElement;
                }
            }

            for (var a = 0; a < want.length; a++) {
                if (!want[a].classList.contains(cls)) {
                    want[a].classList.add(cls);
                }
            }

            var stale = document.getElementsByClassName(cls);
            for (var s = stale.length - 1; s >= 0; s--) {
                if (want.indexOf(stale[s]) === -1) {
                    stale[s].classList.remove(cls);
                }
            }
        }
    }

    window.piSyncPageMarkers = sync;
    sync();

    if (window.MutationObserver) {
        new MutationObserver(sync).observe(document.documentElement, {
            childList: true,
            subtree: true
        });
    }
})();

/* =========================================================================
   2. SIDEBAR & GLOBAL LAYOUT INITIALIZER
   ========================================================================= */
function getRetalSidebarRow() {
    return $('.form a[name="Home btn"]').first().closest('.row');
}

function initializeRetalGlobalLayout() {
    var $headerTarget = $('span[name="Header_style_dbl"]').closest('div.Grid-Layout.root-table');
    if ($headerTarget.length === 0) {
        $headerTarget = $('.form .row:first-child .root-table');
    }
    
    if ($headerTarget.length && !$headerTarget.hasClass('retal-custom-header-layout')) {
        $headerTarget.addClass('retal-custom-header-layout');
        if (window.piSyncPageMarkers) {
            window.piSyncPageMarkers();
        }
    }

    var $sidebarRow = getRetalSidebarRow();
    if (!$sidebarRow.length) {
        return;
    }

    var $buttons = $sidebarRow.find('a.SourceCode-Forms-Controls-Web-Button');

    if ($buttons.length) {
        var currentUrl = window.location.href.toLowerCase();
        var activeButtonName = "Home btn";

        if (currentUrl.indexOf("opsteam.customerdetail.form") !== -1) {
            activeButtonName = null;
        }
        else if (currentUrl.indexOf("customer") !== -1 && currentUrl.indexOf("add") !== -1) {
            activeButtonName = "Add custm btn";
        } else if (currentUrl.indexOf("projects") !== -1 || currentUrl.indexOf("customerjourney.selectedbroker.form") !== -1) {
            activeButtonName = "Project btn";
        } else if (currentUrl.indexOf("configuration") !== -1) {
            activeButtonName = "Configuration btn";
        } else if (currentUrl.indexOf("worklist") !== -1) {
            activeButtonName = "Worklist btn";
        } else if (currentUrl.indexOf("mycustomerslead") !== -1) {
            activeButtonName = "My cust lead btn";
        } else if ((currentUrl.indexOf("my") !== -1 && currentUrl.indexOf("customer") !== -1) || 
                (currentUrl.indexOf("all") !== -1 && currentUrl.indexOf("customer") !== -1) ||
                (currentUrl.indexOf("customerdetailsrega") !== -1 ) ||
                (currentUrl.indexOf("brokercustomerdetails") !== -1 )) {
            activeButtonName = "My custm btn";
        }

        $buttons.removeClass('active-nav');
        if (activeButtonName) {
            $sidebarRow.find('a[name="' + activeButtonName + '"]').addClass('active-nav');
        }
    }
}

(function () {
    var ajaxTimer = null;

    $(document).ready(function () {
        initializeRetalGlobalLayout();

        $(document).on('click', '.form a.SourceCode-Forms-Controls-Web-Button', function () {
            var $row = $(this).closest('.row');
            if (!$row.find('a[name="Home btn"]').length) {
                return;
            }
            $row.find('a.SourceCode-Forms-Controls-Web-Button').removeClass('active-nav');
            $(this).addClass('active-nav');
        });
    });

    $(document).ajaxComplete(function () {
        clearTimeout(ajaxTimer);
        ajaxTimer = setTimeout(initializeRetalGlobalLayout, 100);
    });
})();

// Adding this function for custom adding of class for the inconsistent views which are made in grid layout
// $(document).ready(function () {
//     function applyDetailTableClass() {
//         $('[name="project_may_broker_lbl"]').each(function () {
//             $(this)
//                 .closest('.Grid-Layout')
//                 .addClass('detail-table');
//         });
//     }
//     applyDetailTableClass();
//     var observer = new MutationObserver(function () {
//         applyDetailTableClass();
//     });
//     observer.observe(document.body, {
//         childList: true,
//         subtree: true
//     });
// });
$(document).ready(function () {
    function applyDetailTableClass() {
        var nodes = document.querySelectorAll('[name="project_may_broker_lbl"]');
        for (var i = 0; i < nodes.length; i++) {
            var grid = nodes[i].closest('.Grid-Layout');
            if (grid && !grid.classList.contains('detail-table')) {
                grid.classList.add('detail-table');
            }
        }
    }
 
    applyDetailTableClass();
 
    if (window.MutationObserver) {
        var domTimer = null;
        new MutationObserver(function () {
            if (domTimer) return;
            domTimer = setTimeout(function () {
                domTimer = null;
                applyDetailTableClass();
            }, 150); // Batches multiple mutations into a single execution
        }).observe(document.body, {
            childList: true,
            subtree: true
        });
    }
});
