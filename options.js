function on_err(errmsg) {
    alert(errmsg);
    console.error(errmsg);
    document.getElementById("result").innerHTML = errmsg;
}

function check_data(data) {
    for (const [key, value] of Object.entries(data)) {
        if (!("display_name" in value)) {
            value["display_name"] = key;
        }
        if (!("use_regex" in value)) {
            value["use_regex"] = false;
        }
        if (!("from" in value && "to" in value && Object.keys(value.to) != 0)) {
            on_err(`Entry ${key} is not correct.`);
            return null;
        }
    }
    return data;
}

function load() {
    let textarea = document.getElementById("json");
    load_config_object((data) => {
        textarea.value = JSON.stringify(data, null, 4);
    });
}

function save() {
    let textarea = document.getElementById("json");
    try {
        let obj = JSON.parse(textarea.value);
        obj = check_data(obj);
        if (obj) {
            save_config_object(obj);
            load();
        }
    } catch (e) {
        on_err(`Error: ${e}`);
    }
}

function reset() {
    reset_config_object_to_default();
    load();
}

document.addEventListener("DOMContentLoaded", load);
document.getElementById("submit").addEventListener("click", save);
document.getElementById("reset").addEventListener("click", reset);

var textareas = document.getElementsByTagName("textarea");
var count = textareas.length;
for (var i = 0; i < count; i++) {
    textareas[i].onkeydown = function (e) {
        if (e.key == "Tab") {
            e.preventDefault();
            var s = this.selectionStart;
            this.value =
                this.value.substring(0, this.selectionStart) +
                "    " +
                this.value.substring(this.selectionEnd);
            this.selectionEnd = s + 4;
        }
    };
}
