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
