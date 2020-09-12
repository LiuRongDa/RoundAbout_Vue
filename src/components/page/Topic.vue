<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 专栏
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="el-icon-success" class="handle-del mr10" @click="show()">添加</el-button>
                <el-input v-model="topic.topic_name" placeholder="输入姓名搜索" class="handle-input mr10" clearable></el-input>
                <el-button type="primary" icon="el-icon-search" @click="searchs()">搜索</el-button>
            </div>
            <el-table
                    :data="pageInfo.list"
                    border
                    class="table"
                    ref="multipleTable"
                    header-cell-class-name="table-header"
            >
                <el-table-column label="编号" prop="topic_id"></el-table-column>
                <el-table-column label="专栏" prop="topic_name" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column label="创建者" prop="tbUser[0].user_name"></el-table-column>
                <el-table-column label="文章标题" prop="tbArticle[0].article_title" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column label="文章内容" prop="tbArticle[0].article_content" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column label="操作">
                    <!-- scope：返回当前单元格 -->
                    <template slot-scope="scope">
                        <!--<el-button type="success" round size="mini" icon="el-icon-edit" @click="show(scope.row)"></el-button>-->
                        <el-button icon="el-icon-search" @click="showMores(scope.row.topic_id)" circle></el-button>
                        <el-button type="primary" icon="el-icon-edit" circle @click="show(scope.row)"></el-button>
                        <el-button type="danger" icon="el-icon-delete" circle @click="del(scope.row.topic_id)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页-->
            <el-pagination layout="prev, pager, next":total="pageInfo.total" :page-size="11" @current-change="selectPageInfo" style="float: right;"></el-pagination>
        </div>

        <el-dialog :title="title" :visible.sync="dialogFormVisible" >
            <div v-for="item1 of titCont">
                <span v-for="item2 in item1.tbArticle">
                    <h2>{{item2.article_title}}</h2><br>
                    <!--{{item2.article_content}}-->
                   <div v-html="item2.article_content"></div>
                </span>
            </div>
        </el-dialog>

        <el-dialog :title="title" :visible.sync="dialogFormVisible1" >
            <!--表单提交-->
            <el-form :model="topic" label-width="100px" :rules="rules" ref="fm">
                <el-form-item label="专栏名称" prop="topic_name">
                    <el-input v-model="topic.topic_name" clearable  maxlength="15"></el-input>
                </el-form-item>
                <el-form-item label="用户" prop="user_id">
                    <el-select v-model="topic.user_id">
                        <el-option v-for="item in user":key="item.user_id":label="item.user_name":value="item.user_id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible1 = false,reload()">取 消</el-button>
                <el-button type="primary"  @click="save()">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {isvalidUsername} from '@/utils/validator'
    export default {
        name: 'Topic',
        inject:['reload'],
        data:function() {
            return{
                list:[],
                pageInfo:{},
                topic:{},
                dialogFormVisible: false,
                dialogFormVisible1:false,
                title:'',
                titCont:[],
                user:{},
                rules:{
                    topic_name:[{required:true,message:'专栏名不能为空'},{validator:isvalidUsername,tigger:'blur'}]
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
            //显示文章详情
            showMores:function(topic_id) {
                this.$axios.post('BackTbTopic/queryAll',this.$qs.stringify({'topic_id':topic_id})).then(data=>{
                    //文章标题和内容
                    this.titCont=data.data;//.article_title
                    //判断文章内容是否为空
                    if(this.titCont[0].tbArticle[0].article_content==null){
                        this.dialogFormVisible=false;
                        this.$message.warning("该专栏下没有文章！")
                    }else{
                        this.dialogFormVisible=true;
                    }
                }).catch(err=>{console.info(err)});

            },
            show:function (row) {
                if (row == null) {
                    this.title = '添加专栏';
                    this.dialogFormVisible1 = true;
                    this.topic = {};
                } else {
                    this.title = '修改专栏信息';
                    this.dialogFormVisible1 = true;
                    this.topic = Object.assign({}, row)
                }
            },
            //添加、修改
            save(){
                this.$refs['fm'].validate(valid=>{
                    if(valid){
                        if(this.title=="添加专栏"){
                            this.$axios.post('BackTbTopic/add',this.$qs.stringify({'s':JSON.stringify(this.topic)})).then(data=>{
                                if(data.data!=null){
                                    this.pageInfo = data.data;
                                    this.$message.success("添加成功！")
                                }
                                this.dialogFormVisible1=false;
                            }).catch(err=>{console.info(err)})
                        }else{
                            this.$axios.post('BackTbTopic/update',this.$qs.stringify({'s':JSON.stringify(this.topic)})).then(data=>{
                                if(data.data!=null){
                                    this.pageInfo = data.data;
                                    this.$message.success("修改成功！")
                                }
                                this.dialogFormVisible1=false;
                            }).catch(err=>{console.info(err)})
                        }
                    }
                })
            },
            //分页查询
            selectPageInfo(val){
                this.$axios.post('BackTbTopic/selePage',this.$qs.stringify({'pageNum':val,'topic_name':this.topic.topic_name}))
                    .then(data=>{
                        this.pageInfo = data.data
                    }).catch(err=>console.info(err))
            },
            //模糊搜索
            searchs(val){
                this.$axios.post('BackTbTopic/selePage',this.$qs.stringify({'pageNum':val,'topic_name':this.topic.topic_name}))
                    .then(data=>{
                        this.pageInfo = data.data
                    }).catch(err=>console.info(err))
            },
            //删除
            del(topic_id){
                this.$axios.post('BackTbTopic/del',this.$qs.stringify({'topic_id':topic_id})).then(data=>{
                    //判断返回的值是否为空   为空就是专栏下有文章
                    if(data.data!='' && data.data!=null){
                        this.pageInfo = data.data;
                        this.$message.success("删除成功！");
                    }else{
                        this.$message.warning("该专栏下有文章，不能删除！");
                    }
                }).catch(err=>{console.info(err)})
            }
        },
        created:function() {
            this.$axios.post('BackTbTopic/selePage').then(data=>{
                /*this.list=data.data;*/
                this.pageInfo=data.data;
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
