<template>
  <div>
    <title-bar :title-stack="titleStack"/>
    <hero-bar>
      Bảng công

    </hero-bar>
    <section class="section is-main-section">

      <card-component
        class="has-table has-mobile-sort-spaced"
        title="Bảng chấm công"
        icon="account"
      >
        <attendance-table
          checkable
        />
      </card-component>

      <hr>
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
  import AttendanceTable from "@/components/AttendanceTable";

  export default defineComponent({
    name: "AttendanceTableView",
    components: {
      AttendanceTable,
      CheckboxRadioPicker,
      HeroBar,
      FilePicker,
      CardComponent,
      TitleBar
    },
    data() {
      return {
        titleStack: ["Admin", "Bảng chấm công"],
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
    },

    methods: {
      loadEmployee(storeId) {
        this.instance.get("/employee/" + storeId + "/list")
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
