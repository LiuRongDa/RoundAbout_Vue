<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 问题
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="el-icon-success" class="handle-del mr10" @click="show()">添加</el-button>
                <el-input v-model="issue.issue_title" placeholder="输入标题搜索" class="handle-input mr10"></el-input>
                <el-input v-model="issue.issue_content" placeholder="输入内容搜索" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="searchs()">搜索</el-button>
            </div>
            <el-table
                    :data="pageInfo.list"
                    border
                    class="table"
                    ref="multipleTable"
                    header-cell-class-name="table-header"
            >
                <el-table-column label="编号" prop="issue_id"></el-table-column>
                <el-table-column label="标题" prop="issue_title" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column label="内容" prop="issue_content" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column label="用户名" prop="tbUser.user_name" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column label="创建时间" prop="issue_date" :show-overflow-tooltip="true" width="110px"></el-table-column>
                <el-table-column label="浏览次数" prop="issue_count" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column label="评论数量" prop="count" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column label="操作"  width="100px">
                    <!-- scope：返回当前单元格 -->
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="show(scope.row)">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页-->
            <el-pagination layout="prev, pager, next":total="pageInfo.total" :page-size="2" @current-change="selectPageInfo" style="float: right;"></el-pagination>
        </div>


        <el-dialog :title="title" :visible.sync="dialogFormVisible" >
            <!--表单提交-->
            <el-form :model="issue" label-width="100px" :rules="rules" ref="fm">
                <el-form-item label="话题名称" prop="issue_title">
                    <el-input v-model="issue.issue_title"></el-input>
                </el-form-item>
                <el-form-item label="话题描述" prop="issue_content">
                    <el-input v-model="issue.issue_content"></el-input>
                </el-form-item>
                <el-form-item label="用户" prop="user_id">
                    <el-select v-model="issue.user_id">
                        <el-option v-for="item in user":key="item.user_id":label="item.user_name":value="item.user_id">
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
        name: 'Issue',
        data:function() {
            return{
                list:[],
                pageInfo:{},
                issue:{},
                user:[],
                dialogFormVisible: false,
                title:'',
                rules:{
                    topic_name:[{required:true,message:'专栏名不能为空'}]
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
                    this.title = '添加问题';
                    this.dialogFormVisible = true;
                    this.issue = {};
                } else {
                    this.title = '修改问题';
                    this.dialogFormVisible = true;
                    this.issue = Object.assign({}, row)
                }
            },
            //分页
            selectPageInfo(val){
                this.$axios.post('BackTbIssue/selePage',this.$qs.stringify({'pageNum':val,'issue_title':this.issue.issue_title,'issue_content':this.issue.issue_content}))
                    .then(data=>{
                        this.pageInfo = data.data;
                    }).catch(err=>console.info(err))
            },
            //模糊查询
            searchs(val){
                this.$axios.post('BackTbIssue/selePage',this.$qs.stringify({'pageNum':val,'issue_title':this.issue.issue_title,'issue_content':this.issue.issue_content}))
                    .then(data=>{
                        this.pageInfo = data.data;
                    }).catch(err=>console.info(err))
            },
            //添加修改
            save(){
                this.$axios.post('BackTbIssue/save',this.$qs.stringify({'s':JSON.stringify(this.issue)})).then(data=>{
                        if(data.data!=null && data.data!=''){
                            this.pageInfo = data.data;
                            this.$message.success("成功！")
                        }
                        this.dialogFormVisible=false;
                    }).catch(err=>{console.info(err)})
            }
        },
        created:function() {
            this.$axios.post('BackTbIssue/selePage').then(data=>{
                    this.pageInfo=data.data;
                    //查询用户
                    this.$axios.post('BackTbUser/queryAll').then(data=>{
                            this.user=data.data;
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
