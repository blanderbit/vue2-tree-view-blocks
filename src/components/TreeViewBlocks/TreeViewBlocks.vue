<template>
  <div class="tree-block__container">
    <tree-view-item
      :json="structure"
      class="tree-block__root"
      :expandable="false"
      @click-node="$emit('click-node', $event)"
      @coords-data="setCoordinates"
      v-slot="{ data }"
    >
      <slot :data="data"></slot>
    </tree-view-item>
    <svg
      class="tree-block__svg"
      version="1.1"
      xlink:href="data:image/png"
      :style="{
        width: width,
        height
      }"
    >
      <path
        v-for="(item, index) in getPaths"
        :key="index"
        :d="item.points"
        class="line"
        stroke="#000"
        stroke-linejoin="stroke-linejoin"
      />
    </svg>
  </div>
</template>

<script>
import TreeViewItem from '@/components/TreeViewBlocks/TreeViewItem'
import cloneDeep from 'lodash.clonedeep'

const step = 20

const extendOptions = (jsonData, options) => {
  if (!jsonData) return
  jsonData = createId(jsonData)
  if (options.initialExpandAll) jsonData = expandAll(jsonData)

  if (Array.isArray(jsonData.children)) {
    jsonData.children.forEach((c) => {
      extendOptions(c, options)
    })
  }
  if (Array.isArray(jsonData.mate)) {
    jsonData.mate.forEach((c) => {
      extendOptions(c, options)
    })
  }
  return jsonData
}
const createId = (jsonData) => {
  const randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26))
  jsonData._id = randLetter + Date.now()

  return jsonData
}

const expandAll = (jsonData) => {
  jsonData.extend = true

  return jsonData
}

const matePath = (
  coordinateFromElement,
  coordinateToElement,
  mainBlockCoordinates
) => {
  const y1 =
    coordinateFromElement.y -
    mainBlockCoordinates.y +
    coordinateFromElement.height / 2
  const y2 =
    coordinateToElement.y -
    mainBlockCoordinates.y +
    coordinateToElement.height / 2
  const x1 = coordinateFromElement.right - mainBlockCoordinates.x
  const x2 = coordinateToElement.left - mainBlockCoordinates.x

  const points = `M ${x1} ${y1} L ${x2} ${y2}, M ${x2} ${y2}`

  return {
    points,
    y1,
    y2,
    x1,
    x2
  }
}
const nestedPath = (
  coordinateFromElement,
  coordinateToElement,
  mainBlockCoordinates
) => {
  const y1 = coordinateFromElement.bottom - mainBlockCoordinates.y
  const y2 = coordinateToElement.top - mainBlockCoordinates.y
  const x1 =
    coordinateFromElement.x -
    mainBlockCoordinates.x +
    coordinateFromElement.width / 2
  const x2 =
    coordinateToElement.x -
    mainBlockCoordinates.x +
    coordinateToElement.width / 2

  let height = y1 - y2
  height = height < 0 ? height * -1 : height

  const haveBigHeight = step * 2 > height
  const kf = haveBigHeight ? height / 2 : height - 20
  const points = `
   M ${x1} ${y1} L ${x1} ${y1 + kf},
   M ${x1} ${y1 + kf} L ${x2} ${y1 + kf},
   M ${x2} ${y1 + kf} L ${x2} ${y2},
   M ${x2} ${y2} L ${x2} ${y2}`

  return {
    points,
    y1,
    y2,
    x1,
    x2,
    kf,
    step
  }
}

function getTemplateByCoordinates(
  coordinateFromElement,
  coordinateToElement,
  mainBlockCoordinates,
  mate
) {
  return !mate ? nestedPath(...arguments) : matePath(...arguments)
}
export default {
  name: 'TreeViewBlocks',
  components: {
    TreeViewItem
  },
  props: {
    json: {
      type: Object,
      default: () => {}
    },
    options: {
      type: Object,
      default: () => ({
        initialExpandAll: true
      })
    }
  },
  data() {
    return {
      coordsData: null,
      paths: [],
      width: '100%',
      height: '100%'
    }
  },
  computed: {
    structure() {
      return extendOptions(cloneDeep(this.json), this.options)
    },
    getPaths() {
      return this.paths.map((e) =>
        getTemplateByCoordinates(
          e.fromCoord,
          e.toCoord,
          this.coordsData,
          e.mate
        )
      )
    }
  },
  watch: {
    json() {
      this.paths = []
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.coordsData = this.$el.getBoundingClientRect().toJSON()

      this.width = `${this.$el.scrollWidth}px`
      this.height = `${this.$el.scrollHeight}px`
    })
  },
  methods: {
    setCoordinates(e) {
      if (!e) {
        return
      }

      const findPath = this.paths.findIndex((i) => i._id === e._id)

      if (
        findPath > -1 &&
        e?.points &&
        this.paths[findPath]?.points &&
        this.paths[findPath]?.points === e?.points
      ) {
        this.paths.splice(findPath, 1)
      }

      this.width = `${this.$el.scrollWidth}px`
      this.height = `${this.$el.scrollHeight}px`
      this.paths.push(e)
    }
  }
}
</script>

<style lang="scss">
.tree-block {
  &__root {
    position: absolute;
    z-index: 2;
    height: 100%;
  }
  &__container {
    position: relative;
    height: 100%;
    overflow-x: auto;
  }
  &__svg {
    z-index: 1;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }
}
</style>
