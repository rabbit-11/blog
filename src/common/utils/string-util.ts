/**
 * 文本的工具类
 */
export class StringUtil {
    public static filterEmoji(str: string) {
        let regRule = /\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g;
        if (str.match(regRule)) {
            str = str.replace(
                /\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g,
                ""
            );
            console.log("不支持表情");
        }
        return str;
    }
}
