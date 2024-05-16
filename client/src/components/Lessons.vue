<template>
  <div v-if="lesson" class="p-4">
    <div class="text-3xl flex items-center justify-center">
      {{ lesson.title }}
    </div>
    <div class="materials-section mt-4">
      <h2 class="text-xl font-bold">Materials</h2>
      <ul>
        <li v-for="material in lesson.materials" :key="material" class="mb-1">
          {{ material }}
        </li>
      </ul>
    </div>
    <div class="assignments-section mt-4">
      <h2 class="text-xl font-bold">Instructor Assignments</h2>
      <ul>
        <li v-for="file in instructorFiles" :key="file._id" class="mb-1">
          <a :href="`http://localhost:8080/uploads/${file.filename}`" download>{{ file.filename }}</a>
        </li>
      </ul>
      <h2 class="text-xl font-bold">Student Submissions</h2>
      <ul>
        <li v-for="file in studentFiles" :key="file._id" class="mb-1">
          <a :href="`http://localhost:8080/uploads/${file.filename}`" download>{{ file.filename }}</a>
        </li>
      </ul>
      <div>
        <h1>Upload Assignment</h1>
        <form @submit.prevent="uploadFile" enctype="multipart/form-data">
          <input type="file" id="file" name="file" @change="fileSelected" />
          <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded">Upload</button>
        </form>
      </div>
    </div>
  </div>
  <div v-else class="text-xl">Loading lesson details...</div>
</template>

<script>
import axios from 'axios';

export default {
  name: "LessonDetails",
  data() {
  return {
    lesson: null,
    file: null,
    instructorFiles: [],
    studentFiles: [],
  };
},

  mounted() {
    this.fetchLesson();
    this.fetchFiles();
  },
  methods: {
    fileSelected(event) {
      this.file = event.target.files[0];
    },
    async uploadFile() {
  if (!this.file) {
    alert('Please select a file first.');
    return;
  }

  const formData = new FormData();
  formData.append('file', this.file);
  formData.append('type', 'student_submission'); // Append the type of the upload as student submission

  try {
    const response = await axios.post(
      `http://localhost:8080/upload/${this.$route.params.lessonId}`, 
      formData, 
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      }
    );
    alert('File uploaded successfully!');
    this.files.push(response.data); // Assuming the server response includes the file details
  } catch (error) {
    console.error('Error uploading file:', error.response ? error.response.data : 'No response received');
    alert('Failed to upload file.');
  }
},
    async fetchLesson() {
      const lessonId = this.$route.params.lessonId;
      try {
        const response = await axios.get(`http://localhost:8080/api/lessons/${lessonId}`, { withCredentials: true });
        this.lesson = response.data;
      } catch (error) {
        console.error("Error fetching lesson:", error);
      }
    },
    async fetchFiles() {
  const lessonId = this.$route.params.lessonId;
  try {
    const response = await axios.get(`http://localhost:8080/api/files/lesson/${lessonId}`, { withCredentials: true });
    this.instructorFiles = response.data.filter(file => file.type === 'instructor_assignment');
    this.studentFiles = response.data.filter(file => file.type === 'student_submission');
  } catch (error) {
    console.error("Error fetching files:", error.response ? error.response.data : 'Server error');
    alert('Failed to fetch files.');
  }
},
  }
};
</script>
