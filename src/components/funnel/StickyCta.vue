<template>
  <aside class="sticky-cta"><div class="sticky-cta__inner funnel-container"><div><span>EBOOK DIGITAL</span><strong>$33</strong><small>pago único</small></div><a href="#oferta">QUIERO TRANSFORMARME <span>↑</span></a></div></aside>
</template>

<style lang="scss" scoped>
.sticky-cta { position: fixed; right: 0; bottom: 0; left: 0; z-index: 20; display: flex; justify-content: center; width: 100%; padding: 0.65rem 0; border-top: 1px solid rgba($primary, 0.5); background: rgba($primary-dark, 0.95); backdrop-filter: blur(12px); }
.sticky-cta__inner { justify-content: space-between; gap: 1rem; }
.sticky-cta__inner > div { display: flex; align-items: baseline; width: 100%; gap: 0.6rem; color: $white; }
.sticky-cta span { color: $secondary; font-size: 0.68rem; font-weight: 900; letter-spacing: 0.08em; }
.sticky-cta strong { font-size: 1.8rem; }
.sticky-cta small { color: rgba($white, 0.5); }
.sticky-cta a { display: flex; justify-content: center; align-items: center; width: 100%; max-width: 19rem; gap: 0.5rem; padding: 0.85rem 1rem; border-radius: 999px; background: $primary; color: $white; font-size: 0.78rem; font-weight: 900; text-decoration: none; }
@media (max-width: 600px) { .sticky-cta span, .sticky-cta small { display: none; } .sticky-cta__inner > div { max-width: 4rem; } .sticky-cta a { max-width: none; } }
</style>
