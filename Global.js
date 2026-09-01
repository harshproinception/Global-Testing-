function initializeRetalGlobalLayout() {
    var $headerTarget = $('span[name="Header_style_dbl"]').closest('div.Grid-Layout.root-table');
    if ($headerTarget.length === 0) {
        $headerTarget = $('.form .row:first-child .root-table');
    }
    $headerTarget.addClass('retal-custom-header-layout');
 
    var $sidebarRow = $('.form .row:has(a[name="Home btn"])');
    var $buttons = $sidebarRow.find('a.SourceCode-Forms-Controls-Web-Button');
    if ($buttons.length && !$buttons.filter('.active-nav').length) {
        $sidebarRow.find('a[name="Home btn"]').addClass('active-nav');
    }
}
 
$(document).ready(function () {
    initializeRetalGlobalLayout();
    $(document).on('click', '.form .row:has(a[name="Home btn"]) a.SourceCode-Forms-Controls-Web-Button', function () {
        $('.form .row:has(a[name="Home btn"]) a.SourceCode-Forms-Controls-Web-Button').removeClass('active-nav');
        $(this).addClass('active-nav');
    });
});
 
$(document).ajaxComplete(function() {
    initializeRetalGlobalLayout();
});