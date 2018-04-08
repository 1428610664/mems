<template>
	<footer class="b">
		<ul class="c4 fbox">
			<router-link tag="li" @mouseover.native="changeTitle(0)" to="/page1" class="flex">
				<i class="icon iconfont icon-shouye"></i>
				<p>首页</p>
			</router-link>
			<router-link to="/page2" tag="li" @mouseover.native="changeTitle(1)" class="flex">
				<i class="icon iconfont icon-shenqing"></i>
				<p>申请</p>
			</router-link>
			<router-link to="/page3" tag="li" @mouseover.native="changeTitle(2)" class="flex">
				<i class="icon iconfont icon-daiban"></i>
				<p>待办</p>
			</router-link>
			<router-link to="/page4" tag="li" @mouseover.native="changeTitle(3)" class="flex">
				<i class="icon fz24 iconfont icon-wo"></i>
				<p>我</p>
			</router-link>
		</ul>
	</footer>

</template>

<script>

	const title = ["首页","申请","待办","我"]

	export default {
		data() {
			return {

			}
		},
		methods: {
			changeTitle(index){
				this.$emit("change-title",title[index]);
			}
		},
		created() {

		}
	}
</script>

<style scoped>
footer{position: fixed;bottom: 0;left: 0;width: 100%;height: 50px;}
footer:before{content: "";display: block;width: 100%;height: 1px;background: #3D5C99;-webkit-transform: scaleY(.4);transform: scaleY(.4);}
footer .icon{margin: 5px 0 3px;display: inline-block;width: 22px;height: 22px;font-size: 20px;background: red}
footer .router-link-active{color: #3D5C99;}
</style>
