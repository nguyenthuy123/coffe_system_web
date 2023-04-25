<template>
  <div>
    <title-bar :title-stack="titleStack" />
    <hero-bar>
      Danh sách
      <b-button style="position: absolute; right: 30px" type="is-success" @click="addEmployee">Thêm nhân viên</b-button>
    </hero-bar>
    <section class="section is-main-section">

      <card-component
        class="has-table has-mobile-sort-spaced"
        title="Nhân viên"
        icon="account-multiple"
      >
        <employee-table
          checkable
        />
      </card-component>

      <hr>
    </section>
    <transition v-if="myModel" name="modal">
      <div class="modal-mask">
        <card-component
          class="modal-card"
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
                  v-model="employee.name"
                  icon="account"
                  name="name"
                  placeholder="Tên"
                  required
                />
              </b-field>
              <b-field>
                <b-input
                  v-model="employee.email"
                  icon="email"
                  name="email"
                  placeholder="E-mail"
                  required
                  type="email"
                />
              </b-field>
            </b-field>
            <b-field
              horizontal
              message="Không bắt đầu bằng số 0"
            >
              <b-field>
                <p class="control">
                  <a class="button is-static">
                    +84
                  </a>
                </p>
                <b-input
                  v-model="employee.phone"
                  expanded
                  name="phone"
                  type="tel"
                />
              </b-field>
            </b-field>

            <b-field
              horizontal
              label="Địa chỉ"
              message="Nhập địa chỉ"
            >
              <b-input
                v-model="employee.address"
                placeholder="Ví dụ: Hà Nội"
                required
              />
            </b-field>
            <b-field
              horizontal
              label="Ngày sinh"
            >
              <b-datepicker v-model="employee.dob"
                            :first-day-of-week="1"
                            placeholder="Chọn ngày sinh...">

              </b-datepicker>
            </b-field>

            <b-field
              class="has-check"
              horizontal
              label="Ca"
            >
              <div v-for="shift in shifts">
                <input id="shift" v-model="employee.shiftId" :value="shift.id" type="radio"/> {{ shift.name }}
              </div>
            </b-field>
            <b-field
              class="has-check"
              horizontal
              label="Cơ sở cửa hàng"
            >
              <div v-for="store in stores">
                <input id="store" v-model="employee.storeId" :value="store.id" type="radio"/> {{ store.name }}
              </div>
            </b-field>


          </form>

          <b-notification
            v-model="isActive"
            aria-close-label="Close notification"
            auto-close
            type="is-danger">
            Vui lòng điền đẩy đủ thông tin
          </b-notification>
          <div class="group-btn">
            <b-button style="margin-right: 10px;" @click="myModel = false">Hủy</b-button>
            <b-button type="is-info" @click="submit">Lưu</b-button>
          </div>

        </card-component>


      </div>
    </transition>
  </div>
</template>

<script>
  import { defineComponent } from "vue";
  import NotificationBar from "@/components/NotificationBar.vue";
  import CardComponent from "@/components/CardComponent.vue";
  import TitleBar from "@/components/TitleBar.vue";
  import HeroBar from "@/components/HeroBar.vue";
  import EmployeeTable from "@/components/EmployeeTable";
  import axios from "axios";


  export default defineComponent({
    name: "EmployeeTableView",
    components: {
      HeroBar,
      TitleBar,
      CardComponent,
      NotificationBar,
      EmployeeTable
    },
    data () {
      return {
        titleStack: ["Admin", "Nhân viên"],
        storeId: "",
        isActive: false,
        checkedRows: [],
        isModalActive: false,
        trashObject: null,
        employees: [],
        date: new Date(),
        stores: [],
        shifts: [],
        errors: [],
        instance: "",
        firstName: "",
        lastName: "",
        myModel: false,
        employee: {
          id: "",
          name: "",
          dob: "",
          address: "",
          phone: "",
          email: "",
          storeId: "",
          shiftId: "",
          shiftName: "",
          createTime: ""
        }
      };
    },

    mounted() {
      const baseDomain = "https://coffesystem-production.up.railway.app";

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
      this.loadStore();
      this.loadShift(this.storeId);
      this.employee.storeId = this.stores[0].id;
      this.employee.shiftId = this.shifts[0].id;
    },

    methods: {
      addEmployee() {
        this.storeId = localStorage.getItem("storeId");
        this.myModel = true;
        this.loadStore();
        this.loadShift(this.storeId);
      },
      loadStore() {
        this.instance.get("/store/list")
          .then((response) => {
            this.stores = response.data.data;
            this.employee.storeId = this.stores[0].id;
          })
          .catch((e) => {
            this.error.push(e);
          });
      },

      loadShift(storeId) {
        this.instance.get("admin/" + storeId + "/shift/list")
          .then((response) => {
            this.shifts = response.data;
            this.employee.shiftId = this.shifts[0].id;
          })
          .catch((e) => {
            this.error.push(e);
          });
      },

      submit() {
        console.log(this.employee)
        if (this.checkForm() === true) {
          this.pause();
        } else {
          this.instance.post("admin/employee/save", this.employee)
            .then((response) => {
              if (response.data.status.code === 1000) {
                this.myModel = false;
                this.$buefy.toast.open({
                  message: "Lưu thành công",
                  type: "is-success"
                });
              }
            });
        }

      },

      checkForm() {
        if (this.employee.name === "" || this.employee.phone === "" || this.employee.address === "") {
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
    }
  });
</script>
