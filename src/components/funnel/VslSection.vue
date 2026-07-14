<template>
  <section class="vsl section-pad">
    <div class="funnel-container vsl__inner">
      <p class="eyebrow"><span></span> MIRA ESTO PRIMERO</p>
      <h2>Por qué entrenar más no siempre significa obtener mejores resultados.</h2>
      <p class="section-lead">Dale play y descubre cómo Vital 360 integra entrenamiento funcional, nutrición y comunidad.</p>
      <div class="vsl__player">
        <wistia-player
          media-id="johmj3affk"
          aspect="1.7777777777777777"
          aria-label="Video de presentación de Vital 360 por Luisa Pita Bejarano"
        ></wistia-player>
      </div>
      <p class="vsl__note">Reserva unos minutos sin distracciones. Este puede ser el comienzo de tu mejor versión.</p>
      <a class="primary-button" href="#oferta">QUIERO EMPEZAR AHORA <span>→</span></a>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.vsl {
  background: $LPB-LIGHT;

  &__inner { flex-direction: column; justify-content: center; align-items: center; gap: 1.5rem; text-align: center; }
  h2 { max-width: 55rem; }

  &__player {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    max-width: 58rem;
    margin-top: 1.5rem;
    overflow: hidden;
    border: 0.6rem solid $white;
    border-radius: 1.5rem;
    box-shadow: 0 25px 70px rgba($primary-dark, 0.16);
    background: $primary-dark;
  }

  wistia-player {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    aspect-ratio: 16 / 9;
  }

  wistia-player:not(:defined) {
    background: center / contain no-repeat url('https://fast.wistia.com/embed/medias/johmj3affk/swatch');
    filter: blur(5px);
  }

  &__note { width: 100%; margin-top: 0.5rem; color: $text-secondary; font-size: 0.82rem; }
}
</style>
