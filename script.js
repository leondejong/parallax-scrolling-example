(function (window, document) {

  var ratio = 1;
  var lower = 0;
  var upper = 1;

  var sections = document.querySelectorAll('.parallax');
  var content = document.querySelectorAll('.content');
 
  main();

  function main() {
    initializeRaf();
    addEventHandlers();
    animateSections();
  }

  // Animate the section background and content
  function animateSections() {
    sections.forEach(function (section, index) {
      // Value ranges to play with
      var progress = calculateProgress(section);
      var bounded = bounds(progress.relative, lower, upper);
      var alternated = alternate(bounded);
      var centered = center(bounded);
      var reversed = reverse(bounded);

      // Calculate new values based on progress
      var y = (progress.absolute * ratio * 100) + '%';
      var transform = 'translate3d(' + (-25 + progress.relative * 50) + '%, -50%, 0)';

      // Apply values
      section.style.backgroundPositionY = y;
      content[index].style.transform = transform;
    });
  }

  // Calculate the scroll progress of page and sections as a value between 0 and 1
  function calculateProgress(section) {
    var remainder = document.body.scrollHeight - window.innerHeight;
    var total = (window.pageYOffset / remainder);

    if (section) {
      var top = section.getBoundingClientRect().top;
      var height = section.getBoundingClientRect().height;
      var relative = Math.max(0, Math.min((top / height / -2) + 0.5, 1));
      var absolute = (top / -remainder);
    }

    return {
      top: top, // Top of section
      height: height, // Height of section
      total: total, // Total progress of page
      absolute: absolute, // Absolute progress of section
      relative: relative // Relative progress of section
    };
  }

  // Reverse direction of value from 1 to 0
  function reverse(value) {
    return 1 - value;
  }

  // Center value around 0
  function center(value) {
    return (value * 2) - 1;
  }

  // Alternate value between 0 and 1
  function alternate(value) {
    return (value < 0.5) ? (value * 2) : reverse((value - 0.5) * 2);
  }

  // Contrain value between min and max
  function constrain(value, min, max) {
    return (Math.min(max, Math.max(min, value)));
  }

  // Transpose value to range of 0 to 1
  function bounds(value, lower, upper) {
    if (value < lower) return 0;
    if (value > upper) return 1;
    return value = (value - lower) * (1 / (upper - lower));
  }

  function addEventHandlers() {
    window.addEventListener('scroll', function() {
      window.requestAnimationFrame(animateSections);
    }, false);
  }

  function initializeRaf() {
    window.requestAnimationFrame = window.requestAnimationFrame
      || window.mozRequestAnimationFrame
      || window.webkitRequestAnimationFrame
      || window.msRequestAnimationFrame
      || function(f) { setTimeout(f, 1000 / 60) };
  }

})(window, document);
