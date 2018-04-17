<template>
	<div ref="wrapper">
		<div class="scroller-trans">
			<div class="ct dropdown" v-show="pulldown" ref="dropdown"><img src='./loading.gif' v-show="isShowLoading" width="20" height="20" />{{dropdownText}}</div>
			<slot></slot>
			<div class="loading-container">
				<loading-page :state="LoadingState"></loading-page>
			</div>
			<loading-page :state="upPullLoadingState" :mark="true"></loading-page>
		</div>
    <div class="iconfont icon-arrowup goTop posct b2 c fz18" @click="goTop" v-show="showGoTop"></div>
	</div>
</template>

<script>

	import BScroll from 'better-scroll'
	import LoadingPage from 'components/loading/loading-page'


	export default {
		data(){
			return {
				// 0:不显示, 1：加载完毕,  2：加载中, 3：加载失败, 4：没数据
				LoadingState: 2,
				upPullLoadingState: 0,
				isShowLoading: false,
				dropdownText: "↓ 下拉刷新",
				isRefreshEnd: true,
        showGoTop: false
			}
		},
		props: {
			contentdown: {
				type: String,
				default: "↓ 下拉刷新"
			},
			contentover: {
				type: String,
				default: "↑ 释放立即刷新"
			},
			contentrefresh: {
				type: String,
				default: "正在刷新..."
			},
			probeType: {
				type: Number,
				default: 3
			},
			click: {
				type: Boolean,
				default: true
			},
			listenScroll: {
				type: Boolean,
				default: false
			},
			data: {
				type: Array,
				default: null
			},
			pulldown: {
				type: Boolean,
				default: false
			},
			pullup: {
				type: Boolean,
				default: false
			},
			beforeScroll: {
				type: Boolean,
				default: false
			},
			refreshDelay: {
				type: Number,
				default: 20
			}
		},
		mounted() {
			setTimeout(() => {
				this._initScroll()
			}, 20)
		},
		methods: {
			_initScroll() {
				if(!this.$refs.wrapper) {
					return
				}
				this.scroll = new BScroll(this.$refs.wrapper, {
					probeType: this.probeType,
					click: this.click
				})

				if(this.listenScroll) {
					this.scroll.on('scroll', (pos) => {
						this.$emit('scroll', pos)
            this.showGoTop = pos.y <= -100 ? true : false
						if(!this.isRefreshEnd) return
						if(pos.y >= 50) {
							this.dropdownText = this.contentover
						}else{
							this.dropdownText = this.contentdown
						}
					})
				}

				if(this.pulldown) {
					this.scroll.on('touchend', (pos) => {
						if(!this.isRefreshEnd) return
						if(pos.y >= 50){
							this.$emit("pullRefresh")
							this.$refs.dropdown.style.position = "relative"
							this.$refs.dropdown.style.top = "0px"
							this.isRefreshEnd = false
							this.dropdownText = this.contentrefresh
							this.scroll.disable()
							this.isShowLoading = true
						}
					})
				}
				if(this.pullup) {
					this.scroll.on('scrollEnd', () => {
						if(this.scroll.y <= (this.scroll.maxScrollY + 50)) {
							this.$emit('scrollToEnd')
						}
					})
				}
				if(this.beforeScroll) {
					this.scroll.on('beforeScrollStart', () => {
						this.$emit('beforeScroll')
					})
				}
			},
			disable() {
				this.scroll && this.scroll.disable()
			},
			enable() {
				this.scroll && this.scroll.enable()
			},
			refresh() {
				this.scroll && this.scroll.refresh()
			},
			scrollTo() {
				this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
			},
			scrollToElement() {
				this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
			},
			/*
				isSuccess: 加载是否成功
				isUpload： 是否为上拉加载
				pullRefresh： 是否是下拉刷新
				content： 内容Array
				totalCount: 内容总条数
			*/
			requestSuccess(isSuccess, isUpload, pullRefresh, content, totalCount){
				if(pullRefresh){
					this.endPullDowmToRefresh()
				}
				if(isSuccess){
					this.upPullLoadingState = 2
					this.LoadingState = 1
					if(content.length == 0){
						this[isUpload ? "upPullLoadingState" : "LoadingState"] = 4
					}
					if(content.length >= totalCount){
						this.upPullLoadingState = content.length < 10 ? 0 : 1
					}
				}else{
					if(isUpload){
						this.upPullLoadingState = 3
					}else{
						this.LoadingState = 3
						this.upPullLoadingState = 0
					}
				}
				this.$emit("loadingStateChange", this.LoadingState)
			},
			requestError(isUpload, pullRefresh){
				if(pullRefresh)this.endPullDowmToRefresh()
				if(isUpload){
					this.upPullLoadingState = 3
				}else{
					this.LoadingState = 3
					this.upPullLoadingState = 0
				}
				this.$emit("loadingStateChange", this.LoadingState)
			},
			endPullDowmToRefresh(){
				this.scroll.enable()
				this.dropdownText = this.contentdown
				this.isRefreshEnd = true
				this.isShowLoading = false
				let i = 0
				let timer = setInterval(() => {
					i++
					if(i == 50){
						clearInterval(timer)
						this.$refs.dropdown.style.position = "absolute"
						this.scroll.scrollTo( 0, 0)
						this.scroll.refresh()
						return
					}
					this.$refs.dropdown.style.top = "-"+i+"px"
					this.scroll.scrollTo( 0, "-"+i)
				}, 4)
			},
      goTop(){
        this.scroll.scrollTo( 0, 0, 200, "easeInOutQuad")
      },
      setLoadingState(state){
			  this.LoadingState = state
      }
		},
		watch: {
			data() {
				setTimeout(() => {
					this.refresh()
				}, this.refreshDelay)
			}
		},
		components: {
			LoadingPage
		}
	}
</script>

<style scoped>

.scroller-trans{min-height: 100%;}
.dropdown{position: absolute;top: -50px;left: 0;width: 100%;height: 50px;line-height: 50px;font-weight: 700;color: #999;}
.dropdown img{vertical-align: middle;margin: -3px 5px 0 0;}

  .goTop{
    width: 40px;
    height: 40px;
    position: absolute;
    bottom: 20px;
    right: 20px;
    z-index: 2;
  }

</style>
