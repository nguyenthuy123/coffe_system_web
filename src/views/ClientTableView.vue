<template>
  <div>
    <title-bar :title-stack="titleStack"/>
    <hero-bar>
      Danh sách
      <b-button style="position: absolute; right: 30px" type="is-success" @click="addClient">Thêm khách hàng</b-button>
    </hero-bar>
    <section class="section is-main-section">

      <card-component
        class="has-table has-mobile-sort-spaced"
        icon="account-multiple"
        title="Khách hàng"

      >

        <clients-table-sample
          checkable
        />
      </card-component>

      <hr>
    </section>
    <transition v-if="myModel" name="modal">
      <div class="modal-mask">
        <card-component
          class="modal-customer"
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
                  v-model="customer.name"
                  icon="account"
                  name="name"
                  placeholder="Tên"
                  required
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
                  v-model="customer.phone"
                  expanded
                  name="phone"
                  type="tel"
                />
              </b-field>
            </b-field>
            <b-field
              horizontal
              label="Điểm"
            >
              <b-field>
                <b-input
                  v-model="customer.point"
                  icon="point"
                  name="point"
                  required
                  disabled="true"
                />
              </b-field>
            </b-field>

          </form>

          <b-notification
            v-model="isActive"
            aria-close-label="Close notification"
            auto-close
            type="is-danger">
            Vui lòng điền đẩy đủ thông tin
          </b-notification>
          <div class="group-btn-customer">
            <b-button style="margin-right: 10px;" @click="myModel = false">Hủy</b-button>
            <b-button type="is-info" @click="submit">Lưu</b-button>
          </div>

        </card-component>


      </div>
    </transition>
  </div>


</template>

<script>
  import {defineComponent} from "vue";
  import NotificationBar from "@/components/NotificationBar.vue";
  import ClientsTableSample from "@/components/ClientsTableSample.vue";
  import CardComponent from "@/components/CardComponent.vue";
  import TitleBar from "@/components/TitleBar.vue";
  import HeroBar from "@/components/HeroBar.vue";
  import axios from "axios";


  export default defineComponent({
    name: "EmployeeTableView",
    components: {
      HeroBar,
      TitleBar,
      CardComponent,
      ClientsTableSample,
      NotificationBar,
    },
    data() {
      return {
        titleStack: ["Admin", "Khách hàng"],
        storeId: "",
        isActive: false,
        checkedRows: [],
        isModalActive: false,
        trashObject: null,
        customers: [],
        date: new Date(),
        stores: [],
        shifts: [],
        errors: [],
        instance: "",
        firstName: "",
        lastName: "",
        myModel: false,
        customer: {
          id: "",
          name: "",
          phone: "",
          point: "",
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
    },
    methods: {
      addClient() {
        this.myModel = true
      },

      submit() {
        if (this.checkForm() === true) {
          this.pause();
        } else {
          this.instance.post("customer/save", this.customer)
            .then((response) => {
              if (response.data.status.code === 1000) {
                this.myModel = false;
                this.$root.$emit('reloadClient');
                this.$buefy.toast.open({
                  message: "Lưu thành công",
                  type: "is-success"
                });
              }
            });
        }

      },

      checkForm() {
        if (this.customer.name === "" || this.customer.phone === "") {
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
