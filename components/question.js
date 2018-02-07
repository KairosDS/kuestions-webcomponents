const API_URL_GET = "http://127.0.0.1:4000/question";
const API_URL_POST = "http://127.0.0.1:4000/answer";

class QuestionBlock extends HTMLElement {
    constructor() {
        super();
        this.importDocument = document.currentScript.ownerDocument;
    }

    connectedCallback() {
        let shadowRoot = this.attachShadow({ mode: 'open' });
        const questionBlock = this.importDocument.querySelector('#js-question-block');
        const instance = questionBlock.content.cloneNode(true);

        this.getQuestions();
        shadowRoot.appendChild(instance);
        const button = shadowRoot.querySelector("button");
        button.addEventListener('click', () => {
            this.sendAnswer();
        });
    }

    getQuestions() {
        if (this.shadowRoot && this.shadowRoot.querySelector('header') && this.shadowRoot.querySelector('.radio_container')) {
            this.shadowRoot.querySelector('header').innerText = '';
            this.shadowRoot.querySelector('.radio_container').innerText = '';
        }

        let xhr = new XMLHttpRequest();
        xhr.open("GET", API_URL_GET, true);
        xhr.responseType = 'json';
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    this.setQuestion(xhr.response);
                    this.setQuestionaire(xhr.response);
                }
            }
        };
        xhr.send();
    }

    setQuestionaire(response) {
        const questionBlock = this.shadowRoot.querySelector('.question_block');
        if (this.shadowRoot) {
            questionBlock.setAttribute('data-id-questionaire', response.questionaireId);
            questionBlock.setAttribute('data-id-question', response.id);
        }
    }

    setQuestion(response) {
        if (this.shadowRoot) {
            this.shadowRoot.querySelector('h2').innerHTML = response.questionaireName;

            if (response.question) {
                const title = document.createElement('h3');
                title.innerHTML = response.question;
                this.shadowRoot.querySelector('header').appendChild(title);
            }

            if (response.image) {
                const image = document.createElement('img');
                image.setAttribute('src', response.image);
                this.shadowRoot.querySelector('header').appendChild(image);
            }

            const radios = response.answers;
            for (let i in radios) {
                const label = document.createElement('label');
                const oneRadio = document.createElement('input');

                label.appendChild(oneRadio);
                oneRadio.setAttribute('type', 'radio');
                oneRadio.setAttribute('value', radios[i].id);
                oneRadio.setAttribute('name', 'answer');

                if (radios[i].text) {
                    label.innerHTML += radios[i].text;
                }

                if (radios[i].image) {
                    const image = document.createElement('img');
                    image.setAttribute('src', radios[i].image);
                    label.appendChild(image);
                }

                this.shadowRoot.querySelector('.radio_container').appendChild(label);
            }
        }
    }

    sendAnswer() {
        const elemetChecked = this.shadowRoot.querySelector(
            'input[name="answer"]:checked'
        );

        if (elemetChecked) {
            if (this.shadowRoot.querySelector('.radio_container p')) {
                this.shadowRoot.querySelector('.radio_container p').remove();
            }

            const idAnswer = elemetChecked.value;
            const idQuestionaire = this.shadowRoot.querySelector('.question_block').getAttribute("data-id-questionaire");
            const idQuestion = this.shadowRoot.querySelector('.question_block').getAttribute("data-id-question");
            const body = {
                idAnswer: idAnswer,
                idQuestionaire: idQuestionaire,
                idQuestion: idQuestion
            };

            const xhr = new XMLHttpRequest();
            xhr.open("POST", API_URL_POST, true);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.onreadystatechange = () => {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    if (xhr.status === 200) {
                        this.getQuestions();
                    }
                }
            };
            xhr.send(JSON.stringify(body));
        } else {
            const error = document.createElement('p');
            error.innerHTML = 'You need check one option';
            this.shadowRoot.querySelector('.radio_container').appendChild(error);
        }
    }
}

window.customElements.define('question-block', QuestionBlock);
