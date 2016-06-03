'use strict';

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
