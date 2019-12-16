const URL = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';
function makeGETRequest(URL) {
    return new Promise((resolve, reject) => {
        let xhr;
        if (window.XMLHttpRequest) {
            xhr = new window.XMLHttpRequest();
        } else {
            xhr = new window.ActiveXObject('Microsoft.XMLHTTP');
        }
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                const body = JSON.parse(xhr.responseText);
                resolve(body);
            } else if (xhr.readyState === 4 && xhr.status !== 200) {
                reject({error: xhr.status});
            }
        };
        xhr.open('GET', URL);
        xhr.send();
    })
};
fetch(`${URL}/catalogData.json`)
    .then(body => body.json())
    .then(res => console.log(res))
    .catch(err => console.error(err));

class GoodsItem {
    constructor(product_name = 'Без имени', price = '') {
        this.product_name = product_name;
        this.price = price;
    }
    render() {
        return `<div class="goods-item">
                    <h3 class="title goods-title">${this.product_name}</h3>
                    <p class="goods-price">${this.price} ₽</p>
                    <button class="goods-button">Добавить</button>
                </div>`;
    }
}

class GoodsList {
    constructor() {
        this.goods = [];
    }
    async fetchGoods()  {
        await makeGETRequest(`${URL}/catalogData.json`)
            .then((goods) => {
                this.goods = goods;
                list.render();
            });
    }
    totalPrice() {
        return this.goods.reduce((accum, item) => {
            if (item.price) accum += item.price;
            return accum;
        }, 0);
    }
    render() {
        let listHtml = '';
        this.goods.forEach(good => {
            const goodItem = new GoodsItem(good.product_name, good.price);
            listHtml += goodItem.render();
        });
        document.querySelector('.goods-list').innerHTML = listHtml;
    }
    setEventListeners(cartObj) {
        let btns = document.querySelectorAll('.goods-button');
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

/*class Cart extends GoodsList {
    constructor(props) {
        super(props);
    }
    clean() {}
    incGood() {}
    decGood() {}
}

class CartItem extends GoodsItem {
    constructor(props) {
        super(props);
    }
    delete() {}
}*/

const list = new GoodsList();
list.fetchGoods(() => {
    list.render();
});
