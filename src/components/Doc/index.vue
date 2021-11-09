<template>
  <div>
    <svg-icon icon-class="doc"  @click="click" />
  </div>
</template>

<script>
export default {
  name: 'Doc',
  methods: {
    click() {
      window.open('https://github.com/zf1976/mayi', '_blank')
    }
  }
}
</script>
