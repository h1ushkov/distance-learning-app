<template>
     <!-- Sidebar 1 -->
     <div
     class="flex flex-col items-center w-16 pb-4 overflow-auto border-r border-gray-300"
   >
     <a
       class="flex items-center justify-center flex-shrink-0 w-full h-16 bg-white border-gray-300 border-b"
       href="/dashboard"
     >
       <img src="../../assets/logo.svg" class="flex h-9" alt="logo" />
     </a>
     <a
       class="flex items-center justify-center flex-shrink-0 w-10 h-10 mt-4 rounded hover:bg-gray-300"
       href="#"
     >
 <IconLearn/>
     </a>
   <!-- User -->
   <button @click="toggleDropdown" class="flex items-center justify-center flex-shrink-0 w-10 h-10 mt-auto rounded hover:bg-gray-300 text-sm focus:outline-none group">
    <div class="flex items-center justify-center w-10 h-10 rounded hover:bg-gray-300">
  <IconUser/>
    </div>
  
    <div v-show="dropdownVisible" class="absolute left-14 bottom-14 flex-col items-start w-40 h-auto overflow-x-auto pb-1 bg-white border border-gray-300 shadow-lg">
      <div v-if="user" class="w-full px-4 py-2 text-left font-bold">
        @{{ user.username }}
      </div>
    
      <a v-if="user" :href="'/u/' + user.username" class="w-full px-4 py-2 text-left hover:bg-gray-300">
        Personal page
      </a>
    
      <a class="w-full px-4 py-2 text-left hover:bg-gray-300" href="/settings">
        Settings
      </a>
    
      <a class="w-full px-4 py-2 text-left hover:bg-gray-300" href="/logout">
        Logout
      </a>
    </div>
  </button>
   </div>


        <!-- Sidebar 2 -->
   <div class="flex flex-col w-56 border-r border-gray-300">
     <div class="relative text-sm focus:outline-none group">
       <div
         class="flex items-center justify-between w-full h-16 px-4 border-b bg-black border-gray-300"
       >
         <span class="text-lg text-white"> Courses list </span>
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
       @click="createNewCourse"
       class="flex items-center flex-shrink-0 h-10 px-3 mt-auto text-sm font-medium bg-gray-200 rounded hover:bg-gray-300"
       href="#"
     >
<IconPlus/>
       <span class="ml-2 leading-none">New Item</span>
     </a>
     </div>
     </div>
</template>

<script>
import axios from "axios";
import IconLearn from "../icons/IconLearn.vue";
import IconPlus from "../icons/IconPlus.vue";
import IconUser from "../icons/IconUser.vue";

export default {
  name:'Sidebars',
  components: {IconUser, IconPlus, IconLearn},

  data() {
    return {
      dropdownVisible: false,
      courses: [],
      user: "",
      course: {},
    };
  },
  mounted() {
    this.fetchCourses();
    this.fetchUser();
  },
  methods: {
    toggleDropdown() {
      this.dropdownVisible = !this.dropdownVisible;
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
    async fetchUser() {
        try {
            const response = await axios.get(
            "http://localhost:8080/api/users/current",
            {
                withCredentials: true, // Include credentials (cookies, if any)
            }
            );
            this.user = response.data;
        } catch (error) {
            console.error("Error fetching user:", error);
        }
        },

        async createNewCourse() {
      try {
        const newCourse = {
          title: "untitled",
          description: "Your short description",
          section: "yoursection",
        };

        const response = await axios.post(
          "http://localhost:8080/api/courses",
          newCourse,
          { withCredentials: true }
        );

        // Assuming the API returns the created course
        const createdCourse = response.data;

        // Update the courses list with the new course
        this.courses.push(createdCourse);
        this.fetchCourses();
        // Optionally, you can redirect to the newly created course page
        this.$router.push(`/dashboard/${createdCourse._id}`);
      } catch (error) {
        console.error("Error creating a new course:", error);
      }
    },
}
}
</script>