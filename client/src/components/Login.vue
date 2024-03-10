<template>
  <html class="h-full bg-white">
  <body class="h-full">
  <div class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <img class="mx-auto h-28 w-auto" src="../assets/logo.svg" alt="Your Company" />
      <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Sign in to your account</h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form class="space-y-6" action="http://localhost:8080/api/users/login" method="POST">
        <div>
          <label for="username" class="block text-sm font-medium leading-6 text-gray-900">Username</label>
          <div class="mt-2">
            <input id="username" name="username" type="username" placeholder="@Username" autocomplete="username" required="" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-5" />
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between">
            <label for="password" class="block text-sm font-medium leading-6 text-gray-900">Password</label>
          </div>
          <div class="mt-2">
            <input id="password" name="password" type="password" autocomplete="current-password" required="" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-5" />
          </div>
        </div>

        <div>
          <button type="submit" class="flex w-full justify-center rounded-md bg-black px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Sign in</button>
        </div>
        <div>
          <a href="/register" class="font-semibold text-indigo-600 hover:text-indigo-500">Sign up instead</a>
        </div>
      </form>
    </div>
  </div>
  </body>
  </html>
</template>



<script>
import axios from 'axios';
import Cookies from 'js-cookie';

export default {
  name: 'Login',
  data() {
    return {
      username: '',
      password: '',
    };
  },
  methods: {
    async handleSubmit() {
      try {
        const response = await axios.post('http://localhost:8080/api/users/login', {
          username: this.username,
          password: this.password,
        });

        // Assuming your API returns an accessToken
        const accessToken = response.data.accessToken;

        // Store accessToken in a cookie with a specific name
        Cookies.set('accessToken', accessToken, { expires: 7 });  // Adjust the expiration as needed
        Cookies.set('accessToken', accessToken, { secure: true });
        // Redirect to a protected route after successful login
        this.$router.push('/dashboard');
      } catch (error) {
        console.error('Login failed:', error);
        // Handle login error if needed
      }
    },
  },
};
</script>
