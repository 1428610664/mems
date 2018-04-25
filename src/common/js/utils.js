
export default {
	/*IdentityCodeValid 身份证验证
		code : 身份证号
		return boolean
	*/
	IdentityCodeValid : function(code){
        var city={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江 ",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北 ",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏 ",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外 "};
        var tip = "";
        var pass= true;
        //if(!code || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(code)){
		if (!code || !/^[1-9][0-9]{5}(19[0-9]{2}|200[0-9]|2010)(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])[0-9]{3}[0-9xX]$/i.test(code)) {
            tip = "身份证号格式错误";
            pass = false;
        }else if(!city[code.substr(0,2)]){
            tip = "地址编码错误";
            pass = false;
        }else{
            //18位身份证需要验证最后一位校验位
            if(code.length == 18){
                code = code.split('');
                //加权因子
                var factor = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ];
                //校验位
                var parity = [ 1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2 ];
                var sum = 0;
                var ai = 0;
                var wi = 0;
                for (var i = 0; i < 17; i++){
                    ai = code[i];
                    wi = factor[i];
                    sum += ai * wi;
                }
                var last = parity[sum % 11];
                if(parity[sum % 11] != code[17].toUpperCase()){
                    tip = "校验位错误";
                    pass =false;
                }
            }
        }
        return pass;
    },
	/*isEmpty	判断值是否为空
		val : 值
	*/
	isEmpty : function(val) {
		if(val == null)return true;
		if(val == undefined || val == 'undefined')return true;
		if(val == "")return true;
		if(val.length == 0)return true;
		if(!/[^(^\s*)|(\s*$)]/.test(val))return true;
		return false;
	},
	/*isNotEmpty 元素不为空判断
		val : 值
	*/
	isNotEmpty : function(val){
		return !this.isEmepty(val);
	},
	/*
		isNumber 判断是否是数字
		n : 值
	*/
	isNumber : function(n){
		return !isNaN(parseFloat(n)) && isFinite(n);
	},
	/*
		手机号码验证
	*/
	isPhone : function(val){
		var ref = /^0?1[3|4|5|7|8][0-9]\d{8}$/;
		return !ref.test(val);
	},
	/*
		电话验证
	*/
	 isMobile : function(val){
		var ref =  /^((0\d{2,3})-)?(\d{7,8})(-(\d{3,}))?$/;
		return ref.test(val);
	 },

	/*
		是否是数字、字母、下划线验证
	*/
	isPassword : function(val){
		var ref = /^[0-9a-zA-Z_]{1,}$/;
		return ref.test(val);
	},
	/*
		是否是邮箱
	*/
	isEmail : function(val){
		var ref = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
		return ref.test(val);
	},
  /*
    ip校验 可多个：【,】隔开
   */
  isIp: function(val){
    var ipRegex = /^(?:(?:^|,)(?:[0-9]|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])(?:\.(?:[0-9]|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])){3})+$/;
    return ipRegex.test(val);
  },
	/*
		是否为图片类型
	*/
	isImg : function(val){
		var ref = /\.(gif|jpg|jpeg|png|gif|jpg|png)$/i;
		return ref.test(val);
	},
	isWord : function(val){
		var ref = /\.(doc|docx)$/i;
		return ref.test(val);
	},
	isExcel : function(val){
		var ref = /\.(xls|xlsx)$/i;
		return ref.test(val);
	},
	/*
		银行卡验证
	*/
	bankCheck : function(bankno){
		var num = /^\d*$/;
		var strBin="10,18,30,35,37,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,58,60,62,65,68,69,84,87,88,94,95,98,99"
		var newArr=new Array(),arrJiShu=new Array(),arrJiShu2=new Array(),arrOuShu=new Array(),jishu_child1=new Array(),jishu_child2=new Array();
		var sumJiShu=0,sumOuShu=0,sumJiShuChild1=0,sumJiShuChild2=0,sumTotal=0;

		if (bankno.length < 16 || bankno.length > 19)return false;
		if (!num.exec(bankno))return false;
		if (strBin.indexOf(bankno.substring(0, 2))== -1)return false;
		var lastNum=bankno.substr(bankno.length-1,1),first15Num=bankno.substr(0,bankno.length-1);
		for(var i=first15Num.length-1;i>-1;i--){
			newArr.push(first15Num.substr(i,1));
		}
		for(var j=0;j<newArr.length;j++){
			(j+1)%2==1 ? parseInt(newArr[j])*2<9 ? arrJiShu.push(parseInt(newArr[j])*2) : arrJiShu2.push(parseInt(newArr[j])*2) : arrOuShu.push(newArr[j]);
		}
		for(var h=0;h<arrJiShu2.length;h++){
			jishu_child1.push(parseInt(arrJiShu2[h])%10);
			jishu_child2.push(parseInt(arrJiShu2[h])/10);
		}
		for(var m=0;m<arrJiShu.length;m++){
			sumJiShu=sumJiShu+parseInt(arrJiShu[m]);
		}
		for(var n=0;n<arrOuShu.length;n++){
			sumOuShu=sumOuShu+parseInt(arrOuShu[n]);
		}
		for(var p=0;p<jishu_child1.length;p++){
			sumJiShuChild1=sumJiShuChild1+parseInt(jishu_child1[p]);
			sumJiShuChild2=sumJiShuChild2+parseInt(jishu_child2[p]);
		}
		sumTotal=parseInt(sumJiShu)+parseInt(sumOuShu)+parseInt(sumJiShuChild1)+parseInt(sumJiShuChild2);
		var k= parseInt(sumTotal)%10==0?10:parseInt(sumTotal)%10,luhm = 10-k;
		return lastNum==luhm ? true : false;
	},
	/*

	*/
	posDom : function(fDom,cDom,num){
		var footDomH = fDom.offsetHeight,
		windH = document.documentElement.clientHeight,
		contH = cDom.offsetHeight,
		calc = windH - contH -  num;
		if(calc >= footDomH){
			fDom.style.marginTop = calc-footDomH+"px"
		}
		var _this = this
		window.onresize = function(){
			_this.posDom(fDom,cDom,num);
		}
	},
	//滚动置底回调
	//scrollFoot : function(url,postdata,callback){
	scrollFoot : function(callback){
		window.onscroll = function(){
			var Top = document.documentElement.scrollTop || document.body.scrollTop , innerH = window.innerHeight , windH = document.body.offsetHeight;
			if(windH - (Top + innerH) <= 5){
				//var result = hz.JQAjaxClass(url,postdata);	//jquery封装版本
				//var result = hz.ajaxClass(url,postdata);	//js版本
				if(callback)callback();
			}
		};
	},
	/*
		获取几秒钟以前 startTime==== Date
		return : string 前date
	*/
	getBeforeTime : function(startTime) {
		var startTimeMills = this.transferDate(startTime).getTime();
		var endTimeMills = new Date().getTime();
		var diff = parseInt((endTimeMills - startTimeMills) / 1000);//秒
		var day_diff = parseInt(Math.floor(diff / 86400));//天
		var buffer = Array();
		if (day_diff < 0) {
			return "[error],时间越界...";
		} else {
			if (day_diff == 0 && diff < 60) {
				if (diff <= 0)
					diff = 1;
				buffer.push(diff + "秒前");
			} else if (day_diff == 0 && diff < 120) {
				buffer.push("1 分钟前");
			} else if (day_diff == 0 && diff < 3600) {
				buffer.push(Math.round(Math.floor(diff / 60)) + "分钟前");
			} else if (day_diff == 0 && diff < 7200) {
				buffer.push("1小时前");
			} else if (day_diff == 0 && diff < 86400) {
				buffer.push(Math.round(Math.floor(diff / 3600)) + "小时前");
			} else if (day_diff == 1) {
				buffer.push("1天前");
			} else if (day_diff < 7) {
				buffer.push(day_diff + "天前");
			} else if (day_diff < 30) {
				buffer.push(Math.round(Math.floor(day_diff / 7)) + " 星期前");
			} else if (day_diff >= 30 && day_diff <= 179) {
				buffer.push(Math.round(Math.floor(day_diff / 30)) + "月前");
			} else if (day_diff >= 180 && day_diff < 365) {
				buffer.push("半年前");
			} else if (day_diff >= 365) {
				buffer.push(Math.round(Math.floor(day_diff / 30 / 12)) + "年前");
			}
		}
		return buffer.toString();
	},
	/*转换日期*/
	transferDate : function(date){
		if(typeof date =="string"){
			return new Date(date.replace(/-/ig,"/").replace("T"," "));
		}else if(typeof date =="number"){
			return new Date(date);
		}else{
			return date;
		}
	},
	mix : function(target,source){
		var arr = [];
		var args = arr.slice.call(arguments);

		var i = 1;
		if(args.length==1){
			return target;
		};

		while((source = args[i++])){
			for(var key in source){
				if(source.hasOwnProperty(key)){
					target[key] = source[key];
				}
			}
		}
		return target;
	},
	getQueryString : function(name) {
	    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	    var r = window.location.search.substr(1).match(reg);
	    if (r != null) return unescape(r[2]); return null;
	},
	getDate : function(str, mark){
		if(!str) return ''
		var t = str.substring(str.indexOf("(")+1,str.lastIndexOf(")"))
		var d = new Date(t*1)
		var y = d.getFullYear()
		var M = d.getMonth()+1
		var day = d.getDate()
		var h = d.getHours()
		var m = d.getMinutes()
		var s = d.getSeconds()
		if(mark){
			return y+"-"+this.check(M)+"-"+this.check(day)+" "+this.check(h)+":"+this.check(m)+":"+this.check(s)
		}else{
			return y+"-"+this.check(M)+"-"+this.check(day)
		}
	},
	getCurrentDate : function(){
		var d = new Date()
		var y = d.getFullYear(), M = d.getMonth() + 1, day = d.getDate()
		return y+"-"+this.check(M)+"-"+this.check(day)
	},
	check : function(d){
		return  d < 10 ? "0"+d : d
	},
	parseFileSize : function(size) {
		var fsize = parseFloat(size, 2);
		var fileSizeString;
		if (fsize < 1024) {
			fileSizeString = fsize.toFixed(2) + "B";
		} else if (fsize < 1048576) {
			fileSizeString = (fsize / 1024).toFixed(2) + "KB";
		} else if (fsize < 1073741824) {
			fileSizeString = (fsize / 1024 / 1024).toFixed(2) + "MB";
		} else if (fsize < 1024 * 1024 * 1024) {
			fileSizeString = (fsize / 1024 / 1024 / 1024).toFixed(2) + "GB";
		} else {
			fileSizeString = "0B";
		}
		return fileSizeString;
	},
	isLeapYear : function(year) {
		return ((year % 4) == 0) && ((year % 100) != 0) || ((year % 400) == 0) ? true : false;
	},
	getDays : function(year, mouth) {
		if (mouth == 2) {
			return this.isLeapYear(year) ? 29 : 28;
		} else if (mouth == 1 || mouth == 3 || mouth == 5 || mouth == 7 || mouth == 8 || mouth == 10 || mouth == 12) {
			return 31;
		} else {
			return 30;
		}
	},
	debounce: function(func, delay) {
		let timer
		return function (...args) {
			if (timer) {
		    	clearTimeout(timer)
		    }
		    timer = setTimeout(() => {
		    	func.apply(this, args)
		    }, delay)
		}
	}
}
