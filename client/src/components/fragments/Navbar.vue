<template>
  <div class="flex items-center flex-shrink-0 h-16 px-8 border-b border-gray-300 bg-black text-white ">
    <h1 ref="courseTitle"
        class="text-lg font-medium hover:bg-gray-600 hover:text-white hover:border-2 hover:border-dotted transition-all"
        contenteditable
        @input="updateCourseTitle"
        @blur="saveCourseTitle"
        v-html="courseTitle">
    </h1>

    <!-- Conditionally show buttons if courseId exists -->
    <template v-if="$route.params.courseId">
      <button class="flex items-center justify-center h-10 px-4 ml-auto text-sm font-medium rounded hover:bg-gray-900">

      </button>
      <button @click="deleteCourse" class="flex items-center justify-center h-10 px-4 ml-2 text-sm font-medium rounded hover:bg-gray-900">
        Delete
      </button>
    </template>
  </div>
</template>
    <script>
    import axios from "axios";

    export default {
      name: 'Navbar',
      data() {
        return {
          courses: [],
          user: "",
          course: {},
        };
      },
      computed: {
        courseTitle: {
          get() {
            return this.course.title;
          },
          set(value) {
            this.course.title = value;
          },
        },
      },
      mounted() {
        if (this.$route.params.courseId) {
          this.fetchData();
        }
      },
      watch: {
        '$route.params.courseId': function (newCourseId) {
          if (newCourseId) {
            this.fetchData();
          }
        },
      },
      methods: {
        updateCourseTitle() {
          this.saveCourseTitle();
        },

        async saveCourseTitle() {
          if (this.$route.params.courseId) {
            try {
              await axios.put(`http://localhost:8080/api/courses/${this.$route.params.courseId}`, {
                title: this.$refs.courseTitle.textContent,
              }, {
                withCredentials: true,
              });
            } catch (error) {
              console.error("Error updating course title:", error);
            }
          }
        },


        async fetchData() {
          try {
            this.isLoading = true;
            await this.fetchUser();
            await this.fetchCourseDetails();
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
        async fetchCourseDetails() {
          const courseId = this.$route.params.courseId;
          try {
            const response = await axios.get(`http://localhost:8080/api/courses/${courseId}`, {
              withCredentials: true,
            });
            this.course = response.data;
          } catch (error) {
            console.error("Error fetching course details:", error);
          }
        },
        async deleteCourse() {
  if (!confirm('Are you sure you want to delete this course?')) return;
  
  const courseId = this.$route.params.courseId; // Assuming course_id is stored in the lesson object

  axios.delete(`http://localhost:8080/api/courses/${courseId}`, { withCredentials: true })
    .then(response => {
      alert('Course deleted successfully.');
      // Redirect or update the view as necessary
      this.$router.push('/dashboard'); // Adjust this path as needed
      this.fetchData();
    })
    .catch(error => {
      console.error('Error deleting lesson:', error.response ? error.response.data : 'Server error');
      alert('Failed to delete lesson.');
    });
},
      },
    };
    </script>
