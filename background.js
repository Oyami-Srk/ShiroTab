const isFirefox = !chrome.app;

if (isFirefox) {
    // badge only enable for firefox

    let updater = (winId) => {
        browser.windows.getAll({ populate: true }, function (windows) {
            windows.forEach((win) => {
                let count = win.tabs.length.toString();
                browser.browserAction.setBadgeText({
                    windowId: win.id,
                    text: count,
                });
            });
        });
    };

    let setter = (winId, step) => {
        browser.browserAction.getBadgeText({ windowId: winId }).then((s) => {
            let count = parseInt(s);
            count += step;
            browser.browserAction.setBadgeText({
                windowId: winId,
                text: count.toString(),
            });
        });
    };

    function on_created(tab) {
        updater();
    }

    function on_attached(tabId, attachInfo) {
        updater();
    }

    function on_removed(tabId, removeInfo) {
        if (!removeInfo.isWindowClosing) {
            setter(removeInfo.windowId, -1);
        }
    }

    function on_detached(tabId, detachInfo) {
        updater();
    }

    browser.runtime.onInstalled.addListener(updater);
    browser.tabs.onCreated.addListener(on_created);
    browser.tabs.onAttached.addListener(on_attached);
    browser.tabs.onRemoved.addListener(on_removed);
    browser.tabs.onDetached.addListener(on_detached);
}
