# 回调事件

```vue
<template>
  <vue-tableau-slide @change="handlerChange" />
</template>
````

## change

```javascript
    handlerChange: function(values){
      console.log("values:", values)
    }
```