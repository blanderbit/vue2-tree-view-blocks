# vue2-tree-view-blocks

## PROPS

json - Json structure

{
    name:'', // required
    children: [], // required
    mate: [], // required,
    ...(any properties)
}

options - object for setup 

{
    initialExpandAll: boolean // by default true
}


## EVENTS

@click-node - 
returns clicked node 

```
{
    name:'',
    children: [],
    mate: [],
}
```

## SLOTS 

default slot - for display nested block

## EXAMPLE 
```
<template>
    <tree-view-blocks :json="data" v-slot="{ data }">
        <div>
            {{ data.name }}
        </div>
    </tree-view-blocks>
</template>
```
### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
