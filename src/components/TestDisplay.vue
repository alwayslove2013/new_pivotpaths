<template>
	<div id="testDisplay_">
		<div id="coreDiv">
			<select v-model="itemOrder" class="order">
				<option value="cited">most cited</option>
				<option value="time">most recent</option>
				<option value="random">random</option>
			</select>
			<div>
				<span>publications about</span>
			</div>
			<div id="coreText"/>
		</div>
		<div id="authorDiv"/>
		<div id="itemDiv"/>
		<div id="tagDiv"/>
		<div id="pathDiv" class="path_div"/>
		<!--<svg>-->
			<!--<rect @click="backSearchView" width="50px" height="50px" style="fill:rgb(0,0,255);stroke-width:1; stroke:rgb(0,0,0)"/>-->
		<!--</svg>-->
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
				itemWidth: 0,
				itemOrder: '',
				gap: 0
			}
		},
		computed: {
			...mapState([
				'core2items',
				'coreType',
				'coreText',
				'authorIdDic',
				'itemIdDic',
				'coreRefList',
				'coreCiteList',
				'coreLeft',
				'tagIdDic'
			])
		},
		mounted () {
			console.log('启动TestView成功！！！');
			this.itemWidth = $(window).height() * 0.25;
			this.itemOrder = 'cited';
			let winWidth = $(window).width();
			this.gap = winWidth / 15
		},
		watch: {
			itemOrder (val) {
				console.log('order', val)
				// d3.select('#itemDiv').selectAll('div')
				// 		.sort((itemA, itemB) => {
				// 			console.log(itemA.year, itemB.year)
				// 			if (val === 'time') {
				// 				return +itemB.year - itemA.year
				// 			}
				// 			if (val === 'cited') {
				// 				return +itemB.cites - itemA.cites
				// 			}
				// 			if (val === 'random') {
				// 				return Math.random() - 0.5
				// 			}
				// 		})
				// 		.each((item) => {
				// 			console.log(item.year)
				// 		})
				let sortF = this.sortItemsByTime;
				let that = this;
				if (val === 'cited') {
					sortF = this.sortItemsByCites
				}
				if (val === 'random') {
					sortF = this.sortItemsByRandom
				}
				if (that.coreType === 'item') {
					that.coreRefList.sort(sortF);
					that.coreCiteList.sort(sortF);
					that.computeCore2items()
				} else {
					that.core2items.sort(sortF)
				}
			},
			core2items (items) {
				let coreWidth = this.drawCoreView()
				// let items = this.core2items
				// console.log('drawItemView', items, coreWidth)
				this.drawItemView(coreWidth)
				this.authors = this.computeAuthors(items)
				let authors = this.authors
				// console.log('authors', authors)
				// authors.forEach((author) => {
				//   console.log('authors', author.items)
				// })
				this.authorsLoc = this.computeAuthorsLoc(authors)
				let authorsLoc = this.authorsLoc
				// console.log('Loc', authorsLoc)
				this.drawAuthorView(authors, authorsLoc, coreWidth)

				this.tags = this.computeTags(items)
				let tags = this.tags
				// console.log('tags', tags)
				this.tagsLoc = this.computeTagsLoc(tags)
				let tagsLoc = this.tagsLoc
				// console.log('tagsLoc', tagsLoc)
				this.drawTagView(tags, tagsLoc, coreWidth)
				this.drawPath()
			}
		},
		methods: {
			...mapActions([
				'updateWord2Titles',
				'updateWord2Authors',
				'updateWord2Tags',
				'computeCore2items',
				'updateCore'
			]),
			sortItemsByTime (itemA, itemB) {
				return +itemB.year - itemA.year
			},
			sortItemsByCites (itemA, itemB) {
				return +itemB.cites - itemA.cites
			},
			sortItemsByRandom (itemA, itemB) {
				let sum = +itemA.year + itemB.year;
				return sum - sum + Math.random() - 0.5
			},
			drawCoreView () {
				let that = this
				d3.select('#coreText').selectAll('span').remove();
				d3.select('#coreText').append('span').attr('id', 'coreSpan').classed('core_' + this.coreType, true).text(this.coreText);
				d3.select('#coreText')
						.on('mousemove', function () {
							let width = d3.select('#coreText').node().getBoundingClientRect().width
							console.log('d3.mouse(this)')
							let distance = width - d3.mouse(this)[0]
							console.log(distance)
							if (distance < 20) {
								console.log('change X')
								$('#coreSpan').removeClass('core_' + that.coreType).addClass('core_' + that.coreType + '_delect')
								$('#coreSpan').click(() => {
									that.backSearchView()
								})
							} else {
								$('#coreSpan').removeClass('core_' + that.coreType + '_delect').addClass('core_' + that.coreType).off('click')
							}
						})
						.on('mouseout', () => {
							$('#coreSpan').removeClass('core_' + that.coreType + '_delect').addClass('core_' + that.coreType).off('click')
						})
				let coreWidth = $('#coreDiv')[0].getBoundingClientRect().width;
				$('#coreDiv').css('left', that.coreLeft * that.gap + $(window).width() * 0.04);
				// console.log('coreWidth', coreWidth)
				return coreWidth
			},
			locX (foo) {
				let sum = 0
				foo.items.forEach((d) => {
					sum += (+d)
				})
				let result = Math.ceil((sum / foo.items.length) * 2) / 2
				return result
			},
			backSearchView () {
				$('#searchView').css('display', 'inherit');
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
				let tagsID = [];
				let tags = [];
				for (let key in items) {
					let item = items[key];
					let itemTagsId = item.tags;
					// console.log(itemAuthorsId)
					itemTagsId.forEach((itemTagId) => {
						// console.log(itemAuthorId)
						let tmp = tagsID.indexOf(itemTagId);
						if (tmp >= 0) {
							tags[tmp].items.push(key)
						} else {
							let name = this.tagIdDic[itemTagId];
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
				let Loc = {};
				authors.forEach((author) => {
					let x = this.locX(author);
					// console.log(author.name, y)
					// if (y in Loc) {
					//   Loc[y].push(author)
					// } else {
					//   Loc[y] = [author]
					// }
					if (x in Loc === false) {
						Loc[x] = {}
					}
					let y = author.items.length;
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
			drawAuthorView (authors, loc, coreWidth) {
				let that = this
				let authorDiv = d3.select('#authorDiv')
				authorDiv.selectAll('div').remove()
				// console.log('authors', authors)
				// console.log('loc', loc)
				for (let X in loc) {
					// console.log('locX', X, loc[X])
					let bigGapCount = Object.keys(loc[X]).length;
					let smallGapCount = 0;
					for (let Y in loc[X]) {
						smallGapCount += (+Object.keys(loc[X][Y]).length)
					}
					let authorViewHeight = +$(window).height() * 0.3;
					let gap = authorViewHeight / (bigGapCount * 3 + smallGapCount);
					let foo = Math.random();
					// let foo = 0
					// console.log(bigGapCount, smallGapCount, gap, authorViewHeight, foo)
					let y = authorViewHeight - 2 * gap * foo;
					// console.log('y', y)
					for (let Y in loc[X]) {
						let authors = loc[X][Y];
						authors.forEach((author) => {
							let x = coreWidth * (X >= that.coreLeft) + that.gap * X + 20;
							y = y - gap;
							author.top = y;
							author.left = x;
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
											text: author.name,
											id: author.id
										};
										console.log('change core', core);
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
			drawTagView (tags, loc, coreWidth) {
				let tagDiv = d3.select('#tagDiv');
				tagDiv.selectAll('div').remove();
				// console.log('authors', authors)
				// console.log('loc', loc)
				for (let X in loc) {
					// console.log('locX', X, loc[X])
					let bigGapCount = Object.keys(loc[X]).length;
					let smallGapCount = 0
					for (let Y in loc[X]) {
						smallGapCount += (+Object.keys(loc[X][Y]).length)
					}
					let tagViewHeight = +$(window).height() * 0.3;
					let gap = tagViewHeight / (bigGapCount * 3 + smallGapCount);
					let foo = Math.random()
					// let foo = 0
					// console.log(bigGapCount, smallGapCount, gap, authorViewHeight, foo)
					let y = $(window).height() * 0.7 + 2 * gap * foo;
					// console.log('y', y)
					for (let Y in loc[X]) {
						let that = this
						let tags = loc[X][Y]
						tags.forEach((tag) => {
							let x = coreWidth * (X >= that.coreLeft) + 20 + that.gap * (+X + 1);
							tag.left = x;
							y = y + gap;
							tag.top = y;
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
											text: tag.name,
											id: tag.id
										}
										console.log('change core', core);
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
			drawItemView (coreWidth) {
				let that = this
				let items = that.core2items;
				let itemDiv = d3.select('#itemDiv');
				itemDiv.selectAll('div').remove();
				let itemDivs = itemDiv.selectAll('div').data(items).enter();
				that.items = [];
				itemDivs
						.append('div')
						.attr('id', (d, i) => {
							return 'item_' + i
						})
						.style('position', 'absolute')
						.style('top', $(window).height() * 0.5 + 'px')
						.style('left', (d, i) => {
							let x = coreWidth * (i >= that.coreLeft) + 20 + that.gap * i;
							let item = {
								id: d.id,
								name: d.name,
								left: x,
								top: $(window).height() * 0.5
							}
							that.items.push(item);
							that.loc2item[i] = item;
							return x + 'px'
						})
						.style('transform', 'rotate(' + 45 + 'deg)')
						.style('text-align', 'center')
						.on('click', (item) => {
							let core = {
								type: 'item',
								text: item.name,
								id: item.id
							}
							console.log('change core', core);
							that.updateCore(core)
						})
						.append('span')
						.classed('item', true)
						.style('text-overflow', 'ellipsis')
						.style('overflow', 'hidden')
						.style('white-space', 'nowrap')
						.style('width', that.itemWidth + 'px')
						.text((d) => {
							return d.name
						})
						.on('mouseover', function (d) {
							d3.select(this).classed('itemHover', true);
							d.authors.forEach((author) => {
								// console.log('author', author)
								$('#' + author).css({
									'background': 'rgb(213,230,236)',
									'border-radius': '0.5em'
								})
								// $('#' + author).css('background', 'rgb(213,230,236)')
								// $('#' + author).css('border-radius', '0.5em')
							});
							d.tags.forEach((tag) => {
								// console.log('tag', tag)
								$('#' + tag).css({
									'background': 'rgb(244,227,230)',
									'border-radius': '0.5em'
								})
								// $('#' + tag).css('background', 'rgb(244,227,230)')
								// $('#' + tag).css('border-radius', '0.5em')
							})
						})
						.on('mouseout', function (d) {
							d3.select(this).classed('itemHover', false);
							d.authors.forEach((author) => {
								$('#' + author).css('background', 'rgba(255,255,255,0.5)')
							});
							d.tags.forEach((tag) => {
								$('#' + tag).css('background', 'rgba(255,255,255,0.5)')
							})
						})
			},
			drawPath () {
				let that = this;
				let pathDiv = d3.select('#pathDiv');
				pathDiv.selectAll('svg').remove();
				let svg = pathDiv.append('svg')
						.attr('width', $(window).width())
						.attr('height', $(window).height());
				let h = '';
				that.authors.forEach((author => {
					author.items.forEach((loc) => {
						// let item = that.loc2item[loc]
						// let endX = item.left + that.itemWidth * (1 - Math.sqrt(2) / 2)
						// let endY = item.top - that.itemWidth * Math.sqrt(2) / 4
						let idAuthor = '#' + author.id;
						let rectAuthor = $(idAuthor)[0].getBoundingClientRect();
						let startX = rectAuthor.left + rectAuthor.width / 2;
						let startY = rectAuthor.top + rectAuthor.height;

						let idItem = '#item_' + loc;
						let rect = $(idItem)[0].getBoundingClientRect();
						let endX = rect.x;
						let endY = rect.y;

						let control2 = $(window).height() * 0.05;
						let control1X = startX;
						let control1Y = endY - control2;

						let control2X = endX - control2;
						let control2Y = endY - control2;

						h += '<path class="author_path" d="M ' + startX + ' ' + startY + ' C ' + control1X + ' ' + control1Y + ' ' + control2X + ' ' + control2Y + ' ' + endX + ' ' + endY + '"/> '
						// console.log('compare', endX, endY)
						// console.log('try?', rect)
					})
				}));
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
						// console.log('compare', endX, endY)
						// console.log('try?', rect)
					})
				}));
				svg.html(h)
			}
		}
	}
</script>

<style scoped>
	.order {
		color: #999;
		border: 1px solid #ddd;
		border-radius: 0.5em;
		cursor: pointer;
		appearance: none;
		padding: 1px 14px 2px 4px;
		font-size: 16px;
		background: rgba(255,255,255,1) url('../assets/dropdown.png') no-repeat right center;
	}

	#coreDiv {
		position: absolute;
		left: 1%;
		top: 45%;
		color: #999;
		font-size: 16px;
		line-height: 30px;
	}

	#authorDiv {
		position: absolute;
		z-index: 50;
	}

	#itemDiv {
		position: absolute;
		z-index: 50;
	}

	#tagDiv {
		position: absolute;
		z-index: 50;
	}

	.path_div {
		position: absolute;
		top: 0px;
		left: 0px;
		pointer-events: none;
		z-index: 10;
	}

	#testDispaly_ {
		font-size: 20px;
		text-align: center;
	}
</style>
