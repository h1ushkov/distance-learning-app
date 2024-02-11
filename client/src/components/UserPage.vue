<!-- UserPage.vue -->
<template>
    <div v-if="user" class="h-screen dark:bg-gray-700 bg-gray-200 pt-12">

        <!-- Card start -->
            <div class="max-w-sm mx-auto bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-lg">
                <div class="border-b px-4 pb-6">
                    <div class="text-center my-4">  
                        <div class="py-2">
                            <h3 class="font-bold text-2xl text-gray-800 dark:text-white mb-1">{{ user.fname }} {{ user.mname }} {{ user.lname }}</h3>
                            <div class="inline-flex text-gray-700 dark:text-gray-300 items-center">
 
                            {{ user.role }}
                          @{{ user.username }}
                            </div>
                        </div>
                    </div>
                    <div class="flex gap-2 px-2">
                        <button
                            class="flex-1 rounded-full border-2 border-gray-400 dark:border-gray-700 font-semibold text-black dark:text-white px-4 py-2">
                            Message
                        </button>
                    </div>
                    
                </div>
        
            </div>
        <!-- Card end -->
    
    </div>
    <div v-else>
        <p>user not found...</p>
      </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  import { useRoute } from 'vue-router'; // Import useRoute
  
  export default {
    name: 'UserPage',
    setup() {
      const route = useRoute(); // Use useRoute to get route information
      const userName = route.params.userName; // Access params from the route
      const user = ref(null);
  
      const fetchUserDetails = async () => {
        try {
          const response = await axios.get(`http://localhost:8080/api/users/u/${userName}`);
          user.value = response.data;
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      };
  
      onMounted(() => {
        fetchUserDetails();
      });
  
      return {
        user,
      };
    },
  };
  </script>
  