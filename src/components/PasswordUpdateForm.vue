<template>
  <card-component
    title="Thay đổi mật khẩu"
    icon="lock"
  >
    <form @submit.prevent="submit">
      <b-field
        horizontal
        label="Mật khẩu hiện taại"
        message="Nhập mật khẩu hiện tại"
      >
        <b-input
          v-model="form.password_current"
          name="password_current"
          type="password"
          required
          autcomplete="current-password"
        />
      </b-field>
      <hr>
      <b-field
        horizontal
        label="Mật khẩu mới"
        message="Nhập mật khẩu mới"
      >
        <b-input
          v-model="form.password"
          name="password"
          type="password"
          required
          autocomplete="new-password"
        />
      </b-field>
      <b-field
        horizontal
        label="Xác nhân mật khẩu"
        message="Nhập mật khẩu lần nữa"
      >
        <b-input
          v-model="form.password_confirmation"
          name="password_confirmation"
          type="password"
          required
          autocomplete="new-password"
        />
      </b-field>
      <hr>
      <b-field horizontal>
        <div class="control">
          <b-button
            native-type="submit"
            type="is-info"
            :loading="isLoading"
          >
            Xác nhận
          </b-button>
        </div>
      </b-field>
    </form>
  </card-component>
</template>

<script>
import { defineComponent } from "vue";
import CardComponent from "@/components/CardComponent.vue";

export default defineComponent({
  name: "PasswordUpdateForm",
  components: {
    CardComponent
  },
  data () {
    return {
      isLoading: false,
      form: {
        password_current: null,
        password: null,
        password_confirmation: null
      }
    };
  },
  methods: {
    submit () {
      this.isLoading = true;

      setTimeout(() => {
        this.isLoading = false;

        this.$buefy.snackbar.open(
          {
            message: "Demo only",
            queue: false
          }
        );
      }, 750);
    }
  }
});
</script>
