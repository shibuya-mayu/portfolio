

jQuery(function(){
	
	var logo = jQuery('.color');
	jQuery(window).scroll(function () {
		if (jQuery(this).scrollTop() > 500) { //スクロールが500pxを越えたら
			logo.addClass('invert');
		} else { //スクロールが500pxを越えなければ
			logo.removeClass('invert');
		}
	});

});


jQuery(function(){

	var logo = jQuery('.color2');
	jQuery(window).scroll(function () {
		if (jQuery(this).scrollTop() > 500) { //スクロールが500pxを越えたら
			logo.addClass('invert2');
		} else { //スクロールが500pxを越えなければ
			logo.removeClass('invert2');
		}
	});
});


jQuery(function(){
$('#hamburger-menu a[href]').on('click', function(event) {
	$('.hamburger').trigger('click');
});
});
