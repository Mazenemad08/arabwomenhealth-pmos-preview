/* PMOS interactive body map — vanilla JS, no dependencies.
   Each [data-pmos-bodymap] block contains:
     - clickable elements with [data-zone] (SVG dots + chip buttons)
     - a <script type="application/json" class="pmos-bodymap-data"> map of
       zone -> { title, text }
     - a .pmos-bodymap-panel with <h4> + <p> to receive the content
   Works for LTR and RTL pages (content comes from the JSON, direction from <html dir>). */
(function () {
  function initMap(root) {
    var dataEl = root.querySelector('.pmos-bodymap-data');
    if (!dataEl) return;
    var data;
    try { data = JSON.parse(dataEl.textContent); } catch (e) { return; }

    var panel = root.querySelector('.pmos-bodymap-panel');
    var titleEl = panel ? panel.querySelector('h4') : null;
    var textEl = panel ? panel.querySelector('p') : null;
    var triggers = root.querySelectorAll('[data-zone]');

    function activate(zone) {
      var entry = data[zone];
      if (!entry) return;
      if (titleEl) titleEl.textContent = entry.title;
      if (textEl) textEl.textContent = entry.text;
      for (var i = 0; i < triggers.length; i++) {
        triggers[i].classList.toggle('is-active', triggers[i].getAttribute('data-zone') === zone);
      }
    }

    for (var i = 0; i < triggers.length; i++) {
      (function (el) {
        var zone = el.getAttribute('data-zone');
        el.addEventListener('click', function () { activate(zone); });
        el.addEventListener('keydown', function (ev) {
          if (ev.key === 'Enter' || ev.key === ' ' || ev.key === 'Spacebar') {
            ev.preventDefault();
            activate(zone);
          }
        });
      })(triggers[i]);
    }
  }

  function boot() {
    var maps = document.querySelectorAll('[data-pmos-bodymap]');
    for (var i = 0; i < maps.length; i++) initMap(maps[i]);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
