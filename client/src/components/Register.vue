<template>
    <!-- register.ejs -->


    <html class="h-full bg-white">
        <body class="h-full">
          <div class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div class="sm:mx-auto sm:w-full sm:max-w-sm">
                <img class="mx-auto h-28 w-auto" src="../assets/dla.svg" alt="Your Company" />
              <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Sign up to your account</h2>
            </div>

  

            <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
              <form class="space-y-6" action="http://localhost:8080/api/users/register" method="POST">
                <div>
                    <label for="fname" class="block text-sm font-medium leading-6 text-gray-900">First Name</label>
                    <div class="mt-2">
                      <input id="fname" name="fname" type="text" autocomplete="given-name" required="" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-5" />
                    </div>
                  </div>
                  <div>
                    <label for="mname" class="block text-sm font-medium leading-6 text-gray-900">Middle Name</label>
                    <div class="mt-2">
                      <input id="mname" name="mname" type="text" autocomplete="additional-name" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-5" />
                    </div>
                  </div>
                  <div>
                    <label for="lname" class="block text-sm font-medium leading-6 text-gray-900">Last Name</label>
                    <div class="mt-2">
                      <input id="lname" name="lname" type="text" autocomplete="family-name" required="" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-5" />
                    </div>
                  </div>
                <div>
                  <label for="username" class="block text-sm font-medium leading-6 text-gray-900">Username</label>
                  <div class="mt-2">
                    <input id="username" name="username" type="text" autocomplete="username" required="" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-5" />
                  </div>
                </div>
                
                <div>
                  <label for="email" class="block text-sm font-medium leading-6 text-gray-900">E-mail</label>
                  <div class="mt-2">
                    <input id="email" name="email" type="email" autocomplete="email" required="" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-5" />
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
                  <label for="role" class="block text-sm font-medium leading-6 text-gray-900">Select your role</label>
                  <div class="mt-2">
                    <select id="role" name="role" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
                      <option value="student">Student</option>
                      <option value="instructor">Instructor</option>
                    </select>
                  </div>
                </div>
      
                <div>
                    <button type="submit" class="flex w-full justify-center rounded-md bg-black px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Sign up</button>
                </div>
                <div>
                    <a href="/login" class="font-semibold text-indigo-600 hover:text-indigo-500">Sign in instead</a>
                  </div>
              </form>
            </div>
          </div>
        </body>
      </html>
      
    </template>
    <script>
    export default {
  name: 'Register'

}
    </script>