<template>
  <div>
    <div v-if="isLoading">Loading...</div>
    <div v-else>
      <div v-if="lesson">
        <h2>{{ lesson.title }}</h2>
        <p><strong>Materials:</strong></p>
        <ul>
          <li v-for="(material, index) in lesson.materials" :key="index">{{ material }}</li>
        </ul>
        <p><strong>Students:</strong></p>
        <ul>
          <li v-for="student in lesson.students" :key="student._id">
            {{ student.username }} ({{ student.fname }} {{ student.mname }} {{ student.lname }}) - Grades: {{ student.lesson_grade.join(', ') }}
          </li>
        </ul>
      </div>
      <div v-else>No lesson found</div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: "LessonDetails",
  data() {
    return {
      isLoading: false,
      lesson: null,
    };
  },
  mounted() {
    this.fetchLesson();
  },
  methods: {
    async fetchLesson() {
      const lessonId = this.$route.params.lessonId;
      this.isLoading = true;
      try {
        const response = await axios.get(`http://localhost:8080/api/lessons/${lessonId}`, {
          withCredentials: true
        });
        this.lesson = response.data;
        console.log("Lesson fetched successfully:", this.lesson);
        this.isLoading = false;
      } catch (error) {
        console.error("Error fetching lesson:", error);
        this.isLoading = false;
      }
    },
  },
};
</script>
