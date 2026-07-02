/* PMOS symptom self-assessment quiz — vanilla JS, no dependencies, no network.
   Markup contract (see symptoms*.php):
     [data-pmos-quiz]
       input[type=checkbox]                  -> each ticked box counts as 1
       [data-pmos-submit]                     -> compute + reveal result
       [data-pmos-reset]                      -> clear + hide result
       .pmos-result[data-tier="low|mid|high"] -> one card per tier; the matching
                                                 one is revealed. Its "{score}"
                                                 placeholder (in [data-pmos-score])
                                                 is filled with the count.
   Tiers: 0-3 low, 4-7 mid, 8+ high.  Nothing is sent anywhere. */
(function () {
  function initQuiz(root) {
    var boxes = root.querySelectorAll('input[type="checkbox"]');
    var submit = root.querySelector('[data-pmos-submit]');
    var reset = root.querySelector('[data-pmos-reset]');
    var results = root.querySelectorAll('.pmos-result');

    function tierFor(score) {
      if (score >= 8) return 'high';
      if (score >= 4) return 'mid';
      return 'low';
    }

    function showResult() {
      var score = 0;
      for (var i = 0; i < boxes.length; i++) if (boxes[i].checked) score++;
      var tier = tierFor(score);
      for (var j = 0; j < results.length; j++) {
        var card = results[j];
        var match = card.getAttribute('data-tier') === tier;
        card.classList.toggle('is-visible', match);
        if (match) {
          var scoreEl = card.querySelector('[data-pmos-score]');
          if (scoreEl) scoreEl.textContent = String(score);
        }
      }
      // bring the result into view
      for (var k = 0; k < results.length; k++) {
        if (results[k].classList.contains('is-visible')) {
          results[k].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          break;
        }
      }
    }

    function clearAll() {
      for (var i = 0; i < boxes.length; i++) boxes[i].checked = false;
      for (var j = 0; j < results.length; j++) results[j].classList.remove('is-visible');
    }

    if (submit) submit.addEventListener('click', function (e) { e.preventDefault(); showResult(); });
    if (reset) reset.addEventListener('click', function (e) { e.preventDefault(); clearAll(); });
  }

  function boot() {
    var quizzes = document.querySelectorAll('[data-pmos-quiz]');
    for (var i = 0; i < quizzes.length; i++) initQuiz(quizzes[i]);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
