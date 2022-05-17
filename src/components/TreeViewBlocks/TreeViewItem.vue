<template>
  <table v-if="treeData.name">
    <tr>
      <td
        :colspan="isChildren ? treeData.children.length * 2 : 1"
        :class="{
          parentLevel: isChildren && treeData.children.length,
          extend: isChildren && treeData.children.length && treeData.extend
        }"
      >
        <div :class="{ node: true, hasMate: treeData.mate }">
          <div
            ref="parent"
            class="person"
            :class="isClass ? treeData.class : []"
            @click="$emit('click-node', treeData)"
          >
            <slot :data="treeData">
              <div class="avat">
                <div class="name">{{ treeData.name }}</div>
              </div>
            </slot>
          </div>

          <template v-if="treeData.mate" class="childLevel">
            <TreeViewItem
              v-for="(child, index) in treeData.mate"
              :key="index + 'childLevel'"
              :mate="true"
              :json="child"
              :initial-extend="initialExtend"
              @coords-data="$emit('coords-data', $event)"
              @click-node="$emit('click-node', $event)"
              v-slot="{ data }"
            >
              <slot :data="data"></slot>
            </TreeViewItem>
          </template>
        </div>

        <div
          class="extend_handle"
          v-if="expandable && isChildren && treeData.children.length"
          @click="toggleExtend(treeData)"
        ></div>
      </td>
    </tr>
    <tr v-if="isChildren && treeData.children.length && treeData.extend">
      <td
        v-for="(children, index) in treeData.children"
        :key="index"
        colspan="2"
        class="childLevel"
      >
        <TreeViewItem
          :json="children"
          :initial-extend="initialExtend"
          @coords-data="$emit('coords-data', $event)"
          @click-node="$emit('click-node', $event)"
          v-slot="{ data }"
        >
          <slot :data="data"></slot>
        </TreeViewItem>
      </td>
    </tr>
  </table>
</template>

<script>
const extendKey = (jsonData) => {
  jsonData.extend = !!jsonData.extend
  if (Array.isArray(jsonData.children)) {
    jsonData.children.forEach((c) => {
      extendKey(c)
    })
  }
  return jsonData
}

function adjustLine(from, to, mate, _id) {
  if (!from || !to) {
    return
  }

  const coord1 = from.firstChild.getBoundingClientRect()
  const coord2 = to.firstChild.getBoundingClientRect()

  return {
    fromCoord: coord1.toJSON(),
    toCoord: coord2.toJSON(),
    mate,
    _id
  }
}
export default {
  name: 'TreeViewItem',
  props: ['json', 'expandable', 'mate', 'initialExtend'],
  data() {
    return {
      treeData: {},
      test: 0
    }
  },
  computed: {
    isChildren() {
      return Array.isArray(this.treeData.children)
    },
    isClass() {
      return Array.isArray(this.treeData.class)
    }
  },
  watch: {
    json: {
      handler(data) {
        this.test = this.test + 1
        if (data) {
          this.treeData = extendKey(data)
        }
        this.emitCoords()
      },
      immediate: true
    }
  },
  methods: {
    emitCoords() {
      this.$nextTick(() => {
        let toElement = this.$parent.$refs.parent
        if (this.mate) {
          const elementIndex = this.$parent.$children.findIndex(
            (i) => i._uid === this._uid
          )
          toElement =
            elementIndex > 0
              ? this.$parent.$children[elementIndex - 1]?.$refs?.parent
              : toElement
        }
        this.$emit(
          'coords-data',
          adjustLine(toElement, this.$refs.parent, this.mate, this.treeData._id)
        )
        // }, 0)
      })
    },
    toggleExtend(treeData) {
      treeData.extend = !treeData.extend
      this.$forceUpdate()
    }
  }
}
</script>

<style scoped>
table {
  border-collapse: separate !important;
  border-spacing: 0 !important;
}
td {
  /*position: relative;*/
  vertical-align: top;
  padding: 0 0 20px 0;
  text-align: center;
}
.extend_handle {
  position: absolute;
  left: 50%;
  bottom: 30px;
  width: 10px;
  height: 10px;
  padding: 10px;
  transform: translate3d(-15px, 0, 0);
  cursor: pointer;
}
.extend_handle:before {
  content: '';
  display: block;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  /*border: 2px solid;*/
  border-color: #ccc #ccc transparent transparent;
  transform: rotateZ(135deg);
  transform-origin: 50% 50% 0;
  transition: transform ease 300ms;
}
.extend_handle:hover:before {
  border-color: #333 #333 transparent transparent;
}
.extend .extend_handle:before {
  transform: rotateZ(-45deg);
}
.extend::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: 15px;
  height: 7px;
  /*border-left: 2px solid #ccc;*/
  transform: translate3d(-1px, 0, 0);
}
.childLevel::before {
  content: '';
  position: absolute;
  left: 50%;
  bottom: 100%;
  height: 15px;
  border-left: 2px solid #ccc;
  transform: translate3d(-1px, 0, 0);
}
.childLevel::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  top: -15px;
  /*border-top: 2px solid #ccc;*/
}
.childLevel:first-child:before,
.childLevel:last-child:before {
  display: none;
}
.childLevel:first-child:after {
  left: 50%;
  height: 15px;
  /*border: 2px solid;*/
  border-color: #ccc transparent transparent #ccc;
  border-radius: 6px 0 0 0;
  transform: translate3d(1px, 0, 0);
}
.childLevel:last-child:after {
  right: 50%;
  height: 15px;
  /*border: 2px solid;*/
  border-color: #ccc #ccc transparent transparent;
  border-radius: 0 6px 0 0;
  transform: translate3d(-1px, 0, 0);
}
.childLevel:first-child.childLevel:last-child::after {
  left: auto;
  border-radius: 0;
  border-color: transparent #ccc transparent transparent;
  transform: translate3d(1px, 0, 0);
}
.node {
  display: inline-block;
  margin: 0 1em;
  box-sizing: border-box;
  text-align: center;
}
.node .person {
  display: inline-block;
  z-index: 2;
  min-width: 6em;
}
.node .person .avat {
  width: 150px;
  height: 100px;
  border: 1px solid grey;
  z-index: 1000;
  transition: 0.2s all;
  overflow: hidden;
}

.node.hasMate::after {
  content: '';
  position: absolute;
  left: 2em;
  right: 2em;
  top: 2em;
  /*border-top: 2px solid #ccc;*/
  z-index: 1;
}
.hasMate {
  display: flex;
  align-items: flex-start;
}

.svg {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}

.line {
  stroke-width: 2px;
  stroke: rgb(0, 0, 0);
}
</style>
