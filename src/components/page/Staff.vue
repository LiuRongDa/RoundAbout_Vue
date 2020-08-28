<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 员工管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="el-icon-success" class="handle-del mr10" @click="show()">添加</el-button>
                <el-input v-model="staff.staff_name" placeholder="输入姓名搜索" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="searchs()">搜索</el-button>
            </div>
        <el-table
                :data="pageInfo.list"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
        >
            <el-table-column label="编号" prop="staff_id"></el-table-column>
            <el-table-column label="姓名" prop="staff_name"></el-table-column>
            <el-table-column label="账号" prop="staff_number"></el-table-column>
            <el-table-column label="性别" prop="staff_sex">
                <template slot-scope="scope">
                    {{scope.row.staff_sex ==1?'男':'女'}}
                </template>
            </el-table-column>
            <el-table-column label="身份证号" prop="staff_idcard"></el-table-column>
            <el-table-column label="手机号" prop="staff_phone"></el-table-column>
            <el-table-column label="入职日期" prop="staff_in"></el-table-column>
            <el-table-column label="离职日期" prop="staff_out"></el-table-column>
            <el-table-column label="状态" prop="staff_state">
                <template slot-scope="scope">
                    {{scope.row.staff_state ==1?'离职':'在职'}}
                </template>
            </el-table-column>
            <el-table-column label="角色" prop="tbRole.role_name"></el-table-column>
            <el-table-column label="操作" width="130px">

                <!-- scope：返回当前单元格 -->
                <template slot-scope="scope">
                    <el-button type="success" round size="mini" icon="el-icon-edit" @click="show(scope.row)"></el-button>
                    <el-button type="warning" round size="mini" icon="el-icon-delete" @click="upState(scope.row.staff_id)"></el-button>
                </template>
            </el-table-column>
        </el-table>
            <!-- 分页-->
            <el-pagination layout="prev, pager, next":total="pageInfo.total" :page-size="5" @current-change="selectPageInfo" style="float: right;"></el-pagination>
        </div>


        <el-dialog :title="title" :visible.sync="dialogFormVisible">
            <!--表单提交-->
            <el-form :model="staff" label-width="100px" :rules="rules" ref="fm">
                <el-form-item label="姓名" prop="staff_name">
                    <el-input v-model="staff.staff_name"></el-input>
                </el-form-item>
                <el-form-item label="账号" prop="staff_number">
                    <el-input v-model="staff.staff_number"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="staff_pwd">
                    <el-input v-model="staff.staff_pwd" show-password></el-input>
                </el-form-item>
                <el-form-item label="性别" prop="staff_sex">
                    <el-radio v-model="radio_sex" label="1">男</el-radio>
                    <el-radio v-model="radio_sex" label="0">女</el-radio>
                </el-form-item>
                <el-form-item label="身份证号" prop="staff_idcard">
                    <el-input v-model="staff.staff_idcard"></el-input>
                </el-form-item>
                <el-form-item label="电话号" prop="staff_phone">
                    <el-input v-model="staff.staff_phone"></el-input>
                </el-form-item>
                <el-form-item label="角色" prop="role_id">
                    <el-select v-model="staff.role_id">
                        <el-option v-for="item in role":key="item.role_id":label="item.role_name":value="item.role_id">
                        </el-option>
                    </el-select>
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
    export default {
        name: 'Staff',
        data:function () {
            return{
                list:[],
                staff:{},
                role:{},
                pageInfo:{},
                dialogFormVisible: false,
                title:'',
                radio_sex: '',
                rules:{
                    staff_name:[{required:true,message:'姓名不能为空'}],
                    staff_number:[{required:true,message:'账号不能为空'}],
                    staff_pwd:[{required:true,message:'密码不能为空'}],
                    staff_idcard:[{required:true,message:'身份证号不能为空'}],
                    staff_phone:[{required:true,message:'手机号不能为空'}]
                },
                multipleSelection: [],
                delList: [],
                editVisible: false,
                pageTotal: 0,
                form: {},
                idx: -1,
                id: -1
            }
        },
        methods:{
            show:function (row) {
                if (row == null) {
                    this.title = '添加员工';
                    this.dialogFormVisible = true;
                    this.staff = {};
                } else {
                    this.title = '修改员工信息';
                    this.dialogFormVisible = true;
                    this.radio_sex=row.staff_sex.toString();
                    this.staff = Object.assign({}, row)
                }
            },
            save:function () {
                this.$set(this.staff,'staff_sex',this.radio_sex);
                this.$refs['fm'].validate(valid=>{
                    if(valid){
                        /*添加员工信息*/
                        if(this.title=='添加员工'){
                            console.info(this.staff);
                            this.$axios.post('tbStaff/add',this.$qs.stringify({'tbStaff':JSON.stringify(this.staff)})).then(data=>{
                                this.pageInfo=data.data;
                                this.dialogFormVisible=false;
                            }).catch(err=>{console.info(err)})
                        }else{
                            /*修改员工信息*/
                            console.info(this.staff);
                            this.$axios.post('tbStaff/update',this.$qs.stringify({'tbStaff':JSON.stringify(this.staff)})).then(data=>{
                                console.info('xiuagi');
                                this.pageInfo=data.data;
                                this.dialogFormVisible=false
                            }).catch(err=>{console.info(err)})
                        }
                    }
                })
            },
            //修改员工状态
            upState:function(staff_id) {
                console.info(staff_id);
                this.$axios.post('tbStaff/upState',this.$qs.stringify({'staff_id':staff_id})).then(data=>{
                    this.pageInfo=data.data;
                }).catch(err=>{console.info(err)})
            },
            /*分页查询*/
            selectPageInfo:function (val) {
                this.$axios.post('tbStaff/selePage',this.$qs.stringify({'pageNum':val}))
                    .then(data=>{
                        this.pageInfo = data.data
                    }).catch(err=>console.info(err))
            },
            /*模糊查询*/
            searchs:function() {
                console.info(this.staff.staff_name);
                this.$axios.post('tbStaff/selePage',this.$qs.stringify({'staff_name':this.staff.staff_name})).then(data=>{
                    console.info("chauxun",data.data);
                    this.pageInfo = data.data
                }).catch(err=>{console.info(err)})
            }
        },
        created:function () {
            /*页面加载 分页查询*/
            this.$axios.post('tbStaff/selePage').then(data=>{
                console.info('Staff',data.data);
                this.pageInfo=data.data;
                /*查询下拉框的内容*/
                this.$axios.post('tbRole/queryAll').then(data=>{
                    console.info('Role',data.data);
                    this.role=data.data;
                }).catch(err=>{console.info(err)})
            }).catch(err=>{console.info(err)})
        }
    };
</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }
    .table {
        width: 100%;
        font-size: 14px;
    }
    .red {
        color: #ff0000;
    }
    .mr10 {
        margin-right: 10px;
    }
    .table-td-thumb {
        display: block;
        margin: auto;
        width: 40px;
        height: 40px;
    }
</style>
