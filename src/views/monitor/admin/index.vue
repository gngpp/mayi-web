<template>
  <elFrame :src="adminApi" />
</template>

<script>
import elFrame from '@/components/Iframe/index'
import {mapGetters} from "vuex";
export default {
  name: "AdminMonitor",
  components: { elFrame },
  computed: {
    ...mapGetters([
      'adminApi',
      'sqlApi'
    ])
  }
}
</script>

<style scoped>

</style>
