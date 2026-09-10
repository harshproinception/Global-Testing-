(function () {

    function getMainRuntimeForm() {
        var forms = document.querySelectorAll(".theme-entry .runtime-form");

        for (var i = 0; i < forms.length; i++) {
            if (!forms[i].closest(".popup")) {
                return forms[i];
            }
        }

        return document.querySelector(".theme-entry .runtime-form");
    }

    function markMainForm() {
        var form = getMainRuntimeForm();

        if (!form) {
            return null;
        }

        form.classList.add("main-customer-form");

        return form;
    }

    function getGlobalHeaderRow() {
        var marker = document.querySelector(
            '.theme-entry [name="Header_style_dbl"]'
        );

        if (!marker) {
            return null;
        }

        var table = marker.closest(
            ".Grid-Layout.root-table"
        );

        if (!table) {
            return null;
        }

        return table.closest(".row");
    }

    function getCustomerHeaderRow() {
        var header = document.querySelector(
            '.theme-entry .panel[name="Header"]'
        );

        if (!header) {
            return null;
        }

        return header.closest(".row");
    }

    function moveHeaders() {
        var form = getMainRuntimeForm();

        if (!form) {
            return false;
        }

        var tabs = form.querySelector(".form-tabs");

        if (!tabs) {
            return false;
        }

        var globalHeader = getGlobalHeaderRow();
        var customerHeader = getCustomerHeaderRow();

        if (!globalHeader || !customerHeader) {
            return false;
        }

        globalHeader.classList.add(
            "retal-global-header-row"
        );

        customerHeader.classList.add(
            "retal-customer-header-row"
        );

        if (globalHeader.parentNode !== form) {
            form.insertBefore(
                globalHeader,
                tabs
            );
        }

        if (customerHeader.parentNode !== form) {
            form.insertBefore(
                customerHeader,
                tabs
            );
        }

        if (globalHeader.nextElementSibling !== customerHeader) {
            form.insertBefore(
                globalHeader,
                customerHeader
            );
        }

        if (customerHeader.nextElementSibling !== tabs) {
            form.insertBefore(
                customerHeader,
                tabs
            );
        }

        return true;
    }

    function getDirectCells(table) {
        var cells = [];

        for (var i = 0; i < table.children.length; i++) {
            var child = table.children[i];

            if (
                child.classList &&
                child.classList.contains("editor-cell")
            ) {
                cells.push(child);
            }
        }

        return cells;
    }

    function classifyProgress() {
        var form = getMainRuntimeForm();

        if (!form) {
            return;
        }

        var controls = form.querySelectorAll(
            ".SourceCode-Forms-Controls-Web-ControlPack-ProgressControl"
        );

        for (var i = 0; i < controls.length; i++) {
            var control = controls[i];

            var panel = control.closest(".panel");

            if (!panel) {
                continue;
            }

            panel.classList.add("progress-view");

            var table = control.closest(
                ".Grid-Layout.root-table"
            );

            if (!table) {
                continue;
            }

            table.classList.add("progress-table");

            var cells = getDirectCells(table);

            if (cells.length >= 4) {

                cells[0].classList.add(
                    "progress-title-cell"
                );

                cells[1].classList.add(
                    "progress-description-cell"
                );

                var progressHost = control.closest(
                    ".editor-cell"
                );

                if (progressHost) {
                    progressHost.classList.add(
                        "progress-host"
                    );
                }

                cells[3].classList.add(
                    "progress-status-cell"
                );
            }
        }
    }

    function classifyDetailTables() {
        var form = getMainRuntimeForm();

        if (!form) {
            return;
        }

        var tables = form.querySelectorAll(
            ".SourceCode-Forms-Controls-Web-Table.Grid-Layout"
        );

        for (var i = 0; i < tables.length; i++) {

            var table = tables[i];

            if (
                table.querySelector(
                    ".SourceCode-Forms-Controls-Web-ControlPack-ProgressControl"
                )
            ) {
                continue;
            }

            if (
                table.classList.contains(
                    "progress-table"
                )
            ) {
                continue;
            }

            if (
                table.closest(".grid")
            ) {
                continue;
            }

            if (
                table.classList.contains(
                    "retal-custom-header-layout"
                )
            ) {
                continue;
            }

            var cells = getDirectCells(table);

            if (cells.length < 5) {
                continue;
            }

            var labels = table.querySelectorAll(
                ":scope > .editor-cell .SFC.SourceCode-Forms-Controls-Web-Label"
            );

            var dataLabels = table.querySelectorAll(
                ":scope > .editor-cell .SFC.SourceCode-Forms-Controls-Web-DataLabel"
            );

            if (
                labels.length >= 2 &&
                dataLabels.length >= 1
            ) {

                table.classList.add(
                    "detail-table"
                );

                var panel = table.closest(
                    ".panel"
                );

                if (
                    panel &&
                    !panel.classList.contains(
                        "progress-view"
                    )
                ) {
                    panel.classList.add(
                        "detail-view"
                    );
                }
            }
        }

        var rows = form.querySelectorAll(
            ".form > .row"
        );

        for (var r = 0; r < rows.length; r++) {

            var detailViews = rows[r].querySelectorAll(
                ":scope > .view > .detail-view"
            );

            if (detailViews.length >= 2) {

                rows[r].classList.add(
                    "detail-view-row"
                );

            } else if (
                detailViews.length === 1
            ) {

                var directViews = rows[r].querySelectorAll(
                    ":scope > .view"
                );

                if (directViews.length === 1) {

                    detailViews[0].classList.add(
                        "single-detail-view"
                    );
                }
            }
        }
    }

    function isPopupOpen() {

        var popups = document.querySelectorAll(
            ".popup.dialog"
        );

        for (var i = 0; i < popups.length; i++) {

            var popup = popups[i];

            if (
                popup.closest(
                    ".main-customer-form"
                )
            ) {
                continue;
            }

            var style = window.getComputedStyle(
                popup
            );

            var rect = popup.getBoundingClientRect();

            if (
                style.display !== "none" &&
                style.visibility !== "hidden" &&
                rect.width > 0 &&
                rect.height > 0
            ) {
                return true;
            }
        }

        var iframes =
            document.querySelectorAll(
                "iframe.runtime-popup"
            );

        for (var j = 0; j < iframes.length; j++) {

            var iframe = iframes[j];

            var parent = iframe.closest(
                ".popup"
            );

            if (!parent) {
                continue;
            }

            var iframeStyle =
                window.getComputedStyle(
                    parent
                );

            var iframeRect =
                parent.getBoundingClientRect();

            if (
                iframeStyle.display !== "none" &&
                iframeStyle.visibility !== "hidden" &&
                iframeRect.width > 0 &&
                iframeRect.height > 0
            ) {
                return true;
            }
        }

        return false;
    }

    function updatePopupState() {

        var form = getMainRuntimeForm();

        if (!form) {
            return;
        }

        form.classList.toggle(
            "cj-popup-open",
            isPopupOpen()
        );
    }

    function initialise() {
        markMainForm();
        moveHeaders();
        classifyProgress();
        classifyDetailTables();
        updatePopupState();
    }

    function start() {

        initialise();

        var attempts = 0;
        var maxAttempts = 100;

        var timer = setInterval(
            function () {

                attempts++;

                initialise();

                if (attempts >= maxAttempts) {
                    clearInterval(timer);
                }

            },
            200
        );

        if (window.MutationObserver) {

            var observer =
                new MutationObserver(
                    function () {
                        initialise();
                    }
                );

            observer.observe(
                document.body,
                {
                    childList: true,
                    subtree: true
                }
            );

            setTimeout(
                function () {
                    observer.disconnect();
                },
                30000
            );
        }
    }

    if (
        document.readyState === "complete" ||
        document.readyState === "interactive"
    ) {

        setTimeout(
            start,
            300
        );

    } else {

        document.addEventListener(
            "DOMContentLoaded",
            function () {

                setTimeout(
                    start,
                    300
                );

            }
        );
    }

})();
