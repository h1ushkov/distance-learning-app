<template>
  <div class="flex w-screen h-screen text-gray-700">
    <!-- Component Start -->
    <!-- Sidebar -->
    <Sidebars/>

    <!-- Container -->
    <div class="flex flex-col flex-grow">
      <!-- Nav bar -->
      <Navbar/>

      <!-- Conditional rendering based on courseId -->
      <template v-if="$route.params.courseId">
        <!-- Course details -->
        <CourseDetails/>
      </template>
      <template v-else>
        <!-- Greetings component when no courseId -->
        <Greetings/>
      </template>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import CourseDetails from './fragments/CourseDetails.vue';
import Sidebars from './fragments/Sidebars.vue';
import Navbar from "./fragments/Navbar.vue";
import Greetings from "./fragments/Greetings.vue";

export default {
  name: 'Dashboard',
  components: { CourseDetails, Sidebars, Navbar, Greetings },
  data() {
    return {};
  },
}
</script>
