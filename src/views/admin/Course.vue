<template>
    <div>
      <Modal v-model="formVisable" title="课程信息" class-name="vertical-center-modal">
        <div slot="footer"></div>
        <Form ref="formData" :model="formData" :rules="formRule" :label-width="80">
          <FormItem label="教师工号" prop="tno">
              <Input v-model="formData.tno" placeholder="请输入教师工号"></Input>
          </FormItem>
          <FormItem label="课程名" prop="name">
              <Input v-model="formData.name" placeholder="请输入课程名"></Input>
          </FormItem>
          <FormItem>
              <Button type="primary" @click="submit('formData')">提交</Button>
              <Button @click="reset('formData')" style="margin-left: 8px">重置</Button>
          </FormItem>
        </Form>
      </Modal>
      
      <div style="padding: 10px">
        <div style="background:#fff; border-radius:8px; padding:20px;height:700px">
            <Row class="query-c">
              <Col span="1"><span style="line-height: 35px;">查询：</span></Col>
              <Col span="5"><Input search enter-button placeholder="请输入查询课程名" @on-search="search" style="width: auto" /></Col>
              <Col span="8"><Button shape="circle" type="primary" @click="add()" style="width:140px;margin-left:10px">添加课程</Button></Col>
            </Row>
            <br>
            <Table :columns="column" :data="curData" :loading="loading" max-height="670" border stripe>
              <template #action="{ row }">
                <Button type="primary" size="small" style="margin-right: 5px" @click="update(row.userId)">修改</Button>
                <Button type="error" size="small" @click="remove(row.userId)">删除</Button>
              </template>
            </Table>
            <br>
            <Page :total="total" showPage-elevator @on-change="change" style="position:absolute;bottom:50px;"/>
        </div>
      </div>
    </div>
  </template>
  <script>
    
    export default {
      name: 'Course',
      data () {
        return {
          curPage: 1,
          formVisable: false,
          formData: {
            name: '',
            tno: '',
            sno: []
          },
          formRule: {
            tno: [{ required: true, message: '工号不能为空', trigger: 'blur' }],
            name: [{ required: true, message: '课程名不能为空', trigger: 'blur' }]
          },
          loading: true,
          total: 0,
          column: [
            // { title: '编号', key: 'userId'},
            { title: '课程ID', key: 'courseId'},
            { title: '课程名', key: 'name'},
            {
              title: '操作', slot: 'action', fixed: 'right', width: 180, align: 'center'
            }
          ],
          curData: [],
          courseData: [
            {courseId:0,name:''}
          ],
        }
      },
      created () {
        this.getCourseList()
      },
      methods: {
        getCourseList(){
          this.loading = true
          this.getRequest('/api/manage/getAllCourses').then(res=>{
            console.log(res)
						this.courseData = res.data.courses
						this.total = this.courseData.length
						this.showPage(10*(this.curPage-1))
            this.formData = {}
          })
        },
        add(){ //添加表格
          this.formData = {}
          this.formVisable = true
        },
        submit (name) { //提交添加/更新数据
					this.formData.sno = ["SA22220001","SA22220002","SA22220003","SA22220004","SA22220005",
							"SA22220006","SA22220007","SA22220008","SA22220009","SA22220010"]
          console.log(this.formData)
          this.$refs[name].validate((valid) => {
            if (valid) {
              this.postRequest('/api/manage/addCourse',this.formData).then(res=>{
                console.log(res)
                if(!res.code){ 
                  this.$Message.success('添加成功');
                  this.formVisable = false
                  this.getCourseList() 
                }
                else this.$Message.error(res.msg);
              }) 
            } else {
                this.$Message.error('请填写必要信息');
            }
          })
        },
        search(name){
          if(name.length<=0){
            this.showPage(0)
            return
          }
          this.curData = []
          for(let i=0;i<this.total; i++){
            if(this.courseData[i].name == name){
              this.curData.push(this.courseData[i])
            }
          }
        },
        // remove(id){
        //   console.log('delete: '+id)
        //   let userId = {"userId":id}
        //   this.postRequest('/manage/deleteTeacher',userId).then(res=>{
        //     if(!res.code){
        //       this.$Message.success('删除成功');
        //       this.getTeaList()
        //     }else{
        //       console.info(res.msg)
        //       this.$Message.error(res.msg);
        //     }
        //   })
        // },
        showPage(page){
          this.curData = []
          for(let i=page;i<this.total && i<page+10; i++){
            this.curData.push(this.courseData[i])
          }
          this.loading = false
        },
        change(page){
          this.curPage = page
          this.showPage(10*(page-1))
        },
        reset (name) {
            this.$refs[name].resetFields();
        },
      }
    }
  </script>
  <style>
  .vertical-center-modal{
      display: flex;
      align-items: center;
      justify-content: center;
  }
  .vertical-center-modal .ivu-modal{
      top: 0;
  }
  </style>