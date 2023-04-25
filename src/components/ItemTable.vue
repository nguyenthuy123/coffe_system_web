<template>
  <div>
    <modal-box
      :is-active="isModalActive"
      :trash-object-name="trashObject ? trashObject.name : null "
      @confirm="trashConfirm"
      @cancel="trashCancel"
    />
    <b-table
      :paginated="paginated"
      :per-page="perPage"
      :data="items"
      default-sort="name"
      striped
      hoverable
    >
      <b-table-column
        v-slot="props"
        label="ID"
        field="id"
        sortable
      >
        {{ props.row.id }}
      </b-table-column>
      <b-table-column
        v-slot="props"
        label="Tên"
        field="name"
        sortable
      >
        {{ props.row.name }}
      </b-table-column>
      <b-table-column
        v-slot="props"
        label="Danh mục"
        field="phone"
        sortable
      >
        {{ props.row.categoryName }}
      </b-table-column>
      <b-table-column
        v-slot="props"
        label="Giá"
        field="point"
        sortable
      >
        {{ props.row.price }}
      </b-table-column>
      <b-table-column
        v-slot="props"
        label="Ngày tạo"
      >
        <small
          class="has-text-grey is-abbr-like"
          :title="props.row.createTime"
        >{{ props.row.createTime}}</small>
      </b-table-column>
      <b-table-column
        v-slot="props"
        custom-key="actions"
        cell-class="is-actions-cell"

      >

        <div class="buttons is-right no-wrap">
          <b-button
            size="is-small"
            type="is-info"
            @click="detail(props.row.id)"
          >
            <b-icon
              icon="account-edit"
              size="is-small"
            />
          </b-button>

          <b-button
            size="is-small"
            type="is-danger"
            @click="openDialogDelete(props.row.id)"
          >
            <b-icon
              icon="trash-can"
              size="is-small"
            />
          </b-button>
        </div>
      </b-table-column>

      <section
        slot="empty"
        class="section"
      >
        <div class="content has-text-grey has-text-centered">
          <p>
            <b-icon
              icon="emoticon-sad"
              size="is-large"
            />
          </p>
          <p>Không có dữ liệu&hellip;</p>
        </div>
      </section>
    </b-table>
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
  import {defineComponent} from "vue";
  import ModalBox from "@/components/ModalBox.vue";
  import CardComponent from "@/components/CardComponent.vue";
  import axios from "axios";


  export default defineComponent({
    name: "ItemsTable",
    components: {ModalBox, CardComponent},
    props: {
      checkable: Boolean,
      isEmpty: Boolean,
      perPage: {
        type: Number,
        default: 10
      }
    },
    data() {
      return {
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
      this.loadItems();
      this.loadCategories();
      this.$root.$on("reloadItem", () => {
        this.loadItems();
      });
    },

    computed: {

      paginated() {
        return this.items.length > this.perPage;
      },

    },
    methods: {
      loadItems() {
        this.instance.get("/item/list")
          .then((response) => {
            this.items = response.data.content;
          })
          .catch((e) => {
            this.error.push(e);
          });
      },

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

      detail(id) {
        this.myModel = true;
        this.instance.get("item/detail/" + id)
          .then((response) => {
            this.item = response.data.data;
          })
          .catch((e) => {
            this.error.push(e);
          });
      },

      openDialogDelete(id) {
        this.$buefy.dialog.confirm({
          title: "Xóa đồ uống",
          message: "Bạn chắc chắn <b>xóa</b> chứ ?",
          confirmText: "Xóa",
          cancelText: 'Hủy',
          type: "is-danger",
          hasIcon: true,
          onConfirm: () => this.confirmDelete(id)
        });
      },

      confirmDelete(id) {
        this.instance.delete("item/" + id)
          .then((response) => {
            if (response.data.status.code === 1000) {
              this.loadItems();
              this.$buefy.toast.open({
                message: "Xóa thành công",
                type: "is-success"
              });
            }
          })
          .catch((e) => {
            this.error.push(e);
          });
      },
      submit() {
        if (this.checkForm() === true) {
          this.pause();
        } else {
          this.instance.post("/item/save", this.item)
            .then((response) => {
              if (response.data.status.code === 1000) {
                this.myModel = false;
                this.loadItems()
                this.$buefy.toast.open({
                  message: "Lưu thành công",
                  type: "is-success"
                });
              }
            });
        }

      },
      pause() {
        this.$buefy.notification.open({
          message: `Vui lòng điền đầy đủ thông tin`,
          type: "is-danger",
          pauseOnHover: true,
        });
      },

      checkForm() {
        if (this.item.name === "" || this.item.price === "" || this.item.categoryId === "") {
          return true;
        }
      },

      trashModalOpen(obj) {
        this.trashObject = obj;
        this.isModalActive = true;
      },
      trashConfirm() {
        this.isModalActive = false;

        this.$buefy.snackbar.open({
          message: "Confirmed",
          queue: false
        });
      },
      trashCancel() {
        this.isModalActive = false;
      }
    },
    // reloadData() {
    //   this.$root.$on('reload', (storeId) => {
    //     this.loadItems(storeId);
    //   })
    // }

  });
</script>

<style>
  .modal-mask-item {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    background-color: #444242da;
  }

  .modal-item {
    margin-top: 100px ;
    width: 1000px ;
    height: 450px ;
    padding: 25px ;
  }

  .group-btn-item {
    margin-top: 100px;
    position: absolute;
    right: 30px;
  }

  /*.dialog .modal-card {*/
  /*  height: 300px !important;*/
  /*}*/
</style>
