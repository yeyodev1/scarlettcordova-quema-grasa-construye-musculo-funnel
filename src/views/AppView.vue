<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const sidebarOpen = ref(false)

function logout() {
  localStorage.removeItem('access_token')
  router.push('/login')
}
</script>

<template>
  <div class="app-shell">
    <aside class="app-sidebar" :class="{ 'app-sidebar--open': sidebarOpen }">
      <div class="app-sidebar__head">
        <span class="app-sidebar__brand">SCARLETT CORDOVA</span>
        <span class="app-sidebar__product">Quema Grasa,<br>Construye Músculo</span>
      </div>
      <nav class="app-sidebar__nav">
        <a class="app-sidebar__link app-sidebar__link--active" href="/app">
          <i class="fas fa-book-open"></i>
          Mi Ebook
        </a>
      </nav>
      <div class="app-sidebar__foot">
        <a class="app-sidebar__link" href="/">
          <i class="fas fa-home"></i>
          Inicio
        </a>
        <button class="app-sidebar__link app-sidebar__link--logout" @click="logout">
          <i class="fas fa-right-from-bracket"></i>
          Cerrar sesión
        </button>
      </div>
    </aside>

    <div class="app-overlay" :class="{ 'app-overlay--visible': sidebarOpen }" @click="sidebarOpen = false"></div>

    <main class="app-main">
      <header class="app-topbar">
        <button class="app-topbar__menu" @click="sidebarOpen = !sidebarOpen" aria-label="Menú">
          <i class="fas fa-bars"></i>
        </button>
        <span class="app-topbar__title">Mi Ebook</span>
      </header>

      <section class="app-content">
        <div class="app-content__bar">
          <h2><i class="fas fa-book-open"></i> Quema Grasa, Construye Músculo</h2>
          <a class="app-btn app-btn--mobile" :href="'/reader/qgcm.pdf'" target="_blank">
            <i class="fas fa-external-link-alt"></i> Abrir PDF
          </a>
        </div>
        <iframe
          class="app-content__pdf"
          src="/reader/qgcm.pdf"
          title="Quema Grasa, Construye Músculo"
        ></iframe>
      </section>
    </main>
  </div>
</template>

<style lang="scss" scoped>
.app-shell {
  display: flex;
  width: 100%;
  min-height: 100vh;
  background: #f5f2ef;
}

/* ─── Sidebar ─── */
.app-sidebar {
  display: flex;
  flex-direction: column;
  width: 16rem;
  min-height: 100vh;
  background: $primary-dark;
  color: $white;
  flex-shrink: 0;
}
.app-sidebar__head {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  padding: 1.5rem 1.25rem 1rem;
  border-bottom: 1px solid rgba($white, 0.08);
}
.app-sidebar__brand {
  font-size: 0.6rem;
  font-weight: 900;
  letter-spacing: 0.13em;
  opacity: 0.45;
}
.app-sidebar__product {
  font-size: 0.82rem;
  font-weight: 700;
  line-height: 1.3;
}
.app-sidebar__nav {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 0.5rem 0.75rem;
  gap: 0.15rem;
}
.app-sidebar__foot {
  display: flex;
  flex-direction: column;
  padding: 0.5rem 0.75rem 1rem;
  border-top: 1px solid rgba($white, 0.08);
  gap: 0.15rem;
}
.app-sidebar__link {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.6rem 0.7rem;
  border-radius: 0.5rem;
  color: rgba($white, 0.7);
  text-decoration: none;
  font-size: 0.82rem;
  font-weight: 600;
  transition: background 0.15s, color 0.15s;
  background: none;
  border: none;
  width: 100%;
  cursor: pointer;
  i {
    width: 1.1rem;
    text-align: center;
    font-size: 0.9rem;
  }
  &:hover { background: rgba($white, 0.08); color: $white; }
  &--active {
    background: rgba($white, 0.12);
    color: $white;
  }
  &--logout {
    margin-top: auto;
    opacity: 0.5;
    &:hover { opacity: 1; background: rgba($alert-error, 0.15); color: $alert-error; }
  }
}

/* ─── Overlay ─── */
.app-overlay {
  display: none;
  position: fixed;
  inset: 0;
  z-index: 8;
  background: rgba(#000, 0.35);
}

/* ─── Topbar (mobile) ─── */
.app-topbar {
  display: none;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: $white;
  border-bottom: 1px solid #e0d8cf;
}
.app-topbar__menu {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  background: none;
  border: none;
  cursor: pointer;
  color: $primary-dark;
  font-size: 1.2rem;
}
.app-topbar__title {
  font-size: 0.85rem;
  font-weight: 700;
  color: $primary-dark;
}

/* ─── Main content ─── */
.app-main {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
}

.app-content {
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 0.75rem;
  padding: 1rem;
}
.app-content__bar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  h2 {
    font-size: 1rem;
    font-weight: 800;
    color: $primary-dark;
    margin: 0;
    i { margin-right: 0.4rem; color: $primary; }
  }
}
.app-content__pdf {
  width: 100%;
  flex: 1;
  border: none;
  border-radius: 0.5rem;
  background: $white;
  box-shadow: 0 1px 8px rgba(#000, 0.06);
  min-height: 70vh;
}

/* ─── Mobile ─── */
@media (max-width: 768px) {
  .app-sidebar {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    z-index: 9;
    transform: translateX(-100%);
    transition: transform 0.25s ease;
    &--open { transform: translateX(0); }
  }
  .app-overlay--visible { display: block; }
  .app-topbar { display: flex; }
  .app-content { padding: 0.75rem; }
  .app-content__pdf { display: none; }
  .app-btn--mobile {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.6rem 1.25rem;
    border: none;
    border-radius: 999px;
    background: $primary;
    color: $white;
    font-size: 0.82rem;
    font-weight: 800;
    text-decoration: none;
    cursor: pointer;
    &:hover { opacity: 0.85; }
  }
}
</style>
