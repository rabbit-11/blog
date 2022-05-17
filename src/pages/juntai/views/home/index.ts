import { component, watch, View } from "flagwind-web";
import "./index.scss";
import { pageData } from "./pageData";

@component({
    template: require("./index.html")
})
export default class Home extends View {
    public pages = pageData;

}
