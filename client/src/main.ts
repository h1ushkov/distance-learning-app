// main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // Убедитесь, что путь к вашему файлу router.js правильный
import './style.css'
const app = createApp(App);
app.use(router);

app.mount('#app');

