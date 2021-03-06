var app = require('app');
const Cell = require("Cell");

var shuduTool = app.BaseClass.extend({

    Init:function(){
        this.JS_Name = "shuduTool";

        this.InitConfig();

        cc.log("shuduTool Init");
    },

    //切换账号
    OnReload:function(){

    },

    /**
     * 初始化配置
     */
    InitConfig:function(){
        this.shudu = [];
        this.temporary = [];
        this.index = 0;
        this.isRestore = false;
        this.SetShuDuArray();
    },



    //--------------------------设置接口----------------------------------
    /**
     * 获取数独数组
     * @param option
     */
    SetShuDuArray:function(){
        for(let i = 0 ; i < 9 ; i++){
            this.shudu[i] = [];
            for(let j = 0 ; j < 9 ; j++){

                let shuduNum = this.checkArray(i,j);
                //cc.log("111111111111111",shuduNum);
                if (shuduNum == undefined){
                    cc.log("---------------------------------------------------");
                    return false;
                }
                else {
                    this.shudu[i][j] = parseInt(shuduNum);
                    //cc.log("this.shudu111111111[%s][%s] = %s",i,j,this.shudu[i][j]);
                }


            }
        }
        //cc.log("shudu:",this.shudu);
        //cc.log("this.shudu[%s][%s] = %s",1,3,this.shudu[1][3]);
    },

    //--------------------------获取接口----------------------------------

    GetShuDuArray:function () {
        if (this.shudu.length == 9 && this.shudu[8].length == 9){
            return this.shudu;
        }
        return [];
    },

    //检查填写的是否正确
    GetCheckIsTrueArray:function (cellIndex) {
        let hengArray = [];
        let shuArray = [];
        let gongArray = [];
        let hengNum = parseInt(cellIndex / 9,10);

        for (let h = hengNum * 9; h < hengNum * 9 + 9 ; h++){

            hengArray.push(h);
        }

        for (let sJia = cellIndex; sJia < 81 ; sJia = sJia + 9){
            shuArray.push(sJia);
        }

        for (let sJian = cellIndex; sJian >= 0 ; sJian = sJian - 9){
            shuArray.push(sJian);
        }

        let gongHNum = hengNum % 3;
        let gongSNum = cellIndex % 3;

        let zuoShangJiaoNum = (cellIndex - gongSNum) - gongHNum * 9;


        for (let gong1 = 0; gong1 < 3 ; gong1++){
            let initNum = zuoShangJiaoNum + gong1;
            gongArray.push(initNum);
            gongArray.push(initNum+9);
            gongArray.push(initNum+18);
        }

        // cc.log("heng",hengArray);
        // cc.log("shu",shuArray);
        // cc.log("gong",gongArray);

        let zongArray = [];
        zongArray = zongArray.concat(hengArray,shuArray,gongArray);
        zongArray = this.unique(zongArray);
        return zongArray;

    },

    //检查是否赢得游戏aaaa
    CheckWin(cells){

        for (let i = 0; i < cells.length; i++) {

            if (i%9 === 0){
                let baseNum = parseInt(i/9,10) * 9;
                let checkArray = [];
                for (let a = 0; a < 9; a++){
                    let cell = cells[baseNum+a].getComponent(Cell);

                    if (!cell.txt.string){
                        return false;
                    }

                    if (cell.candidatesShown.length != 1){
                        return false;
                    }
                    checkArray.push(cell.txt.string);
                    if (a == 8){
                        let winIs = this.checkIsReArray(checkArray);
                        if (winIs){
                            return false;
                        }
                    }
                }
            }


        }

        return true;
    },

    //--------------------------方法----------------------------------

    //数组去重复
    unique:function(arr) {
        let result = [], hash = {};
        for (let i = 0, elem; (elem = arr[i]) != null; i++) {
            if (!hash[elem]) {
                result.push(elem);
                hash[elem] = true;
            }
        }
        return result;
    },

    //数组是否重复
    checkIsReArray:function(arr) {
        let result = [], hash = {};
        for (let i = 0, elem; (elem = arr[i]) != null; i++) {
            if (!hash[elem]) {
                result.push(elem);
                hash[elem] = true;
            }
            else {
                return true;
            }
        }
        return false;
    },

    takeArray:function (index) {
        if (this.temporary.length < 1){
            let linArray = [1,2,3,4,5,6,7,8,9]; //补充临时变量a
            for(let q = 0 ; q < 9; ++q){
                let index2 = parseInt(Math.random()*(linArray.length), 10);
                //cc.log("index",index,"length",linArray.length);
                this.temporary.push(linArray.splice(index2,1)[0]);
            }

        }
        if (this.temporary.length > 0 && this.temporary.length > index){
            return this.temporary[index];//返回临时一个数a
        }
        cc.error("this.temporary no find");
    },

    sureArray:function (shuduNum) {
        if (this.temporary.length > 0 && this.temporary.indexOf(shuduNum) != -1){
            //cc.log("this.temporary:%s,index:%s,shuduNum:%s",this.temporary.toString(),this.temporary.indexOf(shuduNum),shuduNum);
            this.temporary.splice(this.temporary.indexOf(shuduNum),1);//最终数确定拿走
            //cc.log("this.temporary:%s",this.temporary.toString())//a
        }
    },

    checkArray:function (i,j,isCheck = false) {



        if (isCheck){
            this.index += 1;
            if (this.index >= this.temporary.length){
                this.index = 0;
                this.isRestore = true;
            }
        }


        if (this.isRestore){
            this.isRestore = false;
            //cc.log("isRestore____________________________________________________",i);
            this.isRestoreArray(i);
            return;
        }

        let shuduNum = parseInt(this.takeArray(this.index));

        //cc.log("this.index:%s,shuduNum:%s",this.index,shuduNum);//aaaa

        if (i == 1 || i == 2 || i == 4 ||i == 5 || i == 7){
            let base;

            if (i == 1 || i == 2){
                base = 0;
            }
            else if (i == 4 ||i == 5){
                base = 3;
            }
            else if (i == 7 || i == 8){
                base = 6;
            }

            while (j < 3){
                for(let a = 0; a < 3; a++){

                    for (let d = base; d < i; d++){
                        let cunNum = this.shudu[d][a];
                        if (cunNum == shuduNum){
                            shuduNum = this.checkArray(i,j,true);
                        }
                    }

                }

                for (let g = 0; g < i; g++){
                    let cunNum = this.shudu[g][j];
                    //cc.log("cunNum",cunNum);
                    if (cunNum == shuduNum){
                        shuduNum = this.checkArray(i,j,true);
                    }
                }

                this.sureArray(parseInt(shuduNum));
                this.index = 0;
                //cc.log("return33333,shuduNum:%s",shuduNum);//aaa
                return shuduNum;
            }
            while (j < 6){
                for(let b = 3; b < 6; b++){

                    for (let e = base; e < i; e++){
                        let cunNum = this.shudu[e][b];
                        if (cunNum == shuduNum){
                            shuduNum = this.checkArray(i,j,true);
                        }
                    }


                }

                for (let g = 0; g < i; g++){
                    let cunNum = this.shudu[g][j];
                    //cc.log("cunNum",cunNum);
                    if (cunNum == shuduNum){
                        shuduNum = this.checkArray(i,j,true);
                    }
                }

                this.sureArray(parseInt(shuduNum));
                this.index = 0;
                //cc.log("return666666,shuduNum:%s",shuduNum);//aa
                return shuduNum;
            }
            while (j < 9){
                for(let c = 6; c < 9; c++){

                    for (let f = base; f < i; f++){
                        let cunNum = this.shudu[f][c];
                        if (cunNum == shuduNum){
                            shuduNum = this.checkArray(i,j,true);
                        }
                    }

                }

                for (let g = 0; g < i; g++){
                    let cunNum = this.shudu[g][j];
                    //cc.log("cunNum",cunNum);
                    if (cunNum == shuduNum){
                        shuduNum = this.checkArray(i,j,true);
                    }
                }


                this.sureArray(parseInt(shuduNum));
                this.index = 0;
                //cc.log("return999999,shuduNum:%s",shuduNum);//aaa
                return shuduNum;
            }
        }
        else if (i == 3 || i==6){
            while (j < 3){
                for (let d = 0; d < i; d++){
                    let cunNum = this.shudu[d][j];
                    //cc.log("cunNum",cunNum);
                    if (cunNum == shuduNum){
                        shuduNum = this.checkArray(i,j,true);
                    }
                }
                this.sureArray(parseInt(shuduNum));
                this.index = 0;
                //cc.log("return33333,shuduNum:%s",shuduNum);//aaa
                return shuduNum;
            }
            while (j < 6){
                for (let e = 0; e < i; e++){
                    let cunNum = this.shudu[e][j];
                    if (cunNum == shuduNum){
                        shuduNum = this.checkArray(i,j,true);
                    }
                }
                this.sureArray(parseInt(shuduNum));
                this.index = 0;
                //cc.log("return666666,shuduNum:%s",shuduNum);//aa
                return shuduNum;
            }
            while (j < 9){
                for (let f = 0; f < i; f++){
                    let cunNum = this.shudu[f][j];
                    if (cunNum == shuduNum){
                        shuduNum = this.checkArray(i,j,true);
                    }
                }
                this.sureArray(parseInt(shuduNum));
                this.index = 0;
                //cc.log("return999999,shuduNum:%s",shuduNum);//aaa
                return shuduNum;
            }
        }
        else if (i == 8){
            let lastArray = [1,2,3,4,5,6,7,8,9];
            for (let a = 0; a < i; a++){
                let num = this.shudu[a][j];
                lastArray.splice(lastArray.indexOf(num),1);
            }
            shuduNum = lastArray[0];
            return shuduNum;
        }
        this.sureArray(parseInt(shuduNum));
        this.index = 0;
        return shuduNum;

    },

    isRestoreArray:function (a) {
        this.temporary = [];
        for(let i = a ; i < 9 ; i++){
            this.shudu[i] = [];
            for(let j = 0 ; j < 9 ; j++){
                let shuduNum = this.checkArray(i,j);
                if (shuduNum == undefined){
                    //cc.log("---------------------------------------------------");
                    return false;
                }
                else {
                    this.shudu[i][j] = parseInt(shuduNum);

                    //cc.log("this.shudu22222222222222[%s][%s] = %s",i,j,this.shudu[i][j]);
                }

            }
        }
        //cc.log("shuduzzzzzzzzzzzzzzzzzzzzzzzzzzz:",this.shudu);

    },

});


var g_shuduTool = null;

/**
 * 绑定模块外部方法
 */
exports.GetModel = function(){
    if(!g_shuduTool){
        g_shuduTool = new shuduTool();
    }
    return g_shuduTool;
};