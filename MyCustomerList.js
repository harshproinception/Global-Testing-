$(document).ready(function () {
    function formatCustomerListView() {
        var $listAnchor = $('span[name="MyCustomer_List_Style_dlb"]');
        if ($listAnchor.length === 0) return;
 
        var $viewContainer = $listAnchor.closest('.view');
 
        var $addBtn = $viewContainer.find('a[name="ToolBar Button Add a customer"]');
        if ($addBtn.length) {
            var $toolbar = $addBtn.closest('.grid-toolbars');
            if ($toolbar.length && $addBtn.parent()[0] !== $toolbar[0]) {
                $toolbar.append($addBtn);
            }
        }
 
        var $filterButtons = $viewContainer.find('a[name="Button All"], a[name="Button In Progress"], a[name="Button Need attention"], a[name="Button Completed"]');
        if ($filterButtons.length && !$filterButtons.filter('.active').length) {
            $viewContainer.find('a[name="Button All"]').addClass('active selected');
        }
 
        var unitColIndex = -1;
        var daysColIndex = -1;
 
        $viewContainer.find('.grid-header-table th, .grid thead th').each(function (idx) {
            var title = $(this).text().trim().toUpperCase();
            if (title.indexOf('UNIT') !== -1) {
                unitColIndex = idx;
            } else if (title.indexOf('DAYS LEFT') !== -1) {
                daysColIndex = idx;
            }
        });
 
        if (unitColIndex !== -1 || daysColIndex !== -1) {
            $viewContainer.find('.grid-content-table tbody tr').each(function () {
                var $cells = $(this).children('td');
 
                if (unitColIndex !== -1 && $cells.length > unitColIndex) {
                    var $unitCell = $cells.eq(unitColIndex);
                    if (!$unitCell.data('formatted')) {
                        var unitText = $unitCell.text().trim();
                        if (unitText !== '' && unitText !== '-' && unitText !== '—') {
                            $unitCell.html('<span class="unit-pill">' + unitText + '</span>');
                        }
                        $unitCell.data('formatted', true);
                    }
                }
 
                if (daysColIndex !== -1 && $cells.length > daysColIndex) {
                    var $daysCell = $cells.eq(daysColIndex);
                    if (!$daysCell.data('formatted')) {
                        var rawText = $daysCell.text().trim();
                        var lower = rawText.toLowerCase();
                        var numVal = parseInt(rawText, 10);
 
                        if (lower === 'completed') {
                            $daysCell.html('<span class="days-pill-completed">Completed</span>');
                        } else if (lower.indexOf('no longer') !== -1) {
                            $daysCell.html('<span class="days-muted">' + rawText + '</span>');
                        } else if (!isNaN(numVal) && numVal <= 7) {
                            $daysCell.html('<span class="days-urgent">' + rawText + '</span>');
                        }
                        $daysCell.data('formatted', true);
                    }
                }
            });
        }
    }
 
    formatCustomerListView();
 
    $(document).ajaxComplete(function () {
        formatCustomerListView();
    });
 
    $(document).on('click', '.view:has(span[name="MyCustomer_List_Style_dlb"]) a[name="Button All"], .view:has(span[name="MyCustomer_List_Style_dlb"]) a[name="Button In Progress"], .view:has(span[name="MyCustomer_List_Style_dlb"]) a[name="Button Need attention"], .view:has(span[name="MyCustomer_List_Style_dlb"]) a[name="Button Completed"]', function () {
        var $parentView = $(this).closest('.view');
        $parentView.find('a[name="Button All"], a[name="Button In Progress"], a[name="Button Need attention"], a[name="Button Completed"]').removeClass('active selected');
        $(this).addClass('active selected');
    });
});