import { defineConfig } from 'vitepress'
export default defineConfig({
  title: "密码的工具箱",
  lang: "zh-CN",
  base: "/",
  head: [
    ['link', { rel: "icon", href: "/img/icon/favicon.png" }]
  ],
  themeConfig: {
    darkModeToggle: false,
    search: false,
    font: false
  }
})