// theme-without-fonts 与 vitepress/theme 的唯一区别：不再预加载 Inter 西文字体
// （站内正文是中文，Inter 只影响拉丁字母，却要占一个高优先级 preload + 66KB）
import DefaultTheme from 'vitepress/theme-without-fonts'
import './custom.css'
export default { extends: DefaultTheme }