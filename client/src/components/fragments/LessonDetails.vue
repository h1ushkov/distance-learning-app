<template>
<div class="text-3xl flex items-center justify-center" v-if="lesson">
    {{ lesson.title }}
    <button @click="deleteLesson" class="ml-4 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded">Delete Lesson</button>
  </div>
  <div class="p-4">
    <div class="test-creation mt-4">
      <h2 class="text-xl font-bold">Create Test</h2>
      <form @submit.prevent="createTest">
        <input type="text" placeholder="Test Title" v-model="newTest.title" class="block w-full p-2 border rounded" />
        <input type="number" placeholder="Duration (minutes)" v-model="newTest.duration" class="block w-full p-2 border rounded mt-2" />

        <div v-for="(question, index) in newTest.questions" :key="index" class="mt-4">
          <textarea v-model="question.text" placeholder="Question Text" class="block w-full p-2 border rounded"></textarea>
          <div v-for="(option, idx) in question.options" :key="idx" class="flex items-center mt-2">
            <input type="text" v-model="option.text" placeholder="Option Text" class="p-2 border rounded flex-grow" />
            <input type="checkbox" v-model="option.isCorrect" class="ml-2" /> Is Correct?
          </div>
          <button @click="addOption(index)" type="button" class="mt-2 bg-blue-300 hover:bg-blue-500 text-white font-bold py-1 px-2 rounded">Add Option</button>
        </div>
        <button @click="addQuestion" type="button" class="mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded">Add Question</button>
        <button type="submit" class="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded">Create Test</button>
      </form>
    </div>
  </div>
    <div>
      <textarea v-model="newMaterial" placeholder="Add new material (up to 10,000 characters)" class="w-full h-24 p-2 border rounded"></textarea>
      <button @click="addMaterial" class="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Add Material</button>
    </div>
    <h2 class="text-xl font-bold mt-4 mb-2">Materials</h2>
    <ul>
      <li v-for="(material, index) in lesson.materials" :key="index" class="mb-1 flex justify-between items-center">
        {{ material }}
        <button @click="deleteMaterial(index)" class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded">
          Delete
        </button>
      </li>
    </ul>
  <div>
  <h1>Upload Assignment</h1>
  <form @submit.prevent="uploadFile" enctype="multipart/form-data">
    <select v-model="uploadType">
      <option value="instructor_assignment">Instructor Assignment</option>
    </select>
    <input type="file" id="file" name="file" @change="fileSelected" />
    <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded">Upload</button>
  </form>
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
            Current grade
            <input disabled v-model="student.lesson_grade" class="border-gray-300 rounded shadow-sm" placeholder="Enter Grade">
Enter new grade
            <input v-model="student.newGrade" type="number" min="0" max="100" class="border-gray-300 rounded shadow-sm" placeholder="Enter Grade">
            <button @click="submitGrade(student.userId, lesson._id, student.newGrade)" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded">
              Submit
            </button>
          </td>
          <td class="px-6 py-4">
  <button @click="toggleSubmissions(student.userId)" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded">
    View Submissions
  </button>
  <div v-if="activeStudentId === student.userId && submissions.length > 0">
    <ul>
      <li v-for="submission in submissions" :key="submission._id">
        <a :href="`http://localhost:8080/uploads/${submission.filename}`" download>{{ submission.filename }}</a>
      </li>
    </ul>
    <button @click="hideSubmissions" class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded">
      Close
    </button>
  </div>
</td>


        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: "LessonDetails",
  data() {
    return {
      lesson: {},
      students: [],
      newMaterial: '',  
      newTest: {
        title: '',
        duration: 0,
        questions: []
      },
      file: null,
      files: [],
      uploadType: 'instructor_assignment',
      activeStudentId: null,
      submissions: [],
    };
  },
  mounted() {
    this.fetchLesson();
    this.fetchStudents();
    this.fetchFiles(); // instead of this.fetchLesson(); if the student data is separate
  },
  methods: {
    toggleSubmissions(studentId) {
      if (this.activeStudentId === studentId) {
        this.hideSubmissions();  // Если список уже показывается для этого студента, скрыть его
      } else {
        this.activeStudentId = studentId;
        axios.get(`http://localhost:8080/api/files/user/${studentId}`, { withCredentials: true })
          .then(response => {
            this.submissions = response.data;
          })
          .catch(error => {
            console.error("Error fetching submissions:", error);
            this.submissions = [];  // Обнуляем список при ошибке
          });
      }
    },
    hideSubmissions() {
      this.submissions = [];
      this.activeStudentId = null;
    },
    addQuestion() {
      this.newTest.questions.push({
        text: '',
        options: []
      });
    },
    addOption(questionIndex) {
      this.newTest.questions[questionIndex].options.push({
        text: '',
        isCorrect: false
      });
    },
    async createTest() {
      try {
        const response = await axios.post(`http://localhost:8080/api/tests`, {
          ...this.newTest,
          lessonId: this.lesson._id
        }, { withCredentials: true });
        alert('Test created successfully!');
        this.resetTestForm();
      } catch (error) {
        console.error('Error creating test:', error.response ? error.response.data : 'Server error');
        alert('Failed to create test.');
      }
    },
    resetTestForm() {
      this.newTest = {
        title: '',
        duration: 0,
        questions: []
      };
    },
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
  formData.append('type', this.uploadType); // Append the type of the upload

  try {
    const response = await axios.post(
      `http://localhost:8080/upload/${this.$route.params.lessonId}`,
      formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      }
    );
    alert('File uploaded successfully!');
    console.log(response.data);
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
    // Assuming response.data includes an 'assignments' array with file details
    this.fetchStudents();
  } catch (error) {
    console.error("Error fetching lesson:", error);
  }
},
async fetchFiles() {
        try {
            const lessonId = this.$route.params.lessonId; // Assuming you have the lesson ID in the route params
            const response = await axios.get(`http://localhost:8080/api/files/lesson/${lessonId}`, { withCredentials: true });
            this.files = response.data; // Store fetched files in the component's data
        } catch (error) {
            console.error("Error fetching files:", error.response ? error.response.data : 'Server error');
            alert('Failed to fetch files.');
        }
    },
    async deleteFile(fileId) {
        if (!confirm('Are you sure you want to delete this file?')) return;
        try {
            await axios.delete(`http://localhost:8080/api/files/${fileId}`, { withCredentials: true });
            this.files = this.files.filter(file => file._id !== fileId); // Remove the file from the local state
            alert('File deleted successfully.');
        } catch (error) {
            console.error('Error deleting file:', error.response ? error.response.data : 'Server error');
            alert('Failed to delete file.');
        }
    },
    async fetchStudents() {
  if (this.lesson.students && this.lesson.students.length > 0) {
    this.students = await Promise.all(this.lesson.students.map(async (student) => {
      const res = await axios.get(`http://localhost:8080/api/users/${student.userId}`, { withCredentials: true });
      // Find the grade for the current lesson from the user's lesson_grade array
      const lessonGrade = res.data.lesson_grade.find(lg => lg.lessonId === this.lesson._id);
      student.lesson_grade = lessonGrade ? lessonGrade.grade : ''; // Use grade directly
      return student;
    }));
  }
},
async addMaterial() {
      const lessonId = this.$route.params.lessonId;
      if (!this.newMaterial || this.newMaterial.length > 10000) {
        alert('Please ensure the material text is not empty and does not exceed 10,000 characters.');
        return;
      }
      try {
        const response = await axios.post(`http://localhost:8080/api/lessons/materials/lid/${lessonId}`, { material: this.newMaterial }, { withCredentials: true });
        if (response.data.success) {
          this.lesson.materials.push(this.newMaterial);  // Update local materials list
          this.newMaterial = '';  // Clear input
        }
      } catch (error) {
        console.error("Error adding material:", error);
        alert('Failed to add material');
      }
    },
    async deleteMaterial(materialId) {
    if (!confirm('Are you sure you want to delete this material?')) return;

    const lessonId = this.lesson._id; // Ensure you have access to the lesson's ID
    try {
        await axios.delete(`http://localhost:8080/api/lessons/materials/${lessonId}/${materialId}`, { withCredentials: true });
        // Update the local state to reflect the change
        this.lesson.materials = this.lesson.materials.filter(material => material._id !== materialId);
        alert('Material deleted successfully.');
        this.fetchLesson();
    } catch (error) {
        console.error('Error deleting material:', error);
        alert('Failed to delete material.');
    }
},
async deleteLesson() {
  if (!confirm('Are you sure you want to delete this lesson?')) return;
  
  const courseId = this.lesson.course_id; // Assuming course_id is stored in the lesson object
  const lessonId = this.lesson._id;

  axios.delete(`http://localhost:8080/api/lessons/l/${lessonId}/c/${courseId}`, { withCredentials: true })
    .then(response => {
      alert('Lesson deleted successfully.');
      // Redirect or update the view as necessary
      this.$router.push('/dashboard'); // Adjust this path as needed
    })
    .catch(error => {
      console.error('Error deleting lesson:', error.response ? error.response.data : 'Server error');
      alert('Failed to delete lesson.');
    });
},
async submitGrade(userId, lessonId, grade) {
  // Check if grade is undefined and handle it
  if (grade === undefined) {
    alert('Grade is undefined. Please enter a valid grade.');
    return;
  }

  try {
    const url = `http://localhost:8080/api/lessons/user/${userId}/lesson/${lessonId}/grade/${grade}`;
    await axios.post(url, {}, { withCredentials: true });
    alert('Grade updated successfully');
    this.fetchStudents(); // Ensure to fetch latest data
  } catch (error) {
    console.error("Error updating grade:", error);
    alert('Failed to update grade');
  }
}
  },
};
</script>