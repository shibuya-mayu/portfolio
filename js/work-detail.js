// Work詳細ページ（キャンプ場・楽たび・深川・青森ねぶた・バグパ）共通：画像のスライダー（Swiper）
const swiper = new Swiper('.swiper', {
    loop: true, //ループ表示
    pagination: {
        el: '.swiper-pagination', //ページネーションを表示する要素
        clickable: true //ドットをクリックできるように
    },
    navigation: {
        nextEl: '.swiper-button-next', //次へボタンを表示する要素
        prevEl: '.swiper-button-prev', //前へボタンを表示する要素
    },
    autoplay: {
        delay: 3000 //自動で次の画像に切り替わるまでの時間（3秒）
    },
    breakpoints: {
        // 画面の幅が768px以上のとき
        768: {
            slidesPerView: 1,
            spaceBetween: 20
        },
    }
});
