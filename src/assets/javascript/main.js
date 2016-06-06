'use strict';

function domReady(cb) {
  document.addEventListener("DOMContentLoaded", cb, false);
}

[].map.call(document.querySelectorAll('.input__field'), function (el) {
  var check = function () {
    if (el.value.length) {
      el.classList.add('filled');
    } else {
      el.classList.remove('filled');
    }
  };

  el.addEventListener('keyup', function () {
    check();
  });

  check();
});

domReady(function () {
  var slideout = new window.Slideout({
    panel: document.getElementById('content'),
    menu: document.getElementById('menu'),
    padding: 256,
    tolerance: 70
  });

  slideout.on('beforeopen', function () {
    document.querySelector('.mobile-header').classList.add('fixed-open');
  });

  slideout.on('beforeclose', function () {
    document.querySelector('.mobile-header').classList.remove('fixed-open');
  });

  document.querySelector('.mobile-header').addEventListener('click', function () {
    slideout.toggle();
  });
});
