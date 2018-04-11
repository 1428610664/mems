
export function actionJson(no, src){
  const urlJson = {
    //服务请求
    No1: ["/services", "确认提交"],				              // 提交请求
    No2: ["/services", "确认暂存"],				              // 暂存请求
    No3: ["/services/{id}/turn", "确认转派"],				  // 转派请求
    No4: ["/services/{id}/reject", "确认驳回"],	      // 驳回请求
    No5: ["/services/{id}/cancel", "确认取消"],				// 取消请求
    No6: ["/services/{id}", "确认删除"],				        // 删除请求
    No7: ["/services/{id}/close", "确认关闭"],			  	// 关闭请求
    No8: ["/services/{id}/evaluate", "确认评价"],			// 评价请求
    No9: ["/services/opinion", "确认添加"],				      // 添加请求处理意见
    No10: ["/services/{id}/update", "确认修改"],			  // 修改请求
    No11: ["/services/{id}/beEvaluate", "确认提交"],  // 待评价请求

    //报障
    No12: ["/faults", "确认提交"],				                 // 提交报障
    No13: ["/faults", "确认暂存"],				                 // 暂存报障
    No14: ["/turnsend/{id}/turn", "确认转派"],				   // 转派报障
    No15: ["/faults/{id}/reject", "确认驳回"],	         // 驳回报障
    No16: ["/faults/{id}/cancel", "确认取消"],				   // 取消报障
    No17: ["/faults/{id}", "确认删除"],				           // 删除报障
    No18: ["/faults/{id}/close", "确认关闭"],			     // 关闭报障
    No19: ["/faults/{id}/evaluate", "确认评价"],			   // 评价报障
    No20: ["/events/opinion", "确认添加"],				       // 添加报障处理意见
    No21: ["/faults/{id}/update", "确认修改"]    	     // 修改报障

  }
  return urlJson["No"+no]
}
