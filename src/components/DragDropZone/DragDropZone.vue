<template>
  <div
    class="drag-drop"
    :data-active="active"
    @dragenter.prevent="_setActive"
    @dragover.prevent="_setActive"
    @dragleave.prevent="_setInactive"
    @drop.prevent="_onDrop"
  >
    <div
      class="drag-drop__container"
      :style="{
        height
      }"
      :class="{
        active
      }"
    >
      <slot :dropZoneActive="active"></slot>
    </div>
  </div>
</template>

<script>
import { FileValidation } from './file.validation'

export default {
  name: 'DragDropZone',
  props: {
    height: {
      type: String,
      default: '400px'
    },
    fileValidationOptions: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      active: false
    }
  },
  methods: {
    _setActive() {
      this.active = true
    },
    _setInactive() {
      this.active = false
    },
    _filterFilesByCriteria(files) {
      return FileValidation.checkFileForFileExtension(
        files,
        this.fileValidationOptions
      )
    },
    _onDrop(e) {
      this._setInactive();
      const resultFilesWithValidation = this._filterFilesByCriteria([
        ...e.dataTransfer.files
      ]);
      this.$emit(
        'success-dropped-files',
        resultFilesWithValidation.successFiles
      );
      this.$emit('error-dropped-files', resultFilesWithValidation.errorFiles)
    }
  }
}
</script>

<style lang="scss">
.drag-drop {
  width: 100%;
  &__container {
    background-image: url("data:image/svg+xml;utf8,<svg width='100%' height='100%' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' style='fill: none; stroke: blue; stroke-width: 3; stroke-dasharray: 8 20'/></svg>");
    width: 100%;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .active {
    background-color: #e7f0fa;
  }
}
</style>
