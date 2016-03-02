var CardGame = function(targetId)
{
  // private variables
  var cards = []
  var card_value = ["0","0","1","1","2","2","3","3","4","4","5","5","6","6","7","7"];

  var started = false;
  var matches_found = 0;
  var card1 = false, card2 = false;

  var hideCard = function(id) // turn card face down
  {
    cards[id].firstChild.src = "images/cards/back.png";
    with(cards[id].style) {
      WebkitTransform = MozTransform = OTransform = msTransform = "scale(1.0) rotate(360deg)";
    }
  };

  var moveToPack = function(id) // move card to pack
  {
    hideCard(id);
    cards[id].matched = true;
    with(cards[id].style) {
      zIndex = "1000";
      top = "100px";
      left = "-140px";
      WebkitTransform = MozTransform = OTransform = msTransform = "rotate(0deg)";
      zIndex = "0";
    }
  };
  var moveToPlace = function(id) // deal card
  {
    cards[id].matched = false;
    with(cards[id].style) {
      zIndex = "1000";
      top = cards[id].fromtop + "px";
      left = cards[id].fromleft + "px";
      WebkitTransform = MozTransform = OTransform = msTransform = "rotate(180deg)";
      zIndex = "0";
    }
  };

  var showCard = function(id) // turn card face up, check for match
  {
    if(id === card1) return;
    if(cards[id].matched) return;

    cards[id].firstChild.src = "images/snh48/zp_" + card_value[id] + ".jpg";
    with(cards[id].style) {
      WebkitTransform = MozTransform = OTransform = msTransform = "scale(1.2) rotate(365deg)";
    }

    if(card1 !== false) {
      card2 = id;
      if(parseInt(card_value[card1]) == parseInt(card_value[card2])) { // match found
        (function(card1, card2) {
          setTimeout(function() { moveToPack(card1); moveToPack(card2); }, 1000);
        })(card1, card2);
        if(++matches_found == 8) { // game over, reset
          matches_found = 0;
          started = false;
          stop_timer();

        }
      } else { // no match
        (function(card1, card2) {
          setTimeout(function() { hideCard(card1); hideCard(card2); }, 800);
        })(card1, card2);
      }
      card1 = card2 = false;
    } else { // first card turned over
      card1 = id;
    }
  };
  var cardClick = function(id)
  {
    if(started) {
      showCard(id);
    } else {
      // shuffle and deal cards
      //start timer
      start_timer();
      //clear div result
      document.getElementById('result').innerHTML = "";


      card_value.sort(function() { return Math.round(Math.random()) - 0.5; });
      for(i=0; i < 16; i++) {
        (function(idx) {
          setTimeout(function() { moveToPlace(idx); }, idx * 100);
        })(i);
      }
      started = true;
    }
  };

  // initialise

  var stage = document.getElementById(targetId);
  var felt = document.createElement("div");
  felt.id = "felt";
  stage.appendChild(felt);

  // template for card
  var card = document.createElement("div");
  card.innerHTML = "<img src=\"images/cards/back.png\">";

  for(var i=0; i < 16; i++) {
    var newCard = card.cloneNode(true);

    newCard.fromtop = 15 + 120 * Math.floor(i/4);
    newCard.fromleft = 70 + 100 * (i%4);
    (function(idx) {
      newCard.addEventListener("click", function() { cardClick(idx); }, false);
    })(i);

    felt.appendChild(newCard);
    cards.push(newCard);
  }

}

var clsStopwatch = function() {
    // Private vars
    var startAt = 0;  // Time of last start / resume. (0 if not running)
    var lapTime = 0;  // Time on the clock when last stopped in milliseconds
    $result_time = 0;

    var now = function() {
        return (new Date()).getTime(); 
      }; 
 
    // Public methods
    // Start or resume
    this.start = function() {
        startAt = startAt ? startAt : now();
      };

    // Stop or pause
    this.stop = function() {
        // If running, update elapsed time otherwise keep it
        lapTime = startAt ? lapTime + now() - startAt : lapTime;
        $result_time = lapTime;
        startAt = 0; // Paused
      };

    // Reset
    this.reset = function() {
        lapTime = startAt = 0;
      };

    // Duration
    this.time = function() {
        return lapTime + (startAt ? now() - startAt : 0); 
      };
  };

var x = new clsStopwatch();
var $time;
var clocktimer;

function pad(num, size) {
  var s = "0000" + num;
  return s.substr(s.length - size);
}

function formatTime(time) {
  var h = m = s = ms = 0;
  var newTime = '';

  h = Math.floor( time / (60 * 60 * 1000) );
  time = time % (60 * 60 * 1000);
  m = Math.floor( time / (60 * 1000) );
  time = time % (60 * 1000);
  s = Math.floor( time / 1000 );
  ms = time % 1000;

  newTime = pad(h, 2) + ':' + pad(m, 2) + ':' + pad(s, 2) + ':' + pad(ms, 3);
  return newTime;
}

function show() {
  $time = document.getElementById('time');
  update();
}

function update() {
  $time.innerHTML = formatTime(x.time());
}

function start_timer() {
  clocktimer = setInterval("update()", 1);
  x.start();
}

function stop_timer() {
  x.stop();
  clearInterval(clocktimer);
  document.getElementById('result').innerHTML = 
  "Congratulations, "+$user+"! You finished game in  <span class = 'red'>" 
  +formatTime($result_time) + "</span>";
  var d1 = document.getElementById('history');
  d1.insertAdjacentHTML('beforeend', "<div>"+$user+"@"+get_current_time()+"--<span class = 'green'>"+formatTime($result_time)+"</span></div>");
}

function reset() {
  stop();
  x.reset();
  update();
}

function get_current_time(){
  return new Date().toLocaleString();
}

// function new_game(){
//   $game = null;
//   delete $game;
//   $game = new CardGame("stage");
// }


