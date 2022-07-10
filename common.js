const isFirefox = !chrome.app;

const default_configs = {

};

function get_browser(on) {
    let b;
    if (isFirefox) b = browser;
    else b = chrome;
    if (b) on(b);
    else console.error("Browser object missing.");
}

function save_config_object(data) {
    if (isFirefox) browser.storage.local.set({ config: data });
    else chrome.storage.local.set({ config: data });
}

function load_config_object(on_data) {
    let ok = (result) => {
        if (!("config" in result)) {
            console.info("ShiroTab empty config. Init with default.");
            save_config_object(default_configs);
            load_config_object(on_data);
        } else {
            on_data(result.config);
        }
    };
    let err = (error) => {
        console.error(`Error: ${error}`);
    };

    if (isFirefox) {
        browser.storage.local.get("config").then(ok, err);
    } else {
        chrome.storage.local.get(ok);
    }
}

function reset_config_object_to_default() {
    save_config_object(default_configs);
}
