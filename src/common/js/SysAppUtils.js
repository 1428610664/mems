export default {

  screenSys: function(_data, assembly) {
    var arr = [],
      arrSys = [],
      aaa;
    if (assembly == "sys") {
      aaa = {
        appName: "",
        appNameNub: 0,
        objName: [{
          objNameNub: "",
          objName: "",
          colony: [{
            colony: "",
            ips: "",
          }],
        }]
      };
    }
    if (assembly == "assembly") {
      aaa = {
        objNameNub: "",
        objName: "",
        colony: [{
          colony: "",
          ips: "",
        }],
      }
    }
    _data.forEach(function(sys, num) {
      if (assembly == "sys") {
        if (arrSys.indexOf(sys.appName) == -1) {
          aaa.appName = sys.appName;
          arr.push(JSON.stringify(aaa));
          arrSys.push(sys.appName)
        } else {}
      }
      if (assembly == "assembly") {
        if (arrSys.indexOf(sys.objName) == -1) {
          aaa.appName = sys.appName;
          aaa.objName = sys.objName;
          arr.push(JSON.stringify(aaa));
          arrSys.push(sys.objName)
        } else {

        }
      }
    });
    var newSys = [];
    arr.forEach(function(v, item) {
      newSys.push(JSON.parse(v));
    });
    arrSys = null;
    aaa = null;
    return newSys;
  },
  screenCom: function(data, assembly) {
    //集群,组件合并
    var newArr = [];
    var newSys = [];
    assembly.forEach(function(ass, num) {
      newSys = [];
      var newAs = [],
        _newCom = ass;
      data.forEach(function(arr, num) {
        if (arr.appName == ass.appName && arr.objName == ass.objName) {
          var aaa = {
            colony: "",
            ips: "",
          };
          for (var key in arr.clu) {
            aaa = {
              colony: key,
              ips: arr.clu[key],
            }
            newAs.push(JSON.stringify(aaa));
          }

        }
      });
      newAs.forEach(function(v, item) {
        newSys.push(JSON.parse(v));
      });
      _newCom.colony = newSys;
      _newCom.objNameNub = newSys.length;
      newArr.push(JSON.stringify(_newCom));
      newAs = null, _newCom = null;
    });
    newSys = [];
    newArr.forEach(function(v, item) {
      newSys.push(JSON.parse(v));
    });
    return newSys;
  },
  mergeSys: function(sys, assembly) {
    //系统,组件合并
    var newArr = [];
    var newSys = [];
    sys.forEach(function(ass, num) {
      newSys = [];
      var newAs = [],
        _newCom = ass;
      assembly.forEach(function(arr, num) {
        if (arr.appName == ass.appName) {
          _newCom.appNameNub = parseInt(_newCom.appNameNub) + parseInt(arr.objNameNub);
          newAs.push(JSON.stringify(arr));
        }
      });
      newAs.forEach(function(v, item) {
        newSys.push(JSON.parse(v));
      });
      _newCom.objName = newSys;
      newArr.push(JSON.stringify(_newCom));
      newAs = null, _newCom = null;
    });
    newSys = [];
    newArr.forEach(function(v, item) {
      newSys.push(JSON.parse(v));
    });
    return newSys;
  },
  loadText: function(row, i) {
    var numId = [];
    var _com = row.objName;
    _com.forEach(function(v, n) {
      if (v.objName != "" && v.objName != null) {
        var _objNameNub = [];
        var _sourse = v.colony;
        _sourse.forEach(function(s, item) { //集群
          var itemNub = [];
          var newIps = [];
          if (Array.isArray(s.ips)) {
            var oldIps = s.ips;
            oldIps.forEach(function(ip) {
              newIps = ip.split(",");
              newIps.forEach(function(ip) {
                itemNub.push({
                  title: ip
                }); //ips
              });
            })
          } else {
            newIps = s.ips.split(",");
            newIps.forEach(function(ip) {
              itemNub.push({
                title: ip
              }); //ips
            });
          }

          _objNameNub.push({
            title: s.colony,
            children: itemNub
          }); //集群
        });
        numId.push({
          title: v.objName,
          children: _objNameNub
        }); //组件
      }
    });
    var aaa = [];
    aaa.push(JSON.stringify({
      title: row.appName,
      children: numId
    }));
    return aaa;
  }


}
