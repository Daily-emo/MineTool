<template>
  <header class="site-nav">
    <div class="nav-inner">
      <a class="nav-left" :href="homeHref" :aria-label="homeLabel">
        <img
          class="nav-logo"
          src="/img/icon/favicon.png"
          alt=""
          width="19"
          height="21"
          decoding="async"
        />
        <span class="nav-title">{{ title }}</span>
      </a>

      <div class="nav-vip">
        <slot name="badge" />
        <nav class="nav-right" aria-label="网站导航">
          <slot />
        </nav>
      </div>
    </div>
  </header>
</template>

<script setup>
defineProps({
  homeHref: {
    type: String,
    default: '/'
  },
  homeLabel: {
    type: String,
    default: '返回密码的工具箱首页'
  },
  title: {
    type: String,
    default: '密码的工具箱'
  }
})
</script>

<style scoped>
.site-nav {
  position: fixed;
  inset: 0 0 auto;
  z-index: 9999;
  box-sizing: border-box;
  width: 100%;
  height: 50px;
  background: rgba(255, 255, 255, 0.5);
  box-shadow: 2px 4px 4px rgba(0, 0, 0, 0.07);
  -webkit-backdrop-filter: blur(8px);
  backdrop-filter: blur(8px);
}

.nav-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  width: 1150px;
  max-width: calc(100% - 40px);
  height: 50px;
  min-width: 0;
  margin: 0 auto;
  box-sizing: border-box;
}

.nav-left {
  display: inline-flex;
  align-items: center;
  flex: 0 0 auto;
  gap: 8px;
  min-width: 0;
  color: #333;
  text-decoration: none;
  white-space: nowrap;
  -webkit-tap-highlight-color: transparent;
}

.nav-logo {
  display: block;
  flex: 0 0 19px;
  width: 19px;
  height: 21px;
  min-width: 19px;
  margin: 0;
  object-fit: contain;
  object-position: center;
  aspect-ratio: 19 / 21;
  transform: none;
}

.nav-title {
  display: block;
  flex: 0 0 auto;
  color: #333;
  font-size: 16px;
  font-weight: 500;
  line-height: 20px;
  white-space: nowrap;
}

.nav-vip {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex: 0 0 auto;
  gap: 12px;
  min-width: 0;
}

:slotted(.nav-vip-icon) {
  display: block;
  flex: 0 0 24px;
  width: 24px;
  height: 24px;
  object-fit: contain;
}

.nav-right {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex: 0 0 auto;
  gap: 16px;
  min-width: 0;
  white-space: nowrap;
}

:slotted(.nav-link) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  min-height: 44px;
  padding: 0 1px;
  border: 0;
  border-radius: 5px;
  background: transparent;
  color: #1a5fa8;
  font-family: inherit;
  font-size: 16px;
  font-weight: 500;
  line-height: 20px;
  text-decoration: none;
  white-space: nowrap;
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  -webkit-tap-highlight-color: transparent;
  transition: color 0.18s ease;
}

.nav-left:focus-visible,
:slotted(.nav-link:focus-visible) {
  outline: 2px solid rgba(55, 132, 207, 0.8);
  outline-offset: 2px;
}

@media (hover: hover) and (pointer: fine) {
  :slotted(.nav-link:hover) {
    color: #0d3f74;
  }
}

@media (max-width: 1220px) {
  .nav-inner {
    width: 85vw;
    max-width: 85vw;
  }
}

@media (max-width: 620px) {
  .nav-inner {
    width: calc(100% - 28px);
    max-width: calc(100% - 28px);
    gap: 10px;
  }

  .nav-left {
    gap: 7px;
  }

  .nav-title {
    font-size: 14px;
    line-height: 20px;
  }

  .nav-vip {
    gap: 8px;
  }

  .nav-right {
    gap: 12px;
  }

  :slotted(.nav-link) {
    font-size: 13px;
    line-height: 18px;
  }
}
</style>
