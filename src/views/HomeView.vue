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
          :number="54"
          label="Khách hàng mới trong ngày"
        />
        <card-widget
          class="tile is-child"
          type="is-info"
          icon="cart-outline"
          :number="1200000"
          prefix="VND"
          label="Đã bán"
        />
        <card-widget
          class="tile is-child"
          type="is-success"
          icon="chart-timeline-variant"
          :number="25"
          suffix="%"
          label="Năng suất"
        />
        <card-widget
          class="tile is-child"
          type="is-info"
          icon="cart-outline"
          :number="1440000"
          prefix="VND"
          label="Tổng"
        />
      </tiles-block>

      <card-component
        title="Biểu đồ"
        icon="finance"
        header-icon="reload"
        @header-icon-click="fillChartData"
      >
        <div
          v-if="chartData"
          class="chart-area"
        >
          <line-chart
            :chart-data="chartData"
            :chart-options="chartOptions"
            :style="{height: '100%'}"
          />
        </div>
      </card-component>

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
import LineChart from "@/components/Charts/LineChart.vue";
import ClientsTableSample from "@/components/ClientsTableSample.vue";
import NotificationBar from "@/components/NotificationBar.vue";
import axios from "axios";

export default defineComponent({
  name: "HomeView",
  components: {
    ClientsTableSample,
    LineChart,
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
      chartData: null,
      chartOptions: {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
          y: {
            display: false
          },
          x: {
            display: true
          }
        },
        plugins: {
          legend: {
            display: false
          }
        }
      }
    };
  },
  mounted () {
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
    this.loadStore();

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
  }
});
</script>
