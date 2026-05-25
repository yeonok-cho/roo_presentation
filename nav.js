// SLIDE (1-based) and TOTAL must be defined in the page before this script
function slideFile(n) {
  return 'slide' + String(n).padStart(2, '0') + '.html';
}
function goNext() { if (SLIDE < TOTAL) location.href = slideFile(SLIDE + 1); }
function goPrev() { if (SLIDE > 1) location.href = slideFile(SLIDE - 1); }
function goto(n) { if (n >= 1 && n <= TOTAL) location.href = slideFile(n); }

(function init() {
  var dotsEl = document.getElementById('dots');
  if (dotsEl) {
    for (var i = 1; i <= TOTAL; i++) {
      var d = document.createElement('div');
      d.className = 'dot' + (i === SLIDE ? ' active' : '');
      (function(n) { d.onclick = function() { goto(n); }; })(i);
      dotsEl.appendChild(d);
    }
  }
  var prog = document.getElementById('prog');
  if (prog) prog.style.width = (SLIDE / TOTAL * 100) + '%';
  var curEl = document.getElementById('cur');
  if (curEl) curEl.textContent = SLIDE;
  var prevBtn = document.getElementById('prevBtn');
  var nextBtn = document.getElementById('nextBtn');
  if (prevBtn) prevBtn.disabled = SLIDE === 1;
  if (nextBtn) nextBtn.disabled = SLIDE === TOTAL;
  var pawBtn = document.getElementById('pawBtn');
  if (pawBtn) pawBtn.classList.toggle('visible', [2,4,6,8,10].indexOf(SLIDE) !== -1);
})();

document.addEventListener('keydown', function(e) {
  var ov = document.getElementById('tipsOverlay');
  if (ov && ov.classList.contains('open')) {
    if (e.key === 'Escape' && typeof closeTips === 'function') closeTips();
    return;
  }
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goNext();
  if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   goPrev();
});

document.addEventListener('click', function(e) {
  if (e.target.closest('a, button, [onclick], .dot, .tag-item, .mode-card, .tips-trigger, .tips-overlay, .scenario')) return;
  e.clientX >= window.innerWidth / 2 ? goNext() : goPrev();
});

var _wcd = false;
window.addEventListener('wheel', function(e) {
  var ov = document.getElementById('tipsOverlay');
  if (ov && ov.classList.contains('open')) return;
  if (_wcd) return;
  _wcd = true;
  setTimeout(function() { _wcd = false; }, 900);
  e.deltaY > 0 ? goNext() : goPrev();
}, { passive: true });

var _tx = 0;
document.addEventListener('touchstart', function(e) { _tx = e.touches[0].clientX; }, { passive: true });
document.addEventListener('touchend', function(e) {
  var ov = document.getElementById('tipsOverlay');
  if (ov && ov.classList.contains('open')) return;
  var dx = e.changedTouches[0].clientX - _tx;
  if (Math.abs(dx) > 50) dx < 0 ? goNext() : goPrev();
}, { passive: true });
