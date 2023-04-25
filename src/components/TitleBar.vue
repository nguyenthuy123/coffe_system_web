<template>
  <section class="section is-title-bar">
    <div class="level">
      <div class="level-left">
        <div class="level-item">
          <ul>
            <li
              v-for="(title, index) in titleStack"
              :key="index"
            >
              {{ title }}
            </li>
          </ul>
        </div>
      </div>
      <div class="level-right">
        <div class="level-item">
          <div class="buttons is-right">
            <p
              class="button is-info"
            >
              <b-icon
                icon="coffee"
                custom-size="default"
              />
              <span>Xin chào</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "TitleBar",
  props: {
    titleStack: {
      type: Array,
      default: () => []
    }
  }
});
</script>
