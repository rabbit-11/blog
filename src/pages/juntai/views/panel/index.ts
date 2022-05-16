import { component, watch, View } from "flagwind-web";
import "./index.scss";
import Perception from "./components/perception";
import Formation from "./components/formation";
import Reactiontime from "./components/reactiontime";

@component({
    template: require("./index.html"),
    components: {
        "u-perception": Perception,
        "u-formation": Formation,
        "u-reactiontime": Reactiontime
    }
})
export default class Panel extends View {
    
}
