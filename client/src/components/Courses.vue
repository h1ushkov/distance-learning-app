<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Enrolled Courses</h1>
    <ul>
      <li v-for="course in courses" :key="course._id" class="mb-4 border p-4">
        <h2 class="text-xl font-bold mb-2">{{ course.title }}</h2>
        <ul>
          <li v-for="lesson in course.lessons" :key="lesson._id">
            <router-link :to="`/lesson/${lesson._id}`">{{ lesson.title }}</router-link>
          </li>
        </ul>
        <button @click="unenrollCourse(course._id)" class="mt-2 bg-black text-white py-2 px-4 rounded">
          Unenroll
        </button>
      </li>
    </ul>
    <div class="mt-4">
      <input type="text" id="courseCode" placeholder="Enter the course code" v-model="courseCode" class="block w-full rounded-t-lg border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-5" />
      <button @click="enrollCourse" class="flex w-full justify-center rounded-b-lg bg-black px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Enroll</button>
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

    for (let course of this.courses) {
      const lessonsResponse = await axios.get(`http://localhost:8080/api/lessons/cid/${course._id}`, {
        withCredentials: true,
      });
      course.lessons = lessonsResponse.data; // Directly assign the lessons to the course object
    }
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
        this.courses = response.data;
        this.courseCode = '';
      } catch (error) {
        console.error('Error enrolling in course:', error);
      }
    },
    async unenrollCourse(courseId) {
      try {
        const response = await axios.post('http://localhost:8080/api/courses/unenroll', { courseId }, { withCredentials: true });
        this.courses = response.data;
      } catch (error) {
        console.error('Error unenrolling from course:', error);
      }
    }
  },
};
</script>
