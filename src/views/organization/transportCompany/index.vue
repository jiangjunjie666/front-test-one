<template>
  <div class="app-container">
    <div>
      <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
        <el-form-item label="运输公司名称" prop="companyName" label-width="100px">
          <el-input v-model="queryParams.companyName" placeholder="请输入运输公司名称" clearable style="width: 240px"
            @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="queryParams.status" placeholder="用户状态" clearable style="width: 240px">
            <el-option :label="'启用'" :value="0" />
            <el-option :label="'禁用'" :value="-1" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
      <el-row :gutter="10" class="mb8">
        <el-col>
          <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
            v-hasPermi="['biz:residentCompany:add']">新增</el-button>
        </el-col>
        <right-toolbar :showSearch.sync="showSearch" @queryTable="getFirmList"></right-toolbar>
      </el-row>

      <!-- 表格 -->
      <el-table v-loading="loading" :data="tableList" @selection-change="handleSelectionChange">
        <el-table-column type="index" label="序号" width="50" align="center" />
        <el-table-column label="公司编码" align="center" key="companyCode" width="150" :show-overflow-tooltip="true"
          prop="companyCode" />
        <el-table-column label="公司名称" key="companyName" prop="companyName" width="400" :show-overflow-tooltip="true" />
        <el-table-column label="简称" key="companyAbbreviation" prop="companyAbbreviation" width="250"
          :show-overflow-tooltip="true" />
        <el-table-column label="联系人" width="130" key="contacts" prop="contacts" :show-overflow-tooltip="true" />
        <el-table-column label="联系人" width="130" key="mobile" prop="mobile" :show-overflow-tooltip="true" />
        <el-table-column label="责任单位" width="150" key="createCompany" prop="createCompany"
          :show-overflow-tooltip="true" />

        <el-table-column label="状态" align="center" key="status">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.status" active-value="0" disabled inactive-value="-1"
              @change="handleStatusChange(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="车辆数量" key="vehicleCount" prop="vehicleCount" width="160" />
        <el-table-column label="更新时间" align="center" prop="updateTime" width="160">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.updateTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" prop="createTime" width="160">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
        @pagination="getFirmList" />
    </div>
    <add-firm-dialog :open="open" @cancel="cancel" :title="title" @submit-form="submitForm"></add-firm-dialog>
  </div>
</template>

<script>
import { reqGetFirmList } from '@/api/organization/transportCompany.js'
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { AddFirmDialog } from './component/index.js'
export default {
  name: "TransportCompany",
  dicts: ["company_size", "company_type"],
  components: { AddFirmDialog },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      tableList: null,
      total: 0,
      dateRange: [],
      // 是否显示弹出层
      open: false,
      title: "",
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        companyName: undefined,
        status: "",
      },
    }
  },
  methods: {
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getFirmList();
    },
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    //新增
    handleAdd() {
      this.open = true;
      this.title = "添加企业";
    },
    cancel() {
      this.open = false;
    },
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.userId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 提交按钮 */
    submitForm: function () {
      this.open = false;
      this.getList();
    },
    //查询承运企业列表
    getFirmList() {
      this.loading = true;
      reqGetFirmList(this.addDateRange(this.queryParams, this.dateRange))
        .then((response) => {
          this.tableList = response.rows;
          this.total = response.total;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },

  },
  created() {
    this.getFirmList();
  }
}
</script>
