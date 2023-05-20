import axios from "axios";
import router from "@/router";

const BASE_URL = "https://coffesystem-production.up.railway.app";

export const login = (form) => {
  isLoading.value = true;
  setTimeout(() => {
    axios.post("https://coffesystem-production.up.railway.app/auth/login", { username: form.value.username, password: form.value.password })
      .then((response) => {
        token.value = response.data.data.accessToken;
        if (response.data.status.code !== 1000) {
          checkLogin.value = true;
          isLoading.value = false;
        }else {
          localStorage.setItem("token", token.value);
          localStorage.setItem("username", response.data.data.user.username);
          isLoading.value = false;
          router.push("/");
        }

      });
  }, 750);
};
