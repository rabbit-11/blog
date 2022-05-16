let debug = process.env.NODE_ENV === "development";
export const global = <any>window;

/**
 * 后端地址
 * @type {string}
 */
export const commonSetting = {
    ...{
        // 后端地址
        baseUrl: "http://192.168.5.16:8003"
    },
    ...global.commonSetting
};
