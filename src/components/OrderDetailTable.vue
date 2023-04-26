<template>
  <div>
    <modal-box
      :is-active="isModalActive"
      :trash-object-name="trashObject ? trashObject.name : null "
      @confirm="trashConfirm"
      @cancel="trashCancel"
    />
    <b-table
      :checked-rows.sync="checkedRows"
      :checkable="checkable"
      :data="dataTable"
      default-sort="name"
      striped
    >
      <b-table-column
        v-slot="props"
        label="Đồ uống"
        field="name"
      >
        {{ props.row.name }}
      </b-table-column>
      <b-table-column
        v-slot="props"
        label="Số lượng"
        field="quantity"
      >
        {{ props.row.quantity }}
      </b-table-column>
      <b-table-column
        v-slot="props"
        label="Đơn giá"
        field="price"
      >
        {{ props.row.price }}
      </b-table-column>
      <b-table-column
        v-slot="props"
        label="Thành tiền"
        field="unit-price"
      >
        {{ props.row.quantity * props.row.price }}
      </b-table-column>
      <b-table-column
        v-slot="props"
        custom-key="actions"
        cell-class="is-actions-cell"
      >
      </b-table-column>

      <section
        slot="empty"
        class="section"
      >
        <div class="content has-text-grey has-text-centered">
          <p>
            <b-icon
              icon="emoticon-sad"
              size="is-large"
            />
          </p>
          <p>Không có dữ liệu&hellip;</p>
        </div>
      </section>
    </b-table>
  </div>
</template>

<script>
  import { defineComponent } from "vue";
  import { mapState } from "vuex";
  import ModalBox from "@/components/ModalBox.vue";

  export default defineComponent({
    name: "OrderDetailTable",
    components: { ModalBox },
    props: {
      checkable: Boolean,
      isEmpty: Boolean,
      perPage: {
        type: Number,
        default: 10
      },
      dataTable: []
    },
    data () {
      return {
        checkedRows: [],
        isModalActive: false,
        trashObject: null,
      };
    },
    computed: {
      paginated () {
        return this.clients.length > this.perPage;
      },
      ...mapState([
        "clients"
      ])
    },
    methods: {
      trashModalOpen (obj) {
        this.trashObject = obj;
        this.isModalActive = true;
      },
      trashConfirm () {
        this.isModalActive = false;

        this.$buefy.snackbar.open({
          message: "Confirmed",
          queue: false
        });
      },
      trashCancel () {
        this.isModalActive = false;
      }
    }
  });
</script>
