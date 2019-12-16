class User {
    constructor(name = 'Пользователь', position = 'пользователь') {
        this.name = name;
        this.position = position;
    }
}

class Message {
    constructor(text = 'Здраствуйте! Я могу вам чем-то помочь?') {
        this.text = text;
    }
    render() {
        return `<div class="chat-widget-message">
                    ${this.text}
                </div>`;
    }
}

class Chat {
    constructor(user = new User(), visibility = false) {
        this.chat = null;
        this.visible = visibility;
        this.messageContainer = null;
        this.messages = [];
        this.user = user;
        this.render();
    }
    addMessage(message) {
        this.messages.push(this.messages);
        this.messageContainer.innerHTML += message.render();
    }
    initEvents() {
        const header = this.chat.querySelector('.chat-widget__header');
        const closeButton = this.chat.querySelector('.chat-widget__close');
        // console.log(header);
        header.addEventListener('click', () => {
            this.showChat();
        });
        closeButton.addEventListener('click', () => {
            this.hideChat();
        });
    }
    showChat() {
        this.chat.classList.remove('chat-widget_closed');
    }
    hideChat() {
        this.chat.classList.add('chat-widget_closed');
    }
    render() {
        this.chat = document.createElement('div');
        this.chat.classList.add('chat-widget');
        if (!this.visible) this.chat.classList.add('chat-widget_closed');
        this.chat.innerHTML = `
        <button class="chat-widget__close">
            <img src="img/icons/close.svg" alt="">
        </button>
        <div class="chat-widget__header">
            <div class="chat-widget__avatar">
                <img src="img/images/no-avatar.png" alt="">
            </div>
            <div class="chat-widget__user">
                <div class="chat-widget__user-name">${this.user.name}</div>
                <div class="chat-widget__user-position">${this.user.position}</div>
            </div>
            <div class="chat-widget__welcome-message">
                Чат
            </div>
        </div>
        <div class="chat-widget__messages"></div>
         <div class="chat-widget__controls">
                <textarea name="chat-input" id="chat__input" rows="4"></textarea>
                <div class="chat-widget__controls-area">
                    <button class="chat-widget__control">
                        <img src="img/icons/smile.svg" alt="smiles">
                    </button>
                    <button class="chat-widget__control">
                        <img src="img/icons/attach.svg" alt="attach">
                    </button>
                </div>
            </div>`;
        this.messageContainer = this.chat.querySelector('.chat-widget__messages');
        this.initEvents();
        document.body.appendChild(this.chat);
    }
}


const consultant = new User('Тэглайн', 'консультант');
const chat = new Chat(consultant);
const message = new Message();
chat.addMessage(message);
