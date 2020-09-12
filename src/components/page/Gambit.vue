<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 话题
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="el-icon-success" class="handle-del mr10" @click="show()">添加</el-button>
                <el-input v-model="gambit.gambit_name" placeholder="输入姓名搜索" class="handle-input mr10" clearable></el-input>
                <el-button type="primary" icon="el-icon-search" @click="searchs()">搜索</el-button>
            </div>
            <el-table
                    :data="pageInfo.list"
                    border
                    class="table"
                    ref="multipleTable"
                    header-cell-class-name="table-header"
            >
                <el-table-column label="编号" prop="gambit_id"></el-table-column>
                <el-table-column label="专栏" prop="gambit_name" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column label="文章标题" prop="tbArticle[0].article_title" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column label="文章内容" prop="tbArticle[0].article_content" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column label="操作" width="150px">
                    <!-- scope：返回当前单元格 -->
                    <template slot-scope="scope">
                        <el-button icon="el-icon-search" @click="showMores(scope.row.gambit_id)" circle></el-button>
                        <el-button type="primary" icon="el-icon-edit" circle @click="show(scope.row)"></el-button>
                        <el-button type="danger" icon="el-icon-delete" circle @click="del(scope.row.gambit_id)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页-->
            <el-pagination layout="prev, pager, next":total="pageInfo.total" :page-size="20" @current-change="selectPageInfo" style="float: right;"></el-pagination>
        </div>

        <el-dialog :title="title" :visible.sync="dialogFormVisible" >
            <div v-for="item1 of titCont">
                <span v-for="item2 in item1.tbArticle">
                    <h2>{{item2.article_title}}</h2><br>
                    <div v-html="item2.article_content"></div>
                </span>
            </div>
        </el-dialog>

        <el-dialog :title="title" :visible.sync="dialogFormVisible1" >
            <!--表单提交-->
            <el-form :model="gambit" label-width="100px" :rules="rules" ref="fm">
                <el-form-item label="话题名称" prop="gambit_name">
                    <el-input v-model="gambit.gambit_name" maxlength="20" clearable></el-input>
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
        name: 'Gambit',
        inject:['reload'],
        data:function() {
            return{
                list:[],
                pageInfo:{},
                titCont:[],
                gambit:{},
                dialogFormVisible: false,
                dialogFormVisible1:false,
                title:'',
                rules:{
                    gambit_name:[{required:true,message:'话题名不能为空'},{validator:isvalidUsername,tigger:'blur'}]
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
            showMores:function(gambit_id) {
                this.$axios.post('BackTbGambit/queryAll',this.$qs.stringify({'gambit_id':gambit_id})).then(data=>{
                    this.titCont=data.data;
                    this.dialogFormVisible=true;
                    /*if(this.titCont[0].tbArticle.length>1){
                        this.dialogFormVisible=true;
                    }else{
                        this.dialogFormVisible=false;
                        this.$message.warning("该话题下没有更多的文章了~")
                    }*/
                }).catch(err=>{console.info(err)})
            },
            show:function (row) {
                if (row == null) {
                    this.title = '添加话题';
                    this.dialogFormVisible1 = true;
                    this.gambit = {};
                } else {
                    this.title = '修改话题内容';
                    this.dialogFormVisible1 = true;
                    this.gambit = Object.assign({}, row)
                }
            },
            save(){
                this.$refs['fm'].validate(valid=>{
                    if(valid){
                        if(this.title=="添加话题"){
                            this.$axios.post('BackTbGambit/add',this.$qs.stringify({'s':JSON.stringify(this.gambit)})).then(data=>{
                                if(data.data!=null){
                                    this.pageInfo = data.data;
                                    this.$message.success("添加成功！")
                                }
                                this.reload();
                                this.dialogFormVisible1=false;
                            }).catch(err=>{console.info(err)})
                        }else{
                            this.$axios.post('BackTbGambit/update',this.$qs.stringify({'s':JSON.stringify(this.gambit)})).then(data=>{
                                if(data.data!=null){
                                    this.pageInfo = data.data;
                                    this.$message.success("修改成功！")
                                }
                                this.reload();
                                this.dialogFormVisible1=false;
                            }).catch(err=>{console.info(err)})
                        }
                    }
                })
            },
            selectPageInfo(val){
                this.$axios.post('BackTbGambit/selePage',this.$qs.stringify({'pageNum':val,'gambit_name':this.gambit.gambit_name}))
                    .then(data=>{
                        this.pageInfo = data.data;
                    }).catch(err=>console.info(err))
            },
            searchs(val){
                this.$axios.post('BackTbGambit/selePage',this.$qs.stringify({'pageNum':val,'gambit_name':this.gambit.gambit_name}))
                    .then(data=>{
                        this.pageInfo = data.data
                    }).catch(err=>console.info(err))
            },
            del(gambit_id){
              this.$axios.post('BackTbGambit/del',this.$qs.stringify({'gambit_id':gambit_id})).then(data=>{
                  //判断返回的值是否为空   为空就是专栏下有文章
                  if(data.data!='' && data.data!=null){
                      this.pageInfo = data.data;
                      this.$message.success("删除成功！");
                  }else{
                      this.$message.warning("该话题下有文章，不能删除！");
                  }
                  }).catch(err=>{console.info(err)})
            }
        },
        created:function() {
            this.$axios.post('BackTbGambit/selePage').then(data=>{
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
