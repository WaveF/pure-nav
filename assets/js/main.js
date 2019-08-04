window.$ = document.querySelector.bind(document),
    window.$$ = document.querySelectorAll.bind(document);

// 侧栏组件
Vue.component('side-menu', {
    props: ['item'],
    template: [
        '<li v-on:click="gotoAnchor(item.catagory)">',
        '    <i :class=" item.icon "></i>',
        '    <span>{{ item.title }}</span>',
        '</li>'
    ].join(''),
    methods: {
        // 滑动到锚点
        gotoAnchor: function (id) {
            window.scrollTo({ "behavior": "smooth", "top": $('#catagory_' + id).offsetTop - 120 })
            if (!this.$parent.isMobile) return;
            this.$parent.collapsMenu();
        }
    }
});

// 分类卡片组
Vue.component('card-box', {
    props: ['menu'],
    template: [
        '<section v-bind:id="\'catagory_\' + menu.catagory" class="catagory">',
        '    <h1 class="catagory-title">{{ menu.title }}</h1>',
        '    <ul class="card-list">',
        '        <slot></slot>',
        '    </ul>',
        '</section>'
    ].join(''),
});

// 卡片列表
Vue.component('card', {
    props: ['product'],
    template: [
        '<li>',
        '    <div class="card-item">',
        '        <div class="card-editor"></div>',
        '        <div class="card-content" v-bind:title="product.title" v-on:click="openLink(product.link)">',
        '            <div class="icon" :style="bgImage(product.logo)"></div>',
        '            <div class="info">',
        '                <h2>{{ product.title }}</h2>',
        '                <p>{{ product.descript }}</p>',
        '            </div>',
        '        </div>',
        '    </div>',
        '</li>'
    ].join(''),
    methods: {
        openLink: function (link) {
            window.open(link);
        },
        bgImage: function (img) {
            var bgUrl = 'url("' + img + '")'
            return 'background-image:' + bgUrl;
        }
    }
});

// Vue非编译模式
var app = new Vue({
    el: '#app',
    data() {
        return {
            isMobile: $('.navbar').clientWidth < 100,
            isMenuExpand: !this.isMobile,

            // fakeMenu: 
            menu: [],
            products: []
        }
    },
    beforeCreate() {
        this.menu = '';
    },
    created() {
        // 侦听窗体尺寸变化
        window.resizeTimer = null;
        this.onWinResize();
        window.addEventListener("resize", this.onWinResize);

        // 根据初始状态重置菜单
        // this.isMenuExpand ? this.collapsMenu() : this.expandMenu();

        var MockData = Mock.mock({
            "menu|5": [{
                "catagory|+1": 0,
                "icon|+1": ['remixicon-star-line', 'remixicon-play-line', 'remixicon-side-bar-line', 'remixicon-map-2-line', 'remixicon-mail-line'],
                "title|+1": ['默认分类', '原型演示', '平台产品', '实验作品', '设计概念'],
                "tag": null,
                "parent": null
            }],
            "products|15": [{
                "id|+1": 0,
                "catagory|0-4": 0,
                "logo": "@dataImage('44x44', 'PN')",
                "title": "@ctitle(2,5)",
                "descript": "@ctitle(6,10)",
                "link": "#"
            }]
        });

        this.menu = MockData.menu;
        this.products = MockData.products;
    },
    methods: {

        // 切换菜单状态
        // FIXME: 测试代码很不稳定，要改为切换css类来展开折叠，看看怎么把界面逻辑抽离数据
        toggleMenu: function () {
            this.isMenuExpand ? this.collapsMenu() : this.expandMenu();
            this.isMenuExpand = !this.isMenuExpand;
        },

        // 折叠菜单
        collapsMenu: function () {
            console.log('折叠');
            if (this.isMobile) {
                $('.sidebar').style.height = '80px';
            } else {
                $('.sidebar').style.width = '80px';
                $('.page-body').style.marginLeft = '80px';
                $('.menu').style.paddingLeft = '30px';
                $('.logo img').setAttribute('src', './assets/images/logo_small.svg');
            }
        },

        // 展开菜单
        expandMenu: function () {
            console.log('展开');
            if (this.isMobile) {
                // 需要有具体数值，用auto会没有动画所以不能用class切换
                $('.sidebar').style.height = $('.menu').clientHeight + 'px';
            } else {
                $('.sidebar').style.width = '280px';
                $('.page-body').style.marginLeft = '280px';
                $('.menu').style.paddingLeft = '60px';
                $('.logo img').setAttribute('src', './assets/images/logo_large.svg');
            }
        },

        eachLoop: function (arr, func) {
            for (var i in arr) {
                func(i, arr[i]);
            }
        },

        // 响应窗体尺寸变化
        onWinResize: function (e) {
            // 模拟lodash的debounce，费事又引多一个插件
            if (resizeTimer) { clearTimeout(resizeTimer) }

            resizeTimer = setTimeout(function () {
                this.isMobile = ($('.navbar').clientWidth < 100);

                // 重置侧栏高度
                if (this.isMobile) {
                    $('.sidebar').style.height = '80px';
                    this.isMenuExpand = false;
                } else {
                    $('.sidebar').style.height = '100%';
                    this.isMenuExpand = true;
                }
            }.bind(this), 400);

        },

        about: function () {
            Swal.fire({
                imageUrl: './assets/images/logo_large.svg',
                imageWidth: 180,
                html: [
                    '<div style="line-height:28px; text-align:left; padding:15px 0;">',
                    '    <div style="margin-bottom:10px;">',
                    '        PureNav灵感来源于<a href="https://webstack.cc/cn/index.html">WebStack</a>，目标也是制作纯前端的导航页，',
                    '        由于我太过菜鸡以致于在修改WebStack的过程中遇到很多不认识的库和衍生的问题，看着那上千行JS瞬间肾虚，于是萌生了重构的邪恶想法。',
                    '    </div>',

                    '    <div style="margin-bottom:10px;">',
                    '        初步设想：</br>沿用WebStack外观设计，VUEJS构建前台，以JSON初始化页面数据，并通过JSONBIN.IO提供的在线存取服务充当数据库，用户可以直接在前台对数据进行增删查改。',
                    '    </div>',

                    '    <div style="margin-bottom:10px;">',
                    '        能少引一个库就少引一个库以免逻辑过于复杂，PURE（纯洁）取意于此，因为WAVEF是第一次写VUE所以只能从非编译方式开搞，感觉引入打包会更麻烦，应该也适合和我一样水平的菜鸡互相学习，欢迎来啄。',
                    '    </div>',
                    '</div>',
                ].join(''),
                confirmButtonText: '了解',
                footer: '<span style="color:#f30">注：PURENAV目前处于开发当中，功能尚未成型且会有劲多BUG！</span>'
            });
        }

    }
});