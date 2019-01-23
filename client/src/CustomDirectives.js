import Vue from 'vue';

Vue.directive('focus', {
  inserted(el) {
    el.focus();
  },
});

Vue.directive('maxchars', {
  bind(el, binding) {
    const maxChars = binding.expression;
    el.addEventListener('input', e => {
      if (e.target.value.length > maxChars) {
        e.target.value = e.target.value.substr(0, maxChars);
      }
    });
  },
});

Vue.directive('restrict', {
  bind(el, binding) {
    el.addEventListener('keydown', e => {
      const regex = new RegExp(/[a-z0-9]+/, 'ig');
      // delete, backpsace, tab, escape, enter,
      const special = [46, 8, 9, 27, 13];
      if (binding.modifiers.decimal) {
        // decimal(numpad), period
        special.push(110, 190);
      }
      // special from above
      if (
        special.indexOf(e.keyCode) !== -1 ||
        // Ctrl+A
        (e.keyCode === 65 && e.ctrlKey === true) ||
        // Ctrl+C
        (e.keyCode === 67 && e.ctrlKey === true) ||
        // Ctrl+X
        (e.keyCode === 88 && e.ctrlKey === true) ||
        // home, end, left, right
        (e.keyCode >= 35 && e.keyCode <= 39)
      ) {
        return; // allow
      }
      console.log(e, e.key, e.key.charCodeAt(0), e.key.match(regex));
      // document.write(e, e.key, e.key.charCodeAt(0), e.key.match(regex));
      if (
        binding.modifiers.alpha &&
        // a-z/A-Z
        e.key.match(regex) !== null
      ) {
        return; // allow
      }
      if (
        binding.modifiers.number &&
        // number keys without shift
        ((!e.shiftKey && (e.keyCode >= 48 && e.keyCode <= 57)) ||
          // numpad number keys
          (e.keyCode >= 96 && e.keyCode <= 105))
      ) {
        return; // allow
      }
      // otherwise stop the keystroke
      e.preventDefault(); // prevent
    }); // end addEventListener
  }, // end bind
}); // end directive
