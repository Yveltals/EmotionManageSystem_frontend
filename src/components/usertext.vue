<template>
  <div id="uesrtext">
    <div>
      <el-popover placement="top-start" width="400" trigger="click" class="emoBox">
        <div class="emotionList">
          <a href="javascript:void(0);" @click="getEmo(index)" v-for="(item,index) in faceList" :key="index" class="emotionItem">{{item}}</a>
        </div>
        <el-button id="emojiBtn" class="emotionSelect" slot="reference">
          <i class="fa fa-smile-o" aria-hidden="true"></i>
        </el-button>
      </el-popover>
      <el-upload
              class="upload-btn"
              action="/ossFileUpload?module=group-chat"
              :show-file-list="false"
              accept=".jpg,.jpeg,.png,.JPG,JPEG,.PNG,.gif,.GIF"
              >
        <el-button id="uploadImgBtn" icon="el-icon-picture-outline"></el-button>
      </el-upload>
    </div>
    <textarea id="textarea" placeholder="按 Ctrl + Enter 发送" v-model="content" v-on:keyup="addMessage">
    </textarea>
    <el-button v-if="$store.state.classId" id="sendBtn" type="primary" @click="addMessageByClick" >发送(S)</el-button>
    <el-button v-else id="sendBtn" type="primary" disabled>发送(S)</el-button>
  </div>
</template>

<script>
const appData=require("../utils/emoji.json")

export default {
  name: 'uesrtext',
  data () {
    return {
      faceList:[],//表情包数据
      content:''
    }
  },
  mounted(){
    for (let i in appData){//读取json文件保存数据给数组
      this.faceList.push(appData[i].char);
    }
  },
  methods: {
    addMessageByClick(){
      if(!this.content || this.content.match(/^[ ]*$/)) {
        this.$message({
          showClose: true,
          message: '不能发送空白信息'
        });
        return;
      }
      let msg = new Object()
      msg.content = this.content;
      msg.courseInstanceId = this.$store.state.classId
      msg.timestamp =new Date().getTime()
      console.log(msg);
      let obj = new Object()
      obj.content = msg.content
      obj.userId = this.$store.state.id_
      obj.name = this.$store.state.name_
      if(obj.userId == 17 || obj.userId == 41)
        obj.avatar = 'https://cdn.jsdelivr.net/gh/Yveltals/Picgo/avatar/0.png'
      else
        obj.avatar = 'https://cdn.jsdelivr.net/gh/Yveltals/Picgo/avatar/'+(obj.userId%6+1)+'.png'
      this.$store.state.sessions.push(obj)
      
      this.postRequest("/api/message/send",msg).then(res=>{
        if(res.code){
          console.info(res.msg)
          this.$message.error("res.msg");
        }
      })
      this.content='';
    },
  	addMessage (e) {
  		if (e.ctrlKey && e.keyCode ===13 && this.content.length) {
  		   this.addMessageByClick();
  		}
  	},
    //获取Emoji
    getEmo(index){
      var textArea=document.getElementById('textarea');
      //将选中的表情插入到输入文本的光标之后
      function changeSelectedText(obj, str) {
        if (window.getSelection) {
          // 非IE浏览器
          textArea.setRangeText(str);
          // 在未选中文本的情况下，重新设置光标位置
          textArea.selectionStart += str.length;
          textArea.focus()
        } else if (document.selection) {
          // IE浏览器
          obj.focus();
          var sel = document.selection.createRange();
          sel.text = str;
        }
      }
      changeSelectedText(textArea,this.faceList[index]);
      this.content=textArea.value;// 要同步data中的数据
      // console.log(this.faceList[index]);
      return;

    },
  }
}
</script>


<style>
/* el-popover是和app同级的，所以scoped的局部属性设置无效 */
/* 需要设置全局style */
.el-popover{
  height:200px;
  width:450px;
  overflow: scroll;
  overflow-x:auto;
}
</style>

<style scoped>
#uesrtext {
	position: absolute;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 30%;
  border: solid 1px #DDD;
  background-color: white;
}
#uesrtext  > textarea {
  padding: 10px;
  width: 95%;
  height: 58%;
  border: none;
  outline: none;
  resize: none;
}
#uesrtext #sendBtn{
  float: right;
  margin-right: 10px;
}
#uesrtext #uploadImgBtn{
  border: none;
  padding-bottom: 0px;
  margin-bottom: 0px;
  padding-left: 12px;
}
#uesrtext #uploadImgBtn:hover{
  background-color: white;
}
#uesrtext #emojiBtn{
  border: none;
  padding-right: 0px;
  padding-bottom: 0px;
  margin-bottom: 0px;
}
#uesrtext #emojiBtn:hover{
  background-color: white;
}
#uesrtext .upload-btn{
  display: inline-block;
}

.emotionList{
  display: flex;
  flex-wrap: wrap;
  padding:5px;
}
.emotionItem{
  width:10%;
  font-size:20px;
  text-align:center;
}
/*包含以下四种的链接*/
.emotionItem {
  text-decoration: none;
}
/*正常的未被访问过的链接*/
.emotionItem:link {
  text-decoration: none;
}
/*已经访问过的链接*/
.emotionItem:visited {
  text-decoration: none;
}
/*鼠标划过(停留)的链接*/
.emotionItem:hover {
  text-decoration: none;
}
/* 正在点击的链接*/
.emotionItem:active {
  text-decoration: none;
}
</style>
