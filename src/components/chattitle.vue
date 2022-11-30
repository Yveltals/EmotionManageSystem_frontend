<template>
  <div class="chatTitle">
    <span class="titleName">{{$store.state.courseTitle}}讨论区</span>

    <Button v-if="$store.state.classStart && !$store.state.isTea" @click="classExit">
      <Icon type="md-exit" />
    </Button>
    <Button v-if="!$store.state.classStart && !$store.state.isTea" disabled>
      <Icon type="md-exit" />
    </Button>
  </div>
</template>

<script>
  export default {
    name: "chattitle",
    methods: {
      classExit(){
        this.$confirm('您是否要离开课堂?', '系统提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$emit('update');
          this.$store.state.classStart = false
          this.$store.state.courseTitle = null
          this.$store.dispatch("disconnect");
          // TODO 教师下课提示学生
          this.$message.success("离开课堂");
        })
      },
    }
  }
</script>

<style scoped>
.chatTitle{
  height: 50px;
  width: 100%;
  font-size: 20px;
  display: flex;
  justify-content: space-between;
  border-bottom: 0.5px solid #c7d2db;
}
.titleName{
  margin: 10px 20px;
}
.ivu-btn {
	background-color: #eee !important;
	font-size: 24px;
	line-height: 32px;
	text-align: center;
	border: 0;
	margin: 10px;
}
</style>
