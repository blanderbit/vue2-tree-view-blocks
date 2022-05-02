# vue2-drag-drop-zone

## PROPS

height - by default 400px, you can pass any height with any extension (px, em, vh....)

fileValidationOptions - Array of options, for check file extension, should be pass 
```
[
  { extension: '.pdf' } 
] // any extension 
```


## EVENTS

@success-dropped-files - 
returns files that haven`t passed the options check 

@error-dropped-files -
returns files that have passed the options check

## EXAMPLE 

<template>
    <drag-drop-zone v-slot="{ dropZoneActive }">
          <div v-if="dropZoneActive">
               drop them
          </div>
          <div v-else>
               drag
          </div>
    </drag-drop-zone>
</template>

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
