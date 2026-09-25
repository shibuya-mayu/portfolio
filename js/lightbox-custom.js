// lightbox の表示をカスタマイズ（lightbox.js の後に読み込む）
// ・小さい画像（バナーなど）を画面に合わせて大きく表示する
// ・画像を画面の上下中央に表示する
(function ($) {
    var MAX_SCALE = 2;         // 小さい画像を最大何倍まで拡大するか
    var MAX_HEIGHT_RATE = 0.8; // 画面の高さの何割まで大きくするか
    var DATA_HEIGHT = 40;      // 画像の下の「×」や「1 / 6」の帯の高さ
    var SVG_MAX_WIDTH = 800;   // SVG を表示する最大の幅

    var originalSizeContainer = lightbox.sizeContainer;

    lightbox.sizeContainer = function (imageWidth, imageHeight) {
        var $window = $(window);
        var paddingX = this.containerPadding.left + this.containerPadding.right + this.imageBorderWidth.left + this.imageBorderWidth.right;
        var paddingY = this.containerPadding.top + this.containerPadding.bottom + this.imageBorderWidth.top + this.imageBorderWidth.bottom;

        // 拡大：画面からはみ出さない範囲で、MAX_SCALE 倍まで
        var maxWidth = $window.width() - paddingX - 20;
        var maxHeight = $window.height() * MAX_HEIGHT_RATE - paddingY - DATA_HEIGHT;
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

        var scale = Math.min(scaleLimit, maxWidth / imageWidth, maxHeight / imageHeight);
        if (scale > 1) {
            imageWidth = Math.round(imageWidth * scale);
            imageHeight = Math.round(imageHeight * scale);
            this.$lightbox.find('.lb-image').width(imageWidth).height(imageHeight);
        }

        // 上下中央に配置
        var totalHeight = imageHeight + paddingY + DATA_HEIGHT;
        var top = $window.scrollTop() + Math.max(10, ($window.height() - totalHeight) / 2);
        this.$lightbox.animate({ top: top }, this.options.resizeDuration);

        originalSizeContainer.call(this, imageWidth, imageHeight);
    };
})(jQuery);
