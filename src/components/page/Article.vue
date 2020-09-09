<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 文章
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="container">
            <div class="handle-box">
                <el-input v-model="article.article_title" placeholder="输入标题搜索" class="handle-input mr10"></el-input>
                <el-input v-model="article.article_content" placeholder="输入标题搜索" class="handle-input mr10"></el-input>
                <el-date-picker v-model="article.article_date" placeholder="输入时间搜索" class="handle-input mr10"  value-format=" yyyy-MM-dd" format="yyyy-MM-dd"></el-date-picker>
                <el-button type="primary" icon="el-icon-search" @click="searchs()">搜索</el-button>
            </div>
            <el-table
                    :data="pageInfo.list"
                    border
                    class="table"
                    ref="multipleTable"
                    header-cell-class-name="table-header"
            >
                <el-table-column label="编号" prop="article_id"></el-table-column>
                <el-table-column label="标题" prop="article_title" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column label="内容" prop="article_content" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column label="头像" align="center">
                    <template slot-scope="scope">
                        <el-image
                                class="table-td-thumb"
                                :src="'http://localhost:8088/springboot/imgs/'+scope.row.article_photo"
                                :preview-src-list="['http://localhost:8088/springboot/imgs/'+scope.row.article_photo]"
                        ></el-image>
                    </template>
                </el-table-column>
                <el-table-column label="状态" prop="article_state" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        {{scope.row.article_state ==0?'正常':'封禁'}}
                    </template>
                </el-table-column>
                <el-table-column label="点赞数量" prop="article_count" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column label="评论数量" prop="count" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column label="时间" prop="article_date" :show-overflow-tooltip="true" width="100px"></el-table-column>
                <el-table-column label="作者" prop="tbUser.user_name" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column label="操作" width="100px">
                    <!-- scope：返回当前单元格 -->
                    <template slot-scope="scope">
                        <el-button icon="el-icon-search" circle @click="showMore(scope.row.article_id)"></el-button>
                        <el-button type="danger" icon="el-icon-delete" circle @click="del(scope.row.article_id)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页-->
            <el-pagination layout="prev, pager, next":total="pageInfo.total" :page-size="5" @current-change="selectPageInfo" style="float: right;"></el-pagination>
        </div>

        <el-dialog :title="title" :visible.sync="dialogFormVisible" >
            <h3>问题标题</h3>
            {{details.article_title}}
            <h3>问题内容</h3>
            {{details.article_content}}<br><br>
            <span style="float: right"><h3>作者：{{users.user_name}}</h3></span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: 'Article',
        data:function() {
            return{
                list:[],
                pageInfo:{},
                article:{},
                details:{},
                users:{},
                dialogFormVisible: false,
                title:'',
                rules:{
                    /*topic_name:[{required:true,message:'专栏名不能为空'}]*/
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
            selectPageInfo(val){
                this.$axios.post('BackTbArticle/selePage',this.$qs.stringify({'pageNum':val})).then(data=>{
                        this.pageInfo=data.data;
                    }).catch(err=>{console.info(err)})
            },
            searchs(val){
                console.info(this.article.article_date);
                this.$axios.post('BackTbArticle/selePage',this.$qs.stringify({'pageNum':val,'article_title':this.article.article_title,'article_content':this.article.article_content,'article_date':this.article.article_date})).then(data=>{
                    this.pageInfo=data.data;
                }).catch(err=>{console.info(err)})
            },
            showMore(article_id){
                this.dialogFormVisible=true;
                this.title="查看详情";
                this.$axios.post('BackTbArticle/seleOne',this.$qs.stringify({'article_id':article_id})).then(data=>{
                        this.details=data.data;
                        this.$axios.post('BackTbUser/queryById',this.$qs.stringify({'user_id':this.details.user_id})).then(data=>{
                                this.users=data.data;
                            }).catch(err=>{console.info(err)})
                    }).catch(err=>{console.info(err)})
            },
            del(article_id){
                this.$axios.post('BackTbArticle/del',this.$qs.stringify({'article_id':article_id})).then(data=>{
                        this.pageInfo=data.data;
                        this.$message.success("删除成功！")
                    }).catch(err=>{console.info(err)})
            }
        },
        created:function() {
            this.$axios.post('BackTbArticle/selePage').then(data=>{
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
