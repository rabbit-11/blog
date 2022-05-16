import { component, watch, View } from "flagwind-web";
import "./index.scss";
import axios from "axios";
import { commonSetting } from "@/settings";

@component({
    template: require("./index.html")
})
export default class Perception extends View {
    public fusionResult = {
        addUpFalseAlarmProbability: "--",
        addUpLocationError: "--",
        addUpOmissionAlarmProbability: "--",
        addUpSpeedDirectionError: "--",
        addUpSpeedError: "--",
        currentFalseAlarmProbability: "--",
        currentLocationError: "--",
        currentOmissionAlarmProbability: "--",
        currentSpeedDirectionError: "--",
        currentSpeedError: "--",
        currentTargetNumber: "--",
        infoUnitCreateTime: null,
        startTime: "00:00:00"
    };

    public nowTime: string = this.updateTime();

    public async getFusionResult(fusionResultUrl: string) {
        let fusionRes = "";
        await axios.get(fusionResultUrl).
        then(response => {
            fusionRes = JSON.stringify(response.data);
        }).
        catch(error => {
            console.error("get fusion result FAILED! using Url: ", fusionResultUrl, "err Code:", error);
        });
 
        return fusionRes;
    }

    public async getCountResult(fusionCountUrl: string) {
        let fusionRes = "";
        await axios.get(fusionCountUrl).
        then(response => {
            fusionRes = JSON.stringify(response.data);
        }).
        catch(error => {
            console.error("get fusion result FAILED! using Url: ", fusionCountUrl, "err Code:", error);
        });
 
        return fusionRes;
    }

    public async getStartTime(startTimeUrl: string) {
        let startTimeRes = "";
        await axios.get(startTimeUrl).
        then(response => {
            startTimeRes = JSON.stringify(response.data);
        }).
        catch(error => {
            console.error("get fusion result FAILED! using Url: ", startTimeUrl, "err Code:", error);
        });
 
        return startTimeRes;
    }

    public updateTime() {
        // let year = new Date().getFullYear();
        // let month = new Date().getMonth() + 1;
        // let day = new Date().getDate();
        let hour = new Date().getHours();
        let minute = new Date().getMinutes();
        let second = new Date().getSeconds();
        // this.nowTime = year + "-" + this.fixtime(month) + "-" + this.fixtime(day) + " " + this.fixtime(hour) + ":" + this.fixtime(minute) + ":" + this.fixtime(second);
        return this.fixtime(hour) + ":" + this.fixtime(minute) + ":" + this.fixtime(second);

    }

    public fixtime(s: number) {
        return s < 10 ? "0" + s : s;
    }

    public created() {
        this.updateTime();
    }

    public mounted() {
        let that = this;
        setInterval(function() {
            let getFusionData = that.getFusionResult(`${commonSetting.baseUrl}` + "/free/efficacy/fusion-result");
            getFusionData.then(res => {
                let result = JSON.parse(res).result;
                that.fusionResult.addUpFalseAlarmProbability = result.addUpFalseAlarmProbability;
                that.fusionResult.addUpLocationError = result.addUpLocationError;
                that.fusionResult.addUpOmissionAlarmProbability = result.addUpOmissionAlarmProbability;
                that.fusionResult.addUpSpeedDirectionError = result.addUpSpeedDirectionError;
                that.fusionResult.addUpSpeedError = result.addUpSpeedError;
                that.fusionResult.currentFalseAlarmProbability = result.currentFalseAlarmProbability;
                that.fusionResult.currentLocationError = result.currentLocationError;
                that.fusionResult.currentOmissionAlarmProbability = result.currentOmissionAlarmProbability;
                that.fusionResult.currentSpeedDirectionError = result.currentSpeedDirectionError;
                that.fusionResult.currentSpeedError = result.currentSpeedError;
                that.fusionResult.infoUnitCreateTime = result.infoUnitCreateTime;
            });
            let getCountData = that.getCountResult(`${commonSetting.baseUrl}` + "/free/efficacy/current-batch-num");
            getCountData.then(res => {
                that.fusionResult.currentTargetNumber = JSON.parse(res).result;
            });
            let startTimeData = that.getCountResult(`${commonSetting.baseUrl}` + "/free/efficacy/start-time");
            startTimeData.then(res => {
                that.fusionResult.startTime = JSON.parse(res).result;
            });
        }, 1000);
        setInterval(() => this.nowTime = this.updateTime(),1000);
    }
}
