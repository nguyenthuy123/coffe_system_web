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
      :data="attendances"
      striped
      hoverable
    >
      <b-table-column
        v-slot="props"
        label="Tên nhân viên"
        field="name"
      >
        {{ props.row.name }}
      </b-table-column>
      <b-table-column
        v-slot="props"
        label="Ca làm việc"
        field="shift"
      >
        {{ props.row.shift }}
      </b-table-column>
      <b-table-column
        v-slot="props"
        label="Ngày"
        field="date"
      >
        {{ props.row.date.split(" ")[0] }}
      </b-table-column>
      <b-table-column
        v-slot="props"
        label="Giờ đến"
        field="checkin"
      >
        {{ props.row.checkin.split(" ")[1] }}
      </b-table-column>
      <b-table-column
        v-slot="props"
        label="Giờ về"
        field="checkout"
      >
        {{ props.row.checkout.split(" ")[1] }}
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
  </div>
</template>

<script>
  import {defineComponent} from "vue";
  import ModalBox from "@/components/ModalBox.vue";
  import CardComponent from "@/components/CardComponent.vue";
  import axios from "axios";


  export default defineComponent({
    name: "AttendanceTable",
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
        categories: [],
        selected: '',
        attendances: [],
        attendance: {
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
      this.storeId = localStorage.getItem("storeId");
      this.loadAttendance(this.storeId);
      this.$root.$on('reloadAttendance', (storeId) => {
        this.loadAttendance(storeId);
      })
    },

    computed: {

      paginated() {
        return this.attendances.length > this.perPage;
      },

    },
    methods: {
      loadAttendance(storeId) {
        this.instance.get("admin/employee/" + storeId + "/attendance/list")
          .then((response) => {
            this.attendances = response.data.content;
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
