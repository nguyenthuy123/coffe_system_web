<template>
  <div>
    <modal-box
      :is-active="isModalActive"
      :trash-object-name="trashObject ? trashObject.name : null "
      @cancel="trashCancel"
      @confirm="trashConfirm"
    />
    <b-table
      :data="customers"
      :paginated="paginated"
      :per-page="perPage"
      default-sort="name"
      hoverable
      striped
    >
      <b-table-column
        v-slot="props"
        field="name"
        label="Tên"
        sortable
      >
        {{ props.row.name }}
      </b-table-column>
      <b-table-column
        v-slot="props"
        field="phone"
        label="Số điện thoại"
        sortable
      >
        {{ props.row.phone }}
      </b-table-column>
      <b-table-column
        v-slot="props"
        field="point"
        label="Điểm"
        sortable
      >
        {{ props.row.point }}
      </b-table-column>
      <b-table-column
        v-slot="props"
        field="shiftName"
        label="Ngày tạo"
        sortable
      >
        {{ props.row.createTime.split("T")[0] + " " + props.row.createTime.split("T")[1].split(".")[0] }}
      </b-table-column>
      <b-table-column
        v-slot="props"
        cell-class="is-actions-cell"
        custom-key="actions"
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
                  disabled="true"
                  icon="point"
                  name="point"
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
  import ModalBox from "@/components/ModalBox.vue";
  import CardComponent from "@/components/CardComponent.vue";
  import axios from "axios";

  export default defineComponent({
    name: "ClientTableSample",
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
      this.storeId = localStorage.getItem("storeId");
      this.loadClient();
      this.$root.$on("reloadClient", () => {
        this.loadClient();
      });
    },

    computed: {
      paginated() {
        return this.customers.length > this.perPage;
      },

    },
    methods: {
      loadClient() {
        this.instance.get("/customer/list")
          .then((response) => {
            this.customers = response.data;
          })
          .catch((e) => {
            this.error.push(e);
          });
      },

      detail(id) {
        this.myModel = true;
        this.instance.get("customer/detail/" + id)
          .then((response) => {
            this.customer = response.data;
          })
          .catch((e) => {
            this.error.push(e);
          });
      },

      submit() {
        if (this.checkForm() === true) {
          this.pause();
        } else {
          this.instance.post("customer/save", this.customer)
            .then((response) => {
              if (response.data.status.code === 1000) {
                this.myModel = false;
                this.loadClient();
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
      openDialogDelete(id) {
        this.$buefy.dialog.confirm({
          title: "Xóa khách hàng",
          message: "Bạn chắc chắn <b>xóa</b> chứ ?",
          confirmText: "Xóa",
          cancelText: 'Hủy',
          type: "is-danger",
          hasIcon: true,
          onConfirm: () => this.confirmDelete(id)
        });
      },

      confirmDelete(id) {
        this.instance.delete("customer/" + id)
          .then((response) => {
            if (response.data.status.code === 1000) {
              this.loadClient();
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

      loading() {
        const loadingComponent = this.$buefy.loading.open({
          container: this.isFullPage ? null : this.$refs.element.$el
        });
        setTimeout(() => loadingComponent.close(), 3 * 1000);
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
    }
  });
</script>

<style>
  .modal-mask {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    background-color: #444242da;
  }

  .modal-customer {
    margin-top: 100px !important;
    width: 1000px !important;
    height: 450px !important;
    padding: 25px !important;
    overflow: scroll;
  }

  .group-btn-customer {
    margin-top: 100px;
    position: absolute;
    right: 30px;
  }

  .dialog .modal-card {
    height: 300px !important;
  }
</style>
