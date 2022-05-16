// 过滤器，当字数大于maxLen时，截断
export const ellipsis = function (value: string, maxLen: number) {
    if (!value) return "";
    if (value.length > maxLen) {
        return value.slice(0, maxLen) + "...";
    }
    return value;
};
