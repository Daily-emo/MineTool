<template>
  <div class="sys-shell">
    <!-- 首页的背景图与渐变参数，绝不叠加旧版 sys 的白色遮罩。 -->
    <div class="sys-home-background" aria-hidden="true"></div>
    <header class="site-nav">
      <div class="nav-inner">
        <a class="nav-left" href="/" aria-label="返回密码的工具箱首页">
          <img class="nav-logo" src="/img/icon/favicon.png" alt="" width="19" height="21" />
          <span class="nav-title">密码的工具箱</span>
        </a>
        <div class="nav-vip">
          <nav class="nav-right" aria-label="网站导航">
            <!-- 本页就是"系统镜像"，导航里不再重复放一个指向自己的"系统镜像"，
                 改为"回到主页"；另一个入口是"下载远程"。 -->
            <a class="nav-link" href="/">回到主页</a>
          </nav>
        </div>
      </div>
    </header>

    <main class="sys-content">
      <!-- 延用原有的 sys-toolbar；只替换架构选择器。 -->
      <section class="sys-toolbar" aria-label="镜像筛选条件">
        <div class="sys-tabs" role="group" aria-label="系统分类">
          <button v-for="tab in tabs" :key="tab.key" class="sys-tab" type="button"
            :class="{'is-active': activeFamily === tab.key}" :aria-pressed="activeFamily === tab.key"
            @click="activeFamily = tab.key">
            {{ tab.label }} <span class="sys-tab-count">{{ tab.count }}</span>
          </button>
        </div>
        <div class="sys-toolbar-divider"></div>
        <div class="sys-filters">
          <label class="sys-search">
            <svg class="sys-search-icon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="10.7" cy="10.7" r="6.7"/><path d="m16 16 5 5"/></svg>
            <input v-model="searchQuery" type="search" autocomplete="off" aria-label="搜索系统镜像" placeholder="搜索系统名称、版本或用途..." />
          </label>
          <div ref="architectureBox" class="sys-selectbox" @keydown="onArchitectureKeydown">
            <button ref="architectureTrigger" type="button" class="sys-select-trigger"
              aria-label="按处理器架构筛选" aria-haspopup="listbox" :aria-expanded="architectureOpen"
              aria-controls="sys-architecture-options" @click="toggleArchitecture">
              <span>{{ currentArchitecture.label }}</span>
              <svg class="sys-select-chevron" :class="{'is-open': architectureOpen}" aria-hidden="true" viewBox="0 0 20 20" fill="none"><path d="m5 7.5 5 5 5-5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
            <Transition name="sys-dropdown">
              <div v-if="architectureOpen" id="sys-architecture-options" class="sys-select-panel" role="listbox" aria-label="处理器架构">
                <button v-for="option in architectureOptions" :key="option.value" type="button"
                  class="sys-select-option" role="option" :aria-selected="activeArchitecture === option.value"
                  :class="{'is-selected': activeArchitecture === option.value}" tabindex="-1"
                  @click="chooseArchitecture(option.value)">
                  <span>{{ option.label }}</span>
                  <svg v-if="activeArchitecture === option.value" class="sys-select-check" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="m4 10 4 4 8-8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /></svg>
                </button>
              </div>
            </Transition>
          </div>
        </div>
      </section>

      <!-- 与 docs/index.md 同样的卡片 DOM、类名、尺寸、背景和内部排版 -->
      <section v-if="catalogLoading" class="sys-loading" role="status" aria-live="polite">正在加载系统镜像…</section>
      <section v-else-if="catalogError" class="sys-empty" role="alert">
        <p class="sys-empty-title">系统资源暂时无法加载</p>
        <p>{{ catalogError }}</p>
        <button type="button" class="sys-retry" @click="loadCatalog">重新加载</button>
      </section>
      <section v-else-if="visibleImages.length" class="card-container" aria-label="系统镜像列表">
        <div v-for="(item, index) in visibleImages" :key="item.id"
          class="tool-card" role="button" tabindex="0"
          :aria-label="`查看 ${item.title} 的镜像详情`"
          @click="openDetails(item.id, $event)"
          @keydown.enter.prevent="openDetails(item.id, $event)"
          @keydown.space.prevent="openDetails(item.id, $event)">
          <div class="card-cover">
            <picture v-if="item.cover">
              <source v-if="item.coverWebp" :srcset="item.coverWebp" type="image/webp" />
              <img :src="item.cover" :alt="item.title" width="560" height="332"
                :loading="index < 4 ? 'eager' : 'lazy'" :fetchpriority="index === 0 ? 'high' : undefined" decoding="async" />
            </picture>
            <div v-else class="sys-cover-placeholder" :class="`sys-placeholder-${item.tone}`" aria-hidden="true">
              <span>{{ item.placeholderLabel }}</span>
              <small>封面待添加</small>
            </div>
          </div>
          <div class="card-title"><b>{{ item.title }}</b></div>
          <div class="card-meta">
            <div class="meta-left">
              <img class="tag-svg" src="/img/icon/tag.svg" alt="" width="16" height="16" />
              <span>{{ item.type }}</span>
              <span class="meta-dot">·</span>
              <span class="meta-version">{{ item.version }}</span>
            </div>
            <span class="meta-date">{{ item.date }}</span>
          </div>
          <div class="card-tag">{{ item.tag }}</div>
          <div class="card-author">
            <div class="author-avatar">
              <img :src="item.avatar || '/img/avatar/jwxz.jpg'" alt="" width="42" height="42" :loading="index < 4 ? 'eager' : 'lazy'" decoding="async" />
            </div>
            <div class="author-info">
              <div class="name">{{ item.author || '皆为序章' }}<img v-if="item.isVip" class="vip-svg" src="/img/icon/VIP.svg" alt="VIP 标识" /></div>
              <div class="desc">{{ item.desc }}</div>
            </div>
          </div>
        </div>
      </section>
      <section v-else class="sys-empty" aria-live="polite">
        <p class="sys-empty-title">没有找到匹配的镜像</p>
        <p>试试其他关键词、系统分类或架构。</p>
      </section>
    </main>

    <dialog ref="detailDialog" class="sys-dialog" :class="{ 'is-closing': dialogClosing }"
      @click="onDialogClick" @cancel.prevent="closeDetails" @close="onDialogClose" aria-label="镜像详情">
      <template v-if="selectedImage">
        <div class="sys-dialog-header">
          <div>
            <p class="sys-dialog-eyebrow">系统镜像详情 · {{ familyName(selectedImage.family) }}</p>
            <h2 class="sys-dialog-title">{{ selectedImage.title }}</h2>
            <p class="sys-dialog-subtitle">{{ selectedImage.subtitle }}</p>
          </div>
          <!-- 关闭按钮：内嵌 SVG 画叉，线条两端是圆头（stroke-linecap:round），
               图形本身对 24×24 视框中心严格对称，hover 旋转 90° 时是绕着中心转的，
               不会再出现"叉叉偏心、转起来晃"的问题。 -->
          <button ref="closeButton" class="sys-close" type="button" @click="closeDetails" aria-label="关闭镜像详情">
            <svg class="sys-close-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M6.6 6.6 17.4 17.4 M17.4 6.6 6.6 17.4" fill="none" stroke="currentColor"
                stroke-width="2.2" stroke-linecap="round" />
            </svg>
          </button>
        </div>
        <div class="sys-dialog-content">
          <div class="sys-badge-row">
            <span class="sys-info-badge">{{ selectedImage.version }}</span>
            <span class="sys-info-badge">{{ selectedImage.format }}</span>
            <span class="sys-info-badge">{{ selectedImage.architecture }}</span>
          </div>
          <p class="sys-dialog-intro">{{ selectedImage.description }}</p>
          <div class="sys-detail-grid">
            <div><div class="sys-detail-key">镜像版本</div><div class="sys-detail-value">{{ selectedImage.version }}</div></div>
            <div><div class="sys-detail-key">处理器架构</div><div class="sys-detail-value">{{ selectedImage.architecture }}</div></div>
            <div><div class="sys-detail-key">镜像格式</div><div class="sys-detail-value">{{ selectedImage.format }}</div></div>
            <div><div class="sys-detail-key">下载来源</div><div class="sys-detail-value">{{ selectedImage.source }}</div></div>
          </div>
          <h3 class="sys-section-head">下载入口</h3>
          <div class="sys-download-actions">
            <a v-for="link in selectedImage.downloadLinks" :key="link.url" class="sys-download-btn"
              :href="link.url" target="_blank" rel="noopener noreferrer">{{ link.label }} <span aria-hidden="true">↗</span></a>
            <p v-if="!selectedImage.downloadLinks?.length" class="sys-dialog-intro">下载链接待配置。</p>
          </div>
          <p v-if="selectedImage.note" class="sys-dialog-note">{{ selectedImage.note }}</p>
        </div>
      </template>
    </dialog>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted, onBeforeUnmount } from 'vue'
// The single source of truth lives at docs/public/json/sys.json.
// 构建期直接导入：SSR 出来的 HTML 就带完整镜像列表，首屏不用等 fetch，
// 也不会出现"正在加载… -> 卡片突然插入"的布局跳动。
import sysCatalog from '../public/json/sys.json'

const pickValid = (list) => (Array.isArray(list) ? list : [])
  .filter(item => item && typeof item === 'object' && item.id && item.title)

const catalog = ref(pickValid(sysCatalog))
const catalogLoading = ref(false)
const catalogError = ref('')
let catalogRequest = null
// 仅在极端情况下（数据异常）才用得到的兜底重载，正常路径不会走到这里。
async function loadCatalog() {
  if (catalogRequest) catalogRequest.abort()
  const request = new AbortController()
  catalogRequest = request
  catalogLoading.value = true
  catalogError.value = ''
  try {
    const response = await fetch('/json/sys.json', { signal: request.signal })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const data = await response.json()
    if (!Array.isArray(data)) throw new Error('sys.json 格式应为数组')
    catalog.value = pickValid(data)
  } catch (error) {
    if (error.name === 'AbortError') return
    catalog.value = []
    catalogError.value = '请确认 docs/public/json/sys.json 已部署，再检查网络连接。'
    console.error('MineTool: 系统镜像数据加载失败', error)
  } finally {
    if (catalogRequest === request) {
      catalogRequest = null
      catalogLoading.value = false
    }
  }
}
const familyOptions = [
  { key: 'all', label: '全部系统' },
  { key: 'Windows', label: 'Windows' },
  { key: 'PE', label: 'PE 工具' },
  { key: 'Linux', label: 'Linux' }
]
const architectureOptions = [
  { value: 'all', label: '全部架构' },
  { value: 'x64', label: 'x64 (64 位)' },
  { value: 'ARM64', label: 'ARM64' },
  { value: 'x86', label: 'x86 (32 位)' }
]
const activeFamily = ref('all')
const activeArchitecture = ref('all')
const searchQuery = ref('')
const architectureOpen = ref(false)
const architectureBox = ref(null)
const architectureTrigger = ref(null)
const selectedId = ref('')
const dialogClosing = ref(false)
let dialogCloseTimer = null
let lastDialogTrigger = null
const detailDialog = ref(null)
const closeButton = ref(null)

const tabs = computed(() => familyOptions.map(item => ({
  ...item,
  count: item.key === 'all' ? catalog.value.length : catalog.value.filter(entry => entry.family === item.key).length
})))
const currentArchitecture = computed(() => architectureOptions.find(option => option.value === activeArchitecture.value) || architectureOptions[0])
const visibleImages = computed(() => {
  const query = searchQuery.value.trim().toLocaleLowerCase()
  return catalog.value.filter(item => {
    if (activeFamily.value !== 'all' && item.family !== activeFamily.value) return false
    if (activeArchitecture.value !== 'all' && !(Array.isArray(item.architectures) ? item.architectures : []).includes(activeArchitecture.value)) return false
    if (!query) return true
    const haystack = [item.title, item.subtitle, item.version, item.architecture, item.description, item.source, item.tag, item.author, item.desc].join(' ').toLocaleLowerCase()
    return haystack.includes(query)
  })
})
const selectedImage = computed(() => catalog.value.find(item => item.id === selectedId.value) || null)
function familyName(key) { return familyOptions.find(item => item.key === key)?.label || key }
function toggleArchitecture() { architectureOpen.value = !architectureOpen.value }
function chooseArchitecture(value) {
  activeArchitecture.value = value
  architectureOpen.value = false
  architectureTrigger.value?.focus({ preventScroll: true })
}
function onOutsidePointer(event) {
  if (architectureOpen.value && architectureBox.value && !architectureBox.value.contains(event.target)) architectureOpen.value = false
}
function optionButtons() { return [...(architectureBox.value?.querySelectorAll('.sys-select-option') || [])] }
async function onArchitectureKeydown(event) {
  if (event.key === 'Escape' && architectureOpen.value) {
    event.preventDefault()
    architectureOpen.value = false
    architectureTrigger.value?.focus({ preventScroll: true })
    return
  }
  if (event.key === 'Tab') { architectureOpen.value = false; return }
  if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp' && event.key !== 'Home' && event.key !== 'End') return
  event.preventDefault()
  if (!architectureOpen.value) {
    architectureOpen.value = true
    await nextTick()
    const options = optionButtons()
    const selected = architectureOptions.findIndex(item => item.value === activeArchitecture.value)
    options[Math.max(0, selected)]?.focus()
    return
  }
  const options = optionButtons()
  if (!options.length) return
  const current = options.indexOf(document.activeElement)
  const next = event.key === 'Home' ? 0 : event.key === 'End' ? options.length - 1
    : event.key === 'ArrowDown' ? (current + 1 + options.length) % options.length
      : (current - 1 + options.length) % options.length
  options[next]?.focus()
}
async function openDetails(id, event) {
  if (dialogCloseTimer !== null) {
    clearTimeout(dialogCloseTimer)
    dialogCloseTimer = null
  }
  dialogClosing.value = false
  lastDialogTrigger = event?.currentTarget || document.activeElement
  selectedId.value = id
  architectureOpen.value = false
  await nextTick()
  if (detailDialog.value && !detailDialog.value.open) {
    detailDialog.value.showModal()
    await nextTick()
    closeButton.value?.focus({ preventScroll: true })
  }
}
function closeDetails() {
  if (!detailDialog.value?.open || dialogClosing.value) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    detailDialog.value.close()
    return
  }
  dialogClosing.value = true
  // Native dialog.close() is immediate; wait for the CSS closing animation.
  dialogCloseTimer = window.setTimeout(() => {
    dialogCloseTimer = null
    detailDialog.value?.close()
  }, 190)
}
function onDialogClose() {
  if (dialogCloseTimer !== null) {
    clearTimeout(dialogCloseTimer)
    dialogCloseTimer = null
  }
  dialogClosing.value = false
  selectedId.value = ''
  lastDialogTrigger?.focus?.({ preventScroll: true })
  lastDialogTrigger = null
}
function onDialogClick(event) { if (event.target === detailDialog.value) closeDetails() }
onMounted(() => {
  document.addEventListener('pointerdown', onOutsidePointer)
})
onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', onOutsidePointer)
  if (catalogRequest) catalogRequest.abort()
  if (dialogCloseTimer !== null) clearTimeout(dialogCloseTimer)
  lastDialogTrigger = null
  if (detailDialog.value?.open) detailDialog.value.close()
})
</script>

<style scoped>
/* 首页 html 使用 scrollbar-gutter:stable：系统页也始终预留滚动条槽位。
   overflow-y:scroll 防止筛选到零条时滚动条忽隐忽现。 */
:global(html) { scrollbar-gutter: stable; overflow-x: hidden; overflow-y: scroll; }
.sys-shell { min-height: 100vh; color: #222; }
.sys-shell, .sys-shell * { box-sizing: border-box; }
.sys-shell button, .sys-shell input { font-family: inherit; }
/* 主页级背景：与 docs/index.md 的 body::before 保持一致。
   要点：
   1. 原写法用的是外部站点 www.shiratamaco.com 上的 527KB 原图，那台机器没有 CDN、
      也没有 Cache-Control，单次下载实测要 10~45 秒 —— 已改为站内
      /img/bg/background.avif（80KB，走 Cloudflare 边缘 + 30 天缓存）。
   2. 背景图只有一层、上面不叠白纱：图一上屏就是原图；图没下完/加载失败时露出
      background-color 的冰蓝底色（background-color 永远垫在所有 image 图层下面）。 */
.sys-home-background {
  position: fixed; inset: 0; pointer-events: none; z-index: 0;
  background-color: #dbe9f8;
  background-image: url("/img/bg/background.avif");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
.sys-content { position:relative; z-index:1; width:1200px; margin:0 auto; padding:80px 0 48px; }
.sys-shell a { text-decoration: none; }
.sys-shell .nav-left { text-decoration:none; }
/* 下方原样拷贝 docs/index.md 的导航与卡片样式；不引入 sys 专属的卡片样式。 */
.site-nav {
  width: 100%;
  height: 50px;
  background-color: rgba(255, 255, 255, 0.5);
  box-shadow: 2px 4px 4px rgba(0,0,0,0.07);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
}
.nav-inner {
  width: 1150px;
  height: 50px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.nav-left {
  display: flex;
  align-items: center;
}
.nav-logo {
  width: 19px;
  height: 21px;
  margin-right: 8px;
}
.nav-title {
  font-size: 16px;
  color: #333;
  font-weight: 500;
}
.nav-vip {
  display: flex;
  align-items: center;
  gap: 12px;
}
.nav-right {
  display: flex;
  align-items: center;
  gap: 16px;
}
.nav-vip-icon {
  width:24px;
  height:24px;
}
.nav-link {
  display: inline-flex;
  align-items: center;
  color: #4FAAFF;
  text-decoration: none;
  font-size: 16px;
  cursor: pointer;
}
/* 卡片容器 */
.card-container {
  width: 1200px;
  margin: 80px auto;
  height: auto;
}
@media (max-width: 1220px) {
  .card-container { width: 900px; }
  .nav-inner { width: 85vw; }
}
@media (max-width: 920px) {
  .card-container { width: 600px; }
}
@media (max-width: 620px) {
  .card-container { width: 300px; }
}
.tool-card {
  width: 280px;
  height: 320px;
  float: left;
  margin: 0 10px 30px 10px;
  background-color: rgba(255, 255, 255, 0.35);
  box-shadow: 4px 4px 4px rgba(50,50,50,0.08);
  backdrop-filter: blur(3px);
  -webkit-backdrop-filter: blur(3px);
  border-radius: 23px;
  overflow: hidden;
  transition: transform 0.3s ease;
  cursor: pointer;
  text-decoration: none;
  color: inherit;
  display: block;
  outline: none;
}
.tool-card:hover, .tool-card:focus {
  transform: translateY(-10px);
}
.card-cover {
  width: 100%;
  height: 166px;
}
.card-cover picture {
  display: block;
  width: 100%;
  height: 100%;
}
.card-cover img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.card-title {
  padding: 10px 16px 4px;
  font-size: 16px;
  color: #222;
}
.card-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 14px 0 18px;
}
.meta-left {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  color: #7B7979;
}
.meta-dot {
  font-size: 14px;
  color: #7B7979;
  line-height: 1;
  margin: 0 2px;
}
.meta-version {
  font-size: 14px;
  color: #7B7979;
  white-space: nowrap;
  letter-spacing: 0.8px;
}

.tag-svg {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}
.meta-date {
  font-size: 14px;
  color: #7B7979;
  letter-spacing: 0.5px;
}
.card-tag {
  padding: 1px 20px;
  font-size: 14px;
  color: #0f52ba;
}
.card-author {
  width: 100%;
  padding: 4px 18px 14px 18px;
  display: flex;
  align-items: center;
  gap: 10px;
}
.author-avatar {
  width: 42px;
  height: 42px;
  border-radius: 21px;
  overflow: hidden;
  background: #e5e6eb;
}
.author-avatar img{
  width:100%;
  height:100%;
  object-fit:cover;
}
.author-info .name {
  font-size: 14px;
  color: #333;
  display: flex;
  align-items: center;
  gap: 2px;
}
.vip-svg {
  width: 24px;
  height: 24px;
  transform: translateY(-1px);
}
.author-info .desc {
  font-size: 15px;
  color: #222;
  font-weight: bold;
}
/* 浮动排列由主页决定；这里仅做清除浮动以使下方内容可正常布局。 */
.card-container::after { content:""; display:table; clear:both; }
.sys-content .card-container { margin: 0 auto 56px; }
.sys-cover-placeholder {
  height:100%; width:100%; display:flex; flex-direction:column; align-items:center; justify-content:center;
  background:linear-gradient(135deg,#d7e4f1,#d0e0ef 52%,#c3d4e6); color:#507293;
}
.sys-cover-placeholder span { font-size:21px; font-weight:650; letter-spacing:.01em; }
.sys-cover-placeholder small { margin-top:8px; font-size:11px; letter-spacing:.06em; opacity:.65; }
.sys-placeholder-win11 { background:linear-gradient(135deg,#d2e6fa,#c1d8f1 58%,#b5cce7); }
.sys-placeholder-win10 { background:linear-gradient(135deg,#d4e8f1,#bfdae5 58%,#b0cede); }
.sys-placeholder-wepe { background:linear-gradient(135deg,#d3ebdf,#c6e2d8 58%,#b5d3cf); }
.sys-placeholder-centos { background:linear-gradient(135deg,#e5dced,#d9d5e7 58%,#c9cce3); }
.sys-shell .tool-card:focus-visible { outline:2px solid #67aaf5; outline-offset:3px; }
/* 工具条本身外观不变：保留前一版 1160px 内容区布局。 */
.sys-content .sys-toolbar { position:relative; z-index:10; margin-left:20px; margin-right:20px; }
.sys-toolbar { padding:17px 18px 15px; background:rgba(255,255,255,.45); border:1px solid rgba(255,255,255,.7); box-shadow:0 10px 24px rgba(45,76,112,.05); -webkit-backdrop-filter:blur(5px); backdrop-filter:blur(5px); border-radius:20px; }
.sys-tabs { display:flex; gap:8px; align-items:center; flex-wrap:wrap; }
.sys-tab { border:1px solid transparent; border-radius:10px; padding:8px 15px; min-height:36px; color:#64748b; background:transparent; font-size:13px; cursor:pointer; transition:background .18s,color .18s, border-color .18s, transform .18s; }
.sys-tab:hover { background:rgba(255,255,255,.5); color:#296eaf; }
.sys-tab.is-active { background:rgba(74,153,233,.12); border-color:rgba(65,148,230,.19); color:#2679c8; font-weight:650; }
.sys-tab-count { opacity:.68; font-size:11px; margin-left:5px; }
.sys-toolbar-divider { height:1px; margin:13px 0; background:rgba(121,154,183,.14); }
.sys-filters { display:flex; gap:10px; flex-wrap:wrap; align-items:center; }
.sys-search { flex:1 1 280px; min-width:180px; position:relative; }
.sys-search-icon { position:absolute; left:14px; top:50%; transform:translateY(-50%); color:#8798ab; width:16px; height:16px; pointer-events:none; }
.sys-search input, .sys-select-trigger { width:100%; outline:none; border:1px solid rgba(133,157,181,.22); border-radius:11px; height:42px; background:rgba(255,255,255,.58); color:#334155; transition:border-color .18s, box-shadow .18s; }
.sys-search input { padding:0 16px 0 39px; font-size:13px; }
.sys-search input::placeholder { color:#94a3b8; }
.sys-search input:focus, .sys-select-trigger:focus-visible { border-color:#80b7ef; box-shadow:0 0 0 3px rgba(80,158,232,.11); }

/* 非原生架构选择：与搜索框等高的磨砂触发盒 + 带动效的下拉面板 */
.sys-selectbox { width:168px; flex:0 0 168px; position:relative; z-index:20; }
.sys-select-trigger {
  display:flex; justify-content:space-between; align-items:center; gap:8px;
  width:100%; height:42px; padding:0 12px; outline:none;
  border:1px solid rgba(133,157,181,.22); border-radius:11px;
  background:rgba(255,255,255,.58); color:#334155;
  -webkit-backdrop-filter:blur(10px); backdrop-filter:blur(10px);
  cursor:pointer; font-size:13px; text-align:left;
  transition:border-color .18s,box-shadow .18s,background .18s;
}
.sys-select-trigger:hover { background:rgba(255,255,255,.7); }
.sys-select-trigger:focus-visible { border-color:#80b7ef; box-shadow:0 0 0 3px rgba(80,158,232,.11); }
.sys-select-chevron { width:18px; height:18px; flex-shrink:0; color:#8594a6; backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);transition:transform .22s cubic-bezier(.2,.7,.2,1); }
.sys-select-chevron.is-open { transform:rotate(180deg); }
.sys-select-panel {
  position:absolute; top:calc(100% + 7px); left:0; width:100%; z-index:30;
  box-sizing:border-box; padding:6px; border:1px solid rgba(255,255,255,.7); border-radius:14px;
  background:rgba(255,255,255,.45); -webkit-backdrop-filter:blur(5px); backdrop-filter:blur(5px);
  box-shadow:0 10px 24px rgba(45,76,112,.05);
  transform-origin:top right;
}
.sys-select-option {
  display:flex; align-items:center; justify-content:space-between; gap:10px; width:100%; padding:10px 11px;
  border:0; border-radius:9px; background:transparent; color:#56667b; font-size:13px; text-align:left;
  cursor:pointer; transition:background .16s,color .16s;
}
.sys-select-option:hover, .sys-select-option:focus-visible { color:#2479c5; background:rgba(255,255,255,.62); outline:none; }
.sys-select-option.is-selected { color:#2479c5; background:rgba(71,153,231,.12); font-weight:600; }
.sys-select-check { width:17px; height:17px; flex-shrink:0; }
.sys-dropdown-enter-active { transition:opacity .22s ease,transform .22s cubic-bezier(.2,.8,.2,1); }
.sys-dropdown-leave-active { transition:opacity .16s ease,transform .16s ease; }
.sys-dropdown-enter-from, .sys-dropdown-leave-to { opacity:0; transform:translateY(-8px) scale(.97); }
/* 与旧版结果统计栏相同的间隔只留在卡片容器，避免多余文字占位。 */
.sys-content .card-container { margin-top:24px; }
.sys-loading { margin:24px 20px; min-height:320px; color:#536477; font-size:14px; }
.sys-retry { margin-top:14px; padding:9px 15px; border:1px solid rgba(72,141,205,.3); border-radius:10px; background:rgba(255,255,255,.45); color:#2e78b9; cursor:pointer; }
.sys-empty { margin:25px 0; border-radius:20px; background:rgba(255,255,255,.49); text-align:center; padding:52px 20px; color:#748396; }
.sys-empty-title { font-size:17px; font-weight:650; color:#334155; margin:0 0 8px; }
.sys-bottom-tips { display:flex; flex-wrap:wrap; gap:12px 28px; color:#75879b; font-size:12px; border-top:1px solid rgba(133,157,181,.2); margin-top:32px; padding:20px 2px; }
.sys-bottom-tips span { display:inline-flex; gap:7px; align-items:center; }
.sys-tick { color:#51a99a; font-weight:bold; }
/* 浅色毛玻璃详情页：15% 中性灰遮罩，绝不使用半黑背景。 */
.sys-dialog {
  width:min(560px,calc(100vw - 28px)); max-height:min(84vh,760px); padding:0; overflow:auto;
  /* 屏幕居中：index.md 里全局的 `* { margin:0 }` 会把 <dialog> 的 UA 默认 `margin:auto`
     一起清掉，弹窗就贴到左上角了。这里显式写回 inset:0 + margin:auto，
     并给一个明确高度（fit-content），纵向的 auto 外边距才生效 —— 双轴居中。 */
  position:fixed; inset:0; margin:auto; height:fit-content;
  color:#304055; border:1px solid rgba(255,255,255,.72); border-radius:23px;
  background:rgba(248,251,255,.66);
  -webkit-backdrop-filter:blur(22px) saturate(125%); backdrop-filter:blur(22px) saturate(125%);
  box-shadow:0 22px 70px rgba(31,53,79,.13), inset 0 1px 0 rgba(255,255,255,.48);
  overscroll-behavior:contain;
}
.sys-dialog::backdrop {
  background:rgba(90,96,105,.15);
  -webkit-backdrop-filter:blur(5px); backdrop-filter:blur(5px);
}
@keyframes sys-dialog-enter { from { opacity:0; transform:translateY(18px) scale(.978); } to { opacity:1; transform:translateY(0) scale(1); } }
@keyframes sys-dialog-exit { from { opacity:1; transform:translateY(0) scale(1); } to { opacity:0; transform:translateY(8px) scale(.99); } }
@keyframes sys-backdrop-enter { from { background:rgba(90,96,105,0); -webkit-backdrop-filter:blur(0); backdrop-filter:blur(0); } to { background:rgba(90,96,105,.15); -webkit-backdrop-filter:blur(5px); backdrop-filter:blur(5px); } }
@keyframes sys-backdrop-exit { to { background:rgba(90,96,105,0); -webkit-backdrop-filter:blur(0); backdrop-filter:blur(0); } }
.sys-dialog[open]:not(.is-closing) { animation:sys-dialog-enter .28s cubic-bezier(.18,.7,.2,1) both; }
.sys-dialog[open]:not(.is-closing)::backdrop { animation:sys-backdrop-enter .28s ease-out both; }
.sys-dialog.is-closing { animation:sys-dialog-exit .19s cubic-bezier(.45,0,1,1) both; }
.sys-dialog.is-closing::backdrop { animation:sys-backdrop-exit .19s ease-in both; }
.sys-dialog-header { padding:25px 26px 18px; display:flex; justify-content:space-between; gap:12px; align-items:flex-start; border-bottom:1px solid rgba(255,255,255,.44); }
.sys-dialog-eyebrow { font-size:12px; color:#4688c3; letter-spacing:.04em; margin:0 0 5px; }
.sys-dialog-title { margin:0; color:#1f3046; font-size:25px; line-height:1.3; }
.sys-dialog-subtitle { margin:5px 0 0; color:#7d8ca0; font-size:13px; }
.sys-close { width:32px; height:32px; flex-shrink:0; display:grid; place-items:center; padding:0; line-height:0; border:1px solid rgba(255,255,255,.56); border-radius:10px; cursor:pointer; background:rgba(255,255,255,.40); color:#63758c; transition:background .18s,transform .18s; }
.sys-close-icon { width:14px; height:14px; display:block; }
.sys-close:hover { background:rgba(255,255,255,.70); transform:rotate(90deg); }
.sys-shell .sys-close:focus-visible { outline:2px solid #67aaf5; outline-offset:2px; }
.sys-dialog-content { padding:20px 26px 26px; }
.sys-badge-row { display:flex; flex-wrap:wrap; gap:7px; margin-bottom:17px; }
.sys-info-badge { padding:6px 10px; border-radius:8px; color:#43789e; background:rgba(225,238,252,.62); font-size:12px; }
.sys-dialog-intro { font-size:13px; color:#56667d; line-height:1.8; margin:0 0 20px; }
.sys-detail-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:14px; padding:17px; background:rgba(255,255,255,.32); border:1px solid rgba(255,255,255,.42); border-radius:13px; }
.sys-detail-key { color:#91a0b0; font-size:11px; margin-bottom:4px; }
.sys-detail-value { color:#32455e; font-size:13px; word-wrap:break-word; }
.sys-section-head { margin:22px 0 11px; font-size:14px; font-weight:680; color:#314158; }
.sys-download-actions { display:grid; gap:9px; }
.sys-download-btn { min-height:46px; border-radius:11px; background:#4f9de6; color:white; text-decoration:none; font-size:14px; font-weight:620; display:flex; align-items:center; justify-content:center; gap:9px; padding:11px 16px; transition:background .2s, transform .2s; }
.sys-download-btn:hover { color:white; background:#3584d3; transform:translateY(-1px); }
.sys-dialog-note { margin:14px 0 0; padding:12px 13px; border-left:3px solid rgba(222,163,77,.75); background:rgba(255,248,230,.52); border-radius:6px 9px 9px 6px; color:#806643; font-size:12px; line-height:1.75; }
.sys-hash { font-size:12px; color:#68778a; word-break:break-all; background:#f5f8fb; border-radius:9px; padding:12px; }

@media (max-width:1220px) { .sys-content { width:900px; } }
@media (max-width:920px) { .sys-content { width:600px; } }
@media (max-width:620px) {
  .sys-content { width:300px; padding-top:74px; }
  .sys-shell .nav-inner { width:calc(100% - 24px); }
  .sys-content .sys-toolbar { width:calc(100vw - 32px); margin-left:50%; margin-right:0; transform:translateX(-50%); padding:13px; }
  .sys-tab { padding:7px 10px; font-size:12px; }
  .sys-search { flex:1 1 100%; }
  .sys-selectbox { width:100%; flex:1 1 100%; }
  .sys-dialog-header { padding:20px 18px 14px; }
  .sys-dialog-content { padding:17px 18px 20px; }
  .sys-dialog-title { font-size:22px; }
}
@media (max-width:370px) {
  .sys-shell .nav-right { gap:6px; }
  .sys-shell .nav-link { font-size:11px; }
  .sys-shell .nav-title { font-size:12px; }
  .sys-shell .nav-logo { margin-right:4px; }
}
@media (prefers-reduced-motion: reduce) {
  .sys-shell *, .sys-shell *::before, .sys-shell *::after,
  .sys-dialog, .sys-dialog::backdrop { animation:none !important; transition:none !important; }
}
</style>
