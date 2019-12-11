
class GoodsItem {
    constructor(code = 0, title = 'Без имени', price = '', prodimg = "img/jacket.png") {
        this.code = code;
        this.title = title;
        this.price = price;
        this.prodimg = prodimg;
    }
    render() {
        return `<div class="goods-item">
                    <img src=${this.prodimg} class="goods-img">
                    <h3 class="title goods-title">${this.title}</h3>
                    <p>${this.price} ₽</p>
                    <button class="goods-btn" id=${this.code}>Add to Cart</button>
                </div>`;
    }
}
class GoodsList {
    constructor() {
        this.goods = [];
        this.sum = 0;
    }
    fetchGoods()  {
        this.goods = [
            { code: 1, title: 'Shirt', price: 150 },
            { code: 2, title: 'Socks', price: 50 },
            { code: 3, title: 'Jacket', price: 350 },
            { code: 4, title: 'Shoes', price: 250 },
        ];
    }
    render() {
        let listHtml = '';
        this.goods.forEach(good => {
            const goodItem = new GoodsItem(good.code, good.title, good.price);
            listHtml += goodItem.render();
        });
        document.querySelector('.goods-list').innerHTML = listHtml;
    }
    searchGood(code){
        let foundGood = {};
        this.goods.forEach(elem => {
            if (elem.code === code){
                foundGood = elem;
            }
        });
        return foundGood;
    }
    setEventListeners(cartObj){
        let btns = document.querySelectorAll('.goods-btn');
        btns.forEach(btn => {
            let btnId = +btn.id;
            let btnGood = this.searchGood(btnId);
            if (btnGood){
                btn.addEventListener('click', function(){
                    cartObj.add2Cart(btnGood);
                });
            }
        });
    }
}
class CartItem{
    constructor(code=0, title = 'Без имени', price = '', prodimg = "img/jacket.png", count = 0) {
        this.code = code;
        this.title = title;
        this.price = price;
        this.prodimg = prodimg;
        this.count = count;
    }
    render() {
        return `<tr><td><img src=${this.prodimg} class="cart-img"></td>
                    <td><span class="cart-title">${this.title}</span></td>
                    <td><span class="cart-price">${this.price} ₽</span></td>
                    <td><span class="cart-count" id="count${this.code}">${this.count}</span></td>
                    <td><button class="inc-good" id="inc${this.code}">+</button>
                        <button class="dec-good" id="dec${this.code}">-</button>
                    </td>
                 </tr>`;
    }
}

class Cart{
    constructor() {
        this.goods = [];
    }
    findGoodPos(code){
        let goodIdx = -1;
        this.goods.forEach((item, index) => {
            if (item.code == code) {
                goodIdx = index;
            }
        });
        return goodIdx;
    }
    /**
     * эту функцию будем вызывать при нажатии на кнопку "В корзину"
     * @param item
     */
    add2Cart(item) {
        let goodPos = this.findGoodPos(item.code);
        if ( goodPos >= 0){
            this.goods[goodPos].count++;
        } else {
            let cartItem = new CartItem(item.code, item.title, item.price);
            cartItem.count = 1;
            this.goods.push(cartItem);
        }
    }
    getSum(){
        let sum=0;
        this.goods.forEach(good => {
            sum += good.price * good.count;
        });
        return sum;
    }
    getCartHeader(){
        return `<tr><th class="cart-th">PreImage</th>
                    <th class="cart-th">Title</th>
                    <th class="cart-th">Price</th>
                    <th class="cart-th">Count</th>
                    <th class="cart-th">Add/remove</th>
                  </tr>`;
    }
    IncGood(btnId){
        let btncode = +btnId.replace("inc", "");
        let gpos= this.findGoodPos(btncode);
        this.goods[gpos].count++;
        document.getElementById(`count${btncode}`).innerText = this.goods[gpos].count;
        document.querySelector('.cart-sum').innerHTML = `ИТОГО: ${this.getSum()} ₽`;
    }
    setIncGoodEvent(){
        let incBtns = document.querySelectorAll('.inc-good');
        incBtns.forEach(btn => {
            btn.addEventListener('click', elem => this.IncGood(elem.target.id));
        });
    }
    searchCartRow(btnId){
        let decBtns = document.querySelectorAll('.dec-good');
        decBtns.forEach((btn, index) => {
            if (btn.id == btnId){
                return index;
            }
            else {
                return -1;
            }
        });
    }
    deleteCartRow(btn){
        /*let row = this.searchCartRow(btnId);
        if (row >= 0){
        }*/
        let row = btn.parentElement.parentElement;
        row.parentElement.removeChild(row);
    }
    DecGood(btn){
        let btncode = +btn.id.replace("dec", "");
        let gpos= this.findGoodPos(btncode);
        this.goods[gpos].count--;
        if (this.goods[gpos].count > 0) {
            document.getElementById(`count${btncode}`).innerText = this.goods[gpos].count;
        }
        else{
            this.goods.splice(gpos, 1);
            this.deleteCartRow(btn);
        }
        document.querySelector('.cart-sum').innerHTML = `Total: ${this.getSum()} ₽`;
    }
    setDecGoodEvent(){
        let decBtns = document.querySelectorAll('.dec-good');
        decBtns.forEach(btn => {
            btn.addEventListener('click', elem => this.DecGood(elem.target));
        });
    }
    render() {
        let listHtml = `<table class="cart-table">${this.getCartHeader()}`;
        this.goods.forEach(good => {
           // const cartItemI = new CartItem(good.title, good.price);
            listHtml += good.render();
        });
        listHtml += `</table>
                    <p class="cart-sum"> ИТОГО: ${this.getSum()}₽</p>`;
            document.querySelector('.cart-inner').insertAdjacentHTML('beforeEnd', listHtml);
        this.setIncGoodEvent();
        this.setDecGoodEvent();
    }
    /**
     *  Устанавливаем на кнопку "Корзина" событие - при нажатии на кнопку открываем корзину
     * @param cartObj
     */
     cartBtnSetEvent() {
        let cartBtn = document.querySelector('.cart-button');
        let cartTag = document.querySelector('.cart-bck');
        cartBtn.addEventListener('click', elem =>{
            this.render();
            cartTag.classList.remove('hidden');
        });
    }
    clearCartHTML() {
        //let cartTable = document.querySelector('.cart-table');
        //cartTable.innerHTML = this.getCartHeader();
        let cartHtml = document.querySelector('.cart-inner');
        cartHtml.innerHTML="";
    }
    /**
     * Устанавливаем на кнопку закрытия корзины событие - при нажатии на кнопку закрываем корзину
     * и подчищаем HTML-разметку страницы, чтобы при новом открытии корзины перерисовать ее заново
     * @param cartObj
     */
    cartCloseBtnSetEvent() {
        let cartCloseBtn = document.querySelector('.cart-close');
        let cartBck = document.querySelector('.cart-bck');
        cartCloseBtn.addEventListener('click', elem =>{
            cartBck.classList.add('hidden');
            this.clearCartHTML();
        });
    };
}
class ChatMessage{
    constructor(author, text, time) {
        this.author = author;
        this.text = text;
        this.time = time;
    }
    render(){
        let msgHTML='';
        if (this.author == 'user') {
            msgHTML = `<div class="msg-block user-block"><p class="msg-time">${this.time}</p><div class="msg-text msg-user"><div class="msg-user-before"></div>${this.text}</div></div>`;
        } else {
            msgHTML = `<div class="msg-block consultant-block"><div class="msg-text msg-consultant"><div class="msg-consultant-before"></div>${this.text}</div><p class="msg-time">${this.time}</p></div>`;
        }
        return msgHTML;
    }
}
class Chat{
    constructor(consultant) {
        this.messages = [];
        this.consultant = consultant;
    }
    init(){
        console.log(document.querySelector('.user-msg').value.type);
        document.querySelector(".consultant-name").innerHTML = this.consultant;
        let fstMsg = new ChatMessage('consultant', 'Здравствуйте! Я могу Вам чем-то помочь?', '');
        this.messages.push(fstMsg);
    }
    messagesHTML(){
        let messagesHTMLcode="";
        this.messages.forEach(msg =>{
            messagesHTMLcode += msg.render();
        });
        return messagesHTMLcode;
    }

    render(){
        this.setEventCloseChat();
        this.setEventInputMessage();
        let currenttime = new Date;
        this.messages[0].time = `${this.getTimeString()}`;
        document.querySelector('.chat-messages').innerHTML = this.messagesHTML();
        document.querySelector(".chat").classList.remove('hidden');
        document.querySelector(".chat").classList.add('animated', 'bounceInRight');
    }
    setEventOpenChat(){
        document.querySelector(".chat-open").addEventListener('click', elem => {
            this.render();
        });
    }
    setEventCloseChat(){
        document.querySelector('.chat-close').addEventListener('click', elem => {
            elem.target.parentElement.parentElement.classList.add('hidden');
        });
    }
    getTimeString(){
        let currentTime = new Date();
        let hours = `${currentTime.getHours()}`;
        if (hours.length < 2) {
            hours = '0' + hours;
        }
        let minutes = `${currentTime.getMinutes()}`;
        if (minutes.length < 2) {
            minutes = '0' + minutes;
        }
        return hours + ':' + minutes;
    }
    setEventInputMessage(){
        document.querySelector('.user-msg').addEventListener('keypress', event => {
            let key = event.which || event.keyCode;
            if (key == 13){
                event.preventDefault();
                let MsgObj = new ChatMessage('user', event.target.value, `${this.getTimeString()}`);
                this.messages.push(MsgObj);
                //document.querySelector('.chat-messages').innerHTML = this.messagesHTML();
                document.querySelector('.chat-messages').insertAdjacentHTML('beforeend', MsgObj.render());
                document.querySelector('.user-msg').value = "";
                document.querySelector('.chat-messages').scrollTop = document.querySelector('.chat-messages').scrollHeight;
            }
        });
    }
}
const list = new GoodsList();
list.fetchGoods();
list.render();

const prodCart = new Cart();
list.setEventListeners(prodCart);
prodCart.cartBtnSetEvent();
prodCart.cartCloseBtnSetEvent();

const chatObj = new Chat('Станислав');
chatObj.init();
chatObj.setEventOpenChat();
