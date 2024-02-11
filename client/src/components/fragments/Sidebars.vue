<template>
     <!-- Sidebar 1 -->
     <div
     class="flex flex-col items-center w-16 pb-4 overflow-auto border-r border-gray-300"
   >
     <a
       class="flex items-center justify-center flex-shrink-0 w-full h-16 bg-gray-300"
       href="/dashboard"
     >
       <img src="../assets/dla.svg" class="flex h-7" alt="logo" />
     </a>
     <a
       class="flex items-center justify-center flex-shrink-0 w-10 h-10 mt-4 rounded hover:bg-gray-300"
       href="#"
     >
       <svg
         xmlns="http://www.w3.org/2000/svg"
         fill="none"
         viewBox="0 0 24 24"
         stroke-width="1.5"
         stroke="currentColor"
         class="w-6 h-6"
       >
         <path
           stroke-linecap="round"
           stroke-linejoin="round"
           d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5"
         />
       </svg>
     </a>
   </div>
        <!-- Sidebar 2 -->
   <div class="flex flex-col w-56 border-r border-gray-300">
     <div class="relative text-sm focus:outline-none group">
       <div
         class="flex items-center justify-between w-full h-16 px-4 border-b border-gray-300"
       >
         <span class="font-medium"> Courses list </span>
       </div>
     </div>
     <div class="flex flex-col flex-grow p-4 overflow-auto">
       <RouterLink
         class="flex items-center flex-shrink-0 h-10 px-2 text-sm font-medium rounded hover:bg-gray-300"
         v-for="course in courses"
         :key="course._id"
         :to="`/dashboard/${course._id}`"
       >
         <span class="leading-none">{{ course.title }} </span>
       </RouterLink>
       <a
         class="flex items-center flex-shrink-0 h-10 px-3 mt-auto text-sm font-medium bg-gray-200 rounded hover:bg-gray-300"
         href="#"
       >
         <svg
           class="w-5 h-5"
           xmlns="http://www.w3.org/2000/svg"
           fill="none"
           viewBox="0 0 24 24"
           stroke="currentColor"
         >
           <path
             stroke-linecap="round"
             stroke-linejoin="round"
             stroke-width="2"
             d="M12 6v6m0 0v6m0-6h6m-6 0H6"
           />
         </svg>
         <span class="ml-2 leading-none">New Item</span>
       </a>
     </div>
     </div>
</template>

<script>
import axios from "axios";

export default {
  name:'Sidebars',

  data() {
    return {
      isPanelVisible: false,
      courses: [],
      user: "",
      course: {},
    };
  },
  mounted() {
    this.fetchCourses();
  },
  methods: {
    showCourseCodePanel() {
      this.isPanelVisible = true;
    },
    hideCourseCodePanel() {
      this.isPanelVisible = false;
    },
    async fetchCourses() {
      try {
        const response = await axios.get("http://localhost:8080/api/courses", {
          withCredentials: true, // Include credentials (cookies, if any)
        });
        this.courses = response.data;
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    },
}
}
</script>