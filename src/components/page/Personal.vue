<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="8">
                <el-card shadow="hover" class="mgb20" style="height:200px;">
                    <div class="user-info">
                        <img src="../../assets/img/img.jpg" class="user-avator" alt />
                        <div class="user-info-cont">
                            <div>欢迎：{{StaffInfo.staff_name}}</div>
                        </div>
                    </div>
                </el-card>
                <el-card shadow="hover" style="height:252px;">
                    <div slot="header" class="clearfix">
                        <span>员工详情</span>
                    </div>管理员
                    <el-progress :percentage="role_count" color="#42b983"></el-progress>举报管理员
                    <el-progress :percentage="role_count2" color="#f1e05a"></el-progress>男
                    <el-progress :percentage="staff_sex_man"></el-progress>女
                    <el-progress :percentage="staff_sex_woman" color="#f56c6c"></el-progress>
                </el-card>
            </el-col>
            <el-col :span="16">
                <el-card shadow="hover" style="height:400px;">
                    <div slot="header" class="clearfix">
                        <span>修改信息</span>
                    </div>
                    <el-form ref="form" :model="StaffInfo" label-width="80px">
                        <el-form-item label="姓名">
                            <el-input v-model="StaffInfo.staff_name" style="width: 100%;outline: none;height: 100%" readonly></el-input>
                        </el-form-item>
                        <el-form-item label="账号">
                            <el-input v-model="StaffInfo.staff_number" style="width: 100%;outline: none;height: 100%" readonly></el-input>
                        </el-form-item>
                        <el-form-item label="手机号">
                            <el-input v-model="StaffInfo.staff_phone" style="width: 100%;outline: none;height: 100%" readonly></el-input>
                        </el-form-item>
                        <el-form-item label="身份证">
                            <el-input v-model="StaffInfo.staff_idcard" style="width: 100%;outline: none;height: 100%" readonly></el-input>
                        </el-form-item>
                    </el-form>
                    <el-button type="primary" icon="el-icon-edit-outline" @click="edit()" style="float: right">修改信息</el-button>
                </el-card>
            </el-col>
        </el-row>


        <el-dialog :visible.sync="dialogFormVisible">
            <!--表单提交-->
            <el-form :model="StaffInfo" label-width="100px" :rules="rules" ref="fm">
                <el-form-item label="姓名" prop="staff_name">
                    <el-input v-model="StaffInfo.staff_name" maxlength="10"></el-input>
                </el-form-item>
                <el-form-item label="身份证号" prop="staff_idcard">
                    <el-input v-model="StaffInfo.staff_idcard"></el-input>
                </el-form-item>
                <el-form-item label="电话号" prop="staff_phone">
                    <el-input v-model="StaffInfo.staff_phone"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary"  @click="save()">确 定</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    import {validatePhoneTwo,validateIdcard,isvalidUsername} from '@/utils/validator'
    export default {
        name: 'Personal',
        data() {
            return {
                StaffInfo:JSON.parse(sessionStorage.getItem('StaffInfo')),
                staff:[],
                list:[],
                role_count:0,
                role_count2:0,
                staff_sex_man:0,
                staff_sex_woman:0,
                dialogFormVisible: false,
                rules:{
                    staff_name:[{required:true,message:'姓名不能为空'},{validator:isvalidUsername,tigger:'blur'}],
                    staff_idcard:[{required:true,message:'身份证号不能为空'},{validator:validateIdcard,tigger:'blur'}],
                    staff_phone:[{required:true,message:'手机号格式不正确！'},{validator:validatePhoneTwo,tigger:'blur'}]
                },
            };
        },
        methods: {
            /* 显示from 表单*/
            edit:function() {
                this.dialogFormVisible=true;
            },
            /*修改个人信息*/
            save:function() {
                this.$axios.post('tbStaff/upInfo',this.$qs.stringify({'staff_id':this.StaffInfo.staff_id,'staff_name':this.StaffInfo.staff_name,'staff_idcard':this.StaffInfo.staff_idcard,'staff_phone':this.StaffInfo.staff_phone})).then(data=>{
                    this.$message.success('修改成功！')
                }).catch(err=>{console.info(err)});
                this.dialogFormVisible=false;
            }
        },
        created:function() {
            this.$axios.post('tbStaff/queryAll').then(data=>{
                    this.staff=data.data;
                    let role_count=0;let role_count2=0;let staff_sex_man=0;let staff_sex_woman=0;
                    let count_all=0;//总数量
                    for(let i in data.data){
                        data.data[i].role_id==1?role_count++:role_count2++;
                        data.data[i].staff_sex==0?staff_sex_man++:staff_sex_woman++;
                        count_all++;
                    }
                    this.role_count=parseFloat(parseFloat(count_all/role_count).toFixed(2));
                    this.role_count2=parseFloat(parseFloat(count_all/role_count2).toFixed(2));
                    this.staff_sex_man=parseFloat(parseFloat(count_all/staff_sex_man).toFixed(2));
                    this.staff_sex_woman=parseFloat(parseFloat(count_all/staff_sex_woman).toFixed(2));
                }).catch(err=>{console.info(err)})
        }
    };
</script>


<style scoped>
    .el-row {
        margin-bottom: 20px;
    }

    .grid-content {
        display: flex;
        align-items: center;
        height: 100px;
    }

    .grid-cont-right {
        flex: 1;
        text-align: center;
        font-size: 14px;
        color: #999;
    }

    .grid-num {
        font-size: 30px;
        font-weight: bold;
    }

    .grid-con-icon {
        font-size: 50px;
        width: 100px;
        height: 100px;
        text-align: center;
        line-height: 100px;
        color: #fff;
    }

    .grid-con-1 .grid-con-icon {
        background: rgb(45, 140, 240);
    }

    .grid-con-1 .grid-num {
        color: rgb(45, 140, 240);
    }

    .grid-con-2 .grid-con-icon {
        background: rgb(100, 213, 114);
    }

    .grid-con-2 .grid-num {
        color: rgb(45, 140, 240);
    }

    .grid-con-3 .grid-con-icon {
        background: rgb(242, 94, 67);
    }

    .grid-con-3 .grid-num {
        color: rgb(242, 94, 67);
    }

    .user-info {
        display: flex;
        align-items: center;
        padding-bottom: 20px;
        border-bottom: 2px solid #ccc;
        margin-bottom: 20px;
    }

    .user-avator {
        width: 120px;
        height: 120px;
        border-radius: 50%;
    }

    .user-info-cont {
        padding-left: 50px;
        flex: 1;
        font-size: 14px;
        color: #999;
    }

    .user-info-cont div:first-child {
        font-size: 30px;
        color: #222;
    }

    .user-info-list {
        font-size: 14px;
        color: #999;
        line-height: 25px;
    }

    .user-info-list span {
        margin-left: 70px;
    }

    .mgb20 {
        margin-bottom: 20px;
    }

    .todo-item {
        font-size: 14px;
    }

    .todo-item-del {
        text-decoration: line-through;
        color: #999;
    }

    .schart {
        width: 100%;
        height: 300px;
    }
</style>
