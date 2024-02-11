<template>
  <div>
    <RouterView/>
  </div>
</template>

<script>
import Dashboard from './components/Dashboard.vue';
export default {
    name: 'App',
    components: { Dashboard }
}
</script>
