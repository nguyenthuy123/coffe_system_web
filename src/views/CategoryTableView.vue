<template>
  <div>
    <title-bar :title-stack="titleStack" />
    <hero-bar>
      Đồ uống
      <b-button style="position: absolute; right: 30px" type="is-success" @click="addCategory">Thêm loại đồ uống</b-button>
    </hero-bar>
    <section class="section is-main-section">

      <card-component
        class="has-table has-mobile-sort-spaced"
        title="Đồ uống"
        icon="coffe"
      >
        <category-table
          checkable
        />
      </card-component>

      <hr>
    </section>
    <transition v-if="myModel" name="modal">
      <div class="modal-mask-category">
        <card-component
          class="modal-category"
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
                  v-model="category.name"
                  icon="account"
                  name="name"
                  placeholder="Tên"
                  required
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
          <div class="group-btn-category">
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
  import ItemsTable from "@/components/ItemTable";
  import EmployeeTable from "@/components/EmployeeTable";
  import CategoryTable from "@/components/CategoryTable";
  import axios from "axios";


  export default defineComponent({
    name: "CategoryTableView",
    components: {
      CategoryTable,
      ItemsTable,
      HeroBar,
      TitleBar,
      CardComponent,
      NotificationBar,
      EmployeeTable
    },
    data () {
      return {
        titleStack: ["Admin", "Loại đồ uống"],
        checkedRows: [],
        isModalActive: false,
        trashObject: null,
        isActive: false,
        myModel: false,
        categories: [],
        selected: '',
        items: [],
        category: {
          id: '',
          name: '',
          createTime: '',
        },
        storeId: '',
        instance: '',
        isCard: false,
        isComponentModalActive: false
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
          const token = localStorage.getItem('token');
          if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
          }

          return config;
        },

        (error) => {
          return Promise.reject(error);
        }
      );
    },

    methods: {
      addCategory() {
        this.myModel = true
      },



      submit() {
        if (this.checkForm() === true) {
          this.pause();
        } else {
          this.instance.post("category/save", this.category)
            .then((response) => {
              if (response.data.status.code === 1000) {
                this.myModel = false;
                this.$root.$emit('reloadCategory');
                this.$buefy.toast.open({
                  message: "Lưu thành công",
                  type: "is-success"
                });
              }
            });
        }

      },

      checkForm() {
        if (this.category.name === "") {
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

<style>
  .modal-mask-category {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    background-color: #444242da;
  }

  .modal-category {
    margin-top: 100px ;
    width: 1000px ;
    height: 300px ;
    padding: 25px ;
  }

  .group-btn-category {
    margin-top: 100px;
    position: absolute;
    right: 30px;
  }

  /*.dialog .modal-card {*/
  /*  height: 300px !important;*/
  /*}*/
</style>
