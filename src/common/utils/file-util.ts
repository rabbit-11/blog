/**
 * 文件操作的工具类
 */
export class FileUtil {

    // 字符串转base64
    public static encode(str: string) {
        // let encode = encodeURIComponent(str);
        // let base64 = btoa(encode);
        // return base64;
       return btoa(unescape(encodeURIComponent(str)));
    }

    // base64转字符串
    public static decode(base64: any) {
        // // 对base64转编码
        // let decode = atob(base64);
        // // 编码转字符串
        // let str = decodeURIComponent(decode);
        // return str;
       return decodeURIComponent(escape(atob(base64)));
    }

    // dataurl 转为file
    public static dataURLtoFile(dataurl: string, filename: string) {
        let arr: Array<any> = dataurl.split(","),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mime});
    }

    // 字符串直接转为file
    public static strToFile(str: string, filename: string = "file", mime: string = "text/plain;charset=UTF-8") {
        let base64 = this.encode(str);
        let dataUrl = `data:${mime};base64,${base64}`;
        let file = this.dataURLtoFile(dataUrl, filename);
        return file;
    }
}