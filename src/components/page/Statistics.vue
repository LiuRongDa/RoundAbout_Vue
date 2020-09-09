<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 统计
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="container">
            <div class="schart-box">
                <div class="content-title">柱状图</div>
                <schart class="schart" canvasId="bar" :options="options1"></schart>
            </div>
            <div class="schart-box">
                <div class="content-title">折线图</div>
                <schart class="schart" canvasId="line" :options="options2"></schart>
            </div>
        </div>
    </div>
</template>

<script>
import Schart from 'vue-schart';

    export default {
        name: 'Statistics',
        components: {
            Schart
        },
        data() {
            return {
                options1: {
                    type: 'bar',
                    title: {
                        text: '最近一周各品类销售图'
                    },
                    bgColor: '#fbfbfb',
                    labels: ['周一', '周二', '周三', '周四', '周五'],
                    datasets: [
                        {
                            label: '家电11',
                            fillColor: 'rgba(241, 49, 74, 0.5)',
                            data: [234, 278, 270, 190, 230]
                        },
                        {
                            label: '百货',
                            data: [164, 178, 190, 135, 160]
                        },
                        {
                            label: '食品',
                            data: [144, 198, 150, 235, 120]
                        }
                    ]
                },
                options2: {
                    type: 'line',
                    title: {
                        text: '最近几个月各品类销售趋势图'
                    },
                    bgColor: '#fbfbfb',
                    labels: ['6月', '7月', '8月', '9月', '10月'],
                    datasets: [
                        {
                            label: '充值',
                            data: [234, 278, 270, 190, 230]
                        },
                        {
                            label: '打赏',
                            data: [114, 138, 200, 235, 190]
                        }
                    ]
                },
            };
        }
    };
</script>

<style scoped>
    .schart-box {
        display: inline-block;
        margin: 20px;
    }
    .schart {
        width: 600px;
        height: 400px;
    }
    .content-title {
        clear: both;
        font-weight: 400;
        line-height: 50px;
        margin: 10px 0;
        font-size: 22px;
        color: #1f2f3d;
    }
</style>
