// lightbox の表示をカスタマイズ（lightbox.js の後に読み込む）
// ・小さい画像（バナーなど）を画面に合わせて大きく表示する
// ・画像を画面の上下中央に表示する
// ・画像の下に、同じグループの画像のサムネイルを並べる（押すとその画像に切り替わる）
(function ($) {
    var MAX_SCALE = 2;         // 小さい画像を最大何倍まで拡大するか
    var MAX_HEIGHT_RATE = 0.8; // 画面の高さの何割まで大きくするか
    var DATA_HEIGHT = 40;      // 画像の下の「×」や「1 / 6」の帯の高さ
    var THUMB_HEIGHT = 76;     // サムネイルの列の高さ（余白を含む）
    var SVG_MAX_WIDTH = 800;   // SVG を表示する最大の幅

    var originalSizeContainer = lightbox.sizeContainer;
    var originalStart = lightbox.start;
    var originalChangeImage = lightbox.changeImage;

    // サムネイルの列の高さ（1枚だけのときは出さないので 0）
    function thumbsHeight(self) {
        return self.album && self.album.length > 1 ? THUMB_HEIGHT : 0;
    }

    lightbox.sizeContainer = function (imageWidth, imageHeight) {
        var $window = $(window);
        var paddingX = this.containerPadding.left + this.containerPadding.right + this.imageBorderWidth.left + this.imageBorderWidth.right;
        var paddingY = this.containerPadding.top + this.containerPadding.bottom + this.imageBorderWidth.top + this.imageBorderWidth.bottom;
        var belowHeight = DATA_HEIGHT + thumbsHeight(this);   // 画像の下に並ぶものの高さ

        // 拡大・縮小：画面からはみ出さない範囲で、MAX_SCALE 倍まで
        var maxWidth = $window.width() - paddingX - 20;
        var maxHeight = $window.height() * MAX_HEIGHT_RATE - paddingY - belowHeight;
        var scaleLimit = MAX_SCALE;

        // SVG は lightbox が画面いっぱいに広げるので、元の比率に戻してから拡大する
        // （SVG はいくら拡大してもぼやけないので、倍率の上限なし）
        var image = this.$lightbox.find('.lb-image')[0];
        if (/\.svg$/i.test(this.album[this.currentImageIndex].link) && image.naturalWidth) {
            imageWidth = image.naturalWidth;
            imageHeight = image.naturalHeight;
            maxWidth = Math.min(maxWidth, SVG_MAX_WIDTH);
            scaleLimit = Infinity;
        }

        // サムネイルの分だけ高さが足りないときは、縮小もする
        var scale = Math.min(scaleLimit, maxWidth / imageWidth, maxHeight / imageHeight);
        if (Math.abs(scale - 1) > 0.001) {
            imageWidth = Math.round(imageWidth * scale);
            imageHeight = Math.round(imageHeight * scale);
            this.$lightbox.find('.lb-image').width(imageWidth).height(imageHeight);
        }

        // 上下中央に配置
        var totalHeight = imageHeight + paddingY + belowHeight;
        var top = $window.scrollTop() + Math.max(10, ($window.height() - totalHeight) / 2);
        this.$lightbox.animate({ top: top }, this.options.resizeDuration);

        originalSizeContainer.call(this, imageWidth, imageHeight);
    };

    // 今表示している画像のサムネイルに印を付ける
    function markActive(self) {
        var $buttons = self.$lightbox.find('.lb-thumb');
        $buttons.removeClass('is-active').removeAttr('aria-current');
        var $active = $buttons.eq(self.currentImageIndex).addClass('is-active').attr('aria-current', 'true');
        // サムネイルが横にスクロールしているときは、選んでいるものが見えるようにする
        if ($active.length) {
            var row = $active.parent()[0];
            var btn = $active[0];
            row.scrollLeft = btn.offsetLeft - (row.clientWidth - btn.offsetWidth) / 2;
        }
    }

    // サムネイルの列を作る
    function renderThumbs(self) {
        var $row = self.$lightbox.find('.lb-thumbs');
        if (!$row.length) {
            $row = $('<div class="lb-thumbs"></div>').appendTo(self.$lightbox);
            $row.on('click', '.lb-thumb', function () {
                var index = $(this).index();
                if (index !== self.currentImageIndex) {
                    self.changeImage(index);
                }
            });
        }

        $row.empty();
        if (self.album.length <= 1) {
            $row.hide();
            return;
        }
        $.each(self.album, function (i, item) {
            $('<button type="button" class="lb-thumb"></button>')
                .attr('aria-label', (i + 1) + '枚目の画像を表示')
                .append($('<img alt="">').attr('src', item.link))
                .appendTo($row);
        });
        $row.show();
        markActive(self);
    }

    lightbox.start = function ($link) {
        originalStart.call(this, $link);
        renderThumbs(this);
    };

    lightbox.changeImage = function (imageNumber) {
        originalChangeImage.call(this, imageNumber);
        markActive(this);
    };
})(jQuery);
