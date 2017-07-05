$(document).ready(function() {

  // Toggle Mobile Menu
  $('#hamburger-button').click(function() {
    $(this).toggleClass('hamburger-button--active');
    $('#mobile-menu').toggleClass('mobile-menu--active');
  });

  //Product Tabs
  $('.product-tab__link').on('click', ProductTab);

  //Throttled Resize Header
  var throttledResizeHeader = _.throttle(resizeHeader, 300);
  $(window).on('scroll', throttledResizeHeader);

  //Prevent Negative and More Than Max Numbers on Input Number
  $('.cart').on('focusout', '.cart-item-detail__select-quantity', function() {
    if ($(this).val() <= 0) {
      $(this).val('1');
    } else if ($(this).val() > 500) {
      $(this).val('500');
    }
  });

  //Sum Items on Cart - Price Box
  sumItemPrices();
  $('.cart-item').on('change', '.cart-item-detail__select-quantity', function() {
    //Check Negative and Max Values
    if ($(this).val() <= 0) {
      $(this).val('1');
    } else if ($(this).val() > 500) {
      $(this).val('500');
    }
    sumItemPrices();
  });

  $('.cart__cart-list').on('DOMSubtreeModified', function() {
    sumItemPrices();
  });

  //List Items on Cart - Price Box
  listItemPrices();
  $('.cart__cart-list').on('DOMSubtreeModified', listItemPrices);
  $('.cart-item').on('change', '.cart-item-detail__select-quantity', listItemPrices);

});
//End of Document Ready


//****************
//FUNCTIONS
//****************

//Resize Header
function resizeHeader() {
  var distanceY = $(window).scrollTop(),
    shrinkOn = 200,
    header = $('.main-header');

  if (distanceY > shrinkOn) {
    header.addClass('main-header--smaller');
  } else {
    if (header.hasClass('main-header--smaller')) {
      header.removeClass('main-header--smaller');
    }
  }
}

//Product Tab
function ProductTab() {
  event.preventDefault();
  var tab_id = $(this).data('tab');

  $('.product-tab__link').removeClass('product-tab__link--active');
  $('.product-tab__product-group').removeClass('product-tab__product-group--active');

  $(this).addClass('product-tab__link--active');
  $("#" + tab_id).addClass('product-tab__product-group--active');
}

//Sum Item Prices
function sumItemPrices() {

  //Sum Values
  var sum = 0;
  $('.cart-item').each(function(index, value) {
    sum += $(this).data('price') * $(this).find('.cart-item-detail__select-quantity').val();
  });

  //Display Values
  sum = sum.toFixed(2);
  var digits = sum.toString().split(".");
  $('.price-box__price').remove();
  var priceBox = $('<span class="price-box__price">' + digits[0] + '<span class="price-box__price-decimal">.' + digits[1] + '</span>tl</span>');
  $('.price-box__header').after(priceBox);
}

//List Item Prices
function listItemPrices() {
  $('.payment-info__item-info-box').empty();
  $('.cart-item').each(function(index, value) {
    var itemName = $(this).find('.cart-item-detail__name').text();
    var itemQuantity = $(this).find('.cart-item-detail__select-quantity').val();
    var itemInfo = $('<li class="payment-info__item-info">' + itemQuantity + ' adet ' + itemName + '</li>');
    $('.payment-info__item-info-box').append(itemInfo);
  });
}
