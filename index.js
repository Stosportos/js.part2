'use strict';

const API_URL = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';
const cart = [];

Vue.component('search', {
    props: {
        searchLine: {
            type: String,
            required: false,
            default: '',
        }
    },
    template: `
      <form class="search-form" @submit.prevent>
        <input type="text" class="search-input" :value="searchLine"
          @input="updateSearchLine"/>
      </form>
  `,
    methods: {
        updateSearchLine(val) {
            const value = val.target.value;
            this.$emit('update:searchLine', value);
        }
    }
});

Vue.component('goodsItem', {
    props: ['good'],
    template: `
    <div class="goods-item">
         <h3 class="title goods-title">{{ good.product_name }}</h3>
         <p class="goods-price">{{ good.price }} ₽</p>
         <button class="goods-button" @click="addToCart">В корзину</button>
    </div>`,
    methods: {
        addToCart() {
            cart.push(this.good);
        },
    },
});

Vue.component('goodsList', {
    props: ['goods'],
    template: `
        <div class="goods-list" v-if="!isGoodsEmpty">
            <goods-item v-for="good in goods" :good="good" :key="good.id_product"></goods-item>
        </div>
        <div class="goods-not-found" v-else><h2>Нет данных</h2></div>`,
    computed: {
        isGoodsEmpty(){
            return this.goods.length === 0;
        },
    },
});

Vue.component('cart', {
    data: () => ({
        cart,
        isVisibleCart: false,
    }),
    methods: {
        toggleVisibility() {
            this.isVisibleCart = !this.isVisibleCart;
        }
    },
    template: `
    <div class="cart-container" v-if="isVisibleCart">
      <a href="#" @click="hideCart"><div class="cart-close"><img src="img/icons/close.svg" alt=""></div></a>
      <ul>
        <li v-for="good in cart">
           {{good.product_name}}
        </li>
      </ul>
    </div>
  `
});

/*Vue.component('cart-container', {
    data: () => ({
        cart,
        isVisibleCart: false,
    }),
    template: `
            <div class="cart-container" v-if="isVisibleCart">
                <a href="#" @click="hideCart"><div class="cart-close">&#10052;</div></a>
                <div class="cart-inner">
                    <div class="cart-good">
                        <div class="cart-name">Наименование</div>
                        <div class="cart-price">Цена</div>
                        <div class="cart-count">Количество</div>
                        <div></div>
                    </div>
                    <div class="cart-good" v-for="cartgood in cartGoods" :key="good.id_product">
                        <div class="cart-name">{{ good.product_name }}</div>
                        <div class="cart-price">{{ good.price }} ₽</div>
                        <div class="cart-count">{{ good.count }}</div>
                        <button class="inc-good" @click="incCartGood(good.id_product)">+</button>
                        <button class="dec-good" @click="decCartGood(good.id_product)">-</button>
                    </div>
                    <div class="cart-sum">ИТОГО: {{cartSumm}} ₽</div>
                </div>
            </div>`,
    methods: {
        toggleCart() {
            this.isVisibleCart = !this.isVisibleCart;
        },
    },
    computed: {
        cartSum() {
            let cSum = 0;
            this.cartGoods.forEach(elem => cSum += elem.price * elem.count);
            return cSum;
        },
    },
});*/

const app = new Vue ({
    el: '#app',
    data: {
        goods: [],
        searchLine: '',
        isVisibleCart: false,
    },
    methods: {
        makeGETRequest(URL) {
            return new Promise((resolve, reject) => {
                let xhr;
                if (window.XMLHttpRequest) {
                    xhr = new window.XMLHttpRequest();
                } else {
                    xhr = new window.ActiveXObject('Microsoft.XMLHTTP');
                }
                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4) {
                        if (xhr.status === 200) {
                            const body = JSON.parse(xhr.responseText);
                            resolve(body)
                        } else {
                            reject(xhr.responseText);
                        }
                    }
                };
                xhr.onerror = function (err) {
                    reject(err);
                };
                xhr.open('GET', URL);
                xhr.send();
            })
        },
        toggleCart() {
            this.$refs.cart.toggleVisibility();
        },
    },
    computed: {
        filteredGoods() {
            const searchValue = this.searchLine.replace(/[\*]/gi, '');
            const regExp = new RegExp(searchValue, 'i');
            return this.goods.filter((good) => regExp.test(good.product_name));
        }
    },
    async mounted() {
        try {
            this.goods = await this.makeGETRequest(`${API_URL}/catalogData.json`);
        } catch (e) {
            console.error(e);
        }
    },
});
