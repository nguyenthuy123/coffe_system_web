<template>
  <div>
    <title-bar :title-stack="titleStack" />
    <hero-bar>
      Đồ uống
      <b-button style="position: absolute; right: 30px" type="is-success" @click="addItem">Thêm đồ uống</b-button>
    </hero-bar>
    <section class="section is-main-section">

      <card-component
        class="has-table has-mobile-sort-spaced"
        title="Đồ uống"
        icon="coffe"
      >
        <items-table
          checkable
        />
      </card-component>

      <hr>
    </section>
    <transition v-if="myModel" name="modal">
      <div class="modal-mask-item">
        <card-component
          class="modal-item"
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
                  v-model="item.name"
                  icon="account"
                  name="name"
                  placeholder="Tên"
                  required
                />
              </b-field>

            </b-field>
            <b-field
              horizontal
              label="Loại đồ uống"
            >
              <select v-model="item.categoryId" style="width: 30%; height: 30px">
                <option v-for="category in categories" :value="category.id">
                  {{ category.name }}
                </option>
              </select>

            </b-field>
            <b-field
              horizontal
              label="Giá"
            >
              <b-field>
                <b-input
                  v-model="item.price"
                  icon="account"
                  name="price"
                  type="number" min="0"
                  placeholder="Giá"
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
          <div class="group-btn-item">
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
  import axios from "axios";


  export default defineComponent({
    name: "ItemTableView",
    components: {
      ItemsTable,
      HeroBar,
      TitleBar,
      CardComponent,
      NotificationBar,
      EmployeeTable
    },
    data () {
      return {
        titleStack: ["Admin", "Đồ uống"],
        checkedRows: [],
        isModalActive: false,
        trashObject: null,
        isActive: false,
        myModel: false,
        categories: [],
        selected: '',
        items: [],
        item: {
          id: '',
          name: '',
          categoryId: '',
          categoryName: '',
          price: '',
          createTime: '',
        },
        storeId: '',
        instance: '',
        isCard: false,
        isComponentModalActive: false
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
      this.loadCategories()

    },

    methods: {
      loadCategories() {
        this.instance.get("/category/list")
          .then((response) => {
            this.categories = response.data.data;
            this.selected = this.categories[0];
          })
          .catch((e) => {
            this.error.push(e);
          });
      },
      addItem() {
        this.myModel = true
      },

      submit() {
        if (this.checkForm() === true) {
          this.pause();
        } else {
          this.instance.post("item/save", this.item)
            .then((response) => {
              if (response.data.status.code === 1000) {
                this.myModel = false;
                this.$root.$emit('reloadItem');
                this.$buefy.toast.open({
                  message: "Lưu thành công",
                  type: "is-success"
                });
              }
            });
        }

      },

      checkForm() {
        if (this.item.name === "" || this.item.phone === "") {
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
