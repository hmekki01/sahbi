
// public/theme.js
(function () {
  try {
    const KEY = 'site-theme';
    const html = document.documentElement;

    // URL override: ?theme=dark|light|auto
    const params = new URLSearchParams(window.location.search);
    const urlTheme = params.get('theme');

    // Choix sauvegardé sinon 'auto'
    const saved = urlTheme || localStorage.getItem(KEY) || 'auto';

    apply(saved);

    // Si 'auto', suivre en direct le thème système
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    if (mq.addEventListener) {
      mq.addEventListener('change', () => {
        if (!html.hasAttribute('data-theme')) apply('auto');
      });
    }

    function apply(mode) {
      html.removeAttribute('data-theme');
      if (mode === 'light' || mode === 'dark') {
        html.setAttribute('data-theme', mode);
      }
    }
  } catch (_) {}
})();
