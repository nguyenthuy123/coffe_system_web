<template>
  <nav
    v-show="isNavBarVisible"
    id="navbar-main"
    class="navbar is-fixed-top"
  >
    <div class="navbar-brand">
      <a
        class="navbar-item is-hidden-desktop"
        @click.prevent="asideToggleMobile"
      >
        <b-icon :icon="asideMobileIcon"/>
      </a>
      <a
        class="navbar-item is-hidden-touch is-hidden-widescreen is-desktop-icon-only"
        @click.prevent="asideDesktopOnlyToggle"
      >
        <b-icon icon="menu"/>
      </a>
      <div class="navbar-item has-control no-left-space-touch no-left-space-desktop-only">

      </div>
    </div>
    <div class="navbar-brand is-right">
      <a
        class="navbar-item navbar-item-menu-toggle is-hidden-desktop"
        @click.prevent="menuToggle"
      >
        <b-icon
          :icon="menuToggleIcon"
          custom-size="default"
        />
      </a>
    </div>
    <div
      class="navbar-menu fadeIn animated faster"
      :class="{ 'is-active': isMenuActive }"
    >
      <div class="navbar-end">
        <nav-bar-menu class="has-divider">
          <select v-model="selected" @change="reloadData()">
            <option v-for="store in stores" :value="store">
              {{ store.name }}
            </option>
          </select>

        </nav-bar-menu>
        <nav-bar-menu class="has-divider has-user-avatar">
          <user-avatar/>
          <div class="is-user-name" v-model="name">
            <span>{{ name }}</span>
          </div>

        </nav-bar-menu>
        <a
          class="navbar-item is-desktop-icon-only"
          title="Log out"
          @click="logout"
        >
          <b-icon
            icon="logout"
            custom-size="default"
          />
          <span>Log out</span>
        </a>
      </div>
    </div>
  </nav>
</template>

<script>
  import {defineComponent} from "vue";
  import {mapState} from "vuex";
  import NavBarMenu from "@/components/NavBarMenu.vue";
  import UserAvatar from "@/components/UserAvatar.vue";
  import router from "@/router";
  import axios from "axios";

  export default defineComponent({
    name: "NavBar",
    components: {
      UserAvatar,
      NavBarMenu
    },
    data() {
      return {
        isMenuActive: false,
        name: "",
        stores: [],
        selected: '',
        storeName: '',
        instance: '',
      };
    },
    computed: {
      asideMobileIcon() {
        return this.isAsideMobileExpanded ? "backburger" : "forwardburger";
      },
      menuToggleIcon() {
        return this.isMenuActive ? "close" : "dots-vertical";
      },
      ...mapState([
        "isAsideMobileExpanded",
        "isNavBarVisible",
        "userName"
      ])
    },
    watch: {
        selected() {
          localStorage.setItem("storeId", this.selected.id)
        },
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
      this.name = localStorage.getItem("name");
      this.stores = JSON.parse(localStorage.getItem("stores"));
      console.log(this.stores[0]);
      this.selected = this.stores[0]
      this.$router.afterEach(() => {
        this.isMenuActive = false;
      });
      // this.loadStore();
    },
    methods: {

      reloadData() {
        this.$root.$emit('reload', this.selected.id)
        this.$root.$emit('reStatistic', this.selected.id, new Date())
        this.$root.$emit('reloadEmForTable', this.selected.id)
        this.$root.$emit('reloadAttendance', this.selected.id)
      },
      asideToggleMobile() {
        this.$store.commit("asideMobileStateToggle");
      },
      asideDesktopOnlyToggle() {
        this.$store.dispatch("asideDesktopOnlyToggle");
      },
      menuToggle() {
        this.isMenuActive = !this.isMenuActive;
      },
      logout() {
        const token = localStorage.getItem('token');
        this.instance.post("/auth/logout?token=" + token)
          .then((response) => {
            if (response.data.status.code === 1000) {
              router.push("/");
              localStorage.removeItem("token")
              localStorage.removeItem("storeId")
              localStorage.removeItem("username")
              localStorage.removeItem("stores")
              localStorage.removeItem("name")
            } else {
              this.$buefy.notification.open({
                message: `Đăng xuất thất bại`,
                type: "is-danger",
                pauseOnHover: true,
              });
            }
          })
          .catch((e) => {
            this.error.push(e);
          });


      }
    }
  });
</script>
