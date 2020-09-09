<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 用户管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <!--<el-button type="primary" icon="el-icon-success" class="handle-del mr10" @click="show()">添加</el-button>-->
                <el-input v-model="user.user_names" placeholder="输入姓名搜索" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="searchs()">搜索</el-button>
            </div>
            <el-table
                    :data="pageInfo.list"
                    border
                    class="table"
                    ref="multipleTable"
                    header-cell-class-name="table-header"
            >
                <el-table-column label="编号" prop="user_id"  :show-overflow-tooltip="true"></el-table-column>
                <el-table-column label="姓名" prop="user_name"  :show-overflow-tooltip="true"></el-table-column>
                <el-table-column label="头像" align="center">
                    <template slot-scope="scope">
                        <el-image
                                class="table-td-thumb"
                                :src="'http://localhost:8088/springboot/imgs/'+scope.row.user_photo"
                                :preview-src-list="['http://localhost:8088/springboot/imgs/'+scope.row.user_photo]"
                        ></el-image>
                    </template>
                </el-table-column>
                <el-table-column label="手机号" prop="user_phone" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column label="性别" prop="user_sex">
                    <template slot-scope="scope">
                        {{scope.row.user_sex ==0?'男':'女'}}
                    </template>
                </el-table-column>
                <el-table-column label="身份证号" prop="user_email" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column label="个性签名" prop="user_sign" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column label="地址" prop="user_residence" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column label="个人简介" prop="user_brief" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column label="访问次数" prop="user_count" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column label="注册时间" prop="user_joindate" :show-overflow-tooltip="true" width="110"></el-table-column>
                <el-table-column label="用户状态" prop="user_state">
                    <template slot-scope="scope">
                        {{scope.row.user_state ==0?'正常':'封禁'}}
                    </template>
                </el-table-column>
                <el-table-column label="职位" prop="tbTrade.trade_name"></el-table-column>
                <el-table-column label="操作" width="130px;">
                    <!-- scope：返回当前单元格 -->
                    <template slot-scope="scope">
                        <el-button type="warning" round size="mini" icon="el-icon-circle-close" @click="upStateJ(scope.row.user_state,scope.row.user_id)"></el-button>
                        <el-button type="success" round size="mini" icon="el-icon-circle-check" @click="upStateQ(scope.row.user_state,scope.row.user_id,)"></el-button>
                    </template>

                </el-table-column>
            </el-table>
            <!-- 分页-->
            <el-pagination layout="prev, pager, next":total="pageInfo.total" :page-size="5" @current-change="selectPageInfo" style="float: right;"></el-pagination>
        </div>


        <el-dialog :title="title" :visible.sync="dialogFormVisible">
            <!--表单提交-->
            <el-form :model="user" label-width="100px" :rules="rules" ref="fm">
                <el-form-item label="姓名" prop="user_name">
                    <el-input v-model="user.user_name" maxlength="10"></el-input>
                </el-form-item>
                <el-form-item label="电话号" prop="user_phone">
                <el-input v-model="user.user_phone"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="user_pwd">
                    <el-input v-model="user.user_pwd" show-password></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="user_email">
                    <el-input v-model="user.user_email"></el-input>
                </el-form-item>
                <el-form-item label="个性签名" prop="user_sign">
                    <el-input v-model="user.user_sign"></el-input>
                </el-form-item>
                <el-form-item label="性别" prop="user_sex">
                    <el-radio v-model="radio_sex" label="1">男</el-radio>
                    <el-radio v-model="radio_sex" label="0">女</el-radio>
                </el-form-item>
                <el-form-item label="个人简介" prop="user_brief">
                    <el-input v-model="user.user_brief"></el-input>
                </el-form-item>
                <el-form-item label="职业" prop="user_trade">
                    <el-select v-model="user.user_trade">
                        <el-option v-for="item in trade":key="item.trade_id":label="item.trade_name":value="item.trade_id">
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
    import {isvalidUsername} from '@/utils/validator'
    export default {
        name: 'User',
        inject:['reload'],
        data:function () {
            return{
                list:[],
                pageInfo:{},
                user:{},
                trade:{},
                user_sex:'',
                user_state:'',
                radio_sex:'',
                StaffInfo:{'StaffInfo':JSON.parse(sessionStorage.getItem('StaffInfo'))},
                dialogFormVisible: false,
                title:'',
                rules:{
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
            //分页
            selectPageInfo:function (val) {
                this.$axios.post('BackTbUser/userAndTradeQueryAll',this.$qs.stringify({'pageNum':val,'user_name':this.user.user_names}))
                    .then(data=>{
                        this.pageInfo = data.data
                    }).catch(err=>console.info(err))
            },
            //显示from 表单
            show:function () {
                this.dialogFormVisible = true;
            },
            //搜索框
            searchs:function(val){
              this.$axios.post('BackTbUser/userAndTradeQueryAll',this.$qs.stringify({'pageNum':val,'user_name':this.user.user_names})).then(data=>{
                  this.pageInfo=data.data;
              }).catch(err=>{console.info(err)})
            },
            //添加
            save:function() {
                this.ref=
                this.$set(this.user,'user_sex',this.radio_sex);
                this.$axios.post('BackTbUser/add',this.$qs.stringify({'tbUser':JSON.stringify(this.user),'staff_id':this.StaffInfo.StaffInfo.staff_id})).then(data=>{
                    this.dialogFormVisible=false;
                    this.pageInfo=data.data;
                }).catch(err=>{console.info(err)})
            },

            upStateJ:function(user_state,user_id) {
                if(user_state==0){
                    this.$axios.post('BackTbUser/upState',this.$qs.stringify({'user_state':user_state,'user_id':user_id,'staff_id':this.StaffInfo.StaffInfo.staff_id})).then(data=>{
                        this.pageInfo=data.data;
                    }).catch(err=>{console.info(err)})
                }else{
                    console.info('禁用按钮')
                }
            },
            upStateQ:function(user_state,user_id) {
                if(user_state==1){
                    this.$axios.post('BackTbUser/upState',this.$qs.stringify({'user_state':user_state,'user_id':user_id,'staff_id':this.StaffInfo.StaffInfo.staff_id})).then(data=>{
                        this.pageInfo=data.data;
                        //this.reload();
                    }).catch(err=>{console.info(err)})
                }else{
                    console.info('禁用按钮')
                }
            }
        },
        created:function () {
            console.info(this.StaffInfo.StaffInfo);
            /*页面加载 分页查询*/
            this.$axios.post('BackTbUser/userAndTradeQueryAll').then(data=>{
                this.pageInfo=data.data;
                this.$axios.post('BackTbTrade/queryAll').then(data=>{
                    this.trade=data.data;
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
