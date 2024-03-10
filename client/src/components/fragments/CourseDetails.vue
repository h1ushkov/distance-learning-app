<template>
  <div class="flex-grow p-6 overflow-auto bg-gray-200">
    <header
      class="h-auto col-span-1 bg-white border border-gray-300 grid overflow-x-auto mb-7 rounded-md "
    >
    <div id="header" class="flex bg-black text-white h-7 font-bold items-center justify-center">
      <h1>
      ADD LESSON
      </h1>
    </div>
      <!-- Display existing lessons -->
      <form
          :action="`http://localhost:8080/api/lessons/cid/${$route.params.courseId}`"
          class=""
          method="POST"
          @submit.prevent="createLesson"
      >
        <input
            type="title"
            id="title"
            placeholder="Add new lesson"
            class="block w-full border-0 py-1.5 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6 p-5"
            name="title"
            v-model="newLessonTitle"
        />
        <ul class="max-w-md space-y-1 text-gray-900 p-2">
          <li v-for="(lesson, index) in lessons" :key="lesson._id">
            <div
            class="editable text-lg font-medium hover:bg-gray-600 hover:text-white hover:border-2 hover:border-dotted transition-all"
            contenteditable
            @input="updateLessonTitle(index, $event)"
            @blur="saveLessonTitle(index)"
          >{{ lesson.title }}</div>
                    <!-- Add the router-link for navigation -->
                    <router-link
                    :to="'/dashboard/lesson/' + lesson._id"
                    class="text-sm hover:underline cursor-pointer mt-1 block"
                  >
                    Edit lesson page
                  </router-link>
          </li>
    
        </ul>


        <button
            type="submit"
            class="flex w-full justify-center rounded-b-lg bg-black px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Add new
        </button>
      </form>

   
      <!-- Form for creating a new lesson -->
    </header>

    <div class="grid grid-cols-3 gap-6">
      
      <div
        class="h-24 col-span-1 bg-white border border-gray-300 block rounded-md "
        data-te-toggle="tooltip"
        title="Course description"
      >
      <div id="header" class="flex bg-black h-7 text-white font-bold items-center justify-center">
        <h1>
        DETAILS
        </h1>
      </div>
      <div class="p-2">
        <span ref="courseDescription"
            class="text-lg font-medium hover:bg-gray-600 hover:text-white hover:border-2 hover:border-dotted transition-all"
            contenteditable
            @input="updateCourseDescription"
            @blur="saveCourseDescription"
            v-html="courseDescription">
        </span>
      </div>
    </div>
      <div
      class="h-24 col-span-1 bg-white border border-gray-300 block rounded-md"
      data-te-toggle="tooltip"
      title="Course Section"
    >
    <div id="header" class="flex bg-black h-7 text-white font-bold items-center justify-center">
      <h1>
      SECTION
      </h1>
    </div>
    <div class="p-2">
        <span ref="courseSection"
              class="text-lg font-medium hover:bg-gray-600 hover:text-white hover:border-2 hover:border-dotted transition-all"
              contenteditable
              @input="updateCourseSection"
              @blur="saveCourseSection"
              v-html="courseSection">
        </span>
        </div>
    </div>
      <div
        class="min-h-24 max-h-72 col-span-2 bg-white border border-gray-300 grid overflow-x-auto"
      >
      <div id="header" class="flex bg-black text-white h-7 font-bold items-center justify-center">
        <h1>
        STUDENTS LIST
        </h1>
      </div>
        <table
          class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-black"
        >
        
          <thead
            class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-100 dark:text-gray-700"
          >
            <tr>
              <th scope="col" class="px-6 py-3">@Username</th>
              <th scope="col" class="px-6 py-3">First name</th>
              <th scope="col" class="px-6 py-3">Middle name</th>
              <th scope="col" class="px-6 py-3">Last name</th>
            </tr>
          </thead>
          <tbody>
            <tr
              class="bg-white border-b dark:bg-white dark:border-gray-400"
              v-if="course.students && course.students.length > 0"
              v-for="(student, index) in course.students"
              :key="index"
            >
              <RouterLink :to="'/u/' + student.username">
                <th
                  scope="row"
                  class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-gray-800"
                >
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
      <span v-if="course.code" data-te-toggle="tooltip" title="Course code">{{
          course.code
        }}</span>
        <span v-else>Course code</span>
        <button @click="showCourseCodePanel">
         <IconZoom/>
        </button>
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
  <IconHideZoom/>
          </button>
        </div>
      </div>
    </div>
</template>
<script>
import axios from "axios";
import Navbar from "./Navbar.vue";
import Sidebars from "./Sidebars.vue";
import IconZoom from "../icons/IconZoom.vue";
import IconHideZoom from "../icons/IconHideZoom.vue";

export default {
  name: "CourseDetails",
  data() {
    return {
      isPanelVisible: false,
      isLoading: false,
      user: "",
      course: {},
      lessons: [],
      newLessonTitle: '',
    };
  },
  computed: {
    courseDescription: {
      get() {
        return this.course.description;
      },
      set(value) {
        this.course.description = value;
      },
    },
    courseSection: {
      get() {
        return this.course.section;
      },
      set(value) {
        this.course.section = value;
      },
    },
    lessonsTitle: {
      get() {
        return this.lessons.map(lesson => lesson.title);
      },
      set(value) {
        this.lessons.forEach((lesson, index) => {
          lesson.title = value[index];
        });
      },
    },

  },
  watch: {
    "$route.params.courseId": function (newCourseId) {
      if (newCourseId) {
        this.fetchData();
      }
    },
  },
  mounted() {
    if (this.$route.params.courseId) {
      this.fetchData();
    }
  },
  methods: {
    updateCourseDescription() {
      this.saveCourseDescription();
    },
    async saveCourseDescription() {
      if (this.$route.params.courseId) {
        try {
          await axios.put(`http://localhost:8080/api/courses/${this.$route.params.courseId}`, {
            description: this.$refs.courseDescription.textContent,
          }, {
            withCredentials: true,
          });
        } catch (error) {
          console.error("Error updating course description:", error);
        }
      }
    },
    async saveLessonTitle(index) {
      try {
        const lessonId = this.lessons[index]._id;
        await axios.put(`http://localhost:8080/api/lessons/${lessonId}`, {
          title: this.lessons[index].title,
        }, {
          withCredentials: true,
        });
      } catch (error) {
        console.error("Error updating lesson title:", error);
      }
    },

updateLessonsTitle(index, event) {
  this.saveLessonsTitle(index, event);
},

    async saveCourseSection() {
      if (this.$route.params.courseId) {
        try {
          await axios.put(`http://localhost:8080/api/courses/${this.$route.params.courseId}`, {
            section: this.$refs.courseSection.textContent,
          }, {
            withCredentials: true,
          });
        } catch (error) {
          console.error("Error updating course section:", error);
        }
      }
    },
    async saveLessonTitle(index) {
      try {
        const lessonId = this.lessons[index]._id;
        await axios.put(`http://localhost:8080/api/lessons/${lessonId}`, {
          title: this.lessons[index].title,
        }, {
          withCredentials: true,
        });
      } catch (error) {
        console.error("Error updating lesson title:", error);
      }
    },

updateLessonTitle(index, event) {
   this.lessons[index].title = event.target.innerText;
    },
    toggleDropdown() {
      this.dropdownVisible = !this.dropdownVisible;
    },
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
    async fetchLessons() {
      const courseId = this.$route.params.courseId;
      try {
        const response = await axios.get(
            `http://localhost:8080/api/lessons/cid/${courseId}`,
            {
              withCredentials: true, // Include credentials (cookies, if any)
            }
        );
        this.lessons = response.data;
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    },
    async fetchCourseDetails() {
      const courseId = this.$route.params.courseId;
      try {
        const response = await axios.get(
            `http://localhost:8080/api/courses/${courseId}`,
            {
              withCredentials: true,
            }
        );
        this.course = response.data;
        this.$emit("courses-updated", this.courses);
      } catch (error) {
        console.error("Error fetching course details:", error);
      }
    },
    createLesson() {
      const url = `http://localhost:8080/api/lessons/cid/${this.$route.params.courseId}`;

      axios.post(url, { title: this.newLessonTitle }, { withCredentials: true })
          .then(response => {
            // Update local data with the new lesson
            this.lessons.push(response.data);

            // Clear the input field
            this.newLessonTitle = '';
          })
          .catch(error => {
            console.error('Error creating lesson:', error);
          });
    }
  },
  components: {IconHideZoom, IconZoom, Navbar, Sidebars },
};
</script>
<style>
.editable {
  white-space: pre-wrap; /* Preserve newlines and spaces */
}
</style>