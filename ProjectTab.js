$(document).ready(function () {
    function formatProjectGridColumns() {
        var $anchor = $('span[name="Projects_tab_List_dlb"]');
        if ($anchor.length === 0) return;
 
        var $view = $anchor.closest('.view');
        var unitColIdx = -1;
        var availColIdx = -1;
 
        $view.find('.grid-column-header-table td').each(function (index) {
            var text = $(this).text().trim().toLowerCase();
            if (text === 'unit') {
                unitColIdx = index + 1;
                $(this).addClass('cell-align-center');
            }
            if (text === 'availability') {
                availColIdx = index + 1;
                $(this).addClass('cell-align-center');
            }
        });
 
        if (unitColIdx !== -1) {
            $view.find('.grid-content-table tbody tr').each(function () {
                var $td = $(this).find('td:nth-child(' + unitColIdx + ')');
                $td.addClass('cell-align-center');
                var $wrapper = $td.find('.grid-content-cell-wrapper');
                if ($wrapper.length && !$wrapper.find('.unit-pill').length && $wrapper.text().trim() !== '') {
                    var t = $wrapper.text().trim();
                    $wrapper.html('<span class="unit-pill">' + t + '</span>');
                }
            });
        }
 
        if (availColIdx !== -1) {
            $view.find('.grid-content-table tbody tr').each(function () {
                var $td = $(this).find('td:nth-child(' + availColIdx + ')');
                $td.addClass('cell-align-center');
                var $wrapper = $td.find('.grid-content-cell-wrapper');
                if ($wrapper.length && !$wrapper.find('.status-pill').length && $wrapper.text().trim() !== '') {
                    var t = $wrapper.text().trim();
                    var l = t.toLowerCase();
                    var c = '';
                    if (l === 'available') c = 'status-available';
                    else if (l === 'reserved') c = 'status-reserved';
                    else if (l === 'sold') c = 'status-sold';
                    if (c !== '') {
                        $wrapper.html('<span class="status-pill ' + c + '">' + t + '</span>');
                    }
                }
            });
        }
    }
 
    formatProjectGridColumns();
 
    var observer = new MutationObserver(function () {
        formatProjectGridColumns();
    });
 
    var targetView = document.querySelector('.view:has(span[name="Projects_tab_List_dlb"])');
    if (targetView) {
        observer.observe(targetView, { childList: true, subtree: true });
    }
 
    $(document).ajaxComplete(function () {
        formatProjectGridColumns();
    });
});
