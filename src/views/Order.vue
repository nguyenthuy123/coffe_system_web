<template>
  <div>
    <title-bar :title-stack="titleStack"/>
    <hero-bar :has-right-visible="false">
      Order
    </hero-bar>
    <div class="row">
      <div class="col col-sm-4">
        <div class="card shadow mb-4">
          <div class="card-header py-3">Danh sách bàn
            <b-button style="margin-left: 45%" type="is-success" @click="addTable">Thêm bàn</b-button></div>
          <div class="card-body">
            <div class="table-area" v-for="(numberTable, index) in listOrder">
              <b-button style="width: 130px; border: double; height: 70px"
                        rounded
                        type="is-light"
                        v-model="numberTable.id"
                        class="table-status"
                        @click="detail(storeId, numberTable.id)"
                        :class="numberTable.status === true ? 'busy-table' : 'free-table'"
              >
                {{ numberTable.name }}
              </b-button>
            </div>
          </div>

        </div>
      </div>

      <div class="col col-sm-8 detail-order-block">
        <div class="card shadow mb-4">
          <div class="card-header py-3">
            Chi tiết order
          </div>

          <div class="detail-order">
            <order-detail-table
              :data-table="detailData"
            >

            </order-detail-table>
          </div>
        </div>
      </div>
    </div>

    <transition v-if="myModel" name="modal">
      <div class="modal-mask-table">
        <card-component
          class="modal-table"
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
                  v-model="table.name"
                  icon="table"
                  name="name"
                  placeholder="Tên bàn"
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
          <div class="group-btn-table">
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
  import ClientsTableSample from "@/components/ClientsTableSample";
  import OrderDetailTable from "@/components/OrderDetailTable";
  import LineChart from "@/components/Charts/LineChart";
  import CardComponent from "@/components/CardComponent";
  import CardWidget from "@/components/CardWidget";
  import TilesBlock from "@/components/TilesBlock";
  import HeroBar from "@/components/HeroBar";
  import TitleBar from "@/components/TitleBar";
  import NotificationBar from "@/components/NotificationBar";
  import * as chartConfig from "@/components/Charts/chart.config";
  import axios from "axios";

  export default defineComponent({
    name: "Order",
    components: {
      ClientsTableSample,
      OrderDetailTable,
      LineChart,
      CardComponent,
      CardWidget,
      TilesBlock,
      HeroBar,
      TitleBar,
      NotificationBar
    },
    data() {
      return {
        titleStack: ["Admin", "Order"],
        instance: '',
        error: [],
        stores: [],
        isActive: false,
        myModel: false,
        storeId: '',
        listTable: [],
        listOrder: [],
        detailData: [],
        table: {
          id: '',
          name: ''
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
      this.fillChartData();

      this.storeId = localStorage.getItem("storeId")
      this.loadTable(this.storeId);
      this.$root.$on('reload', (storeId) => {
        this.loadTable(storeId);
        this.detailData = []
      })
    },

    methods: {
      fillChartData() {
        this.chartData = chartConfig.sampleChartData();
      },

      loadTable(storeId) {
        this.instance.get("/" + storeId + "/table/list")
          .then((response) => {
            this.listOrder = response.data.data;
          });
      },

      addTable() {
        this.myModel = true;
      },

      submit(storeId) {
        if (this.checkForm() === true) {
          this.pause();
        } else {
          storeId = this.storeId;
          this.instance.post("/" + storeId + "/table/save", this.table)
            .then((response) => {
              if (response.data.status.code === 1000) {
                this.myModel = false;
                this.$buefy.toast.open({
                  message: 'Lưu thành công',
                  type: 'is-success'
                })
                this.loadTable(storeId);
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
        if (this.table.name === "") {
          return true;
        }
      },

      detail(storeId, tableId) {
        storeId = this.storeId;
        this.instance.get("/" + storeId + "/order/detail/" +tableId)
          .then((response) => {
            this.detailData = response.data.data.listItemResponse
          });
      }


    },

  });
</script>

<style scoped>

  .modal-mask-table {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    background-color: #444242da;
  }

  .modal-table {
    margin-top: 100px;
    width: 1000px;
    height: 300px;
    padding: 25px;
  }

  .group-btn-table {
    margin-top: 100px;
    position: absolute;
    right: 30px;
  }

  .row {
    display: flex;
    flex-wrap: wrap;
    margin-left: 40px;
    margin-right: 10px;
    margin-top: 10px;
    height: 500px;
    padding: 10px;
  }

  .card {
    position: relative;
    display: flex;
    flex-direction: column;
    min-width: 0;
    word-wrap: break-word;
    background-color: #fff;
    background-clip: border-box;
    border: 1px solid #e3e6f0;
    border-radius: 0.35rem;
  }

  .shadow {
    box-shadow: 0 .15rem 1.75rem 0 rgba(58, 59, 69, .15) !important;
  }

  .card-header {
    padding: 0.75rem 1.25rem;
    margin-bottom: 0;
    background-color: #f8f9fc;
    border-bottom: 1px solid #e3e6f0;
    font-weight: bold;
    font-size: 20px;
  }

  .card-body {
    flex: 1 1 auto;
    min-height: 1px;
    padding: 1.25rem;
    display: flex;
    flex-wrap: wrap;
    width: 500px;
    height: 500px;
  }

  .detail-order {
    width: 1000px;
    height: 500px;
    overflow: scroll;
  }

  .table-area {
    padding: 5px;
    display: inline-block;
    flex-grow: 1 0;
  }

  .detail-order-block {
    margin-left: 15px;
  }

  .btn-payment {
    margin-top: 10px;
    position: absolute;
    right: 8%;
  }

  .busy-table {
    background-color: #3ec487 !important;
  }

  .free-table {
    background-color: darkgray !important;
  }

</style>
