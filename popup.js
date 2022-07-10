function UpdateTabs() {
    var textarea = document.getElementById("urls");
    textarea.value = "";
    var count = 0;
    chrome.windows.getCurrent(function (win) {
        if (!isFirefox) {
            chrome.tabs.getAllInWindow(win.id, function (tabs) {
                tabs.forEach((t) => {
                    textarea.value += t.url + "\n";
                    count++;
                });
                document.getElementById("urls_count").innerText =
                    count.toString();
            });
        } else {
            browser.tabs
                .query({
                    windowId: win.id,
                })
                .then((tabs) => {
                    tabs.forEach((t) => {
                        textarea.value += t.url + "\n";
                        count++;
                    });
                    document.getElementById("urls_count").innerText =
                        count.toString();
                });
        }
    });
}

function Copy() {
    var copyFrom = document.getElementById("urls");
    copyFrom.focus();
    document.execCommand("SelectAll");
    document.execCommand("Copy");
}

function Replace() {
    var textarea = document.getElementById("urls");
    textarea.value = "";
    var from = document.getElementById("replace_from").value;
    var to = document.getElementById("replace_to").value;
    var is_regex = document.getElementById("is_regex").checked;
    chrome.windows.getCurrent(function (win) {
        let func = (tabs) => {
            tabs.forEach((t) => {
                var original_url = t.url;

                var new_url = "";
                if (is_regex == false) {
                    new_url = original_url.replace(from, to);
                } else {
                    var regex = new RegExp(from);
                    new_url = original_url.replace(regex, to);
                }
                textarea.value += new_url + "\n";
                if (new_url != original_url) {
                    console.log("Update: " + new_url);
                    if (isFirefox) {
                        browser.tabs.update(t.id, { url: new_url });
                    } else {
                        chrome.tabs.update(t.id, { url: new_url });
                    }
                }
            });
        };

        if (isFirefox) {
            browser.tabs.query({ windowId: win.id }).then(func);
        } else {
            chrome.tabs.getAllInWindow(win.id, func);
        }
    });
}

function fill_rep() {
    var from = document.getElementById("replace_from");
    var to = document.getElementById("replace_to");
    var use_regex = document.getElementById("is_regex");
    var select = document.getElementById("fill_list");
    let fill = (platform) => {
        load_config_object((data) => {
            let d = data[select.value];
            if (d) {
                from.innerText = d.from;
                to.innerText = d.to[platform];
                use_regex.checked = d.use_regex;
            }
        });
    };
    if (isFirefox) {
        browser.runtime.getPlatformInfo().then((info) => {
            fill(info.os);
        });
    } else {
        chrome.runtime.getPlatformInfo((info) => {
            fill(info.os);
        });
    }
}

document.getElementById("btn").addEventListener("click", Copy);
document.getElementById("rep_btn").addEventListener("click", Replace);
document.getElementById("fill_btn").addEventListener("click", fill_rep);
document.getElementById("set_btn").addEventListener("click", () => {
    if (isFirefox) {
        browser.runtime.openOptionsPage();
    } else {
        chrome.runtime.openOptionsPage();
    }
});
document.addEventListener("DOMContentLoaded", UpdateTabs);

load_config_object((data) => {
    for (const [key, value] of Object.entries(data)) {
        let opt = document.createElement("option");
        opt.value = key;
        opt.innerText = value["display_name"];
        document.getElementById("fill_list").appendChild(opt);
    }
});
