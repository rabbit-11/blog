window.commonSetting = {
    baseUrl: "http://192.168.1.94:8089",
};
/**
 * 初始化屏幕分辨率
 */
const Screen = {
    designWidth     : 1920,   // 设计稿屏幕宽度
    designHeight    : 1080,   // 设计稿屏幕高度
    minHeight       : 620,    // laptop高度
    resize() {
        document.documentElement.style.fontSize = (document.documentElement.clientWidth / 19.2) + "px";
    }
};
Screen.resize();
addEventListener("resize", Screen.resize);
