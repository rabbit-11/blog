import { component, watch, View } from "flagwind-web";
import "./index.scss";

const components: Function = component;
@components({
    template: require("./index.html")
})
export default class Container extends View {

}
