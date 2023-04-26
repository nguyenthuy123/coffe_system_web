<template>
  <b-modal
    :active.sync="isModalActive"
    has-modal-card
  >
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">
          Confirm action
        </p>
        <button
          type="button"
          class="delete"
          @click="cancel"
        />
      </header>
      <section class="modal-card-body">
        <p>
          Bạn đang thực hiện xóa <b>{{ trashObjectName }}</b>
        </p>
        <p>Hành động này không thể hoàn tác.</p>
      </section>
      <footer class="modal-card-foot">
        <b-button
          native-type="button"
          type="is-danger"
          outlined
          @click="cancel"
        >
          Hủy
        </b-button>
        <b-button
          type="is-danger"
          @click="confirm"
        >
          Xóa
        </b-button>
      </footer>
    </div>
  </b-modal>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "ModalBox",
  props: {
    isActive: Boolean,
    trashObjectName: {
      type: String,
      default: null
    }
  },
  emits: ["cancel", "confirm"],
  computed: {
    isModalActive: {
      get: function () {
        return this.isActive;
      },
      set: function (value) {
        if (!value) {
          this.cancel();
        }
      }
    }
  },
  methods: {
    confirm () {
      this.$emit("confirm");
    },
    cancel () {
      this.$emit("cancel");
    }
  }
});
</script>
