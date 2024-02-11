<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Enrolled courses</h1>
    
    <ul>
      <li v-for="course in courses" :key="course._id" class="mb-4 border p-4">
        <h2 class="text-xl font-bold mb-2">{{ course.title }}</h2>
        <button @click="unenrollCourse(course._id)" class="mt-2  bg-black text-white py-2 px-4 rounded">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M22 10.5h-6m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM4 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 10.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
          </svg>
          
</button>
      </li>
    </ul>

    <div class="mt-4">
      <input type="text" id="courseCode" placeholder="Enter the course code" v-model="courseCode" class="block w-full rounded-t-lg border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-5" />
      <button @click="enrollCourse" class="flex w-full justify-center rounded-b-lg  bg-black px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Enroll</button>
    </div>
  </div>
</template>
<script>
import axios from 'axios';

export default {
  data() {
    return {
      courses: [],
      courseCode: '',
    };
  },
  mounted() {
    this.fetchCourses();
  },
  methods: {
    async fetchCourses() {
      try {
        const response = await axios.get('http://localhost:8080/api/courses/student', {
          withCredentials: true,
        });
        this.courses = response.data;
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    },
    async enrollCourse() {
      try {
        const response = await axios.post('http://localhost:8080/api/courses/enroll', {
          courseCode: this.courseCode,
        }, {
          withCredentials: true,
        });

        // Assuming the response contains the updated list of courses after enrollment
        this.courses = response.data;

        // Clear the input field after successful enrollment
        this.courseCode = '';
      } catch (error) {
        console.error('Error enrolling in course:', error);
      }
    },
    async unenrollCourse(courseId) {
  try {
    const response = await axios.post(
      'http://localhost:8080/api/courses/unenroll',
      { courseId: courseId },
      { withCredentials: true }
    );

    // Assuming the response contains the updated list of courses after unenrollment
    this.courses = response.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.error) {
      const errorMessage = error.response.data.error;

      if (errorMessage === 'User is not enrolled in the specified course') {
        // Handle this specific error (e.g., show a message to the user)
        console.error(`Error unenrolling from course: ${errorMessage}`);
      } else {
        // Handle other errors
        console.error('Error unenrolling from course:', errorMessage);
      }
    } else {
      console.error('Unexpected error:', error.message);
    }
  }
}
  },
};
</script>

<style scoped>
/* Add your component styles here */
</style>
