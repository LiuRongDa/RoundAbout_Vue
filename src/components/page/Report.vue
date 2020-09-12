<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 举报详情
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="container">
            <div class="handle-box">
                <el-input v-model="report.report_content" placeholder="输入问题内容搜索" class="handle-input mr10" clearable></el-input>
                <el-date-picker v-model="report.report_data" placeholder="输入时间搜索" class="handle-input mr10"  value-format=" yyyy-MM-dd" format="yyyy-MM-dd"></el-date-picker>
                <el-button type="primary" icon="el-icon-search" @click="searchs()">搜索</el-button>
            </div>
            <el-table
                    :data="pageInfo.list"
                    border
                    class="table"
                    ref="multipleTable"
                    header-cell-class-name="table-header"
            >
                <el-table-column label="编号" prop="report_id"></el-table-column>
                <el-table-column label="举报原因" prop="report_content" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column label="举报人" prop="tbUser.user_name" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column label="被举报问题标题" prop="tbIssue.issue_title" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column label="被举报问题描述" prop="tbIssue.issue_content" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column label="被举报文章标题" prop="tbArticle.article_title" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column label="被举报文章内容" prop="tbArticle.article_content" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column label="被举报评论" prop="tbComment.comment_content" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column label="被举报回复" prop="tbReply.reply_content" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column label="举报时间" prop="report_data" :show-overflow-tooltip="true" width="110px"></el-table-column>
                <el-table-column label="操作" width="100px">
                    <!-- scope：返回当前单元格 -->
                    <template slot-scope="scope">
                        <el-button icon="el-icon-search" circle @click="showMore(scope.row.report_id,scope.row.bereport_user_id)"></el-button>
                        <el-button type="danger" icon="el-icon-delete" circle @click="del(scope.row.report_id,scope.row.tbUser.user_email)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页-->
            <el-pagination layout="prev, pager, next":total="pageInfo.total" :page-size="11" @current-change="selectPageInfo" style="float: right;"></el-pagination>
        </div>


        <el-dialog :title="title" :visible.sync="dialogFormVisible" >
            <div v-for="item1 of titCont">
                <span v-if="item1.tbIssue.issue_title!=null">
                    <h3>问题标题</h3>
                    {{item1.tbIssue.issue_title}}
                    <br><br>
                    <h3>问题内容</h3>
                    {{item1.tbIssue.issue_content}}
                </span>
                <span v-if="item1.tbArticle.article_content!=null">
                    <h3>文章标题</h3><br>
                    {{item1.tbArticle.article_title}}
                    <br><br>
                    <h3>文章内容</h3><br>
                    {{item1.tbArticle.article_content}}<br>
                </span>
                <span v-if="item1.tbComment.comment_content!=null">
                    <h3>评论</h3><br>
                    {{item1.tbComment.comment_content}}
                </span>
                <span v-if="item1.tbReply.reply_content!=null">
                    <h3>回复</h3><br>
                    {{item1.tbReply.reply_content}}<br>
                </span>
            </div><br>

            <div>
                <span style="float: right">
                    <h4>被举报人：{{BereportUser.user_name}}</h4>
                </span>
                <el-button type="danger" round size="mini" @click="Ban()">封禁用户</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: 'Report',
        data:function() {
            return{
                list:[],
                pageInfo:{},
                report:{},
                user:[],
                titCont:[],
                BereportUser:[],
                BansPeo:'',
                dialogFormVisible: false,
                title:'',
                beReportPeople:'',
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
            selectPageInfo(val){
                this.$axios.post('BackTbReport/selePage',this.$qs.stringify({'pageNum':val,'report_content':this.report.report_content,'report_data':this.report.report_data}))
                    .then(data=>{
                        this.pageInfo = data.data;
                    }).catch(err=>console.info(err))
            },
            searchs(val){
                this.$axios.post('BackTbReport/selePage',this.$qs.stringify({'pageNum':val,'report_content':this.report.report_content,'report_data':this.report.report_data}))
                    .then(data=>{
                        this.pageInfo = data.data;
                    }).catch(err=>console.info(err))
            },
            showMore(report_id,bereport_user_id){
                this.dialogFormVisible=true;
                this.title="详情";
                this.$axios.post('BackTbReport/showMore',this.$qs.stringify({'report_id':report_id})).then(data=>{
                        this.titCont=data.data;
                        //查询被举报人
                        this.$axios.post('BackTbUser/queryById',this.$qs.stringify({'user_id':bereport_user_id})).then(data=>{
                            //赋值  被举报人信息
                            this.BereportUser=data.data;
                            //赋值  被举报人编号
                            this.BansPeo=bereport_user_id;
                        }).catch(err=>{console.info(err)});
                    }).catch(err=>{console.info(err)})
            },
            Ban(){
                this.$axios.post('BackTbUser/upState',this.$qs.stringify({'user_state':0,'user_id':this.BansPeo})).then(data=>{
                    if(data.data!=null){
                        this.dialogFormVisible=false;
                        this.$message.success("禁用成功！")
                    }
                }).catch(err=>{console.info(err)})
            },
            del(report_id,user_email){
                this.$axios.post('BackTbReport/del',this.$qs.stringify({'report_id':report_id,'user_email':user_email})).then(data=>{
                        this.pageInfo=data.data;
                    }).catch(err=>{console.info(err)})
            }
        },
        created:function() {
            this.$axios.post('BackTbReport/selePage').then(data=>{
                this.pageInfo=data.data;
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
