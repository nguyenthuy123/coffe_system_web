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
      :data="categories"
      default-sort="name"
      striped
      hoverable
    >
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
        label="Ngày tạo"
        field="createTime"
        sortable
      >
        {{ props.row.createTime.split("T")[0] + " " + props.row.createTime.split("T")[1].split(".")[0] }}
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
  import {defineComponent} from "vue";
  import CardComponent from "@/components/CardComponent.vue";
  import ModalBox from "@/components/ModalBox.vue";
  import axios from "axios";


  export default defineComponent({
    name: "CategoryTable",
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
        categories: [],
        storeId: '',
        isActive: false,
        myModel: false,
        instance: '',
        category: {
          id: '',
          name: '',
          createTime: ''
        },
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
      this.loadCategories();
      this.$root.$on("reloadCategory", () => {
        this.loadCategories();
      });
    },

    computed: {

      paginated() {
        return this.categories.length > this.perPage;
      },
    },
    methods: {
      loadCategories() {
        this.instance.get("/category/list")
          .then((response) => {
            this.categories = response.data.data;
          })
          .catch((e) => {
            this.error.push(e);
          });
      },

      submit() {
        if (this.checkForm() === true) {
          this.pause();
        } else {
          this.instance.post("/category/save", this.category)
            .then((response) => {
              if (response.data.status.code === 1000) {
                this.myModel = false;
                this.loadCategories()
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
        if (this.category.name === "") {
          return true;
        }
      },

      detail(id) {
        this.myModel = true;
        this.instance.get("category/detail/" + id)
          .then((response) => {
            this.category = response.data.data;
          })
          .catch((e) => {
            this.error.push(e);
          });
      },

      openDialogDelete(id) {
        this.$buefy.dialog.confirm({
          title: "Xóa loại đồ uống",
          message: "Bạn chắc chắn <b>xóa</b> chứ ?",
          confirmText: "Xóa",
          cancelText: 'Hủy',
          type: "is-danger",
          hasIcon: true,
          onConfirm: () => this.confirmDelete(id)
        });
      },

      confirmDelete(id) {
        this.instance.delete("category/" + id)
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
