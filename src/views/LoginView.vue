<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { getApiBaseUrl } from '@/config/environment'

const router = useRouter()
const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function handleLogin() {
  error.value = ''
  if (!email.value || !password.value) {
    error.value = 'Completá ambos campos'
    return
  }
  loading.value = true
  try {
    const baseUrl = getApiBaseUrl()
    const res = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value, password: password.value }),
    })
    const data = await res.json()
    if (!res.ok) {
      error.value = data.message || 'Error al iniciar sesión'
      return
    }
    localStorage.setItem('access_token', data.token)
    router.push('/app')
  } catch {
    error.value = 'Error de conexión'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="login-view">
    <div class="login-card">
      <div class="login-card__header">
        <span class="login-card__brand">SCARLETT CORDOVA</span>
        <h1 class="login-card__title">Iniciar sesión</h1>
        <p class="login-card__subtitle">Accedé a tu ebook y contenido exclusivo</p>
      </div>
      <form class="login-card__form" @submit.prevent="handleLogin">
        <label class="login-field">
          <span>Email</span>
          <input v-model="email" type="email" placeholder="tu@email.com" autocomplete="email" />
        </label>
        <label class="login-field">
          <span>Contraseña</span>
          <input v-model="password" type="password" placeholder="••••••••" autocomplete="current-password" />
        </label>
        <p v-if="error" class="login-error">{{ error }}</p>
        <button class="login-btn" type="submit" :disabled="loading">
          {{ loading ? 'Entrando...' : 'Entrar' }}
        </button>
      </form>
      <a class="login-back" href="/">← Volver al inicio</a>
    </div>
  </main>
</template>

<style lang="scss" scoped>
.login-view {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 100vh;
  padding: 2rem;
  background: $primary-surface;
}
.login-card {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 24rem;
  padding: 2.5rem;
  border-radius: 1.25rem;
  background: $white;
  box-shadow: 0 4px 24px rgba(0,0,0,0.06);
}
.login-card__header {
  text-align: center;
  margin-bottom: 1.75rem;
}
.login-card__brand {
  font-size: 0.68rem;
  font-weight: 900;
  letter-spacing: 0.12em;
  color: $primary;
}
.login-card__title {
  font-size: 1.5rem;
  font-weight: 800;
  color: $primary-dark;
  margin: 0.5rem 0 0.25rem;
}
.login-card__subtitle {
  font-size: 0.85rem;
  color: $text-secondary;
  margin: 0;
}
.login-card__form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.login-field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  span {
    font-size: 0.78rem;
    font-weight: 700;
    color: $primary-dark;
  }
  input {
    padding: 0.75rem 1rem;
    border: 1px solid #e0d8cf;
    border-radius: 0.625rem;
    background: $white;
    font-size: 0.9rem;
    outline: none;
    transition: border-color 0.2s;
    &:focus { border-color: $primary; }
  }
}
.login-error {
  margin: 0;
  padding: 0.65rem 0.85rem;
  border-radius: 0.5rem;
  background: $alert-error-bg;
  color: $alert-error;
  font-size: 0.8rem;
  text-align: center;
}
.login-btn {
  padding: 0.85rem;
  border: none;
  border-radius: 999px;
  background: $primary;
  color: $white;
  font-size: 0.9rem;
  font-weight: 800;
  cursor: pointer;
  transition: opacity 0.2s;
  &:hover:not(:disabled) { opacity: 0.85; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
}
.login-back {
  margin-top: 1rem;
  text-align: center;
  font-size: 0.82rem;
  color: $text-secondary;
  text-decoration: none;
  &:hover { color: $primary-dark; }
}
</style>
