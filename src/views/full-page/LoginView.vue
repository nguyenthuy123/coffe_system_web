<template>
  <card-component
    title="Login"
    icon="lock"
  >
    <router-link
      slot="button"
      to="/"
      class="button is-small"
    >
      Dashboard
    </router-link>

    <form
      method="POST"
      @submit.prevent="login"
    >
      <b-field label="Username">
        <b-input
          v-model="form.username"
          name="username"
          type="username"
          required
        />
      </b-field>

      <b-field label="Password">
        <b-input
          v-model="form.password"
          type="password"
          name="password"
          required
        />
      </b-field>

      <b-field>
        <div v-if="checkLogin" class="alert alert-danger" style="color: red">
          Username or password is wrong !
        </div>
      </b-field>

      <hr>

      <b-field grouped>
        <div class="control">
          <b-button
            native-type="submit"
            type="is-black"
            :loading="isLoading"
          >
            Login
          </b-button>
        </div>
      </b-field>
    </form>
  </card-component>
</template>

<script setup>
  import {onMounted, ref} from "vue";
  import axios from "axios";
  import CardComponent from "@/components/CardComponent.vue";
  import router from "@/router";

  const checkLogin = ref(false);
  const isLoading = ref(false);
  const token = ref("");
  const role = ref("");
  const form = ref({
      username: "",
      password: ""
  });

  const login = () => {
    isLoading.value = true;
    setTimeout(() => {
      axios.post("https://coffesystem-production.up.railway.app/auth/login", { username: form.value.username, password: form.value.password })
        .then((response) => {
          token.value = response.data.data.accessToken;
          role.value = response.data.data.role;
          console.log(role.value);
          if (response.data.status.code !== 1000) {
            console.log("Login fail !");
            checkLogin.value = true;
            isLoading.value = false;
          }else if (role.value === 'ROLE_ADMIN' || 'ROLE_MANAGER'){
            localStorage.setItem("token", token.value);
            localStorage.setItem("username", response.data.data.username);
            localStorage.setItem("name", response.data.data.name);
            localStorage.setItem("role", response.data.data.role);
            localStorage.setItem("employeeId", response.data.data.employeeId);
            isLoading.value = false;
            router.push("/home");
          } else {
            this.$buefy.notification.open({
              message: `Đăng nhập thất bại`,
              type: "is-danger",
              pauseOnHover: true,
            });
          }

        });
    }, 750);
  };

</script>

