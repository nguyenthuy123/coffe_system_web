<template>
  <card-component
    title="Chỉnh sửa hồ sơ"
    icon="account-circle"
  >
    <form @submit.prevent="submit">
      <b-field
        horizontal
        label="Avatar"
      >
        <file-picker type="is-info" />
      </b-field>
      <hr>
      <b-field
        horizontal
        label="Tên"
        message="Yêu cầu bắt buộc"
      >
        <b-input
          v-model="admin"
          name="name"
          required
        />
      </b-field>
      <b-field
        horizontal
        label="E-mail"
        message="Yêu cầu bắt buộc"
      >
        <b-input
          v-model="email"
          name="email"
          type="email"
          required
        />
      </b-field>
      <hr>
      <b-field horizontal>
        <b-field grouped>
          <div class="control">
            <b-button
              native-type="submit"
              type="is-info"
              :loading="isLoading"
            >
              Submit
            </b-button>
          </div>
          <div class="control">
            <b-button
              type="is-info"
              native-type="button"
              outlined
            >
              Reset
            </b-button>
          </div>
        </b-field>
      </b-field>
    </form>
  </card-component>
</template>

<script>
import { defineComponent } from "vue";
import FilePicker from "@/components/FilePicker.vue";
import CardComponent from "@/components/CardComponent.vue";

export default defineComponent({
  name: "ProfileUpdateForm",
  components: {
    CardComponent,
    FilePicker
  },
  data () {
    return {
      isLoading: false,
      admin: 'Thủy',
      email: 'thuy@gmail.com'
    };
  },
  computed: {
    userName: {
      get: function () {
        return this.$store.state.userName;
      },
      set: function (name) {
        this.$store.commit("user", { name });
      }
    },
    userEmail: {
      get: function () {
        return this.$store.state.userEmail;
      },
      set: function (email) {
        this.$store.commit("user", { email });
      }
    }
  },
  methods: {
    submit () {
      this.isLoading = true;

      setTimeout(() => {
        this.isLoading = false;

        this.$buefy.snackbar.open({
          message: "Demo only",
          queue: false
        });
      }, 750);
    }
  }
});
</script>
