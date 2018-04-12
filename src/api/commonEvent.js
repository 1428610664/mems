
export function actionJson(no, id){
  const urlJson = {
    //服务请求
    No1: ["/services", "提交"],				              // 提交请求
    No2: ["/services", "暂存"],				              // 暂存请求
    No3: [`/services/${id}/turn`, "转派"],				  // 转派请求
    No4: [`/services/${id}/reject`, "驳回", 1],	      // 驳回请求
    No5: [`/services/${id}/cancel`, "取消", 1],				// 取消请求
    No6: [`/services/${id}`, "删除"],				        // 删除请求
    No7: [`/services/${id}/close`, "关闭", 1],			  	// 关闭请求
    No8: [`/services/${id}/evaluate`, "评价"],			// 评价请求
    No9: ["/services/opinion", "添加"],				      // 添加请求处理意见
    No10: [`/services/${id}/update`, "修改"],			  // 修改请求
    No11: [`/services/${id}/beEvaluate`, "提交"],  // 待评价请求

    //报障
    No12: ["/faults", "提交"],				                 // 提交报障
    No13: ["/faults", "暂存"],				                 // 暂存报障
    No14: [`/turnsend/${id}/turn`, "转派"],				   // 转派报障
    No15: [`/faults/${id}/reject`, "驳回"],	         // 驳回报障
    No16: [`/faults/${id}/cancel`, "取消"],				   // 取消报障
    No17: [`/faults/${id}`, "删除"],				           // 删除报障
    No18: [`/faults/${id}/close`, "关闭"],			     // 关闭报障
    No19: [`/faults/${id}/evaluate`, "评价"],			   // 评价报障
    No20: ["/events/opinion", "添加"],				       // 添加报障处理意见
    No21: [`/faults/${id}/update`, "修改"]    	     // 修改报障

  }
  return urlJson["No"+no]
}
