import { component, watch, View } from "flagwind-web";
import "./index.scss";
import axios from "axios";
import { commonSetting } from "@/settings";

@component({
    template: require("./index.html")
})
export default class Reactiontime extends View {
    public isTime = false;
    public findTimeResult = ["目标[001]发现时间：10s", "目标[002]发现时间：10s", "目标[003]发现时间：10s", "目标[004]发现时间：10s", "目标[005]发现时间：10s", "目标[006]发现时间：10s", "目标[007]发现时间：10s", "目标[008]发现时间：10s", "目标[009]发现时间：10s", "目标[010]发现时间：10s"];
    public processResult = [
        {
          name: "盲区判断正确率",
          value: "--",
          unit: "%"
        },
        {
          name: "累计能耗",
          value: "--",
          unit: ""
        },
        {
          name: "进入危险区次数",
          value: "--",
          unit: "次"
        },
        {
          name: "30min/95%的覆盖率",
          value: "--",
          unit: "%"
        }
    ];

    public async getFindTimeResult(reactiontimeUrl: string) {
        let reactiontimeRes = "";
        await axios.get(reactiontimeUrl).
        then(response => {
            reactiontimeRes = JSON.stringify(response.data);
        }).
        catch(error => {
            console.error("get reactiontime result FAILED! using Url: ", reactiontimeUrl, "err Code:", error);
        });
 
        return reactiontimeRes;
    }

    public async getProcessResult(processUrl: string) {
        let processRes = "";
        await axios.get(processUrl).
        then(response => {
            processRes = JSON.stringify(response.data);
        }).
        catch(error => {
            console.error("get reactiontime result FAILED! using Url: ", processUrl, "err Code:", error);
        });
 
        return processRes;
    }

    public mounted() {
        let that = this;
        setInterval(function() {
            let getFindTimeData = that.getFindTimeResult(`${commonSetting.baseUrl}` + "/free/efficacy/intrusion-detection");
            getFindTimeData.then(res => {
                that.findTimeResult = JSON.parse(res).result;
            });
            let getProcessData = that.getProcessResult(`${commonSetting.baseUrl}` + "/free/efficacy/executive-time");
            getProcessData.then(res => {
                that.processResult = JSON.parse(res).result;
            });
        }, 1000);
    }
}
