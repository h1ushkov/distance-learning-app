<template>
  <div class="text-3xl flex items-center justify-center" v-if="lesson">
  {{ lesson.title }}
  </div>
  <div class="min-h-24 max-h-72 col-span-2 bg-white border border-gray-300 grid overflow-x-auto">
    <div id="header" class="flex bg-black text-white h-7 font-bold items-center justify-center">
      <h1>STUDENTS LIST</h1>
    </div>
    <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-black">
      <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-100 dark:text-gray-700">
        <tr>
          <th scope="col" class="px-6 py-3">@Username</th>
          <th scope="col" class="px-6 py-3">First name</th>
          <th scope="col" class="px-6 py-3">Middle name</th>
          <th scope="col" class="px-6 py-3">Last name</th>
          <th scope="col" class="px-6 py-3">Grade for "{{ lesson.title }}" lesson</th>
          <th scope="col" class="px-6 py-3">Assigment</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="lesson.students && lesson.students.length > 0" v-for="(student, index) in lesson.students" :key="index"
          class="bg-white border-b dark:bg-white dark:border-gray-400">
          <RouterLink :to="'/u/' + student.username">
            <th scope="row"
              class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-gray-800">@{{ student.username }}</th>
          </RouterLink>
          <td class="px-6 py-4">{{ student.fname }}</td>
          <td class="px-6 py-4">{{ student.mname }}</td>
          <td class="px-6 py-4">{{ student.lname }}</td>
          <td class="px-6 py-4">
  <input v-model="student.newGrade" type="number" min="0" max="100" class="border-gray-300 rounded shadow-sm" placeholder="Enter Grade">
</td>
<td class="px-6 py-4">
  <button @click="submitGrade(student.userId, lesson._id, student.newGrade)" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded">
    Submit
  </button>
</td>

          <td class="px-6 py-4">View</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "LessonDetails",
  data() {
    return {
      lesson: {},
    };
  },
  mounted() {
    this.fetchLesson();
  },
  methods: {
    async fetchLesson() {
      const lessonId = this.$route.params.lessonId;
      try {
        const response = await axios.get(`http://localhost:8080/api/lessons/${lessonId}`, { withCredentials: true });
        this.lesson = response.data;
        // Initialize newGrade for each student
        this.lesson.students.forEach(student => {
          student.newGrade = student.lesson_grade.length ? student.lesson_grade[0].grade : ''; // Assuming grade is the first item if exists
        });
      } catch (error) {
        console.error("Error fetching lesson:", error);
      }
    },
    async submitGrade(userId, lessonId, grade) {
  try {
    const url = `http://localhost:8080/user/:userId/lesson/:lessonId/grade/:grade`; // Updated endpoint
    const data = { // Construct the data object to be sent in the request body
      userId,
      lessonId,
      grade
    };
    const response = await axios.post(url, data, { withCredentials: true });
    alert('Grade updated successfully');
    console.log('Response:', response.data); // Log the response data for debugging
    this.fetchLesson(); // Refresh lesson details to show the updated grades
  } catch (error) {
    console.error("Error updating grade:", error);
    alert('Failed to update grade');
  }
}

  },
};
</script>
