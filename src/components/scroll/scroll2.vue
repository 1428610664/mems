<template>
	<div ref="wrapper">
		<div class="scroller-trans">
			<div class="ct dropdown" ref="dropdown"><img src='./loading.gif' v-show="isShowLoading" width="20" height="20" />{{dropdownText}}</div>
			<slot></slot>
		</div>
	</div>
</template>

<script>
	import BScroll from 'better-scroll'

	export default {
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
				default: 1
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
		data(){
			return {
				isShowLoading: false,
				dropdownText: "↓ 下拉刷新",
				isRefreshEnd: true
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
						if(!this.isRefreshEnd) return
						if(pos.y >= 50) {
							this.dropdownText = this.contentover
						}else{
							this.dropdownText = this.contentdown
						}
					})
				}
				
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
			}
		},
		watch: {
			data() {
				setTimeout(() => {
					this.refresh()
				}, this.refreshDelay)
			}
		}
	}
</script>

<style scoped>
.scroller-trans{min-height: 100%;}
.dropdown{position: absolute;top: -50px;left: 0;width: 100%;height: 50px;line-height: 50px;font-weight: 700;color: #999;}
.dropdown img{vertical-align: middle;margin: -3px 5px 0 0;}

</style>