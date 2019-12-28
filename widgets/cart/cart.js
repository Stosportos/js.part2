// Товар в корзине
class CartItem{
    constructor(id_product = '', product_name = 'Без имени', price = '', count = 0) {
        this.title = product_name;
        this.price = price;
        this.id_product = id_product;
        this.count = count;
    }
    render() {
        //возвращает строку таблицы
        return `<tr><td><span class="cart-title">${this.title}</span></td>
                    <td><span class="cart-price">${this.price} ₽</span></td>
                    <td><button class="inc-good" id="inc${this.id_product}">+</button>
                        <button class="dec-good" id="dec${this.id_product}">-</button>
                    </td>
                 </tr>`;
    }
}

// Список товаров в корзине
class Cart{
    constructor() {
        this.goods = [];
    }
    findGoodPos(id_product){
        // Ищем по артикулу
        let goodIdx = -1;
        this.goods.forEach((item, index) => {
            if (item.id_product == id_product) {
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
        let goodPos = this.findGoodPos(item.id_product);
        if ( goodPos >= 0){
            this.goods[goodPos].count++;
        } else {
            //Тут нужно создать новый объект класса CartItem, копируя свойства соответствующего объекта GoodsItem
            let cartItem = new CartItem(item.id_product, item.product_name, item.price);
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
        return `<tr><th class="cart-th">Продукт</th>
                    <th class="cart-th">Наименование</th>
                    <th class="cart-th">Цена</th>
                    <th class="cart-th">Количество</th>
                    <th class="cart-th"></th>
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
        document.querySelector('.cart-sum').innerHTML = `ИТОГО: ${this.getSum()} ₽`;
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
                    <p class="cart-sum"> ИТОГО: ${this.getSum()} ₽</p>`;
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


const prodCart = new Cart();
list.setEventListeners(prodCart);
prodCart.cartBtnSetEvent();
prodCart.cartCloseBtnSetEvent();