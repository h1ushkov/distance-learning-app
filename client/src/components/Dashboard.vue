<template>
  <div class="flex w-screen h-screen text-gray-700">
    <!-- Component Start -->
        <!-- Sidebar -->
<Sidebars/>
    <!-- Container -->
    <div class="flex flex-col flex-grow">
      <!-- Nav bar -->
<Navbar/>

      <!-- Course details -->
      <CourseDetails/>

    </div>
  </div>
</template>
<script>
import axios from "axios";
import CourseDetails from './fragments/CourseDetails.vue';
import Sidebars from './fragments/Sidebars.vue';
import Navbar from "./fragments/Navbar.vue";
export default {
  name:'Dashboard',
  components: { CourseDetails, Sidebars, Navbar },
  data() {
    return {
    };
    
  },
  
}
</script>
