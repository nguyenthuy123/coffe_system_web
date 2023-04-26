<template>
  <div>
    <modal-box
      :is-active="isModalActive"
      :trash-object-name="trashObject ? trashObject.name : null "
      @cancel="trashCancel"
      @confirm="trashConfirm"
    />
    <b-table
      :data="employees"
      :paginated="paginated"
      :per-page="perPage"
      default-sort="name"
      hoverable
      striped
      @reload-employee="loadEmployee(storeId)"
    >
      <b-table-column
        v-slot="props"
        field="id"
        label="ID"
        sortable
      >
        {{ props.row.id }}
      </b-table-column>
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
        field="address"
        label="Địa chỉ"
        sortable
      >
        {{ props.row.address }}
      </b-table-column>
      <b-table-column
        v-slot="props"
        field="email"
        label="Email"
        sortable
      >
        {{ props.row.email }}
      </b-table-column>
      <b-table-column
        v-slot="props"
        field="dob"
        label="Ngày sinh"
        sortable
      >
        {{ props.row.dob.split("T")[0] }}
      </b-table-column>
      <b-table-column
        v-slot="props"
        field="shiftName"
        label="Ca làm việc"
        sortable
      >
        {{ props.row.shiftName }}
      </b-table-column>
      <b-table-column
        v-slot="props"
        field="shiftName"
        label="Ngày tạo"
        sortable
      >
        {{ props.row.createTime.split("T")[0] }}
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
              @click="detail(props.row.storeId, props.row.id)"
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
                            size="is-small"
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
  import {defineComponent} from "vue";
  import ModalBox from "@/components/ModalBox.vue";
  import CardComponent from "@/components/CardComponent.vue";
  import axios from "axios";

  export default defineComponent({
    name: "EmployeeTable",
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
        employees: [],
        date: new Date(),
        stores: [],
        shifts: [],
        errors: [],
        instance: "",
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
      this.loadEmployee(this.storeId);
      this.loadStore();
      this.loadShift(this.storeId);
      this.employee.storeId = this.stores[0].id;
      this.employee.shiftId = this.shifts[0].id;

      this.$root.on('load', () => {
        this.loadEmployee(this.storeId);
      })
    },

    computed: {
      paginated() {
        return this.employees.length > this.perPage;
      },
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

      detail (storeId, id) {
        this.myModel = true;
        this.instance.get("admin/employee/" + storeId + "/detail/" + id)
          .then((response) => {
            this.employee = response.data.data;
            this.employee.dob = new Date(response.data.data.dob);
          })
          .catch((e) => {
            this.error.push(e);
          });
      },

      submit() {
        if (this.checkForm() === true) {
          this.pause();
        } else {
          this.instance.post("/admin/employee/save", this.employee)
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

      openDialogDelete(id) {
        this.$buefy.dialog.confirm({
          title: "Xóa nhân viên",
          message: "Bạn chắc chắn <b>xóa</b> chứ ?",
          confirmText: "Xóa",
          cancelText: 'Hủy',
          type: "is-danger",
          hasIcon: true,
          onConfirm: () => this.confirmDelete(id)
        });
      },

      confirmDelete(id) {
        this.instance.delete("admin/employee/" + id)
          .then((response) => {
            if (response.data.status.code === 1000) {
              this.loadEmployee(this.storeId);
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

      pause() {
        this.$buefy.notification.open({
          message: `Vui lòng điền đầy đủ thông tin`,
          type: "is-danger",
          pauseOnHover: true,
        });
      },
      prompt(id) {
        this.$buefy.dialog.prompt({
          message: `What's your name?`,
          inputAttrs: [{
            placeholder: "e.g. Walter",
            maxlength: 10
          }],
          trapFocus: true,
          onConfirm: (value) => this.$buefy.toast.open(`Your name is: ${value}`)
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

  .modal-card {
    margin-top: 100px !important;
    width: 1000px !important;
    height: 500px !important;
    padding: 25px !important;
    overflow: scroll;
  }

  .group-btn {
    margin-top: 15px;
    position: absolute;
    right: 30px;
  }
</style>
