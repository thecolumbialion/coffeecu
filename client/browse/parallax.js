Template.parallax.rendered = function () {
  $(document).ready(function(){
    $('.parallax').parallax();
  });
};

Template.parallax.helpers({
  'randomParallaxImage': function () {
    var images = new Array('A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T');
    var randNum = Math.floor(Math.random() * images.length);
    return images[randNum];
  }
});
