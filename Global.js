function initializeRetalGlobalLayout() {
    var $headerTarget = $('span[name="Header_style_dbl"]').closest('div.Grid-Layout.root-table');
    if ($headerTarget.length === 0) {
        $headerTarget = $('.form .row:first-child .root-table');
    }
    $headerTarget.addClass('retal-custom-header-layout');

    var $sidebarRow = $('.form .row:has(a[name="Home btn"])');
    var $buttons = $sidebarRow.find('a.SourceCode-Forms-Controls-Web-Button');

    if ($buttons.length) {
        var currentUrl = window.location.href.toLowerCase();
        var activeButtonName = "Home btn";

        if (currentUrl.indexOf("customer") !== -1 && currentUrl.indexOf("add") !== -1) {
            activeButtonName = "Add custm btn";
        } else if (currentUrl.indexOf("projects") !== -1) {
            activeButtonName = "Project btn";
        } else if (currentUrl.indexOf("configuration") !== -1) {
            activeButtonName = "Configuration btn";
        } else if (currentUrl.indexOf("worklist") !== -1) {
            activeButtonName = "Worklist btn";
        } else if (currentUrl.indexOf("mycustomerslead") !== -1) {
            activeButtonName = "My cust lead btn";
        }else if ((currentUrl.indexOf("my") !== -1 && currentUrl.indexOf("customer") !== -1) || 
                (currentUrl.indexOf("all") !== -1 && currentUrl.indexOf("customer") !== -1) ||
                (currentUrl.indexOf("customerdetailsrega") !== -1 ) ||
                (currentUrl.indexOf("brokercustomerdetails") !== -1 )) {
            activeButtonName = "My custm btn";
            
        }


        $buttons.removeClass('active-nav');
        $sidebarRow.find('a[name="' + activeButtonName + '"]').addClass('active-nav');
    }
} 


$(document).ready(function () {
    initializeRetalGlobalLayout();

    $(document).on('click', '.form .row:has(a[name="Home btn"]) a.SourceCode-Forms-Controls-Web-Button', function () {
        $('.form .row:has(a[name="Home btn"]) a.SourceCode-Forms-Controls-Web-Button').removeClass('active-nav');
        $(this).addClass('active-nav');
    });
});

$(document).ajaxComplete(function () {
    initializeRetalGlobalLayout();
});