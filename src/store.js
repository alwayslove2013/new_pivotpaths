import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

const state = {
	coreType: String,
	coreText: String,
	coreId: String,
	compareCoreType: String,
	compareCoreText: String,
	compareCoreId: String,
	oldCoreType: String,
	oldCoreText: String,
	oldCoreId: String,
	word2titles: [],
	word2tags: [],
	word2authors: [],
	core2items: [],
	compareCore2items: [],
	oldCore2items: [],
	coreRefList: [],
	coreCiteList: [],
	authorIdDic: {},
	itemIdDic: {},
	tagIdDic: {},
	coreLeft: 0,
	coreRight: 0,
	isCompare: false,
	isItemView: false,
	oldLeft: [],
	insect: [],
	compareLeft: []
}

const getters = {}

const types = {
	UPDATE_WORD2TITLES: 'UPDATE_WORD2TITLES',
	UPDATE_WORD2TAGS: 'UPDATE_WORD2TAGS',
	UPDATE_WORD2AUTHORS: 'UPDATE_WORD2AUTHORS',
	UPDATE_CORE_TYPE: 'UPDATE_CORE_TYPE',
	UPDATE_CORE_TEXT: 'UPDATE_CORE_TEXT',
	UPDATE_CORE_ID: 'UPDATE_CORE_ID',
	UPDATE_CORE2ITEMS: 'UPDATE_CORE2ITEMS',
	UPDATE_AUTHORIDDIC: 'UPDATE_AUTHORIDDIC',
	UPDATE_ITEMIDDIC: 'UPDATE_ITEMIDDIC',
	UPDATE_TAGIDDIC: 'UPDATE_TAGIDDIC',
	UPDATE_CORE: 'UPDATE_CORE',
	UPDATE_COMPARE_CORE: 'UPDATE_COMPARE_CORE',
	UPDATE_OLD_CORE: 'UPDATE_OLD_CORE',
	UPDATE_COMPARECORE2ITEMS: 'UPDATE_COMPARECORE2ITEMS',
	UPDATE_REF_CITE: 'UPDATE_REF_CITE',
	UPDATE_CORELEFT: 'UPDATE_CORELEFT',
	UPDATE_CORERIGHT: 'UPDATE_CORERIGHT',
	COMPUTE_CORE2ITEMS: 'COMPUTE_CORE2ITEMS',
	UPDATE_ISCOMPARE: 'UPDATE_ISCOMPARE',
	UPDATE_ISITEMVIEW: 'UPDATE_ISITEMVIEW',
	UPDATE_INSECT: 'UPDATE_INSECT'
}

const mutations = {
	[types.UPDATE_WORD2TITLES] (state, payload) {
		state.word2titles = payload
	},
	[types.UPDATE_WORD2TAGS] (state, payload) {
		state.word2tags = payload
	},
	[types.UPDATE_WORD2AUTHORS] (state, payload) {
		state.word2authors = payload
	},
	[types.UPDATE_COMPARE_CORE] (state, payload) {
		state.compareCoreType = payload.type
		state.compareCoreText = payload.text
		state.compareCoreId = payload.id
	},
	[types.UPDATE_COMPARECORE2ITEMS] (state, payload) {
		state.compareCore2items = payload
	},
	[types.UPDATE_CORE] (state, payload) {
		state.coreType = payload.type
		state.coreText = payload.text
		state.coreId = payload.id
	},
	[types.UPDATE_ISCOMPARE] (state, payload) {
		state.isCompare = payload
	},
	[types.UPDATE_ISITEMVIEW] (state, payload) {
		state.isItemView = payload
	},
	[types.UPDATE_OLD_CORE] (state) {
		if (state.isCompare) {
			state.coreType = state.compareCoreType
			state.coreText = state.compareCoreText
			state.coreId = state.compareCoreId

			state.oldCoreType = state.compareCoreType
			state.oldCoreText = state.compareCoreText
			state.oldCoreId = state.compareCoreId
			state.oldCore2items = [...state.compareCore2items]  // 测试只是一层深度复制
		} else {
			state.oldCoreType = state.coreType
			state.oldCoreText = state.coreText
			state.oldCoreId = state.coreId
			state.oldCore2items = [...state.core2items]  // 测试只是一层深度复制
		}
		console.log('oldCoreText', state.oldCoreText)
	},
	[types.UPDATE_REF_CITE] (state, payload) {
		state.coreRefList = payload.refList
		state.coreCiteList = payload.citeList
		state.coreLeft = payload.refList.length
		state.isItemView = true
	},
	[types.UPDATE_CORE2ITEMS] (state, payload) {
		state.core2items = payload
	},
	[types.UPDATE_AUTHORIDDIC] (state, payload) {
		state.authorIdDic = payload
	},
	[types.UPDATE_ITEMIDDIC] (state, payload) {
		state.itemIdDic = payload
	},
	[types.UPDATE_TAGIDDIC] (state, payload) {
		state.tagIdDic = payload
	},
	[types.UPDATE_CORELEFT] (state, payload) {
		state.coreLeft = payload
	},
	[types.UPDATE_CORERIGHT] (state, payload) {
		state.coreRight = payload
	},
	[types.COMPUTE_CORE2ITEMS] (state) {
		if (state.isItemView) {
			state.core2items = state.coreRefList.concat(state.coreCiteList)
		} else {
			let oldLeft = []
			let insect = []
			let compareLeft = []
			state.oldCore2items.forEach((oldItem) => {
				state.compareCore2items.forEach((compareItem) => {
					if (oldItem.id === compareItem.id) {
						insect.push(oldItem)
					}
				})
			})
			console.log('insect', insect)
			state.oldCore2items.forEach((oldItem) => {
				let oldFlag = 0
				insect.forEach((insectItem) => {
					if (oldItem.id === insectItem.id) {
						oldFlag = 1
					}
				})
				if (oldFlag === 0) {
					oldLeft.push(oldItem)
				}
			})
			state.compareCore2items.forEach((compareItem) => {
				let compareFlag = 0
				insect.forEach((insectItem) => {
					if (compareItem.id === insectItem.id) {
						compareFlag = 1
					}
				})
				if (compareFlag === 0) {
					compareLeft.push(compareItem)
				}
			})
			console.log('oldLeft', oldLeft)
			console.log('compareLeft', compareLeft)
			state.oldLeft = oldLeft
			state.insect = insect
			state.compareLeft = compareLeft
			state.coreLeft = oldLeft.length
			state.coreRight = insect.length
			state.core2items = state.oldLeft.concat(state.insect, state.compareLeft)
		}
	}
}

const actions = {
	updateCore ({commit}, payload) {
		console.log('更新core', payload)
		commit(types.UPDATE_CORE, payload)
		// commit(types.UPDATE_CORE_TYPE, payload.type)
		// commit(types.UPDATE_CORE_TEXT, payload.text)
		// commit(types.UPDATE_CORE_ID, payload.id)
		axios({
			methods: 'get',
			url: '/api/core_' + payload.type,
			params: {
				word: payload.text,
				id: payload.id
			},
			timeout: 10000
		})
			.then(function (response) {
				commit(types.UPDATE_ISCOMPARE, false)
				console.log('test: 接受后端的数据', response.data)
				let items = []
				if (payload.type === 'item') {
					let tmp = {
						refList: response.data.refData,
						citeList: response.data.citeData
					}
					console.log('coreData', tmp)
					commit(types.UPDATE_REF_CITE, tmp)
					items = response.data.refData.concat(response.data.citeData)
				} else {
					items = response.data.data
					commit(types.UPDATE_CORELEFT, 0)
					commit(types.UPDATE_ISITEMVIEW, false)
				}
				console.log('coreData', items)
				commit(types.UPDATE_CORE2ITEMS, items)
			})
			.catch(function (error) {
				console.log(error)
			})
	},
	updateCompareCore ({commit}, payload) {
		console.log('更新compare_core', payload)
		commit(types.UPDATE_OLD_CORE)
		commit(types.UPDATE_COMPARE_CORE, payload)
		axios({
			methods: 'get',
			url: '/api/core_' + payload.type,
			params: {
				word: payload.text,
				id: payload.id
			},
			timeout: 10000
		})
			.then(function (response) {
				commit(types.UPDATE_ISCOMPARE, true)
				console.log('test: 接受后端的数据', response.data)
				let items = response.data.data
				console.log('compareCoreData', items)
				commit(types.UPDATE_COMPARECORE2ITEMS, items)
				commit(types.COMPUTE_CORE2ITEMS)
			})
			.catch(function (error) {
				console.log(error)
			})
	},
	updateWord2Titles ({commit}, payload) {
		// console.log('test: Word2Titles', payload)
		if (payload === '') {
			commit(types.UPDATE_WORD2TITLES, [])
		} else {
			axios({
				methods: 'get',
				url: '/api/search_titles',
				// params指定传过去的参数，server使用query接收
				params: {
					word: payload
				},
				timeout: 10000
			})
					.then(function (response) {
						// console.log('test: 接受后端的数据', response.data.data)
						let foo = response.data.data
						commit(types.UPDATE_WORD2TITLES, foo)
					})
					.catch(function (error) {
						console.log(error)
					})
		}
	},
	updateWord2Authors ({commit}, payload) {
		// console.log('test: Word2Authors', payload)
		if (payload === '') {
			commit(types.UPDATE_WORD2AUTHORS, [])
		} else {
			axios({
				methods: 'get',
				url: '/api/search_authors',
				// params指定传过去的参数，server使用query接收
				params: {
					word: payload
				},
				timeout: 10000
			})
					.then(function (response) {
						// console.log('test: 接受后端的数据', response.data.data)
						let foo = response.data.data
						console.log('test', foo)
						commit(types.UPDATE_WORD2AUTHORS, foo)
					})
					.catch(function (error) {
						console.log(error)
					})
		}
	},
	updateWord2Tags ({commit}, payload) {
		// console.log('test: Word2Tags', payload)
		if (payload === '') {
			commit(types.UPDATE_WORD2TAGS, [])
		} else {
			axios({
				methods: 'get',
				url: '/api/search_tags',
				// params指定传过去的参数，server使用query接收
				params: {
					word: payload
				},
				timeout: 10000
			})
					.then(function (response) {
						// console.log('test: 接受后端的数据', response.data.data)
						let foo = response.data.data
						commit(types.UPDATE_WORD2TAGS, foo)
					})
					.catch(function (error) {
						console.log(error)
					})
		}
	},
	updateIdDic ({commit}) {
		console.log('begin updateIdDic')
		axios({
			methods: 'get',
			url: '/api/get_id_dic',
			params: {},
			timeout: 10000
		})
				.then((res) => {
					let foo = res.data.data
					commit(types.UPDATE_AUTHORIDDIC, foo.authorDic)
					commit(types.UPDATE_ITEMIDDIC, foo.itemDic)
					commit(types.UPDATE_TAGIDDIC, foo.tagDic)
					console.log('end updateIdDic')
				})
				.catch((err) => {
					console.log(err)
				})
	},
	computeCore2items ({commit}) {
		commit(types.COMPUTE_CORE2ITEMS)
	}
}

export default new Vuex.Store({
	state,
	getters,
	mutations,
	actions
})
