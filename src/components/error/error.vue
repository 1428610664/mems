<template>

	<div class="not-result">
		<div class="not-result-box">
			<div class="icon-wrapper iconfont icon-expressionfailure"></div>
			<p class="text">{{text}}</p>
		</div>
	</div>

</template>

<script>



	export default {
		props: {
			text: {
				type: String,
				default: '加载失败...'
			}
		},
		data (){
			return {

			}
		}
	}

</script>

<style>

.not-result{display:flex;align-items:center;justify-content:center;text-align: center;color: #999;}
.not-result .icon-wrapper{width: 80px;height: 80px;line-height: 80px;font-size: 48px;}

</style>
