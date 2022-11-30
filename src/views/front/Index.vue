<template>
	<div id="index">
		<!-- 左侧工具栏 -->
		<div class="toolbar">
			<img class="imgProfile" src="../../assets/logo.png" alt="">
			<div class="btnBar">
				<div>
					<el-tooltip effect="dark" content="进入讨论区" placement="right">
						<Button @click="chooseSession()" class="toolBtn" size="large"><i class="fa fa-comments fa-2x"
								aria-hidden="true"></i></Button>
					</el-tooltip>

					<el-tooltip v-if="$store.state.isTea" effect="dark" content="查看学生情绪" placement="right">
						<Button @click="chooseEmotion()" class="toolBtn" size="large"><i class="fa fa-pie-chart fa-2x"
								aria-hidden="true"></i></Button>
					</el-tooltip>
				</div>
				<div>
					<el-tooltip effect="dark" content="个人中心" placement="right">
						<Button class="toolBtn" size="large"><i class="fa fa-user fa-2x" aria-hidden="true"></i></Button>
					</el-tooltip>
					<el-tooltip effect="dark" content="退出" placement="right">
						<Button @click="exitSystem" class="toolBtn" size="large"><i class="fa fa-sign-out fa-2x"
								aria-hidden="true"></i></Button>
					</el-tooltip>
				</div>
			</div>
		</div>
		<!-- 课程列表 -->
		<div v-if="sessionVisable" class="sidebar">
			<div id="card">
				<Input search placeholder="搜索" style="width:70%" v-model="search" class="search" @on-search="filter" />
				<Button v-if="$store.state.classStart && $store.state.isTea" @click="classOver">
					<Icon type="md-notifications-outline" />
				</Button>
				<Button v-if="!$store.state.classStart && $store.state.isTea" disabled>
					<Icon type="md-notifications-outline" />
				</Button>
				<Button v-if="$store.state.classStart && !$store.state.isTea" @click="dialogFormVisible = true">
					<Icon type="md-happy" />
				</Button>
				<Button v-if="!$store.state.classStart && !$store.state.isTea" disabled>
					<Icon type="md-happy" />
				</Button>

				<!-- 表情评分弹窗 -->
				<div>
					<el-dialog :title="$store.state.courseTitle" :visible.sync="dialogFormVisible" append-to-body>
						<el-form :model="form">
							<el-form-item label="My Feeling" :label-width="formLabelWidth">
								<el-select v-model="form.selectedOptionIndex" placeholder="表情评价">
									<el-option v-for="(item, index) in voteOptions" :key="index" :label="item.image" :value="index">
									</el-option>
								</el-select>
							</el-form-item>
						</el-form>
						<div slot="footer" class="dialog-footer">
							<el-button @click="dialogFormVisible = false">取 消</el-button>
							<el-button type="primary" @click="sendEmotion()">确 定</el-button>
						</div>
					</el-dialog>
				</div>


			</div>
			<div v-if="!$store.state.classStart" id="list">
				<ul>
					<p @click="getCourseInstance" class="listTitle">课程列表
						<Tooltip content="刷新课程列表" placement="right">
							<Icon style="cursor:pointer" type="md-refresh" />
						</Tooltip>
					</p>
					<el-divider></el-divider>
					<el-scrollbar style="height: 600px">
						<li v-for="item in courseFilter" @click="handleClassIn(item)">
							<img class="sessionAvatar" src="../../assets/course_list.png">
							<el-badge>
								<p class="sessionName">{{ item.name }}</p>
							</el-badge>
						</li>
					</el-scrollbar>
				</ul>
			</div>
			<div v-else id="list">
				<ul>
					<p class="listTitle">学生列表</p>
					<el-divider></el-divider>
					<el-scrollbar style="height: 600px">
						<li v-for="item in userList" :class="{ active: item.userId == $store.state.id }">
							<img class="sessionAvatar" src="../../assets/avatar_list.png">
							<el-badge>
								<p class="sessionName">{{ item.name }}</p>
							</el-badge>
						</li>
					</el-scrollbar>
				</ul>
			</div>
		</div>
		<!-- 讨论区 -->
		<div class="main">
			<chattitle v-if="sessionVisable" @update="getCourseInstance"></chattitle>
			<message v-if="sessionVisable" :courseTitle="courseTitle"></message>
			<usertext v-if="sessionVisable"></usertext>
			<!-- 教师查看表情 -->
			<emotions v-if="!sessionVisable" :emotionsData="emotionsData" :courseList="courseList"></emotions>
		</div>
	</div>
</template>

<script>
import message from '../../components/message.vue'
import usertext from '../../components/usertext.vue'
import chattitle from "../../components/chattitle"
import emotions from '../../components/emotions.vue'

const optionsData = require("../../utils/vote_options.json")

export default {
	name: 'Index',
	data() {
		return {
			sessionVisable: true, //讨论区界面or查看表情界面
			courseTitle: '软件工程实践', //当前课程
			courseId: '0',
			courseList: [], //教师授课列表
			courseFilter: [], //搜索过滤后课程
			userList: [], //课程成员
			voteOptions: [], // 6 类表情数据 -> [{ emotionId, score, reps}, ...]
			dialogFormVisible: false, // 表情评分弹窗
			form: {
				selectedOptionIndex: 0, // 用户选中的评分
			},
			formLabelWidth: '120px',
			search: '',
			emotionsData: {} // 学生反馈的表情数据
		}
	},
	mounted: function () {
		this.voteOptions = optionsData;
	},
	created() {
		if (this.$store.state.isTea) {
			this.getCourse()
		} else {
			this.getCourseInstance()
		}
		if (this.$store.state.classId) {
			this.getSessions()
			if (this.$store.state.isTea)
				this.getStudent()
		}
		//在页面加载时读取sessionStorage里的状态信息
		if (sessionStorage.getItem("state")) {
			this.$store.replaceState(Object.assign({}, this.$store.state, JSON.parse(sessionStorage.getItem("store"))))
		}
		//在页面刷新时将vuex里的最新信息保存到sessionStorage里
		window.addEventListener("beforeunload", () => {
			sessionStorage.setItem("state", JSON.stringify(this.$store.state))
		})
	},
	methods: {
		getSessions() {
			let msg = new Object()
			msg.courseInstanceId = this.$store.state.classId
			msg.startId = null
			msg.count = 10
			msg.timestamp = null
			this.postRequest('/api/message/getMessages', msg).then(res => {
				if (!res.code) {
					console.log(res.data)
					this.$store.state.sessions = []
					for (let i = res.data.count - 1; i >= 0; --i) {
						let obj = res.data.messages[i]
						if(obj.userId == 17 || obj.userId == 41)
							obj.avatar = 'https://cdn.jsdelivr.net/gh/Yveltals/Picgo/avatar/0.png'
						else
							obj.avatar = 'https://cdn.jsdelivr.net/gh/Yveltals/Picgo/avatar/' + (obj.userId % 6 + 1) + '.png'
						this.$store.state.sessions.push(obj)
					}
				} else {
					console.info(res.msg)
				}
			})
		},
		getCourse() { // 教师 获取全部授课列表
			this.getRequest('/api/course/getCourses').then(res => {
				console.log('getCourse() res:', res)
				this.courseList = res.data.courses
				this.courseFilter = res.data.courses
			})
		},
		getCourseInstance() { // 学生 获取参加的且正在上课的课程与实例ID（仅一个）
			if (this.$store.state.isTea) return
			this.getRequest('/api/course/getCourseInstances').then(res => {
				console.log(res)
				if (res.data.courseInstances.length > 1) {
					let idx = 0, max_ = 0;
					for(let i=0;i<res.data.courseInstances.length;++i){
						if(res.data.courseInstances[i].timestamp>max_){
							max_=res.data.courseInstances[i].timestamp
							idx = i
						}
					} 
					let instance = res.data.courseInstances[idx]
					this.$store.state.classId = instance.courseInstanceId
					this.$store.state.courseId = instance.course.courseId
					this.courseList = [instance.course]
					this.courseFilter = [instance.course]
				} else {
					this.$store.state.classId = null
					this.$store.state.courseId = null
					this.courseList = []
					this.courseFilter = []
				}
			})
		},
		sendEmotion() {
			let voteMsg = new Object();
			voteMsg.courseInstanceId = this.$store.state.classId;
			voteMsg.score = this.voteOptions[this.form.selectedOptionIndex].score;
			voteMsg.timestamp = new Date().getTime();
			console.log(voteMsg);

			this.postRequest('/api/emotion/score', voteMsg).then(res => {
				console.log('sendEmotion() res:', res);
				this.printTips(res.code, res.msg);
				this.dialogFormVisible = false;
			})
		},
		printTips(code, tips) {
			if (!code) {
				tips = '评分成功';
			}
			const h = this.$createElement;
			this.$notify({
				title: this.$store.state.courseTitle,
				message: h('i', { style: 'color: teal' }, tips)
			});
		},
		showOptions() {
			console.log(this.voteOptions);
		},
		handleClassIn(course) {
			if (this.$store.state.isTea) {
				this.classBegin(course)
			} else {
				this.classAttend(course)
			}
		},
		classBegin(course) {
			let info = '《' + course.name + '》授课是否现在开始?'
			this.$confirm(info, '系统提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'info'
			}).then(() => {
				let param = {
					"courseId": course.courseId,
					"timestamp": Math.floor(Math.random() * 10000000)
				}
				this.postRequest('/api/course/createInstance', param).then(res => {
					if (!res.code) {
						this.$store.state.classStart = true
						this.$store.state.classBeginTime = new Date().getTime();
						this.$store.state.courseId = course.courseId
						this.$store.state.courseTitle = course.name
						this.$store.state.classId = res.data.courseInstanceId
						this.$store.state.sessions = []
						console.log("class begin -> createInstance(), active class Id: ", this.$store.state.classId);
						this.$message.success("课程开始");
						this.$store.dispatch("connect");
						this.getStudent()
						this.getSessions()
					} else {
						console.info(res.msg)
						this.$message.error("服务器故障，请联系管理员");
					}
				})
			})
		},
		classAttend(course) {
			let info = '是否加入《' + course.name + '》课堂?'
			this.$confirm(info, '系统提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'info'
			}).then(() => {
				this.$store.state.courseTitle = course.name
				this.$store.state.classStart = true
				this.$store.state.sessions = []
				this.$store.dispatch("connect");
				this.$message.success("加入课程");
				this.getSessions()
				this.getStudent()
			})
		},
		classOver() {
			this.$confirm('您是否要立即结束授课?', '系统提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				let param = { "courseId": this.$store.state.courseId }
				this.postRequest('/api/course/stopInstance', param).then(res => {
					if (!res.code) {
						this.$store.state.classStart = false
						this.$store.state.classId = null
						this.$store.state.courseId = null
						this.$store.state.courseTitle = null
						this.$store.state.classBeginTime = null
						this.$store.dispatch("disconnect");
						this.$message.success("课程结束");
					} else {
						console.info(res.msg)
						this.$message.error(res.msg);
					}
				})
			})
		},
		getStudent() {
			this.getRequest('/api/course/getStudentOfCourse?courseId=' + this.$store.state.courseId).then(res => {
				console.log(res)
				this.userList = res.data.stu
			})
		},
		exitSystem() {
			this.$confirm('你是否要退出系统吗?', '系统提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.$message.success("退出登录");
				this.$store.commit('logout')
				this.$router.replace("/")
			})
		},
		filter() {
			if (this.search.length <= 0) {
				this.courseFilter = this.courseList
				return
			}
			this.courseFilter = []
			for (let i = 0; i < this.courseList.length; i++) {
				if (this.courseList[i].name == this.search) {
					this.courseFilter.push(this.courseList[i])
				}
			}
		},
		chooseSession() {
			this.sessionVisable = true
		},
		chooseEmotion() {
			this.sessionVisable = false;
			console.log("classStart: ", this.$store.state.classStart);
			if (this.$store.state.classStart) {
				this.fetchEmotions();
			} else {
				this.$message("您没有课进行中，可查询其他课程数据");
				this.emotionsData = {};
			}

		},
		fetchEmotions() {
			let param = new Object();
			param.courseInstanceId = this.$store.state.classId;
			param.timestamp_begin = this.$store.state.classBeginTime; 	// 默认为课程开始时间
			param.timestamp_end = new Date().getTime();
			this.postRequest('/api/emotion/query', param).then(res => {
				// console.log("chooseEmotion(): emotion/query res:", res);
				if (!res.code) {
					// 正常
					console.log("chooseEmotion(): emotion_query data: ", res.data.info.distribution);
					this.emotionsData = res.data.info.distribution; 	// 可能为空
				} else {
					console.log("chooseEmotion(): emotion_query error:", res.msg);
					this.$message.error(res.msg)
				}
			});
			// this.emotionsData = { "1": 2, "2": 4, "3": 16, "4": 23, "5": 9, "6": 3 };
		},
		closeDebug(courseId) {
			let param = { "courseId": courseId }
			this.postRequest('/api/course/stopInstance', param).then(res => {
				if (!res.code) {
					this.$store.state.classStart = false
					this.$store.state.classId = null
					this.$store.state.courseId = null
					this.$store.dispatch("disconnect");
					this.$message.success("课程结束");
				} else {
					console.info(res.msg)
					this.$message.error(res.msg);
				}
			})
		},
	},
	components: {
		usertext,
		chattitle,
		message,
		emotions
	},
	directives: {
		'scroll-bottom'(el) {
			setTimeout(function () {
				el.scrollTop += 9999;
			}, 1)
		}
	},
}
</script>

<style scoped>
#index {
	position: fixed;
	margin: auto;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	width: 1050px;
	height: 720px;
	overflow: hidden;
	border-radius: 10px;
}

.toolbar {
	float: left;
	color: #f4f4f4;
	background-color: #2e3238;
	width: 67px;
	height: 100%;
}

.btnBar {
	width: 100%;
	height: 82%;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
}

.imgProfile {
	width: 40px;
	height: 40px;
	margin: 25px 14px;
}

.toolBtn {
	background-color: #2e3238;
	width: 60px;
	border: 0;
	margin: 5px 3px;
}

#card {
	padding: 12px;
	margin-bottom: 5px;
}

#list ul {
	margin-left: 0px;
	padding-left: 0px;
	margin-left: 2px;
}

#list li {
	padding-top: 14px;
	padding-bottom: 14px;
	list-style: none;
	cursor: pointer;
}

#list li:hover {
	background-color: #D8D6D6;
}

#list li.active {
	background-color: #C8C6C6;
}

#list .listTitle {
	height: 30px;
	padding: 2px 10px;
	font-size: 19px;
	color: #2e3238;
	font-family: "Poppins", sans-serif;
}

.sessionAvatar {
	margin-left: 20px;
	border-radius: 2px;
	width: 37px;
	height: 37px;
	vertical-align: middle;
}

.sessionName {
	font-size: 15px;
	display: inline-block;
	margin-left: 15px;
	margin-top: 0px;
	margin-bottom: 0px;
}

.el-scrollbar__wrap.default-scrollbar__wrap {
	overflow-x: auto;
}

.sidebar {
	float: left;
	color: #000000;
	background-color: #ECEAE8;
	width: 240px;
	height: 100%;
}

.main {
	height: 100%;
	position: relative;
	overflow: hidden;
	background-color: #eee;
}
</style>
<style>
.el-button {
	margin-left: 0px;
}

#card .ivu-input {
	background-color: #DBD9D8 !important;
	outline: none;
}

#card .ivu-btn {
	background-color: #DBD9D8;
	font-size: 20px;
	line-height: 32px;
	text-align: center;
	border: 0;
	margin-left: 5px;
}

#list .el-divider--horizontal {
	margin-top: 12px;
	margin-bottom: 12px;
}
</style>
