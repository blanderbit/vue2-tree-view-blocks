<template>
  <div id="app">
    <drag-drop-zone v-slot="{ dropZoneActive }">
      <div v-if="dropZoneActive">
        <div>drop them</div>
      </div>
      <div v-else>
        <div class="mb-6">drag</div>
      </div>
    </drag-drop-zone>
  </div>
</template>

<script>
import DragDropZone from './components/DragDropZone/DragDropZone.vue'

export default {
  name: 'App',
  components: {
      DragDropZone
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
