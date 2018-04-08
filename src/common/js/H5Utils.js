import Vue from 'vue'
import { TOAST_POS } from 'common/js/config'

let uploadPath = ''

export function Toast(txt){
	if(window.plus){
		plus.nativeUI.toast(txt)
	}else{
		Vue.$vux.toast.text(txt, TOAST_POS)
	}
}

export function initBack(){
	document.addEventListener('plusready', function(){
		plus.navigator.setStatusBarBackground("#3D5C99")
		plus.device.setWakelock(true)
		plus.webview.currentWebview().setStyle({scrollIndicator: 'none',})
		
		var first = null
		plus.key.addEventListener('backbutton',function(){
			if(!first){
				first = new Date().getTime()
				plus.nativeUI.toast('再按一次退出应用')
				setTimeout(function(){
					first = null
				},2000)
			}else{
				if(new Date().getTime() - first < 2000){  
					plus.runtime.quit()
				}
			}
		},false)
		
	})
}

export function setHeadPic() {
	var Parmas = [{title: "拍照"}, {title: "从手机相册选择"}, {title: "选择文件"}];
	plus.nativeUI.actionSheet({title: "修改头像",cancel: "取消",buttons: Parmas}, function(b) {
		switch (b.index) {
			case 0:
				break;
			case 1:
				openCamera();
				break;
			case 2:
				openGallery();
				break;
			case 3:
				PickFile(function(path) {
					hzMUI.upload(path, function(data) {
						console.log(JSON.stringify(data))
					}, function(jd) {
						// console.log("已上传进度" + jd)
					}, function() {
						console.log("上传失败")
					})
				})
				break
			default:
				break
		}
	})
}

export function openCamera(directorName, cb1, cb2, cb3) {
	uploadPath = directorName
	hzMUI.openCamera(function(v, url) {
		hzMUI.upload(url, function(data) {
			if(cb1)cb1(data)
		}, function(jd) {
			if(cb2)cb2(jd)
		}, function() {
			if(cb3)cb3()
		})
	});
}

export function openGallery(directorName, cb1, cb2, cb3) {
	uploadPath = directorName
	// 从相册中选择图片
	plus.gallery.pick(function(e) {
		for (var i in e.files) {
			plus.zip.compressImage({
				src: e.files[i],
				dst: e.files[i],
				overwrite: true,
				quality: 10
			}, function(e) {
				hzMUI.upload(e.target, function(data) {
					if(cb1)cb1(data)
				}, function(jd) {
					if(cb2)cb2(jd)
				}, function() {
					if(cb3)cb3()
				})
			}, function() {
				if(cb3)cb3()
			});
		}
	}, function(e) {
		console.log("取消选择图片");
	}, {
		filter: "none",
		maximum: 9,
		system: false,
		multiple: true
	});
}

export function pickAllFile(directorName, cb1, cb2, cb3){
	uploadPath = directorName
	PickFile(function(path) {
		console.log("PickFile:-------------"+path)
		hzMUI.upload(path, function(data) {
			if(cb1)cb1(data)
		}, function(jd) {
			if(cb2)cb2(jd)
		}, function() {
			if(cb3)cb3()
		})
	})
}

function down(url){
	var hzDown1 = new hzDown();
	hzDown1.init(url,function(d,s){
		if (s == 200) {
			plus.runtime.openFile(d.filename, {}, function(e){
                 console.log( "无法打开此文件："+e.emssage,"我的软件" );
            });
		}else{
			console.log("下载失败");
		}
	},function(jd){
		console.log("下载进度："+jd);
	});
}
export function openFile(url){
	var fileName = url.substring(url.lastIndexOf("/"))
	plus.io.resolveLocalFileSystemURL( "_downloads"+fileName, function(entry){
	 	console.log(entry.fullPath)
	 	plus.runtime.openFile(entry.fullPath, {}, function(e){
            console.log( "无法打开此文件："+e.emssage,"我的软件" );
            Toast("无法打开此文件")
        });
	}, function(error){
		console.log("本地不存在")
	 	down(url)
	});
}





function selectFile(fileId) {
	var ie = navigator.appName == "Microsoft Internet Explorer" ? true : false;
	if (ie) {
		document.getElementById(fileId).click();
	} else {
		var a = document.createEvent("MouseEvents");
		a.initEvent("click", true, true);
		document.getElementById(fileId).dispatchEvent(a);
	}
}

function PickFile(callback, acceptType) {
	var CODE_REQUEST = 1000;
	var main = plus.android.runtimeMainActivity();
	if (plus.os.name == 'Android' && typeof callback == 'function') {
		var Intent = plus.android.importClass('android.content.Intent');
		var intent = new Intent(Intent.ACTION_GET_CONTENT);
		intent.addCategory(Intent.CATEGORY_OPENABLE);
		if (acceptType) {
			intent.setType(acceptType);
		} else {
			intent.setType("*/*");
		}
		main.onActivityResult = function(requestCode, resultCode, data) {
			if (requestCode == CODE_REQUEST) {
				var uri = data.getData();
				plus.android.importClass(uri);
				var Build = plus.android.importClass('android.os.Build');
				var isKitKat = Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT;

				var DocumentsContract = plus.android.importClass('android.provider.DocumentsContract');
				// DocumentProvider
				if (isKitKat && DocumentsContract.isDocumentUri(main, uri)) {
					console.log("版本大于 4.4 ");
					// ExternalStorageProvider
					if ("com.android.externalstorage.documents" == uri.getAuthority()) {
						var docId = DocumentsContract.getDocumentId(uri);
						var split = docId.split(":");
						var type = split[0];

						if ("primary" == type) {
							var Environment = plus.android.importClass('android.os.Environment');
							callback(Environment.getExternalStorageDirectory() + "/" + split[1]);
						} else {
							var System = plus.android.importClass('java.lang.System');
							var sdPath = System.getenv("SECONDARY_STORAGE");
							if (sdPath) {
								callback(sdPath + "/" + split[1]);
							}
						}
					}
					// DownloadsProvider
					else if ("com.android.providers.downloads.documents" == uri.getAuthority()) {
						var id = DocumentsContract.getDocumentId(uri);
						var ContentUris = plus.android.importClass('android.content.ContentUris');
						var contentUri = ContentUris.withAppendedId(
							//	Uri.parse("content://downloads/public_downloads"), Long.valueOf(id));
							Uri.parse("content://downloads/public_downloads"), id);
						callback(getDataColumn(main, contentUri, null, null));
					}
					// MediaProvider
					else if ("com.android.providers.media.documents" == uri.getAuthority()) {
						var docId = DocumentsContract.getDocumentId(uri);
						var split = docId.split(":");
						var type = split[0];

						var MediaStore = plus.android.importClass('android.provider.MediaStore');
						if ("image" == type) {
							contentUri = MediaStore.Images.Media.EXTERNAL_CONTENT_URI;
						} else if ("video" == type) {
							contentUri = MediaStore.Video.Media.EXTERNAL_CONTENT_URI;
						} else if ("audio" == type) {
							contentUri = MediaStore.Audio.Media.EXTERNAL_CONTENT_URI;
						}

						var selection = "_id=?";
						var selectionArgs = new Array();
						selectionArgs[0] = split[1];

						callback(getDataColumn(main, contentUri, selection, selectionArgs));
					}
				}
				// MediaStore (and general)
				else if ("content" == uri.getScheme()) {
					callback(getDataColumn(main, uri, null, null));
				}
				// File
				else if ("file" == uri.getScheme()) {
					callback(uri.getPath());
				}
			}
		}
		main.startActivityForResult(intent, CODE_REQUEST);
	}
}

function getDataColumn(main, uri, selection, selectionArgs) {
	plus.android.importClass(main.getContentResolver());
	var cursor = main.getContentResolver().query(uri, ['_data'], selection, selectionArgs,
		null);
	plus.android.importClass(cursor);
	if (cursor != null && cursor.moveToFirst()) {
		var column_index = cursor.getColumnIndexOrThrow('_data');
		var result = cursor.getString(column_index)
		cursor.close();
		return result;
	}
	return null;
}

var hzMUI = {
	upload: function(url, cb1, cb2, cb3) {
		console.log("uploadPath："+uploadPath)
		hzMUI.uploadData(uploadPath, url, {
			key: "file"
		}, function(s, t) {
			if (s == 200) {
				if (cb1) cb1(JSON.parse(t.responseText))
			} else {
				if (cb3) cb3()
			}
		}, function(jd) {
			// console.log("已上传进度" + jd);
			if (cb2) cb2(jd)
		});
	},
	uploadData: function(url, file, method, CB, CB1) {
		var task = plus.uploader.createUpload(url, {
			method: "POST",
			blocksize: 204800
		}, function(t, status) {
			if (CB) CB(status, t);
		});
		task.addFile(file, method);
		task.addEventListener("statechanged", function() {
			var size = task.uploadedSize;
			var total = task.totalSize;
			if (CB1) CB1(size / total);
		}, false);
		task.start();
	},
	openCamera: function(callback) {
		var cmr = plus.camera.getCamera();
		var res = cmr.supportedImageResolutions[0];
		var fmt = cmr.supportedImageFormats[0];
		console.log("Resolution: " + res + ", Format: " + fmt);
		var _this = this;
		cmr.captureImage(function(path) {
				plus.io.resolveLocalFileSystemURL(path, function(entry) {
					var s = entry.toLocalURL();
					console.log("--------拍照--------" + entry);
					console.log("=======拍照 - 图片路劲======" + s);
					//var ImgChar = _this.uploadHead(s); /*上传图片 s = 图片路径 ImgChar = 图片字符流*/
					plus.zip.compressImage({
						src: s,
						dst: s,
						overwrite: true,
						quality: 10
					}, function(e) {
						console.log(e.size + "--------------" + e.target);
						var ImgChar = _this.uploadHead(e.target);
						if (callback) callback(ImgChar, e.target);
					}, function() {
						plus.nativeUI.toast("拍照上传失败");
					});
				}, function(path) {
					console.log("读取拍照文件错误：" + e.message);
				});
			},
			function(error) {
				//plus.nativeUI.toast(error.message);
			}, {
				resolution: res,
				format: fmt
			}
		);
	},
	uploadHead: function(imgPath) {
		var image = new Image(),
			_this = this;
		image.src = imgPath;
		image.onload = function() {
			var imageData = _this.getBase64Image(image);
			return imageData;
		}
	},
	getBase64Image: function(img) {
		var canvas = document.createElement("canvas");
		var width = img.width;
		var height = img.height;
		if (width > height) {
			if (width > 100) {
				height = Math.round(height *= 100 / width);
				width = 100;
			}
		} else {
			if (height > 100) {
				width = Math.round(width *= 100 / height);
				height = 100;
			}
		}
		canvas.width = width;
		canvas.height = height;
		var ctx = canvas.getContext("2d");
		ctx.drawImage(img, 0, 0, width, height);
		var dataURL = canvas.toDataURL("image/png", 0.8);
		return dataURL;
	}
}

/*
	hzDown 支持单文件、多文件下载
		init(urlarr,cb1,cb2,cb3)
			urlarr ：下载路径
				单文件下载为：String Url 
				多文件下载为：Array Url 
			cb1(download,status) ：下载成功失败回调 status = 200为下载成功
			cb2(jd)：下载过程监听回调 jd返回为进度
			cb3()：多文件下载完返回事件
*/
function hzDown(){
	
}
hzDown.prototype = {
	init : function(urlarr,cb1,cb2,cb3){
		if(Object.prototype.toString.call(urlarr) === '[object Array]'){
			this.length = urlarr.length;
			this.urlarr = urlarr;
			this.recursion(cb1,cb2,cb3);
			this.mark = true;
		}else{
			this.mark = false;
			this.downloadWgt(urlarr,cb1,cb2);
		}
	},
	index : 0,
	length : 0,
	urlarr : null,
	mark:true,
	recursion : function(cb1,cb2,cb3){
		if(this.index != this.length){
			this.downloadWgt(this.urlarr[this.index],cb1,cb2,cb3);
		}else{
			if(cb3)cb3();
			return;
		}
		this.index++;
	},
	task : null,
	downloadWgt : function(url,cb1,cb2,cb3){
		console.log("-----------"+url);
		var _this = this;
		var task = _this.task = plus.downloader.createDownload(url, {}, function (download, status) {
			if(cb1)cb1(download, status);
			if (status == 200) {
				if(_this.mark)_this.recursion(cb1,cb2,cb3);
			} else {
				console.log("下载失败");
			}
		});
		task.addEventListener("statechanged", function (download, status) {
			switch (download.state) {
				case 2:
					console.log("已连接到服务器");
					break;
				case 3:
					var percent = download.downloadedSize / download.totalSize * 100;
					if(cb2)cb2(parseInt(percent));
					break;
				case 4:
					console.log("下载完成");
					break;
			}
		});
		task.start();
	},
	//取消下载
	abort : function(){
		this.task.abort();
	}
}
	