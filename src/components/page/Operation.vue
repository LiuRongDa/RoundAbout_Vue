<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 操作记录
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="container">
            <div class="handle-box">
                <el-input v-model="operation.report_content" placeholder="输入问题内容搜索" class="handle-input mr10"></el-input>
                <el-date-picker v-model="operation.report_data" placeholder="输入时间搜索" class="handle-input mr10"  value-format=" yyyy-MM-dd" format="yyyy-MM-dd"></el-date-picker>
                <el-button type="primary" icon="el-icon-search" @click="searchs()">搜索</el-button>
            </div>
            <el-table
                    :data="pageInfo.list"
                    border
                    class="table"
                    ref="multipleTable"
                    header-cell-class-name="table-header"
            >
                <el-table-column label="编号" prop="operation_id"></el-table-column>
                <el-table-column label="内容" prop="operation_content" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column label="用户" prop="user_name" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column label="操作人" prop="tbStaff.staff_name" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column label="操作人账号" prop="tbStaff.staff_number" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column label="时间" prop="operation_time" :show-overflow-tooltip="true" width="110px"></el-table-column>
            </el-table>
            <!-- 分页-->
            <el-pagination layout="prev, pager, next":total="pageInfo.total" :page-size="15" @current-change="selectPageInfo" style="float: right;"></el-pagination>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'Operation',
        data:function () {
            return{
                list:[],
                pageInfo:{},
                operation:{},
                dialogFormVisible: false,
                title:'',
                rules:{
                    //staff_name:[{required:true,message:'姓名不能为空'}]
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
                this.$axios.post('BackTbOperaion/selePage',this.$qs.stringify({'pageNum':val})).then(data=>{
                        this.pageInfo=data.data;
                    }).catch(err=>{console.info(err)})
            },
            searchs(val){
                this.$axios.post('BackTbOperaion/selePage',this.$qs.stringify({'pageNum':val,'operation_content':this.operation.report_content,'operation_time':this.operation.report_data})).then(data=>{
                    this.pageInfo=data.data;
                }).catch(err=>{console.info(err)})
            }
        },
        created:function() {
            this.$axios.post('BackTbOperaion/selePage').then(data=>{
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
