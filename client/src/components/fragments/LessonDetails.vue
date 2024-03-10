<template>
  <div v-if="lesson">{{ lesson.title }}</div>
  <div v-else>No lesson</div>
</template>

<script>
import axios from "axios";

export default {
  name: "LessonDetails",
  data() {
    return {
      isPanelVisible: false,
      isLoading: false,
      lesson: {}, // Initialize as an object
    };
  },
  mounted() {
    this.fetchLesson(); // Call the fetchLesson method when the component is mounted
  },
  methods: {
    async fetchLesson() {
      const lessonId = this.$route.params.lessonId;
      try {
        const response = await axios.get(
          `http://localhost:8080/api/lessons/${lessonId}`,
          {
            withCredentials: true, // Include credentials (cookies, if any)
          }
        );
        this.lesson = response.data;
        console.log(this.lesson); // Corrected console.log statement
      } catch (error) {
        console.error("Error fetching lesson:", error);
      }
    },
  },
};
</script>
