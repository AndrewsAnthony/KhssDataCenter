$(document).ready(function(){

$('.js-upload-photos').one('click', function(e){
	$(this).parent().find('.owl-carousel').owlCarousel({
		items:1,
		lazyLoad:true,
		loop:true,
		margin:10
	})
	$(this).hide()
	return false
})

})