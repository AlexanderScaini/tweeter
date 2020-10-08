// makes the text on the top right of the screen focus the input area to type a new tweet
$(document).ready(function() {
  $(".rightSide div").click( function() {
    $("input").focus();
  });
})