<template>
  <div>
    <Modal v-model="formVisable" title="教师信息" class-name="vertical-center-modal">
      <div slot="footer"></div>
      <Form ref="formData" :model="formData" :rules="formRule" :label-width="80">
        <FormItem label="工号" prop="tno" :required="!formupdate">
            <Input v-if="formupdate" v-model="formData.tno" placeholder="为空则保持不变"></Input>
            <Input v-else v-model="formData.tno" placeholder="请输入教师编号"></Input>
        </FormItem>
        <FormItem label="姓名" prop="name" :required="!formupdate">
            <Input v-if="formupdate" v-model="formData.name" placeholder="为空则保持不变"></Input>
            <Input v-else v-model="formData.name" placeholder="请输入教师姓名"></Input>
        </FormItem>
        <FormItem  label="密码" prop="password" :required="!formupdate">
            <Input v-if="formupdate" v-model="formData.password" placeholder="为空则保持不变"></Input>
            <Input v-else v-model="formData.password" placeholder="请分配教师登录密码"></Input>
        </FormItem>
        <FormItem label="性别" prop="gender">
            <RadioGroup v-model="formData.gender">
                <Radio label="男">男</Radio>
                <Radio label="女">女</Radio>
            </RadioGroup>
        </FormItem>
        <FormItem label="年龄" prop="age">
            <Input v-if="formupdate" v-model="formData.age" placeholder="为空则保持不变"></Input>
            <Input v-else v-model="formData.age" placeholder="请输入教师年龄"></Input>
        </FormItem>
        <FormItem label="联系方式" prop="contact">
            <Input v-if="formupdate" v-model="formData.contact" placeholder="为空则保持不变"></Input>
            <Input v-else v-model="formData.contact" placeholder="请输入教师联系方式"></Input>
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
            <Col span="5"><Input search enter-button placeholder="请输入查询编号或姓名" @on-search="search" style="width: auto" /></Col>
            <Col span="8"><Button shape="circle" type="primary" @click="add()" style="width:140px;margin-left:10px">添加教师</Button></Col>
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
    name: 'Tea',
    data () {
      return {
        curPage: 1,
        formVisable: false,
        formupdate: false,
        formData: {
          userId: '',
          tno: '',
          name: '',
          password: '',
          gender: '',
          age: '',
          contact: ''
        },
        formRule: {
          tno: [{ required: true, message: '工号不能为空', trigger: 'blur' }],
          name: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
          password: [{ required: true, message: '请设置登录密码', trigger: 'blur' }]
        },
        loading: true,
        total: 0,
        column: [
          // { title: '编号', key: 'userId'},
          { title: '工号', key: 'tno'},
          { title: '姓名', key: 'name'},
          { title: '年龄', key: 'age'},
          { title: '性别', key: 'gender'},
          { title: '联系方式', key: 'contact'},
          {
            title: '操作', slot: 'action', fixed: 'right', width: 180, align: 'center'
          }
        ],
        curData: [],
        userData: [
          {userId:0,tno:'',name:'',age:0,gender:'',contact:''}
        ],
        // 为啥这俩赋值给formData会变空
        tno: '',
        name: '',
      }
    },
    created () {
      this.getTeaList()
    },
    methods: {
      getTeaList(){
        this.loading = true
        this.postRequest('/api/manage/getTeacher').then(res=>{
          console.log(res)
          this.formData = {}
          this.total = res.data.total
          this.userData = res.data.tea
          this.showPage(10*(this.curPage-1))
        })
      },
      add(){ //添加表格
        this.formData = {}
        this.formupdate = false
        this.formVisable = true
      },
      submit (name) { //提交添加/更新数据
        console.log(this.formData)
        if(this.formupdate){  //更新无需校验
          if(this.formData.name == '') this.formData.name = this.name
          if(this.formData.tno == '') this.formData.tno = this.tno
          this.postRequest('/api/manage/updateTeacher',this.formData).then(res=>{
            if(!res.code){ 
              this.$Message.success('更新成功');
              this.formVisable = false
              this.getTeaList()
            }
            else{
              this.$Message.error(res.msg);
            }
          })
        }
        else this.$refs[name].validate((valid) => {
          if (valid) {
            this.postRequest('/api/manage/addTeacher',this.formData).then(res=>{
              console.log(res)
              if(!res.code){ 
                this.$Message.success('添加成功');
                this.formVisable = false
                this.getTeaList() 
              }
              else this.$Message.error(res.msg);
            }) 
          } else {
              this.$Message.error('请填写必要信息');
          }
        })
      },
      update(id){ //更新表格
        this.formupdate = true
        for(let i=0;i<this.userData.length; ++i){
          if(this.userData[i].userId == id){
            this.name = this.userData[i].name
            this.tno = this.userData[i].tno
            this.formData.userId = this.userData[i].userId
            this.formData.tno = this.userData[i].tno
            this.formData.name = this.userData[i].name
            this.formData.password = ''
            this.formData.age = this.userData[i].age
            this.formData.gender = this.userData[i].gender
            this.formData.contact = this.userData[i].contact
          }
        }
        this.formVisable = true
      },
      search(name){
        if(name.length<=0){
          this.showPage(0)
          return
        }
        this.curData = []
        for(let i=0;i<this.total; i++){
          if(this.userData[i].name == name || this.userData[i].tno == name){
            this.curData.push(this.userData[i])
          }
        }
      },
      remove(id){
        console.log('delete: '+id)
        let userId = {"userId":id}
        this.postRequest('/api/manage/deleteTeacher',userId).then(res=>{
          if(!res.code){
            this.$Message.success('删除成功');
            this.getTeaList()
          }else{
            console.info(res.msg)
            this.$Message.error(res.msg);
          }
        })
      },
      showPage(page){
        this.curData = []
        for(let i=page;i<this.total && i<page+10; i++){
          this.curData.push(this.userData[i])
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