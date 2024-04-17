<template>
  <el-dialog :title="title" :close-on-click-modal="false" :visible="open" width="900px" append-to-body @close="cancel"
    @open="openModel">
    <el-form size="small" ref="form" :model="form" :rules="rules" label-width="150px" v-loading='loading'>
      <el-descriptions title="基本信息"></el-descriptions>
      <el-row :gutter="15">
        <el-col :span="12">
          <el-form-item label="企业编码" prop="companyCode">
            <el-input disabled v-model="form.companyCode" placeholder="系统自动生成" maxlength="30" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="统一社会信用代码" prop="orgCode">
            <el-input v-model="form.orgCode" maxlength="18" placeholder="请输入统一社会信用代码" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="15">
        <el-col :span="12">
          <el-form-item label="企业名称" prop="companyName">
            <el-input v-model="form.companyName" placeholder="请输入企业名称" maxlength="30" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="简称" prop="companyAbbreviation">
            <el-input v-model="form.companyAbbreviation" placeholder="请输入简称" maxlength="30" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="15">
        <el-col :span="12">
          <el-form-item label="电话" prop="telephone">
            <el-input v-model="form.telephone" placeholder="请输入电话" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系人" prop="contacts">
            <el-input v-model="form.contacts" placeholder="请输入联系人" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="15">
        <el-col :span="12">
          <el-form-item label="联系电话" prop="mobile">
            <el-input v-model="form.mobile" @blur="mobileBluer" placeholder="请输入11位手机号" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态" prop="status">
            <el-switch v-model="form.status" active-value="0" inactive-value="-1"></el-switch>
          </el-form-item>
        </el-col>
      </el-row>
      <div v-if="!form.companyId">
        <el-divider></el-divider>
        <el-descriptions title="账号设置"></el-descriptions>
        <el-row :gutter="15">
          <el-col :span="12">
            <el-form-item label="企业登录账号" prop="userName">
              <el-input disabled v-model="form.userName" placeholder="请输入联系电话自动生成账号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="企业登录密码" prop="password">
              <el-input v-model="form.password" disabled placeholder="企业登录密码" />
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { reqGetFirmCode, reqGetInitPwd, reqAddFirm } from '@/api/organization/transportCompany.js'
import { regexIsSocialcode } from "@/utils/validate";
export default {
  name: "AddFirmDialog",
  props: {
    open: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '',
    }
  },
  data() {
    const validateSocialcode = (rule, value, callback) => {
      if (!regexIsSocialcode(value)) {
        callback(new Error("信用代码格式错误"));
      } else {
        callback();
      }
    };
    return {
      form: {
        companyAbbreviation: null,
        companyCode: null,
        companyName: null,
        contacts: null,
        mobile: null,
        orgCode: null,
        password: null,
        registeType: 2,
        status: '0',
        telephone: null,
        userName: null
      },
      loading: false,
      rules: {
        orgCode: [
          {
            required: true,
            message: "统一社会信用代码不能为空",
            trigger: "blur",
          },
          {
            validator: validateSocialcode,
            trigger: "blur",
          },
        ],
        companyName: [
          { required: true, message: "公司名称不能为空", trigger: "blur" },
          { min: 1, max: 30, message: '公司名称长度必须介于 1 和 30 之间', trigger: 'blur' }
        ],
        companyAbbreviation: [
          { required: true, message: "简称不能为空", trigger: "blur" },
          { min: 1, max: 30, message: '简称长度必须介于 1 和 30 之间', trigger: 'blur' }
        ],
        contacts: [
          { required: true, message: "联系人不能为空", trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "联系电话不能为空", trigger: "blur" },
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "blur",
          },
        ],
        userName: [
          { required: true, message: "企业登录账号不能为空", trigger: "blur" },
        ],
        password: [
          { required: true, message: "企业登录密码不能为空", trigger: "blur" },
        ]
      }
    }
  },
  methods: {
    openModel() {

    },
    cancel() {
      this.$emit("cancel");
    },
    //获取初始化密码
    getInitPwd() {
      reqGetInitPwd().then((response) => {
        this.form.password = response.msg;
      });
    },
    //获取企业编码
    getCompanyCode() {
      reqGetFirmCode().then((response) => {
        this.form.companyCode = response.msg;
      });
    },
    // 手机号输入完  赋值账号
    mobileBluer() {
      if (this.form.companyId) {
        return;
      }
      this.$refs.form.validateField("mobile", (error) => {
        if (!error) {
          this.form.userName = this.form.mobile;
        }
      });
    },
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          // 检验通过，可以修改
          reqAddFirm(this.form).then((response) => {
            this.$modal.msgSuccess("新增成功");
            this.$emit("submit-form");
          })
        } else {
          // 检验不通过，不允许修改
          return false;
        }
      });
    }
  },
  mounted() {
    this.getInitPwd();
    this.getCompanyCode();
  }
}
</script>
