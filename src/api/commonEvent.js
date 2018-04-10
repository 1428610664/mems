
export function actionJson(no, src){
  const urlJson = {
    No1: [`/services`, "确认提交"],				  // 提交
    No2: ["/services", "确认暂存"],				  // 暂存
  }
  return urlJson["No"+no]
}
