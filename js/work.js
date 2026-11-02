// Work：Lightbox の設定
lightbox.option({ albumLabel: '%1 / %2' });   // 「Image 1 of 6」→「1 / 6」

// Work：タブ・ページ送り・制作のこだわりの開閉など
$(function(){
    $('.tab_box .tab_btn').click(function(e) {
        e.preventDefault();                          // href="#all" に飛ばないようにする
        var index = $('.tab_box .tab_btn').index(this);
        $('.tab_box .tab_btn, .tab_box .tab_panel').removeClass('active');
        $(this).addClass('active');
        $('.tab_box .tab_panel').eq(index).addClass('active');
        history.replaceState(null, '', '#' + this.id); // URL を開いたタブ（#web など）にする
        showPage(0);                                 // タブを変えたら1ページ目から
    });

    // オレンジの矢印を押したら、そのカードの画像を Lightbox で開く
    $('.other-card .arrow-parent').on('click', function() {
        $(this).closest('.other-card').find('.other-img a').trigger('click');
    });

    // 同じ段（横並び）にある、ほかのカードを探す
    function rowSiblings($box) {
        var top = $box.offset().top;
        return $box.siblings('.other-box:visible').filter(function() {
            return Math.abs($(this).offset().top - top) < 2;
        });
    }

    // 「制作のこだわりを見る」を押したとき：隣のカードが一緒に伸びないように、今の高さで止める
    $('.making-details > summary').on('click', function() {
        var $box = $(this).closest('.other-box');
        $box.data('closedHeight', $box.outerHeight()); // 閉じているときの高さを覚えておく
        $box.css('height', '');                      // 自分は伸びられるように
        rowSiblings($box).each(function() {
            if (!$(this).find('details').prop('open')) {
                $(this).css('height', $(this).outerHeight());
            }
        });
    });

    // 画面の幅が変わったら、止めていた高さを外す
    $(window).on('resize', function() {
        $('.other-box').css('height', '');
    });

    // 「閉じる」を押したら、制作のこだわりを閉じる
    $('.making-close').on('click', function() {
        var $details = $(this).closest('details');
        $details.prop('open', false);
        var $box = $details.closest('.other-box');
        var $row = rowSiblings($box);
        if ($row.find('details[open]').length) {
            $box.css('height', $box.data('closedHeight'));  // 隣が開いたままなら、自分は元の高さで止める
        } else {
            $box.add($row).css('height', '');            // 段の全員が閉じたら、高さの固定を外す
        }
        // 閉じたあと「制作のこだわりを見る」が画面の上に隠れていたら、見える位置まで戻す
        var summary = $details.children('summary')[0];
        if (summary.getBoundingClientRect().top < 0) {
            summary.scrollIntoView({ block: 'center' });
        }
    });

    // ページ送り：開いているタブの作品を PER_PAGE 個ずつ表示する
    var PER_PAGE = 9;
    var CARD = '.web-box, .other-box';               // 作品のカード

    function showPage(page) {
        var $cards = $('.tab_box .tab_panel.active').find(CARD);
        var pages = Math.ceil($cards.length / PER_PAGE);

        $cards.addClass('is-hidden');
        $cards.slice(page * PER_PAGE, (page + 1) * PER_PAGE).removeClass('is-hidden');

        // ボタンを作り直す（1ページしかないときは出さない）
        var $area = $('.page_area').empty();
        if (pages <= 1) return;
        for (var i = 0; i < pages; i++) {
            $('<button type="button" class="page_btn"></button>')
                .text(i + 1)
                .data('page', i)
                .toggleClass('active', i === page)
                .attr('aria-current', i === page ? 'page' : null)
                .appendTo($area);
        }
    }

    $('.page_area').on('click', '.page_btn', function() {
        showPage($(this).data('page'));
        $('.btn_area')[0].scrollIntoView();          // 作品の種類メニューまで戻る
    });

    // URL の #〇〇 に合わせてタブを開く
    function openByHash() {
        if (!location.hash) return;

        // タブの名前（#all・#web など）のとき：そのタブを開く
        var $tab = $('.tab_box .tab_btn' + location.hash);
        if ($tab.length) { $tab.click(); return; }

        // 作品（#fitness など）のとき：その作品があるタブを開いて、作品までスクロール
        var $target = $(location.hash);
        var $panel = $target.closest('.tab_panel');
        if (!$panel.length) return;

        var index = $('.tab_box .tab_panel').index($panel);
        $('.tab_box .tab_btn, .tab_box .tab_panel').removeClass('active');
        $('.tab_box .tab_btn').eq(index).addClass('active');
        $panel.addClass('active');
        showPage(Math.max(0, Math.floor($panel.find(CARD).index($target) / PER_PAGE))); // 作品があるページを開く
        $target[0].scrollIntoView();
    }

    showPage(0);                               // 最初は All の1ページ目
    openByHash();                            // ほかのページから work.html#〇〇 で来たとき
    $(window).on('hashchange', openByHash);   // 同じページの中で #〇〇 のリンクを押したとき
});
