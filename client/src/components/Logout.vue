<template>
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Logout</title>
  </head>
  <body>
  <h1>Logout</h1>
  <p>Are you sure you want to logout?</p>
  <form @submit.prevent="handleLogout">
    <button type="submit">Logout</button>
  </form>
  </body>
  </html>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Logout',
  methods: {
    async handleLogout() {
      try {
        // Make a request to the server to perform logout actions
        await axios.post('http://localhost:8080/api/users/logout');

        // Clear the access token and session cookie on the client side
        this.clearCookies();

        // Redirect to the login page or any other desired page
        this.$router.push('/login');
      } catch (error) {
        console.error('Logout failed:', error);
        // Handle logout error if needed
      }
    },
    clearCookies() {
      // Clear the access token cookie
      document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

      // Clear the session cookie (connect.sid)
      document.cookie = 'connect.sid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    },
  },
};
</script>
