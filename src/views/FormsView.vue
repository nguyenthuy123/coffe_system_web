<template>
  <div>
    <title-bar :title-stack="titleStack"/>
    <hero-bar>
      Tài khoản
      <router-link
        slot="right"
        class="button"
        to="/"
      >
        Thông tin
      </router-link>
    </hero-bar>
    <section class="section is-main-section">
      <card-component
        icon="ballot"
        title="Thông tin"
      >
        <form @submit.prevent="formAction">
          <b-field
            horizontal
            label="Tên"
          >
            <b-field>
              <b-input
                v-model="user.username"
                icon="account"
                name="username"
                placeholder="Tên đăng nhập"
                required
              />
            </b-field>

          </b-field>
          <b-field
            horizontal
            label="Mật khẩu"
          >
            <b-field>
              <b-input
                v-model="user.password"
                icon="account"
                name="name"
                type="password"
                placeholder="Mật khẩu"
                required
              />
            </b-field>

          </b-field>
          <b-field
            horizontal
            label="Nhân viên"
          >
            <select v-model="user.employeeId" style="width: 30%; height: 30px">
              <option v-for="employee in employees" :value="employee.id">
                {{ employee.name }}
              </option>
            </select>
          </b-field>
          <b-field
            horizontal
            label="Chức vụ"
          >
            <select v-model="user.role" style="width: 30%; height: 30px">
              <option v-for="role in roles" :value="role.name">
                {{ role.name }}
              </option>
            </select>
          </b-field>
        </form>
        <b-field grouped class="group-btn-action">
          <div class="control">
            <b-button
              native-type="submit"
              type="is-info"
              @click="submit"
            >
              Xác nhận
            </b-button>
          </div>
          <div class="control">
            <b-button
              type="is-info is-outlined"
              @click="resetForm"
            >
              Xóa
            </b-button>
          </div>
        </b-field>
      </card-component>

    </section>
  </div>
</template>

<script>
  import {defineComponent} from "vue";
  import TitleBar from "@/components/TitleBar.vue";
  import CardComponent from "@/components/CardComponent.vue";
  import FilePicker from "@/components/FilePicker.vue";
  import HeroBar from "@/components/HeroBar.vue";
  import CheckboxRadioPicker from "@/components/CheckboxRadioPicker.vue";
  import axios from "axios";

  export default defineComponent({
    name: "FormsView",
    components: {
      CheckboxRadioPicker,
      HeroBar,
      FilePicker,
      CardComponent,
      TitleBar
    },
    data() {
      return {
        titleStack: ["Admin", "Tài khoản nhân viên"],
        date: new Date(),
        employees: [],
        roles: [],
        user: {
          id: '',
          username: '',
          password: '',
          employeeId: '',
          role: '',
        }
      };
    },

    mounted() {
      const baseDomain = "http://localhost:8080";

      const baseURL = `${baseDomain}`;
      this.instance = axios.create({
        baseURL,
      });
      this.instance.interceptors.request.use(
        (config) => {
          const token = localStorage.getItem("token");
          if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
          }

          return config;
        },

        (error) => {
          return Promise.reject(error);
        }
      );
      this.storeId = localStorage.getItem("storeId");

      this.loadEmployee(this.storeId);
      this.loadRole();
      this.user.employeeId = this.employees[0].id;
      this.user.role = this.roles[0].name;
      this.$on('reloadEm', (storeId) => {
        this.loadEmployee(storeId);
      })
    },

    methods: {
      loadEmployee(storeId) {
        this.instance.get("/admin/employee/" + storeId + "/list")
          .then((response) => {
            this.employees = response.data.content;
          })
          .catch((e) => {
            this.error.push(e);
          });
      },

      loadRole() {
        this.instance.get("/role/list")
          .then((response) => {
            this.roles = response.data;
          })
          .catch((e) => {
            this.error.push(e);
          });
      },

      submit() {
        if (this.checkForm()) {
          this.pause()
        } else {
          this.instance.post("/user/save", this.user)
            .then((response) => {
              if (response.data.status.code === 1000) {
                this.resetForm();
                this.$buefy.toast.open({
                  message: 'Lưu thành công',
                  type: 'is-success'
                })
              }
            });
        }
      },

      checkForm() {
        if (this.user.username === "" || this.user.password === "" || this.user.employeeId === "" || this.user.role === "") {
          return true;
        }
      },

      pause() {
        this.$buefy.notification.open({
          message: `Vui lòng điền đầy đủ thông tin`,
          type: "is-danger",
          pauseOnHover: true,
        });
      },

      resetForm() {
        this.user.id = '',
        this.user.username = '',
        this.user.password = '',
        this.user.employeeId = '',
        this.user.role = ''
      }
    }
  });
</script>

<style>
  .group-btn-action  {
    margin-left: 18%;
    margin-top: 35px;
  }
</style>
