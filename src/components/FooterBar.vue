<template>
  <footer
    v-show="isFooterBarVisible"
    class="footer"
  >
    <div class="container-fluid">
      <div class="level">
        <div class="level-left">
          <div class="level-item">
            <div class="footer-copyright">
              <b>&copy; {{ year }}, MyCf.me</b>. <a
                target="_blank"
              >GitHub</a>
            </div>
          </div>
        </div>
        <div class="level-right">
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
import { defineComponent } from "vue";
import { mapState } from "vuex";

export default defineComponent({
  name: "FooterBar",
  data () {
    return {
      year: new Date().getFullYear()
    };
  },
  computed: {
    ...mapState([
      "isFooterBarVisible"
    ])
  }
});
</script>
