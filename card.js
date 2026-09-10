$(document).ready(function () {
    function formatDashboardCards() {
        var $cardsAnchor = $('span[name="card_style_dlb"]');
        if ($cardsAnchor.length === 0) return;

        var $viewContainer = $cardsAnchor.closest('.view');

        var bannerCell = $viewContainer.find('[name="Cell notification"]');
        if (bannerCell.length && !bannerCell.hasClass('custom-banner-container')) {
            bannerCell.addClass('custom-banner-container');
            var welcomeLbl = $viewContainer.find('[name="Label_welcome"]');
            var nameLbl = $viewContainer.find('[name="Notification_name dlb"]');
            var companyLbl = $viewContainer.find('[name="Nortification_Company_Name_dlb"]');
            var descLbl = $viewContainer.find('[name="NotificationDesc_label"]');
            var btn = $viewContainer.find('[name="addcustomer_Btn"]');

            bannerCell.contents().filter(function() { return this.nodeType === 3; }).remove();
            bannerCell.find('span:not([id])').remove();

            var iconHtml = '<div class="banner-icon-wrapper"><svg viewBox="0 0 24 24" width="24" height="24" stroke="white" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 12 11 14 15 10"></polyline></svg></div>';
            var textWrapper = $('<div class="banner-text-wrapper"></div>');
            var titleWrapper = $('<div class="banner-title"></div>').append(welcomeLbl).append("&nbsp;").append(nameLbl).append(companyLbl);
            textWrapper.append(titleWrapper).append(descLbl);
            var leftGroup = $('<div class="banner-left-group"></div>').append(iconHtml).append(textWrapper);

            if (btn.find('svg').length === 0) {
                btn.prepend('<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" style="margin-right:6px; vertical-align:middle;"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>');
            }
            btn.addClass('custom-btn');
            
            if (bannerCell.find('.banner-left-group').length === 0) {
                bannerCell.empty().append(leftGroup).append(btn);
            }
        }

        var cardsTable = $viewContainer.find('[name="Table cards"]');
        if (cardsTable.length && !cardsTable.hasClass('custom-cards-table')) {
            cardsTable.addClass('custom-cards-table');

            function formatCard(cellName, iconSvg, iconBgClass) {
                var cell = $viewContainer.find('[name="' + cellName + '"]');
                if (cell.length) {
                    var num = cell.find('.SourceCode-Forms-Controls-Web-DataLabel, span[name*="_dlb"]');
                    var lbl = cell.find('.SourceCode-Forms-Controls-Web-Label, span[name*="_label"]');
                    
                    num.addClass('card-number');
                    lbl.addClass('card-label');

                    if (!cell.hasClass('custom-card')) {
                        cell.addClass('custom-card');
                        var iconHtml = '<div class="card-icon-wrapper ' + iconBgClass + '">' + iconSvg + '</div>';
                        cell.prepend(iconHtml);
                    }
                }
            }

            var card1Svg = '<svg viewBox="0 0 24 24" width="20" height="20" stroke="#7A7A7A" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>';
            var card2Svg = '<svg viewBox="0 0 24 24" width="20" height="20" stroke="#B87B41" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>';
            var card3Svg = '<svg viewBox="0 0 24 24" width="20" height="20" stroke="#50935A" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';

            formatCard('Cell Cell9', card1Svg, 'bg-gray');
            formatCard('Cell Cell14', card2Svg, 'bg-orange');
            formatCard('Cell Cell19', card3Svg, 'bg-green');
        }
    }

    formatDashboardCards();

    $(document).ajaxComplete(function () {
        formatDashboardCards();
    });
});