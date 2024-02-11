<template>
  <div class="flex-grow p-6 overflow-auto bg-gray-200">
    <div class="grid grid-cols-3 gap-6">
      
      <div
        class="h-24 col-span-1 bg-white border border-gray-300 flex justify-center items-center"
        data-te-toggle="tooltip"
        title="Course description"
      >
      
        <span v-if="course.description">{{ course.description }}</span>
        <span v-else>Course description</span>
      </div>
      <div
        class="h-24 col-span-1 bg-white border border-gray-300 flex justify-center items-center"
        data-te-toggle="tooltip"
        title="Course instructor"
      >
        {{
          Array.isArray(course.instructor) && course.instructor.length > 0
            ? course.instructor[0]
            : "Course instructor"
        }}
      </div>

      <div
      class="h-24 col-span-1 bg-white border border-gray-300 flex justify-center items-center"
      data-te-toggle="tooltip"
      title="Course lessons"
    >
<ul v-for="lesson in lessons" class="max-w-md space-y-1 text-gray-900 list-disc list-inside ">
    <li>
      {{ lesson.title }}
    </li>
</ul>
    </div>
      <div
        class="h-24 col-span-2 bg-white border border-gray-300 flex justify-center items-center text-3xl"
        data-te-toggle="tooltip"
        title="Course section"
      >
        <span v-if="course.section">{{ course.section }}</span>
        <span v-else>Course section</span>
      </div>
      <div class="min-h-24 max-h-72 col-span-2 bg-white border border-gray-300 flex justify-center items-center overflow-x-auto">
        <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-100 dark:text-gray-700">
              <tr>
                  <th scope="col" class="px-6 py-3">
                      @Username
                  </th>
                  <th scope="col" class="px-6 py-3">
                      First name
                  </th>
                  <th scope="col" class="px-6 py-3">
                      Middle name
                  </th>
                  <th scope="col" class="px-6 py-3">
                      Last name
                  </th>
              </tr>
          </thead>
          <tbody>
              <tr class="bg-white border-b dark:bg-white dark:border-gray-400 " v-if="course.students && course.students.length > 0" v-for="(student, index) in course.students" :key="index">
                <RouterLink :to="'/u/' + student.username">
                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-gray-800">
                   
                  @{{ student.username }}
                  </th>
                </RouterLink>
                  <td class="px-6 py-4">
                    {{ student.fname }}
                  </td>
                  <td class="px-6 py-4">
                    {{ student.mname }}
                  </td>
                  <td class="px-6 py-4">
                    {{ student.lname }}
                  </td>

              </tr>
          </tbody>
      </table>
      </div>
      <div
        class="h-24 col-span-2 bg-white border border-gray-300 flex justify-center items-center text-3xl"
      >
        <span
          v-if="course.code"
          data-te-toggle="tooltip"
          title="Course code"
          >{{ course.code }}</span
        >
        <span v-else>Course code</span>
        <div class="cursor-pointer" @click="showCourseCodePanel">
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
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607ZM10.5 7.5v6m3-3h-6"
            />
          </svg>
        </div>
      </div>

      <div
        v-if="isPanelVisible"
        class="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-75"
      >
        <div class="bg-white p-8 rounded shadow-lg">
          <!-- Panel content, in this case, the course code -->
          <p class="text-8xl">{{ course.code }}</p>
          <button @click="hideCourseCodePanel">
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
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607ZM13.5 10.5h-6"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import Navbar from "./Navbar.vue";
import Sidebars from "./Sidebars.vue";

export default {
    name: 'CourseDetails',
    data() {
        return {
            isPanelVisible: false,
            isLoading: false,
            user: "",
            course: {},
            lessons: []
        };
    },
    watch: {
        '$route.params.courseId': 'fetchData'
    },
    mounted() {
        this.fetchData();
    },
    methods: {
        showCourseCodePanel() {
            this.isPanelVisible = true;
        },
        hideCourseCodePanel() {
            this.isPanelVisible = false;
        },

        async fetchData() {
            try {
                this.isLoading = true;
                await this.fetchUser();
                await this.fetchCourseDetails();
                await this.fetchLessons();
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                this.isLoading = false;
            }
        },
        async fetchUser() {
            try {
                const response = await axios.get("http://localhost:8080/api/users/current", {
                    withCredentials: true, // Include credentials (cookies, if any)
                });
                this.user = response.data;
            }
            catch (error) {
                console.error("Error fetching user:", error);
            }
        },
        async fetchLessons() {
            const courseId = this.$route.params.courseId;
            try {
                const response = await axios.get(`http://localhost:8080/api/lessons/cid/${courseId}`, {
                    withCredentials: true, // Include credentials (cookies, if any)
                });
                this.lessons = response.data;
            }
            catch (error) {
                console.error("Error fetching courses:", error);
            }
        },
        async fetchCourseDetails() {
            const courseId = this.$route.params.courseId;
            try {
                const response = await axios.get(`http://localhost:8080/api/courses/${courseId}`, {
                    withCredentials: true,
                });
                this.course = response.data;
                this.$emit('courses-updated', this.courses);
            }
            catch (error) {
                console.error("Error fetching course details:", error);
            }
        },
    },
    components: { Navbar, Sidebars }
};
</script>
