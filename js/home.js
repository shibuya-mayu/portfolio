// Home：初回のローディング
$(function () {
    if (sessionStorage.getItem('access')) {
        // 2回目以降のアクセス：すぐに隠す
        $('.loading').addClass('is-active');
        return;
    }

    // 初回のアクセス
    sessionStorage.setItem('access', 'true');
    $('.loading-animation').addClass('is-active');   // ローディングのアニメーションを表示

    // お花の場面（0.2秒×12枚のうち7枚目＝1.2秒後）から画面いっぱいにする
    var img = $('.loading-animation img')[0];
    function flower() {
        setTimeout(function () {
            $('.loading-animation').addClass('is-flower');
        }, 1200);
    }
    if (img.complete) {
        flower();
    } else {
        img.addEventListener('load', flower);   // 画像が読み込まれて動き始めてから数える
    }
    setTimeout(function () {
        $('.loading').addClass('is-active');
        $('.loading-animation').removeClass('is-active');
    }, 3000);                                        // ローディングを表示する時間
});

// Home：スクロールしたら .elem を表示
$(window).on('scroll', function () {
    var scrollPos = $(window).scrollTop();
    var wh = $(window).height();

    $('.elem').each(function () {
        if (scrollPos > $(this).offset().top - wh + (wh / 3)) {
            $(this).addClass('isAnimate');
        }
    });
});
