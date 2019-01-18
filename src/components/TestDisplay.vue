<template>
	<div id="testDisplay_">
		<div id="coreDiv">
			<div>
				<span id="coreSpan">{{coreText}}</span>
			</div>
		</div>
		<div id="authorDiv"/>
		<div id="itemDiv"/>
		<div id="tagDiv"/>
		<div id="pathDiv" class="path_div"/>
		<svg>
			<rect @click="backSearchView" width="50px" height="50px" style="fill:rgb(0,0,255);stroke-width:1; stroke:rgb(0,0,0)"/>
		</svg>
	</div>
</template>

<script>
	import $ from 'jquery'
	import { mapState, mapActions } from 'vuex'

	const d3 = require('d3')

	export default {
		name: 'TestDisplay',
		data () {
			return {
				authors: [],
				authorsLoc: [],
				tags: [],
				tagsLoc: [],
				items: [],
				loc2item: {},
				itemWidth: 0
			}
		},
		computed: {
			...mapState([
				'core2items',
				'coreType',
				'coreText',
				'authorIdDic',
				'itemIdDic',
				'tagIdDic'
			])
		},
		mounted () {
			console.log('启动TestView成功！！！')
			this.itemWidth = $(window).height() * 0.25
		},
		watch: {
			coreText () {
				let winHeight = $(window).height()
				$('#coreDiv').css('transform', 'translate(' + 50 + 'px, ' + winHeight / 2 + 'px)')
				$('#coreSpan').removeClass().addClass(this.coreType)
			},
			core2items (items) {
				this.drawItemView(items)
				this.authors = this.computeAuthors(items)
				let authors = this.authors
				console.log('authors', authors)
				// authors.forEach((author) => {
				//   console.log('authors', author.items)
				// })
				this.authorsLoc = this.computeAuthorsLoc(authors)
				let authorsLoc = this.authorsLoc
				console.log('Loc', authorsLoc)
				this.drawAuthorView(authors, authorsLoc)

				this.tags = this.computeTags(items)
				let tags = this.tags
				// console.log('tags', tags)
				this.tagsLoc = this.computeTagsLoc(tags)
				let tagsLoc = this.tagsLoc
				// console.log('tagsLoc', tagsLoc)
				this.drawTagView(tags, tagsLoc)
				this.drawPath()
			}
		},
		methods: {
			...mapActions([
				'updateWord2Titles',
				'updateWord2Authors',
				'updateWord2Tags',
				'updateCore'
			]),
			locX (foo) {
				let sum = 0
				foo.items.forEach((d) => {
					sum += (+d)
				})
				let result = Math.ceil((sum / foo.items.length) * 2) / 2
				return result
			},
			backSearchView () {
				$('#searchView').css('display', 'inherit')
				$('#testDisplay').css('display', 'none')
			},
			computeAuthors (items) {
				let authorsID = []
				let authors = []
				for (let key in items) {
					let item = items[key]
					let itemAuthorsId = item.authors
					// console.log(itemAuthorsId)
					itemAuthorsId.forEach((itemAuthorId) => {
						// console.log(itemAuthorId)
						let tmp = authorsID.indexOf(itemAuthorId)
						if (tmp >= 0) {
							authors[tmp].items.push(key)
						} else {
							let name = this.authorIdDic[itemAuthorId]
							if (name !== this.coreText) {
								let author = {
									name: name,
									id: itemAuthorId,
									items: [key],
									left: 0,
									top: 0
								}
								authorsID.push(itemAuthorId)
								authors.push(author)
								// console.log(authors)
							}
						}
					})
				}
				return authors
			},
			computeTags (items) {
				let tagsID = []
				let tags = []
				for (let key in items) {
					let item = items[key]
					let itemTagsId = item.tags
					// console.log(itemAuthorsId)
					itemTagsId.forEach((itemTagId) => {
						// console.log(itemAuthorId)
						let tmp = tagsID.indexOf(itemTagId)
						if (tmp >= 0) {
							tags[tmp].items.push(key)
						} else {
							let name = this.tagIdDic[itemTagId]
							if (name !== this.coreText) {
								let tag = {
									name: name,
									id: itemTagId,
									items: [key],
									left: 0,
									top: 0
								}
								tagsID.push(itemTagId)
								tags.push(tag)
								// console.log(authors)
							}
						}
					})
				}
				return tags
			},
			computeAuthorsLoc (authors) {
				let Loc = {}
				authors.forEach((author) => {
					let x = this.locX(author)
					// console.log(author.name, y)
					// if (y in Loc) {
					//   Loc[y].push(author)
					// } else {
					//   Loc[y] = [author]
					// }
					if (x in Loc === false) {
						Loc[x] = {}
					}
					let y = author.items.length
					if (y in Loc[x]) {
						Loc[x][y].push(author)
					} else {
						Loc[x][y] = [author]
					}
				})
				return Loc
			},
			computeTagsLoc (tags) {
				let Loc = {}
				tags.forEach((tag) => {
					let x = this.locX(tag)
					// console.log(author.name, y)
					// if (y in Loc) {
					//   Loc[y].push(author)
					// } else {
					//   Loc[y] = [author]
					// }
					if (x in Loc === false) {
						Loc[x] = {}
					}
					let y = tag.items.length
					if (y in Loc[x]) {
						Loc[x][y].push(tag)
					} else {
						Loc[x][y] = [tag]
					}
				})
				return Loc
			},
			drawAuthorView (authors, loc) {
				let that = this
				let authorDiv = d3.select('#authorDiv')
				authorDiv.selectAll('div').remove()
				// console.log('authors', authors)
				// console.log('loc', loc)
				for (let X in loc) {
					// console.log('locX', X, loc[X])
					let bigGapCount = Object.keys(loc[X]).length
					let smallGapCount = 0
					for (let Y in loc[X]) {
						smallGapCount += (+Object.keys(loc[X][Y]).length)
					}
					let authorViewHeight = +$(window).height() * 0.3
					let gap = authorViewHeight / (bigGapCount * 3 + smallGapCount)
					let foo = Math.random()
					// let foo = 0
					// console.log(bigGapCount, smallGapCount, gap, authorViewHeight, foo)
					let y = authorViewHeight - 2 * gap * foo
					// console.log('y', y)
					for (let Y in loc[X]) {
						let authors = loc[X][Y]
						authors.forEach((author) => {
							let x = (+$(window).width()) * 0.1 + (+$(window).width()) / 15 * X
							y = y - gap
							author.top = y
							author.left = x
							// console.log('y', y)
							// console.log($(window).width(), $(window).height())
							// console.log('author', author, x, y)
							authorDiv
									.append('div')
									.attr('id', author.id)
									.style('position', 'absolute')
									.style('top', y + 'px')
									.style('left', x + 'px')
									.style('text-align', 'center')
									.on('click', () => {
										let core = {
											type: 'author',
											text: author.name
										}
										console.log('change core', core)
										that.updateCore(core)
									})
									.append('span')
									.classed('author', true)
									.style('text-overflow', 'ellipsis')
									.style('overflow', 'hidden')
									.style('white-space', 'nowrap')
									// .style('width', 320 + 'px')
									.text(author.name)
						})
						y = y - 3 * gap
					}
				}
			},
			drawTagView (tags, loc) {
				let tagDiv = d3.select('#tagDiv')
				tagDiv.selectAll('div').remove()
				// console.log('authors', authors)
				// console.log('loc', loc)
				for (let X in loc) {
					// console.log('locX', X, loc[X])
					let bigGapCount = Object.keys(loc[X]).length
					let smallGapCount = 0
					for (let Y in loc[X]) {
						smallGapCount += (+Object.keys(loc[X][Y]).length)
					}
					let tagViewHeight = +$(window).height() * 0.3
					let gap = tagViewHeight / (bigGapCount * 3 + smallGapCount)
					let foo = Math.random()
					// let foo = 0
					// console.log(bigGapCount, smallGapCount, gap, authorViewHeight, foo)
					let y = $(window).height() * 0.7 + 2 * gap * foo
					// console.log('y', y)
					for (let Y in loc[X]) {
						let that = this
						let tags = loc[X][Y]
						tags.forEach((tag) => {
							let x = (+$(window).width()) * 0.2 + (+$(window).width()) / 15 * X
							tag.left = x
							y = y + gap
							tag.top = y
							// console.log('y', y)
							// console.log($(window).width(), $(window).height())
							// console.log('author', author, x, y)
							tagDiv
									.append('div')
									.attr('id', tag.id)
									.style('position', 'absolute')
									.style('top', y + 'px')
									.style('left', x + 'px')
									.style('text-align', 'center')
									.on('click', () => {
										let core = {
											type: 'tag',
											text: tag.name
										}
										console.log('change core', core)
										that.updateCore(core)
									})
									.append('span')
									.classed('tag', true)
									.style('text-overflow', 'ellipsis')
									.style('overflow', 'hidden')
									.style('white-space', 'nowrap')
									// .style('width', 320 + 'px')
									.text(tag.name)
						})
						y = y + 3 * gap
					}
				}
			},
			drawItemView (items) {
				let that = this
				let itemDiv = d3.select('#itemDiv')
				itemDiv.selectAll('div').remove()
				let itemDivs = itemDiv.selectAll('div').data(items).enter()
				// itemDivs
				//   .append('svg')
				//   .attr('width', 10)
				//   .attr('height', 10)
				//   .style('transform', (d, i) => {
				//     let winWidth = $(window).width()
				//     let winHeight = $(window).height()
				//     let x = winWidth * 0.1 + winWidth / 20 * i
				//     let y = winHeight * 0.6
				//     return 'translate(' + x + 'px, ' + y + 'px)'
				//   })
				//   .append('rect')
				//   .attr('width', 8 + 'px')
				//   .attr('height', 8 + 'px')
				//   .style('fill', 'red')
				that.items = []
				itemDivs
						.append('div')
						.attr('id', (d, i) => {
							return 'item_' + i
						})
						.style('position', 'absolute')
						.style('top', $(window).height() * 0.5 + 'px')
						.style('left', (d, i) => {
							let winWidth = $(window).width()
							let x = winWidth * 0.1 + winWidth / 15 * i
							let item = {
								id: d.id,
								name: d.name,
								left: x,
								top: $(window).height() * 0.5
							}
							that.items.push(item)
							that.loc2item[i] = item
							return x + 'px'
						})
						.style('transform', 'rotate(' + 45 + 'deg)')
						.style('text-align', 'center')
						.append('span')
						.classed('item', true)
						.style('text-overflow', 'ellipsis')
						.style('overflow', 'hidden')
						.style('white-space', 'nowrap')
						.style('width', that.itemWidth + 'px')
						.text((d) => {
							return d.name
						})
			},
			drawPath () {
				let that = this
				let pathDiv = d3.select('#pathDiv')
				pathDiv.selectAll('svg').remove()
				let svg = pathDiv.append('svg')
						.attr('width', $(window).width())
						.attr('height', $(window).height())
				let h = ''
				that.authors.forEach((author => {
					author.items.forEach((loc) => {
						// let item = that.loc2item[loc]
						// let endX = item.left + that.itemWidth * (1 - Math.sqrt(2) / 2)
						// let endY = item.top - that.itemWidth * Math.sqrt(2) / 4
						let idAuthor = '#' + author.id
						let rectAuthor = $(idAuthor)[0].getBoundingClientRect()
						let startX = rectAuthor.left + rectAuthor.width / 2
						let startY = rectAuthor.top + rectAuthor.height

						let idItem = '#item_' + loc
						let rect = $(idItem)[0].getBoundingClientRect()
						let endX = rect.x
						let endY = rect.y

						let control2 = $(window).height() * 0.05
						let control1X = startX
						let control1Y = endY - control2

						let control2X = endX - control2
						let control2Y = endY - control2

						h += '<path class="author_path" d="M ' + startX + ' ' + startY + ' C ' + control1X + ' ' + control1Y + ' ' + control2X + ' ' + control2Y + ' ' + endX + ' ' + endY + '"/> '
						console.log('compare', endX, endY)
						console.log('try?', rect)
					})
				}))
				that.tags.forEach((tag => {
					tag.items.forEach((loc) => {
						// let item = that.loc2item[loc]
						// let endX = item.left + that.itemWidth * (1 - Math.sqrt(2) / 2)
						// let endY = item.top - that.itemWidth * Math.sqrt(2) / 4
						let idTag = '#' + tag.id
						let rectTag = $(idTag)[0].getBoundingClientRect()
						let startX = rectTag.left + rectTag.width / 2
						let startY = rectTag.top

						let idItem = '#item_' + loc
						let rect = $(idItem)[0].getBoundingClientRect()
						let endX = rect.x + rect.width
						let endY = rect.y + rect.height

						let control2 = $(window).height() * 0.05
						let control1X = startX
						let control1Y = endY + control2

						let control2X = endX + control2
						let control2Y = endY + control2

						h += '<path class="tag_path" d="M ' + startX + ' ' + startY + ' C ' + control1X + ' ' + control1Y + ' ' + control2X + ' ' + control2Y + ' ' + endX + ' ' + endY + '"/> '
						console.log('compare', endX, endY)
						console.log('try?', rect)
					})
				}))
				svg.html(h)
			}
		}
	}
</script>

<style scoped>
	.author {
		color: #004787;
		font-size: 16px;
		background: rgba(255,255,255,.5);
		border-radius: 1.5em;
		border: 2px solid #3488BC;
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
		max-width: 150px;
		padding-left: 18px;
		padding-right: 4px;
		background: url("../assets/author5.png") no-repeat left center;
	}
	.path_div {
		position: absolute;
		top: 0px;
		left: 0px;
		pointer-events: none;
	}
	#testDispaly_ {
		font-size: 20px;
	}
</style>
