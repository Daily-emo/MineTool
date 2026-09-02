---
layout: false
navbar: false
sidebar: false
aside: false
---

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
html {
  scrollbar-gutter: stable;
  overflow-x: hidden;
  -webkit-text-size-adjust: 100%;
  text-size-adjust: 100%;
}
body {
  background-color: #f3f4f8;
  height: auto;
}
img {
  user-drag: none;
  -webkit-user-drag: none;
  pointer-events: auto;
}
body {
  user-select: none;
  -webkit-user-select: none;
}
.site-nav {
  width: 100%;
  height: 50px;
  background: #fff;
  box-shadow: 2px 4px 4px rgba(0,0,0,0.07);
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
.nav-right {
  display: flex;
  align-items: center;
  gap: 8px;
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
  .card-container, .nav-inner { width: 900px; }
}
@media (max-width: 920px) {
  .card-container, .nav-inner { width: 600px; }
}
@media (max-width: 620px) {
  .card-container, .nav-inner { width: 300px; }
}
.tool-card {
  width: 280px;
  height: 320px;
  float: left;
  margin: 0 10px 30px 10px;
  background: #fff;
  border-radius: 23px;
  box-shadow: 0 1px 10px 1px rgba(0, 0, 0, 0.10);
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
  background: #f0f2f5;
}
.card-cover img {
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
.tag-svg {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}
.meta-date {
  font-size: 14px;
  color: #7B7979;
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
.notification {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 300px;
  max-width: 90vw;
  background: #fff;
  border-radius: 8px;
  box-shadow: 3px 4px 15px rgba(0,0,0,0.2);
  overflow: hidden;
  z-index: 9999;
  opacity: 0;
  transform: translateY(20px);
  pointer-events: none;
}
.notification.show{
  pointer-events: auto;
}
.notification-header {
  background: #3b82f6;
  color: white;
  padding: 8px 8px 6px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap:8px;
}
.notification-title-wrap{
  flex:1;
  display:flex;
  align-items:center;
  gap:12px;
}
.notification-title {
  font-weight: bold;
  font-size: 14px;
}
.notify-close-wrap{
  width:32px;
  height:32px;
  display:flex;
  align-items:center;
  justify-content:center;
  border-radius:4px;
  cursor:pointer;
  transition:background-color 0.2s;
}
.notify-close-wrap:hover{
  background-color:rgba(255,255,255,0.2);
}
.notification-content {
  padding: 16px;
  font-size: 14px;
  color: #333;
  line-height: 1.6;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes fadeOut {
  from { opacity: 1; transform: translateY(0); }
  to { opacity: 0; transform: translateY(20px); }
}
.fade-in {
  animation: fadeIn 0.6s ease forwards;
}
.fade-out {
  animation: fadeOut 0.8s ease forwards;
}

/* ===== 左下角公告：左间距20px + 左右内边距20px ===== */
.announce-wrap {
  position: fixed;
  bottom: calc( max( 29px, ((100vw - 1200px) / 2 - 380px) / 2 ) );
  left: calc( max( 29px, ((100vw - 1200px) / 2 - 380px) / 2 ) );
  z-index: 9997;
  width: calc(((100vw - 1200px) / 2) - 50px);
  min-width: 240px;
  max-width: 390px;
  transition: transform 0.6s ease, opacity 0.6s ease;
}
/* 点击收起：向左滑出 + 渐隐 */
.announce-wrap.folded {
  transform: translateX(calc(-100% - 20px));
  opacity: 0;
  pointer-events: none;
}
.announce-notification {
  width: 100%;
  background: #fff;
  border-radius: 8px;
  box-shadow: 3px 4px 15px rgba(0,0,0,0.2);
  overflow: hidden;
}
.announce-header {
  background: #3b82f6;
  color: white;
  padding: 8px 8px 6px 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap:8px;
}
.announce-title-wrap {
  flex:1;
  display:flex;
  align-items:center;
  gap:12px;
}
.announce-title {
  font-weight: bold;
  font-size: 14px;
}
.announce-close-wrap {
  width:32px;
  height:32px;
  display:flex;
  align-items:center;
  justify-content:center;
  border-radius:4px;
  cursor:pointer;
  transition:background-color 0.2s;
}
.announce-close-wrap:hover {
  background-color:rgba(255,255,255,0.2);
}
.announce-content {
  padding: 16px 20px;
  font-size: 14px;
  color: #333;
  line-height: 1.6;
  text-align: center;
}
.announce-content img {
  display: block;
  height: auto;
  max-width: 100%;
  margin: 0 auto 12px auto;
}

/* 适配卡片宽度断点：自动调整公告宽度 */
@media (max-width: 1520px) {
  .announce-wrap {
    width: calc((100vw - 900px) / 2);
  }
}
@media (max-width: 1220px) {
  .announce-wrap {
    width: calc((100vw - 600px) / 2);
  }
}
@media (max-width: 920px) {
  .announce-wrap {
    width: calc((100vw - 300px) / 2);
  }
}

/* 宽度不足160px时：自动隐藏，同收起动画 */
@media (max-width: 1800px) {
  .announce-wrap {
    transform: translateX(calc(-100% - 20px));
    opacity: 0;
    pointer-events: none;
  }
}
</style>

<!-- 左下角网站公告 -->
<div class="announce-wrap" :class="{folded: announceFolded}">
  <div class="announce-notification">
    <div class="announce-header">
      <div class="announce-title-wrap">
        <span class="announce-title">📢 网站公告</span>
      </div>
      <div class="announce-close-wrap" @click="announceToggle">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
          <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
            <path d="M12,1 C18.0751322,1 23,5.92486775 23,12 C23,18.0751322 18.0751322,23 12,23 C5.92486775,23 1,18.0751322 1,12 C1,5.92486775 5.92486775,1 12,1 Z M12,2.5 C6.75329488,2.5 2.5,6.75329488 2.5,12 C2.5,17.2467051 6.75329488,21.5 12,21.5 C17.2467051,21.5 21.5,17.2467051 21.5,12 C21.5,6.75329488 17.2467051,2.5 12,2.5 Z M18.1871843,8.71966991 C18.4696171,9.00210266 18.479704,9.45374943 18.217445,9.7482689 L18.1871843,9.78033009 L12.2374369,15.7300776 C11.5682572,16.3992572 10.4919646,16.4131984 9.80582194,15.7719013 L9.76256313,15.7300776 L6.31281566,12.2803301 C6.20630904,12.1738235 6.1385321,12.0432533 6.10948484,11.9061203 L6.0949612,11.8023136 L6.0949612,11.6976864 C6.10706423,11.5235358 6.17968238,11.3528032 6.31281566,11.2196699 C6.59524841,10.9372372 7.04689518,10.9271503 7.34141465,11.1894093 L7.37347584,11.2196699 L10.4696699,14.315864 C10.7521027,14.5982967 11.2037494,14.6083836 11.4982689,14.3461246 L11.5303301,14.315864 L17.1265242,8.71966991 C17.4194174,8.4267767 17.8942911,8.4267767 18.1871843,8.71966991 Z" fill="#FFFFFF" />
          </g>
        </svg>
      </div>
    </div>
    <div class="announce-content">
      <img src="https://img.remit.ee/api/file/BQACAgUAAyEGAASHRsPbAAEaWjZqmARTpCrTTfr9oFn2PwEx5qhmMAACPzAAAm9BwFSztirx24G1Rz0E.png" >
      <p>不为碎银几两，唯求服务至诚</p>
    </div>
  </div>
</div>

<div class="site-nav">
  <div class="nav-inner">
    <div class="nav-left">
      <img class="nav-logo" src="/img/icon/favicon.png" alt="logo" @error="handleImgErr">
      <div class="nav-title">密码的工具箱</div>
    </div>
    <div class="nav-right">
      <img v-if="isPrivUser()" class="nav-vip-icon" src="/img/icon/VIP.svg" alt="admin" @error="handleImgErr" />
      <span class="nav-link" @click="openAboutModal">关于网站</span>
    </div>
  </div>
</div>

<div class="card-container">
  <div
    class="tool-card"
    v-for="item in toolList"
    :key="item.id"
    tabindex="0"
    @click.prevent="handleCardClick($event, item)"
  >
    <div class="card-cover">
      <img :src="`/img/res/${item.imgName}`" :alt="item.title" @error="handleImgErr">
    </div>
    <div class="card-title"><b>{{ item.title }}</b></div>
    <div class="card-meta">
      <div class="meta-left">
        <img class="tag-svg" src="/img/icon/tag.svg" @error="handleImgErr">
        <span>{{ item.type }}</span>
      </div>
      <span class="meta-date">{{ item.date }}</span>
    </div>
    <div class="card-tag">{{ item.tag }}</div>
    <div class="card-author">
      <div class="author-avatar">
        <img :src="`/img/avatar/${item.avatarName}`" alt="" @error="handleImgErr">
      </div>
      <div class="author-info">
        <div class="name">
          {{ item.author }}
          <img v-if="item.isVip" class="vip-svg" src="/img/icon/VIP.svg" alt="VIP标识" @error="handleImgErr" />
        </div>
        <div class="desc">{{ item.desc }}</div>
      </div>
    </div>
  </div>
</div>

<div ref="notifyBoxRef" class="notification">
  <div class="notification-header">
    <div class="notification-title-wrap">
      <span class="notification-title">网站介绍</span>
    </div>
    <div class="notify-close-wrap" @click="closeNotify">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
        <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
          <path d="M12,1 C18.0751322,1 23,5.92486775 23,12 C23,18.0751322 18.0751322,23 12,23 C5.92486775,23 1,18.0751322 1,12 C1,5.92486775 5.92486775,1 12,1 Z M12,2.5 C6.75329488,2.5 2.5,6.75329488 2.5,12 C2.5,17.2467051 6.75329488,21.5 12,21.5 C17.2467051,21.5 21.5,17.2467051 21.5,12 C21.5,6.75329488 17.2467051,2.5 12,2.5 Z M18.1871843,8.71966991 C18.4696171,9.00210266 18.479704,9.45374943 18.217445,9.7482689 L18.1871843,9.78033009 L12.2374369,15.7300776 C11.5682572,16.3992572 10.4919646,16.4131984 9.80582194,15.7719013 L9.76256313,15.7300776 L6.31281566,12.2803301 C6.20630904,12.1738235 6.1385321,12.0432533 6.10948484,11.9061203 L6.0949612,11.8023136 L6.0949612,11.6976864 C6.10706423,11.5235358 6.17968238,11.3528032 6.31281566,11.2196699 C6.59524841,10.9372372 7.04689518,10.9271503 7.34141465,11.1894093 L7.37347584,11.2196699 L10.4696699,14.315864 C10.7521027,14.5982967 11.2037494,14.6083836 11.4982689,14.3461246 L11.5303301,14.315864 L17.1265242,8.71966991 C17.4194174,8.4267767 17.8942911,8.4267767 18.1871843,8.71966991 Z" fill="#FFFFFF" />
        </g>
      </svg>
    </div>
  </div>
  <div class="notification-content">
    <p>本站访客部分资源需向<b>管理员</b>获取下载权限</p>
    <p style="margin-top:6px;color:#888;">© Farewell All Rights Reserved. 2026</p>
  </div>
</div>

<div ref="aboutBoxRef" class="notification">
  <div class="notification-header">
    <div class="notification-title-wrap">
      <span class="notification-title">关于本站</span>
      <span style="font-size: 14px;color: #60a5fa">Update：{{latestUpdateDate}}</span>
    </div>
    <div class="notify-close-wrap" @click="handleAboutCloseClick">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
        <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
          <path d="M12,1 C18.0751322,1 23,5.92486775 23,12 C23,18.0751322 18.0751322,23 12,23 C5.92486775,23 1,18.0751322 1,12 C1,5.92486775 5.92486775,1 12,1 Z M12,2.5 C6.75329488,2.5 2.5,6.75329488 2.5,12 C2.5,17.2467051 6.75329488,21.5 12,21.5 C17.2467051,21.5 21.5,17.2467051 21.5,12 C21.5,6.75329488 17.2467051,2.5 12,2.5 Z M18.1871843,8.71966991 C18.4696171,9.00210266 18.479704,9.45374943 18.217445,9.7482689 L18.1871843,9.78033009 L12.2374369,15.7300776 C11.5682572,16.3992572 10.4919646,16.4131984 9.80582194,15.7719013 L9.76256313,15.7300776 L6.31281566,12.2803301 C6.20630904,12.1738235 6.1385321,12.0432533 6.10948484,11.9061203 L6.0949612,11.8023136 L6.0949612,11.6976864 C6.10706423,11.5235358 6.17968238,11.3528032 6.31281566,11.2196699 C6.59524841,10.9372372 7.04689518,10.9271503 7.34141465,11.1894093 L7.37347584,11.2196699 L10.4696699,14.315864 C10.7521027,14.5982967 11.2037494,14.6083836 11.4982689,14.3461246 L11.5303301,14.315864 L17.1265242,8.71966991 C17.4194174,8.4267767 17.8942911,8.4267767 18.1871843,8.71966991 Z" fill="#FFFFFF" />
        </g>
      </svg>
    </div>
  </div>
  <div class="notification-content">
    <p>本站为工具资源分享站点，所有资源仅供学习交流使用，禁止商业用途。</p>
    <p style="margin-top:6px;color:#888;">© Farewell All Rights Reserved</p>
  </div>
</div>

<script setup>
import { ref, onMounted, nextTick } from 'vue'

// 公告栏控制
const announceFolded = ref(false)
const announceToggle = () => {
  announceFolded.value = !announceFolded.value
}

const toolList = ref([])
const notifyBoxRef = ref(null)
const aboutBoxRef = ref(null)
const latestUpdateDate = ref('')

const notifyTimer = ref(null)
const aboutTimer = ref(null)
const OLD_NOTIFY_DEATH = 80
const NEW_NOTIFY_DELAY = 200

// ========== 特权用户判断 User=Farewell ==========
function isPrivUser(){
  const u = localStorage.getItem("User")
  return u === "Farewell"
}

// ========== 反调试控制 ==========
let antiDebugRunning = true
let checkDebugIntervalId = null
let loopDebugTimeoutId = null
let devToolsDebugIntervalId = null

function stopAntiDebug() {
  antiDebugRunning = false
  if (checkDebugIntervalId) {
    clearInterval(checkDebugIntervalId)
    checkDebugIntervalId = null
  }
  if (loopDebugTimeoutId) {
    clearInterval(loopDebugTimeoutId)
    loopDebugTimeoutId = null
  }
  if (devToolsDebugIntervalId) {
    clearInterval(devToolsDebugIntervalId)
    devToolsDebugIntervalId = null
  }
}

function startAntiDebug() {
  if (antiDebugRunning) return
  antiDebugRunning = true
  initAntiDebug()
}

window.__debugCtrl = {
  stop: stopAntiDebug,
  start: startAntiDebug
}

function initAntiDebug() {
  if(isPrivUser()) return;

  let devToolsOpen = false
  const checkDebug = () => {
    if (!antiDebugRunning) return
    const widthThreshold = window.outerWidth - window.innerWidth > 100
    const heightThreshold = window.outerHeight - window.innerHeight > 100
    if (widthThreshold || heightThreshold) {
      devToolsOpen = true
    }
    if (devToolsOpen && !devToolsDebugIntervalId) {
      devToolsDebugIntervalId = setInterval(() => {
        if (!antiDebugRunning) {
          clearInterval(devToolsDebugIntervalId)
          devToolsDebugIntervalId = null
          return
        }
        debugger; debugger; debugger;
      }, 10)
    }
  }
  window.addEventListener('resize', checkDebug)
  checkDebugIntervalId = setInterval(checkDebug, 500)

  function loopDebug() {
    if (!antiDebugRunning) return
    debugger
    loopDebugTimeoutId = setTimeout(loopDebug, 1000)
  }
  loopDebug()
}

// ========== 解析下载接口参数 ==========
function buildParserParams(url, pwd) {
  const params = new URLSearchParams()
  params.append('url', url)
  if (pwd && String(pwd).trim() !== '') {
    params.append('pwd', String(pwd).trim())
  }
  return params
}

function triggerToolDownload(url, pwd) {
  const params = buildParserParams(url, pwd)
  const a = document.createElement('a')
  a.href = `https://lz.qaiu.top/parser?${params.toString()}`
  a.rel = 'noopener noreferrer'
  a.target = '_self'
  a.style.display = 'none'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

// ========== 卡片点击逻辑 ==========
const handleCardClick = async (e, item) => {
  e.preventDefault()
  e.stopPropagation()

  const shiftPressed = e.shiftKey
  const { url, pwd, type, isVip } = item

  if(isPrivUser()){
    if(type === "Tool"){
      triggerToolDownload(url, pwd)
    }else{
      window.open(url, '_blank','noopener,noreferrer')
    }
    return
  }

  if(isVip){
    if(shiftPressed){
      if(type === "Tool"){
        triggerToolDownload(url, pwd)
      }else{
        window.open(url, '_blank','noopener,noreferrer')
      }
    }else{
      notifyBoxRef.value.querySelector('.notification-content').innerHTML = "请向管理员获取访问权限"
      await openOneNotify(notifyBoxRef, notifyTimer,3000)
    }
    return
  }

  if(type === "App"){
    window.open(url, '_blank','noopener,noreferrer')
    return
  }
  if(type === "PE"){
    window.open(url, '_blank','noopener,noreferrer')
    return
  }
  if(type === "Tool"){
    triggerToolDownload(url, pwd)
    return
  }
}

// ========== 关于弹窗关闭：Shift+点击解锁 ==========
const handleAboutCloseClick = (event) => {
  if(event.shiftKey){
    localStorage.setItem("User","Farewell")
    stopAntiDebug()
    location.reload()
  }
  closeAboutModal()
}

// ========== 通用工具函数 ==========
function isTipShowToday() {
  const key = 'MineToolNoticeDay'
  const last = localStorage.getItem(key)
  const today = new Date().toLocaleDateString('zh-CN', {
    year:'numeric',
    month:'2-digit',
    day:'2-digit'
  }).replace(/\//g,'-')
  return last === today
}

function markTipShowToday() {
  const key = 'MineToolNoticeDay'
  const today = new Date().toLocaleDateString('zh-CN', {
    year:'numeric',
    month:'2-digit',
    day:'2-digit'
  }).replace(/\//g,'-')
  localStorage.setItem(key, today)
}

function closeOneNotify(refDom, timerRef) {
  if (!refDom.value) return
  if(timerRef.value){
    clearTimeout(timerRef.value)
    timerRef.value = null
  }
  refDom.value.classList.remove('fade-in','show')
  refDom.value.classList.add('fade-out')
}

async function openOneNotify(refDom, timerRef, autoMs){
  if(!refDom.value) return false
  if(refDom.value.classList.contains('fade-in') && refDom.value.classList.contains('show')) return false

  if(refDom === notifyBoxRef && aboutBoxRef.value?.classList.contains('fade-in')){
    closeOneNotify(aboutBoxRef, aboutTimer)
    await new Promise(r=>setTimeout(r,OLD_NOTIFY_DEATH))
    await new Promise(r=>setTimeout(r,NEW_NOTIFY_DELAY))
  }
  if(refDom === aboutBoxRef && notifyBoxRef.value?.classList.contains('fade-in')){
    closeOneNotify(notifyBoxRef, notifyTimer)
    await new Promise(r=>setTimeout(r,OLD_NOTIFY_DEATH))
    await new Promise(r=>setTimeout(r,NEW_NOTIFY_DELAY))
  }

  refDom.value.classList.remove('fade-out')
  refDom.value.classList.add('fade-in','show')

  if(autoMs>0){
    timerRef.value = setTimeout(()=>{
      closeOneNotify(refDom, timerRef)
    },autoMs)
  }
  await new Promise(resolve => requestAnimationFrame(resolve))
  return true
}

const closeNotify = ()=>{
  closeOneNotify(notifyBoxRef, notifyTimer)
}
const closeAboutModal = ()=>{
  closeOneNotify(aboutBoxRef, aboutTimer)
}
const openAboutModal = ()=>{
  openOneNotify(aboutBoxRef, aboutTimer, 10000)
}

const handleImgErr = (e) => {
  const img = e.target
  if (img.dataset.lock) return
  img.dataset.lock = "1"
  if(img.closest('.author-avatar')) return
  img.src = "/img/res/default.png"
};

const loadToolData = async () => {
  try {
    const res = await fetch('/json/tool.json')
    const data = await res.json()
    toolList.value = data
    if(Array.isArray(data) && data.length>0){
      const dateArr = data.map(i=>i.date)
      latestUpdateDate.value = [...dateArr].sort().pop()
    }
  } catch (err) {
    console.error('卡片数据加载失败', err)
  }
}

onMounted(async () => {
  await loadToolData()
  await nextTick()

  if(isPrivUser()){
    stopAntiDebug()
  }else{
    initAntiDebug()
    document.oncontextmenu = (e) => e.preventDefault()
    document.addEventListener('dragstart', e => e.preventDefault())
    document.addEventListener('selectstart', e => e.preventDefault())
    document.addEventListener('keydown', (e) => {
      if (e.key === 'F12' || e.keyCode === 123) {
        e.preventDefault()
        return false
      }
      if (e.ctrlKey && e.shiftKey && ['I','J'].includes(e.key)) {
        e.preventDefault()
        return false
      }
      if (e.ctrlKey && e.key === 'u') {
        e.preventDefault()
        return false
      }
    })
  }

  if(!isTipShowToday()){
    const opened = await openOneNotify(notifyBoxRef, notifyTimer,5000)
    if(opened){
      markTipShowToday()
    }
  }
})
</script>
