class QuestionData extends HTMLElement {
    constructor() {
        super();
        this.importDocument = document.currentScript.ownerDocument;
    }

    connectedCallback() {
        this.callServer();
    }

    attributeChangedCallback(attribute, oldValue, newValue, domain) {
        this.callServer();
    }

    callServer() {
        var url = this.getAttribute("url");
        var method = this.getAttribute("method");
        var params = this.getAttribute("params");

        if (url && method) {
            let xhr = new XMLHttpRequest();
            xhr.open(method, url, true);
            xhr.responseType = "json";
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        document.dispatchEvent(
                            new CustomEvent("response", {
                                detail: xhr.response
                            })
                        );
                    }
                }
            };
            if (params) {
                xhr.send(params);
            } else {
                xhr.send();
            }
        }
    }
}

window.customElements.define("question-data", QuestionData);
