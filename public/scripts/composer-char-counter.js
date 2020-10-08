// updates the character count whenever the input text changes
$(document).ready(function() {
  $('#tweet-text').on('input', function() {
    let numberOfChars = $(this).val().length;
    $('.counter').text(140 - numberOfChars) 
    if ((140 - numberOfChars) > 0) {
      $('.counter').removeClass('red')
    } else {
      $('.counter').addClass('red')
    }
  })
});