<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">后台管理系统</div>
            <el-form :model="staff" :rules="rules" ref="login" label-width="0px" class="ms-content" label-suffix="：">
                <el-form-item prop="name">
                    <el-input v-model="staff.name" placeholder="name">
                        <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="pwd">
                    <el-input
                        type="password"
                        placeholder="password"
                        v-model="staff.pwd"
                        @keyup.enter.native="submitForm()"
                    >
                        <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                    </el-input>
                </el-form-item>
                记住密码<el-switch v-model="value" active-color="#13ce66" inactive-color="#ff4949">
            </el-switch>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm()">登录</el-button>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
    data: function() {
        return {
            staff:{'name':localStorage.getItem("ms_username"),'pwd':localStorage.getItem("pwd")},
            rules:{
                name:[{required:true,message:'用户名不能为空'}],
                pwd:[{required:true,message:'密码不能为空'}]
            },
            value: true
            /*param: {
                username: 'admin',
                password: '123123',
            },
            rules: {
                username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
                password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
            },*/
        };
    },
    methods: {
        submitForm() {
            this.$refs.login.validate(valid => {
                if (valid) {
                   /* localStorage.setItem('ms_username', this.param.username);*/
                    this.$axios.post('login-check',this.$qs.stringify({"name":this.staff.name,"pwd":this.staff.pwd}))
                        .then(data=>{
                            if(data.data!='{"code":403,"meaage":登录失败,"data":{}}'){
                                if(this.value){
                                  //设置cookie
                                  localStorage.setItem('ms_username',this.staff.name);
                                  localStorage.setItem('pwd',this.staff.pwd);
                                  //设置session
                                  sessionStorage.setItem("StaffInfo",JSON.stringify(data.data));
                                }else{
                                  localStorage.clear();
                                }
                                /*this.$router.push({name:'Home',params:{data}});*/
                                this.$message.success('登录成功');
                                this.$router.push('/');
                            }else{
                                this.$message.error("用户名或密码错误！")
                            }
                        }).catch(err=>{
                        console.info(err)
                    })
                } else {
                    this.$message.error('请输入账号和密码');
                    console.log('error submit!!');
                    return false;
                }
            });
        },
    }
};
</script>

<style scoped>
.login-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    /*background-image: url(../../assets/img/login-bg.jpg);*/
    background-size: 100%;
}
.ms-title {
    width: 100%;
    line-height: 50px;
    text-align: center;
    font-size: 20px;
    color: #fff;
    border-bottom: 1px solid #ddd;
}
.ms-login {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 350px;
    margin: -190px 0 0 -175px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.3);
    overflow: hidden;
}
.ms-content {
    padding: 30px 30px;
}
.login-btn {
    text-align: center;
}
.login-btn button {
    width: 100%;
    height: 36px;
    margin-bottom: 10px;
}
.login-tips {
    font-size: 12px;
    line-height: 30px;
    color: #fff;
}
</style>
