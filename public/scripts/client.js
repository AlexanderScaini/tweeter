const createTweetElement = (tweet) => {
  const date = new Date(tweet.created_at).toString().slice(0, 16)

  // cleans the input of the user so they cant XSS
  const escape = function(str) {
    let div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }
  const safeHTML = `${escape(tweet.content.text)}`;

  // constructs the new tweet

  let $tweet = `
  <div class="whole-tweet">
  <header>
    <span>
      <img src='${tweet.user.avatars}'>
      ${tweet.user.name}
    </span>
    <span class='username'>
      ${tweet.user.handle}
    </span>
  </header>
  <div class='content'>
    ${safeHTML}
  </div>
  <footer>
    <span>
      ${date}
    </span>
    <span class='icons'>
      <i class="far fa-flag"></i>
      <i class="fas fa-retweet"></i>
      <i class="far fa-thumbs-up"></i>
    </span>
  </footer>
  </div>
  `

  return $tweet;
}

const renderTweets = (tweets) => {
  let arrayOfTweets = [];

  for (const tweet of tweets) {
    arrayOfTweets.push(createTweetElement(tweet));
  }

  return $('#tweets-container').append(arrayOfTweets); 
}


$(document).ready(function() {
  const $form = $('form');

  $form.on('submit', function (event) {
    event.preventDefault();

    const data = $form.serialize();
    const tweetLength = data.slice(5).length;
    console.log(tweetLength)
    // throws an error if the user inputs more than 140 characters or nothing at all
    if (tweetLength > 140) {
      $(".error-message").slideDown();
      $(".error-text").html("Tweet is too long!");
    } else if (tweetLength <= 0) {
      $(".error-message").slideDown();
      $(".error-text").html("Write something!");

    // posts the new tweet on the top of the pile
    } else {
      $.ajax({url: '/tweets/', method: "POST", data}).then((result) => {
        // removes the error message if there was one, resets the counter and the input field
        $(".error-message").slideUp();
        $(".counter").html(140)
        $("form")[0].reset();
        // giving loadTweets a thruthy value will only render the new tweet on the page
        loadTweets(true);
      }).catch((error) => {
        console.log(error);
      });
    }
  })

  const loadTweets = (newTweet) => {

    $.ajax({url: '/tweets', method: 'GET'}).then((tweetsJSON) => { 
      if (newTweet) {
        // getting the last tweet in the json
        $('#tweets-container').append(createTweetElement(tweetsJSON[tweetsJSON.length - 1]));
      } else {
        renderTweets(tweetsJSON);
      }
    }).catch((error) => {
      console.log(error);
    });
  }
  // giving loadTweets a falsy value will load all of the tweets in the database
  loadTweets()
})