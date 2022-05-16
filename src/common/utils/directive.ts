import Vue, { DirectiveOptions, VNode } from "vue";
import { StringUtil } from "./string-util";
/**
 * 字符串类型v-model指令 针对字符串输入 过滤非法emoji字符
 */
const smodel: DirectiveOptions = {
    bind: (el, binding: any, vnode) => {
        let arr = binding.expression.split(".");
        let target = getObject(arr, vnode);
        el.oninput = (event: any) => {
            target = getObject(arr, vnode);
            event.target.value = StringUtil.filterEmoji((event.target.value || ""));
            Vue.set(
                target as any,
                arr[arr.length - 1],
                (binding.modifiers && binding.modifiers.trim) ? event.target.value.trim() : event.target.value
            );
        };
    },
    update: (el: any, binding, vnode) => {
        Vue.set(
            el.__vue__ ? el.__vue__ : el,
            "value",
            binding.value
        );
    }
};
const getObject = (arr: Array<string>, vnode: VNode) => {
    let target: any = vnode.context;
    arr.forEach((v: string, index: number) => {
        if(index < arr.length - 1) {
            target = (target as any)[v];
        }
    });
    return target;
};
const directives = () => {
    Vue.directive("smodel", smodel);
};
export default directives;
