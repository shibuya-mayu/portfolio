// Work一覧 All タブ：写真が画面に入ったら、1枚ずつ「貼っていく」アニメーションで出す
// 動きそのものは css/work-all.css の「写真を貼っていくアニメーション」に書いてある
$(function(){
    var $items = $('.all-item, .all-bear');
    if (!$items.length || !('IntersectionObserver' in window)) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return; // 「動きを減らす」設定の人には出さない

    var STEP = 220;   // 1枚ずつずらす時間（ミリ秒）

    var observer = new IntersectionObserver(function(entries) {
        var n = 0;
        entries.forEach(function(entry) {
            if (!entry.isIntersecting) return;
            var el = entry.target;
            el.style.setProperty('--d', (n++ * STEP) + 'ms');   // 同時に画面に入ったものは順番にずらす
            el.classList.remove('is-wait');
            el.classList.add('is-in');
            observer.unobserve(el);
        });
    }, { rootMargin: '0px 0px -40px 0px' });  // 画面の下から少し（40px）入ったところで出す

    function play() {
        $items.removeClass('is-in').addClass('is-wait');
        $items.each(function(){ observer.observe(this); });
    }

    play();

    // All タブに切り替えたら、もう一度再生
    $('.tab_box .tab_btn').on('click', function() {
        if ($('.tab_box .tab_btn').index(this) === 0) setTimeout(play, 0);
    });
});
