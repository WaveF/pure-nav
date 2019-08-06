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
            this.$parent.isDropdown = false;
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
            Swal.fire({
                // imageUrl: 'https://unsplash.it/400/200',
                // imageWidth: 400,
                // imageHeight: 200,
                // imageAlt: 'Custom image',
                title: '外部链接',
                html: [
                    '<p>即将访问以下链接，是否继续？</p>',
                    '<a href="' + link + '">' + link + '</a>'
                ].join(''),
                showCancelButton: true,
                focusConfirm: false,
                confirmButtonText: '继续',
                cancelButtonText: '取消',
                reverseButtons: true,
                showCloseButton: true
            }).then(function(result){
                if (!result.value) return;
                window.open(link);
            });
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
            isMobile: false,
            isCollaps: false,
            isDropdown: false,
            isMenuExpand: !this.isMobile,

            api: 'https://www.jsonstore.io/8723202190b3fd6c738095e3ac1bd2a21925efe8d90be60b70af127812223003',

            // fakeMenu: 
            menu: [],
            products: []
        }
    },
    created() {
        var _this = this;

        // 侦听窗体尺寸变化
        window.resizeTimer = null;
        window.addEventListener("resize", this.onWinResize);
        this.onWinResize();

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

        this.loadData(function(res){
            var result = res.data.result;
            _this.menu = result.menu || MockData.menu;
            _this.products = result.products || MockData.products;
        });
    },
    methods: {

        // 切换菜单状态
        toggleMenu: function () {
            this.isCollaps  = !this.isCollaps;
            this.isDropdown = !this.isDropdown;
        },

        loadData: function (callback) {
            axios.get(this.api)
            .then(callback)
            .catch(function (err) {
                console.log(err);
            });
        },

        saveData: function (callback) {
            axios.put(this.api, {
                menu: this.menu,
                products: this.products
            })
            .then(callback)
            .catch(function (err) {
                console.log(err);
            });
        },

        // 响应窗体尺寸变化
        onWinResize: function (e) {
            // 模拟 lodash 的 debounce，费事又引多一个插件
            if (resizeTimer) { clearTimeout(resizeTimer) }

            resizeTimer = setTimeout(function () {
                this.isMobile = ($('.navbar').clientWidth < 100);
            }.bind(this), 400);
        },

        about: function () {
            Swal.fire({
                // imageUrl: './assets/images/logo_large.svg',
                // imageWidth: 180,
                title: '<strong>PURE</strong>NAV',
                html: [
                    '<div style="line-height:28px; text-align:left; padding:15px 0 0;">',
                    '    <div style="margin-bottom:10px;">',
                    '        PureNav灵感源来<a href="https://webstack.cc/cn/index.html">WebStack</a>，本想拿来为公司内部产品页改版，',
                    '        但因WAVEF太过菜鸡以致在修改WebStack时不断遇到问题，怒视众多JS瞬间崩溃，顿时萌生了重构的邪恶想法。',
                    '    </div>',

                    '    <div style="margin-bottom:10px;">',
                    '        初步设想：</br>沿用WebStack外观设计，VUEJS构建前台，以JSON初始化页面数据，并通过某些免费在线JSON存取服务充当数据库，用户可以直接在前台对数据进行增删查改。',
                    '    </div>',

                    '    <div>',
                    '        能少引一个库就少引一个库以免逻辑过于复杂，PURE（纯洁）取意于此，因为WAVEF是第一次写VUE所以只能从非编译方式开搞，感觉引入打包会更麻烦，应该也适合和我一样水平的菜鸡互相学习，欢迎来啄。',
                    '    </div>',
                    '</div>',
                ].join(''),
                confirmButtonText: '明白',
                footer: '<span style="color:#09f">注意：PURENAV目前处于开发当中，功能尚未成型且会有劲多BUG！</span>'
                /*customClass: {
                    title        : 'swal2-title-custom',
                    content      : 'swal2-content-custom',
                    actions      : 'swal2-actions-custom',
                    footer       : 'swal2-footer-custom',
                    confirmButton: 'swal2-confirm-button-custom',

                    // closeButton  : 'swal2-close-button-custom',
                    // cancelButton : 'swal2-cancel-button-custom',
                    // container    : 'swal2-container-custom',
                    // popup        : 'swal2-popup-custom',
                    // header       : 'swal2-header-custom',
                    // icon         : 'swal2-icon-custom',
                    // image        : 'swal2-image-custom',
                    // input        : 'swal2-input-custom',
                }*/
            });
        }

    }
});