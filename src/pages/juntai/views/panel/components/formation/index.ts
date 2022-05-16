import { component, watch, View } from "flagwind-web";
import "./index.scss";
import axios from "axios";
import { commonSetting } from "@/settings";

@component({
    template: require("./index.html")
})
export default class Formation extends View {
    
    public ctx: any;
    public shipImg = new Image();
    public labelImg = new Image();
    public width: any;
    public height: any;
    public shipwidth = 20;
    public centery: any;
    public centerBoatId = "1";
    public flagx: boolean = true;
    public flagy: boolean = true;
    public isTime: boolean = true;
    public initShipInterval: any;

    public shipdata: any = [
        {
            entityId: "1",
            name: "7t无人艇2",
            x: 0.0,
            y: 0.0,
            locationError: 0.0
        },
        {
            entityId: "2",
            name: "7t无人艇1",
            x: 50,
            y: 0,
            locationError: 0.0
        },
        {
            entityId: "3",
            name: "3t级无人艇1",
            x: 100,
            y: 0,
            locationError: 0.0
        },
        {
            entityId: "4",
            name: "中心无人艇1",
            x: 150,
            y: 0,
            locationError: 0.0
        }
    ];

    public lineList: any = [
        {
            entity1Id: "1",
            entity2Id: "2",
            theoVal: 150.1,
            realVal: 2804.67,
            holdingAccuracy: 2654.5698
        },
        {
            entity1Id: "4",
            entity2Id: "1",
            theoVal: 150.1,
            realVal: 5011.557,
            holdingAccuracy: 4861.457
        },
        {
            entity1Id: "2",
            entity2Id: "3",
            theoVal: 149.8731,
            realVal: 5137.0103,
            holdingAccuracy: 4987.137
        },
        {
            entity1Id: "3",
            entity2Id: "4",
            theoVal: 150.1,
            realVal: 1684.4624,
            holdingAccuracy: 1534.3624
        }
    ];

    public reactiontimeResult = [
        {
          name: "任务生成时间",
          value: "--",
          unit: "s"
        },
        {
          name: "任务重构时间",
          value: "--",
          unit: "s"
        },
        {
          name: "编队重构时间",
          value: "--",
          unit: "s"
        },
        {
          name: "备用任务计划数量",
          value: "--",
          unit: "个"
        }
    ];

    public mounted() {
        let that = this;
        setInterval(function() {
            let getReactiontimeData = that.getReactiontimeResult(`${commonSetting.baseUrl}` + "/free/efficacy/reaction-time");
            getReactiontimeData.then(res => {
                that.reactiontimeResult = JSON.parse(res).result;
            });
        }, 1000);
        
    }

    public initCanvas() {
        let that = this;
        setTimeout(() => {
            let canvas: any = document.getElementById("canvas");
            this.ctx = canvas.getContext("2d");
            canvas = this.setupCanvas(canvas);
            that.width = canvas.width;
            that.height = canvas.height;
            this.onloadImg(function() {
                that.canvasLoop();
                that.initShipInterval = setInterval(that.canvasLoop, 1000);
                
                // that.ClearCanvas();
                // that.width = canvas.width;
                // that.height = canvas.height;
                // that.computePosition();
                // // this.drawBorderLine();
                // that.drawLine();
                // that.addDistanceLabel();
                
                // that.addShipImg();
                // that.addShipLabel();
                
            });
        }, 10)
        
    }

    public canvasLoop() {
        let that = this;
        let getShipData = that.getShipResult(`${commonSetting.baseUrl}` + "/free/efficacy/boat-group-accuracy");
        getShipData.then((res: any) => {
            let result = JSON.parse(res).result;
            that.shipdata = result.boatMapToList;
            that.lineList = result.lineList;
            that.centerBoatId = result.centerBoatId;
            
            that.ClearCanvas();
            
            that.computePosition();
            // this.drawBorderLine();
            that.drawLine();
            that.addDistanceLabel();
            
            that.addShipImg();
            that.addShipLabel();
        });
    }

    public onloadImg(callback: any) {
        let imgCount = 0;
        this.shipImg.src = require("@/assets/images/ship.png");
        this.labelImg.src = require("@/assets/images/label.png");
        this.shipImg.onload = function() {
            imgCount++;
            if(imgCount === 2) {
                callback();
            }
        };
        this.labelImg.onload = function() {
            imgCount++;
            if(imgCount === 2) {
                callback();
            }
        };
    }

    public async getReactiontimeResult(reactiontimeUrl: string) {
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

    public async getShipResult(shipUrl: string) {
        let shipRes = "";
        await axios.get(shipUrl).
        then(response => {
            shipRes = JSON.stringify(response.data);
        }).
        catch(error => {
            console.error("get ship result FAILED! using Url: ", shipUrl, "err Code:", error);
        });
 
        return shipRes;
    }

    public ClearCanvas() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }

    public setupCanvas(canvas: any) {
        let dpr = (window.devicePixelRatio || 1);
        let rect = canvas.getBoundingClientRect();
        console.log(rect)
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        canvas.style.width = rect.width + "px";
        canvas.style.height = rect.height + "px";
        return canvas;
    }

    public computePosition() {
        let maxx = 0;
        let minx = 0;
        let maxy = 0;
        let miny = 0;
        this.flagx = true;
        this.flagy = true;
        let maxxlength = this.width * 3 / 5;
        let maxylength = this.height * 2 / 3;
        for(let i = 0; i < this.shipdata.length; i++) {
            this.shipdata[i].x = parseFloat(this.shipdata[i].x.toFixed(2));
            this.shipdata[i].y = -this.shipdata[i].y.toFixed(2);
            if(this.shipdata[i].x > maxx) {
                maxx = this.shipdata[i].x;
                this.flagx = false;
            }
            else if(this.shipdata[i].x < minx) {
                minx = this.shipdata[i].x;
                this.flagx = false;
            }
            if(this.shipdata[i].y > maxy) {
                maxy = this.shipdata[i].y;
                this.flagy = false;
            }
            else if(this.shipdata[i].y < miny) {
                miny = this.shipdata[i].y;
                this.flagy = false;
            }
        }
        for(let i = 0; i < this.shipdata.length; i++) {
            if(this.flagx) this.shipdata[i].x = this.width / 2;
            else this.shipdata[i].x = this.width / 5 + (this.shipdata[i].x - minx) / (maxx - minx) * maxxlength;
            if(this.flagy) this.shipdata[i].y = this.height / 2;
            else this.shipdata[i].y = this.height / 6 + (this.shipdata[i].y - miny) / (maxy - miny) * maxylength;
        }
    }

    // public drawBorderLine() {
    //     this.ctx.save();
    //     this.ctx.globalCompositeOperation = "source-out";
    //     this.ctx.beginPath();
    //     this.ctx.moveTo(this.shipdata[0].x, this.shipdata[0].y);
    //     for(let i = 1; i < this.shipdata.length; i++) this.ctx.lineTo(this.shipdata[i].x, this.shipdata[i].y);
    //     this.ctx.lineTo(this.shipdata[0].x, this.shipdata[0].y);
    //     this.ctx.lineWidth = 5;
    //     this.ctx.shadowBlur = this.height / 8;
    //     this.ctx.shadowColor = "rgba(96,193,207,1)";
    //     this.ctx.strokeStyle = "rgba(96,193,207,1)";
    //     this.ctx.fillStyle = "rgba(96,193,207,1)";
    //     this.ctx.stroke();
    //     this.ctx.fill();
    //     this.ctx.closePath();
    //     this.ctx.restore();
    // }

    public drawLine() {
        this.ctx.save();
        this.ctx.beginPath();
        for(let i = 0; i < this.lineList.length; i++) {
            let ship1 = this.shipdata.find((item: any) => item.entityId === this.lineList[i].entity1Id);
            let ship2 = this.shipdata.find((item: any) => item.entityId === this.lineList[i].entity2Id);
            console.log(ship1);
            this.ctx.moveTo(ship1.x, ship1.y);
            this.ctx.lineTo(ship2.x, ship2.y);
        }
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = "rgba(96,193,207,1)";
        this.ctx.stroke();
        this.ctx.closePath();
        this.ctx.restore();
    }

    public addDistanceLabel() {
        this.ctx.save();
        for(let i = 0; i < this.lineList.length; i++) {
            let ship1 = this.shipdata.find((item: any) => item.entityId === this.lineList[i].entity1Id);
            let ship2 = this.shipdata.find((item: any) => item.entityId === this.lineList[i].entity2Id);
            this.ctx.font = "Normal 12px Arial";
            this.ctx.textAlign = "left";
            this.ctx.textBaseline = "middle";
            this.ctx.fillStyle = "#fff";
            this.ctx.fillText(this.lineList[i].holdingAccuracy, (ship1.x + ship2.x) / 2 - this.ctx.measureText(this.lineList[i].holdingAccuracy).width / 2, (ship1.y + ship2.y) / 2);
            this.ctx.fillStyle = "rgba(71,118,126,1)";
            this.ctx.fillText("m", (ship1.x + ship2.x) / 2 + this.ctx.measureText(this.lineList[i].holdingAccuracy).width / 2, (ship1.y + ship2.y) / 2);
        }
        this.ctx.restore();
    }

    public addShipImg() {
        this.ctx.drawImage(this.shipImg, this.width / 2 - this.shipwidth / 2, this.centery - this.shipwidth / 2, this.shipwidth, this.shipwidth);
        for(let i = 0; i < this.shipdata.length; i++) {
            this.ctx.drawImage(this.shipImg, this.shipdata[i].x - this.shipwidth / 2, this.shipdata[i].y - this.shipwidth / 2, this.shipwidth, this.shipwidth);
        }
    }

    public addShipLabel() {
        this.ctx.save();
        this.ctx.font = "Normal 10px Arial";
        for(let i = 0; i < this.shipdata.length; i++) {
            if(this.flagx) {
                let labelWidth = this.ctx.measureText(this.shipdata[i].name).width + 5;
                this.ctx.drawImage(this.labelImg, this.shipdata[i].x + 15, this.shipdata[i].y - 6, labelWidth, 14);
                this.ctx.fillStyle = "rgba(96,193,207,1)";
                this.ctx.fillText(this.shipdata[i].name, this.shipdata[i].x + 18, this.shipdata[i].y + 4);
                this.ctx.fillStyle = "#fff";
                // this.ctx.fillText(this.shipdata[i].locationError, this.shipdata[i].x + 18 + labelWidth, this.shipdata[i].y + 4);
                // this.ctx.fillStyle = "rgba(71,118,126,1)";
                // this.ctx.fillText("m", this.shipdata[i].x + 18 + labelWidth + this.ctx.measureText(this.shipdata[i].locationError).width, this.shipdata[i].y + 4);
            }
            else if(this.flagy) {
                let labelWidth = this.ctx.measureText(this.shipdata[i].name).width + 5;
                this.ctx.drawImage(this.labelImg, this.shipdata[i].x - labelWidth / 2, this.shipdata[i].y - 28, labelWidth, 14);
                this.ctx.fillStyle = "rgba(96,193,207,1)";
                this.ctx.fillText(this.shipdata[i].name, this.shipdata[i].x - labelWidth / 2 + 3, this.shipdata[i].y - 18);
                this.ctx.fillStyle = "#fff";
                // this.ctx.fillText(this.shipdata[i].locationError, this.shipdata[i].x + labelWidth / 2 + 3, this.shipdata[i].y - 18);
                // this.ctx.fillStyle = "rgba(71,118,126,1)";
                // this.ctx.fillText("m", this.shipdata[i].x + labelWidth / 2 + 3 + this.ctx.measureText(this.shipdata[i].locationError).width, this.shipdata[i].y - 18);
            }
            else if(this.shipdata[i].y > this.height * 11 / 20) {
                // let labelWidth = this.ctx.measureText(this.shipdata[i].entityId).width + this.ctx.measureText("无人艇").width + 5;
                let labelWidth = this.ctx.measureText(this.shipdata[i].name).width + 5;
                this.ctx.drawImage(this.labelImg, this.shipdata[i].x - labelWidth / 2, this.shipdata[i].y + 12, labelWidth, 14);
                this.ctx.fillStyle = "rgba(96,193,207,1)";
                // if(this.centerBoatId === this.shipdata[i].entityId) this.ctx.fillText("中心艇", this.shipdata[i].x - 17, this.shipdata[i].y + 22);
                // else this.ctx.fillText("无人艇", this.shipdata[i].x - 17, this.shipdata[i].y + 22);
                this.ctx.fillText(this.shipdata[i].name, this.shipdata[i].x - labelWidth / 2 + 3, this.shipdata[i].y + 22);
                this.ctx.fillStyle = "#fff";
                // this.ctx.fillText(this.shipdata[i].entityId, this.shipdata[i].x + this.ctx.measureText("无人艇").width - 17, this.shipdata[i].y + 22);
                // this.ctx.fillText(this.shipdata[i].locationError, this.shipdata[i].x + labelWidth / 2 + 3, this.shipdata[i].y + 22);
                // this.ctx.fillStyle = "rgba(71,118,126,1)";
                // this.ctx.fillText("m", this.shipdata[i].x + labelWidth / 2 + 3 + this.ctx.measureText(this.shipdata[i].locationError).width, this.shipdata[i].y + 22);
            }
            else if(this.shipdata[i].y < this.height * 9 / 20) {
                // let labelWidth = this.ctx.measureText(this.shipdata[i].entityId).width + this.ctx.measureText("无人艇").width + 5;
                let labelWidth = this.ctx.measureText(this.shipdata[i].name).width + 5;
                this.ctx.drawImage(this.labelImg, this.shipdata[i].x - labelWidth / 2, this.shipdata[i].y - 28, labelWidth, 14);
                this.ctx.fillStyle = "rgba(96,193,207,1)";
                // if(this.centerBoatId === this.shipdata[i].entityId) this.ctx.fillText("中心艇", this.shipdata[i].x - 17, this.shipdata[i].y - 18);
                // else this.ctx.fillText("无人艇", this.shipdata[i].x - 17, this.shipdata[i].y - 18);
                this.ctx.fillText(this.shipdata[i].name, this.shipdata[i].x - labelWidth / 2 + 3, this.shipdata[i].y - 18);
                this.ctx.fillStyle = "#fff";
                // this.ctx.fillText(this.shipdata[i].entityId, this.shipdata[i].x + this.ctx.measureText("无人艇").width - labelWidth / 2 + 3, this.shipdata[i].y - 18);
                // this.ctx.fillText(this.shipdata[i].locationError, this.shipdata[i].x + labelWidth / 2 + 3, this.shipdata[i].y - 18);
                // this.ctx.fillStyle = "rgba(71,118,126,1)";
                // this.ctx.fillText("m", this.shipdata[i].x + labelWidth / 2 + 3 + this.ctx.measureText(this.shipdata[i].locationError).width, this.shipdata[i].y - 18);
            }
            else {
                if(this.shipdata[i].x > this.width / 2) {
                    // let labelWidth = this.ctx.measureText(this.shipdata[i].entityId).width + this.ctx.measureText("无人艇").width + 5;
                    let labelWidth = this.ctx.measureText(this.shipdata[i].name).width + 5;
                    this.ctx.drawImage(this.labelImg, this.shipdata[i].x + 15, this.shipdata[i].y - 6, labelWidth, 14);
                    this.ctx.fillStyle = "rgba(96,193,207,1)";
                    // if(this.centerBoatId === this.shipdata[i].entityId) this.ctx.fillText("中心艇", this.shipdata[i].x + 18, this.shipdata[i].y + 4);
                    // else this.ctx.fillText("无人艇", this.shipdata[i].x + 18, this.shipdata[i].y + 4);
                    this.ctx.fillText(this.shipdata[i].name, this.shipdata[i].x + 18, this.shipdata[i].y + 4);
                    this.ctx.fillStyle = "#fff";
                    // this.ctx.fillText(this.shipdata[i].entityId, this.shipdata[i].x + this.ctx.measureText("无人艇").width + 18, this.shipdata[i].y + 4);
                    // this.ctx.fillText(this.shipdata[i].locationError, this.shipdata[i].x + 18 + labelWidth, this.shipdata[i].y + 4);
                    // this.ctx.fillStyle = "rgba(71,118,126,1)";
                    // this.ctx.fillText("m", this.shipdata[i].x + 18 + labelWidth + this.ctx.measureText(this.shipdata[i].locationError).width, this.shipdata[i].y + 4);
                }
                else {
                    // let labelWidth = this.ctx.measureText(this.shipdata[i].entityId).width + this.ctx.measureText("无人艇").width + 5;
                    let labelWidth = this.ctx.measureText(this.shipdata[i].name).width + 5;
                    this.ctx.drawImage(this.labelImg, this.shipdata[i].x - 15 - labelWidth, this.shipdata[i].y - 6, labelWidth, 14);
                    this.ctx.fillStyle = "rgba(96,193,207,1)";
                    // if(this.centerBoatId === this.shipdata[i].entityId) this.ctx.fillText("中心艇", this.shipdata[i].x - 12 - labelWidth, this.shipdata[i].y + 4);
                    // else this.ctx.fillText("无人艇", this.shipdata[i].x - 12 - labelWidth, this.shipdata[i].y + 4);
                    this.ctx.fillText(this.shipdata[i].name, this.shipdata[i].x - 12 - labelWidth, this.shipdata[i].y + 4);
                    this.ctx.fillStyle = "#fff";
                    // this.ctx.fillText(this.shipdata[i].entityId, this.shipdata[i].x - 12 - labelWidth + this.ctx.measureText("无人艇").width, this.shipdata[i].y + 4);
                    // this.ctx.fillText(this.shipdata[i].locationError, this.shipdata[i].x - 26 - labelWidth - this.ctx.measureText(this.shipdata[i].locationError).width, this.shipdata[i].y + 4);
                    // this.ctx.fillStyle = "rgba(71,118,126,1)";
                    // this.ctx.fillText("m", this.shipdata[i].x - 26 - labelWidth, this.shipdata[i].y + 4);
                }
            }
        }
        this.ctx.restore();
    }

    @watch("isTime")
    public timeFlagChange() {
        if(!this.isTime) this.initCanvas();
        else clearInterval(this.initShipInterval);
    }
}
