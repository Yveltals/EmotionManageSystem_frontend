<template>
<div id="message" v-scroll-bottom="sessions">
	<ul v-if="$store.state.classStart">
		<li v-for="item in $store.state.sessions" :key="item.id">
			<div class="other" :class="{self:item.userId==$store.state.id_}">
				<p class="username">{{item.name}}</p>
				<img class="avatar" :src="item.avatar" alt="">
				<div><p class="text" v-html="item.content"></p></div>
			</div>
		</li>
	</ul>
	<div class="wait" v-else>
		<h2 v-if="$store.state.isTea">等待教师开始上课</h2>
		<h2 v-else>等待学生进入课堂</h2>
	</div>
</div>
</template>

<script>
export default {
  name: 'message',
  data () {
    return {
    }
  },
  filters:{
  	time (date) {
      if (date) {
        date = new Date(date);
      }
      //当前的时间
			let currentDate=new Date();
      //与当前时间的日期间隔
			let timeInterval=currentDate.getDate()-date.getDate();
			//星期数组
			let weekdays = ["星期日","星期一","星期二","星期三","星期四","星期五","星期六"];
			//时间范围
			let timeRange="上午";
			if (date.getHours()>12){
				timeRange="下午";
			}
			//如果与当前时间同日
			if (date.getMonth()==currentDate.getMonth()&&date.getDate()==currentDate.getDate()){
				return `${timeRange} ${date.getHours()}:${date.getMinutes()}`;
			}
			//在当前时间同一年且日期间隔在7天内
			if (date.getFullYear()==currentDate.getFullYear()&&timeInterval<=6&&timeInterval>=1) {
				//当前时间的前一天
				if (timeInterval==1){
					return `昨天 ${timeRange} ${date.getHours()}:${date.getMinutes()}`;
				}
				else{
					return `${weekdays[date.getDay()]} ${timeRange} ${date.getHours()}:${date.getMinutes()}`;
				}
			}
			//如果日期超过7天
			else
				return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()} ${timeRange}  ${date.getHours()}:${date.getMinutes()}`;
  	}
  },
  directives: {
    'scroll-bottom' (el) {
      setTimeout(function () {
        el.scrollTop+=9999;
      },1)
    }
  },
methods:{
}
}
</script>

<style scoped>

#message {
	padding: 15px;
	height: 60%;
  	max-height: 63%;
  	overflow-y: scroll;
	overflow-x: hidden;
}
ul {
	list-style-type: none;
	padding-left: 0px;
}
ul li {
	margin-bottom: 15px;
}
.wait{
	margin-top: 150px;
	font-size: 25px;
	text-align: center;
	color: rgb(200, 200, 200);
}
.other .avatar {
	float: left;
	margin: 0 10px 0 0;
	border-radius: 3px;
	width: 50px;
	height: 50px;
}
.other .text {
	display: inline-block;
	padding: 0 10px;
	max-width: 80%;
	margin-top: 17px;
	background-color: #fafafa;
	border-radius: 4px;
	line-height: 37px;
}
.other .username{
	position: relative;
	left: 60px;
	top:15px;
	margin: 0 0;
	padding: 0 0;
	border-radius: 4px;
	line-height: 15px;
	font-size: 15px;
	color: grey;
}

.self {
	text-align: right;
}
.self .avatar {
	float: right;
	margin: 0 0 0 10px;
	border-radius: 3px;
	width: 50px;
	height: 50px;
}
.self .text {
	display: inline-block;
	margin-top: 18px;
	padding: 0 10px;
	max-width: 80%;
	background-color: #b2e281;
	border-radius: 4px;
	line-height: 37px;
}
.self .username{
	/* display: inline-block; */
	position: relative;
	left: 440px;
	top:15px;
	margin: 0 0;
	padding: 0 0;
	width: 200px;
	line-height: 15px;
	font-size: 15px;
	color: grey;
}
</style>
