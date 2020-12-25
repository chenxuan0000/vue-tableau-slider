const title = "vue-tableau-slider";
const path = require("path");
const isDev = process.env.NODE_ENV === "development";

module.exports = {
  base: "/vue-tableau-slider/",
  locales: {
    "/": {
      lang: "en-US", // 将会被设置为 <html> 的 lang 属性
      title,
      description: "A simple, Seamless scrolling for Vue.js",
    },
    "/zh/": {
      lang: "zh-CN",
      title,
      description: "一个简单的基于vue.js的无缝滚动",
    },
  },
  head: [["link", { rel: "icon", href: `/favicon.ico` }]],
  themeConfig: {
    repo: "chenxuan0000/vue-tableau-slider",
    locales: {
      "/": {
        selectText: "Languages",
        label: "English",
        ariaLabel: "Languages",
        editLinkText: "Edit this page on GitHub",
        serviceWorker: {
          updatePopup: {
            message: "New content is available.",
            buttonText: "Refresh",
          },
        },
        algolia: {},
        nav: [
          { text: "Home", link: "/" },
          { text: "Guide", link: "/guide/" },
          { text: "Changelog", link: "/changelog/" },
        ],
        sidebar: {
          "/guide/": [
            {
              title: "Guide",
              collapsable: false,
              children: [
                "",
                "usage",
                "properties",
                "events",
              ],
            },
            {
              title: "Examples",
              collapsable: false,
              children: [
                "01-basic",
                "02-值范围",
                "03-至少",
                "04-至多",
                "05-更改最大最小值步长",
                "06-滑块轨道颜色",
                "07-slace缩放",
              ],
            },
          ],
        },
      },
      "/zh/": {
        // 多语言下拉菜单的标题
        selectText: "选择语言",
        // 该语言在下拉菜单中的标签
        label: "简体中文",
        // 编辑链接文字
        editLinkText: "在 GitHub 上编辑此页",
        // Service Worker 的配置
        serviceWorker: {
          updatePopup: {
            message: "发现新内容可用.",
            buttonText: "刷新",
          },
        },
        // 当前 locale 的 algolia docsearch 选项
        algolia: {},
        nav: [
          { text: "主页", link: "/zh/" },
          { text: "指南", link: "/zh/guide/" },
          { text: "更新日志", link: "/zh/changelog/" },
        ],
        sidebar: {
          "/zh/guide/": [
            {
              title: "指南",
              collapsable: false,
              children: [
                "",
                "usage",
                "properties",
                "events",
              ],
            },
            {
              title: "示例",
              collapsable: false,
              children: [
                "01-basic",
                "02-值范围",
                "03-至少",
                "04-至多",
                "05-更改最大最小值步长",
                "06-滑块轨道颜色",
                "07-slace缩放",
              ],
            },
          ],
        },
      },
    },
  },
  dest: "public",
  configureWebpack: {
    resolve: {
      alias: {
        "vue-tableau-slider": path.resolve(
          __dirname,
          isDev
            ? "../../../src/index.js"
            : "../../node_modules/vue-tableau-slider"
        ),
      },
    },
  },
};
