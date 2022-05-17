<template>
    <div id="app">
        <tree-view-blocks :json="data" v-slot="{ data }">
            <div >
                {{ data.name }}
            </div>
        </tree-view-blocks>
        <tree-view-blocks :json="data" v-slot="{ data }">
            <div style="width: 250px;height: 200px;border: 3px solid red;">
                {{ data.name }}
            </div>
        </tree-view-blocks>
        <tree-view-blocks :json="data"/>
    </div>
</template>

<script>
    import TreeViewBlocks from './components/TreeViewBlocks/TreeViewBlocks.vue'
    import {data} from "./const";

    export default {
        name: 'App',
        components: {
            TreeViewBlocks
        },
        data() {
            return {
                data
            }
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
        height: 100vh;
        width: 100vw;
    }
</style>
