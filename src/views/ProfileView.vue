<template>
  <div>
    <title-bar :title-stack="titleStack" />
    <hero-bar>
      Cá nhân
      <router-link
        slot="right"
        to="/"
        class="button"
      >
        Trang chủ
      </router-link>
    </hero-bar>
    <section class="section is-main-section">
      <tiles-block>
        <profile-update-form class="tile is-child" />
        <card-component
          title="Hồ sơ"
          icon="account"
          class="tile is-child"
        >
          <user-avatar class="image has-max-width is-aligned-center" />
          <hr>
          <b-field label="Tên">
            <b-input
              :value="name"
              custom-class="is-static"
              readonly
            />
          </b-field>
          <hr>
          <b-field label="E-mail">
            <b-input
              :value="email"
              custom-class="is-static"
              readonly
            />
          </b-field>
        </card-component>
      </tiles-block>
      <password-update-form />
    </section>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { mapState } from "vuex";
import CardComponent from "@/components/CardComponent.vue";
import TitleBar from "@/components/TitleBar.vue";
import HeroBar from "@/components/HeroBar.vue";
import ProfileUpdateForm from "@/components/ProfileUpdateForm.vue";
import PasswordUpdateForm from "@/components/PasswordUpdateForm.vue";
import TilesBlock from "@/components/TilesBlock.vue";
import UserAvatar from "@/components/UserAvatar.vue";

export default defineComponent({
  name: "ProfileView",
  components: {
    UserAvatar,
    TilesBlock,
    PasswordUpdateForm,
    ProfileUpdateForm,
    HeroBar,
    TitleBar,
    CardComponent
  },
  data () {
    return {
      titleStack: ["Admin", "Cá nhân"],
      name: 'Thuy',
      email: 'thuy@gmail.com'
    };
  },
  computed: {
    ...mapState([
      "userName",
      "userEmail"
    ])
  }
});
</script>
