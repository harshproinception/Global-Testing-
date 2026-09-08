(function () {
    function applyStatus($thisLabel) {
        if (!$thisLabel || !$thisLabel.length) {
            return;
        }

        var rawText = $thisLabel.text().trim();
        var currentText = rawText.toLowerCase();
        var appliedStatus = $thisLabel.attr("data-applied-status");

        if (currentText === "" || currentText === appliedStatus) {
            return;
        }

        $thisLabel.attr("data-applied-status", currentText);

        $thisLabel.removeClass(
            "status-available status-reserved status-sold status-completed"
        );

        if (currentText === "available") {
            $thisLabel.addClass("status-available");
        } else if (currentText === "reserved") {
            $thisLabel.addClass("status-reserved");
        } else if (currentText === "sold") {
            $thisLabel.addClass("status-sold");
        } else if (currentText === "completed") {
            $thisLabel.addClass("status-completed");
        }
    }

    function applyAllStatuses() {
        $(".theme-entry .SourceCode-Forms-Controls-Web-ListView span, .theme-entry .SourceCode-Forms-Controls-Web-ListView .SFC").each(function () {
            var $thisLabel = $(this);
            var text = $thisLabel.text().trim().toLowerCase();

            if (
                text === "available" ||
                text === "reserved" ||
                text === "sold" ||
                text === "completed"
            ) {
                applyStatus($thisLabel);
            }
        });
    }

    $(document).ready(function () {
        applyAllStatuses();

        setInterval(function () {
            applyAllStatuses();
        }, 500);

        var observer = new MutationObserver(function () {
            applyAllStatuses();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true
        });
    });
})();
