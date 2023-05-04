<template>
  <div>
    <title-bar :title-stack="titleStack" />
    <hero-bar :has-right-visible="false">
      Trang chủ
    </hero-bar>
    <section class="section is-main-section">
      <notification-bar class="is-info" style="font-weight: bold">
        Chúc bạn một ngày làm  việc vui vẻ !

        <a
          slot="right"
          target="_blank"
          class="button is-white is-small"
        >
          <b-icon
            icon="coffee"
            custom-size="default"
          />
          <span style="font-weight: bold">My coffe</span>
        </a>
      </notification-bar>

      <tiles-block>
        <card-widget
          class="tile is-child"
          type="is-primary"
          icon="account-multiple"
          :number="newCustomer"
          label="Khách hàng mới trong ngày"
        />
        <card-widget
          class="tile is-child"
          type="is-info"
          icon="cart-outline"
          :number="quantityOrder"
          suffix=""
          label="Số order trong ngày"
        />
        <card-widget
          class="tile is-child"
          type="is-info"
          icon="currency-usd"
          :number="revenue"
          suffix="VND"
          label="Tổng"
        />
        <card-widget
          class="tile is-child"
          type="is-success"
          icon="chart-timeline-variant"
          :number="performance"
          suffix="%"
          label="So với hôm qua"
        />
      </tiles-block>

      <card-component
        title="Khách hàng"
        class="has-table has-mobile-sort-spaced"
      >
        <clients-table-sample />
      </card-component>
    </section>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import * as chartConfig from "@/components/Charts/chart.config.js";
import TitleBar from "@/components/TitleBar.vue";
import HeroBar from "@/components/HeroBar.vue";
import TilesBlock from "@/components/TilesBlock.vue";
import CardWidget from "@/components/CardWidget.vue";
import CardComponent from "@/components/CardComponent.vue";
import ClientsTableSample from "@/components/ClientsTableSample.vue";
import NotificationBar from "@/components/NotificationBar.vue";
import axios from "axios";

export default defineComponent({
  name: "HomeView",
  components: {
    ClientsTableSample,
    CardComponent,
    CardWidget,
    TilesBlock,
    HeroBar,
    TitleBar,
    NotificationBar
  },
  data () {
    return {
      titleStack: ["Admin", "Trang chủ"],
      instance: '',
      error: [],
      newCustomer: '',
      quantityOrder: '',
      revenue: '',
      performance: '',
    };
  },
  watch: {
    performance() {
      console.log(this.performance);
    }
  },
  mounted () {
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
    this.fillChartData();
    this.loadStore();
    this.statisticNewCustomer(this.storeId, new Date());
    this.statisticOrderByDate(this.storeId, new Date());
    this.statisticPerformanceByDate(this.storeId, new Date());

    this.$root.$on('reStatistic', (storeId, date) => {
      this.statisticNewCustomer(storeId, date);
      this.statisticOrderByDate(storeId, date);
      this.statisticPerformanceByDate(storeId, date);
    });
  },
  methods: {
    fillChartData () {
      this.chartData = chartConfig.sampleChartData();
    },
    loadStore() {
      this.instance.get("/store/list")
        .then((response) => {
          this.stores = response.data.data;
          localStorage.setItem("stores", JSON.stringify(this.stores));
          localStorage.setItem("storeId", JSON.stringify(this.stores[0].id));
        })
        .catch((e) => {
          this.error.push(e);
        });
    },

    statisticPerformanceByDate(storeId, date) {
      let dayParam = this.convert(date);
      this.instance.get("/admin/statistic-by-date/" + storeId + "/performance?date=" + dayParam)
        .then((response) => {
          this.performance = response.data.data;
        })
        .catch((e) => {
          this.error.push(e);
        });
    },

    statisticOrderByDate(storeId, date) {
      let dayParam = this.convert(date);
      this.instance.get("/admin/statistic-by-date/" + storeId + "/revenue?date=" + dayParam)
        .then((response) => {
          this.quantityOrder = response.data.data.quantityOrder;
          this.revenue = response.data.data.revenue;
        })
        .catch((e) => {
          this.error.push(e);
        });
    },

    statisticNewCustomer(storeId, date) {
      let dayParam = this.convert(date);
      this.instance.get("/admin/statistic-by-date/" + storeId + "/new-customer?date=" + dayParam)
        .then((response) => {
          this.newCustomer = response.data.data;
        })
        .catch((e) => {
          this.error.push(e);
        });
    },
    convert(str) {
       let date = new Date(str),
        month = ("0" + (date.getMonth() + 1)).slice(-2),
        day = ("0" + date.getDate()).slice(-2);
      return [date.getFullYear(), month, day].join("/");
    }
  }
});
</script>
