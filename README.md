# Nexus Platform

## Project Overview

Nexus is an Investor & Entrepreneur collaboration platform where users can schedule meetings, conduct video calls, upload documents, and manage investment interactions securely.

---


# Daily Progress Log

## Day 1
- connected to mongodb
- created the user schema controllers and routes
- also implemented token blacklistToken and middleware
- tested APIs in postman
- configured cloudinary and multer for file handling

### In Progress
-  profile handling 

### Issues Faced
- handling two diff users with different fields

---


## Day 2
- created the profileComplete controller and tested it successfully
- also created the model of meeting and notifications
- created 5 controllers meeting and also include the relevant notifications in the response and link them to the specific user


### In Progress
- didn't tested the APIs of meeting yet only one endpoint is tested successfully

### Issues Faced
- it was a bit overwhelming when linking meetings and notifications and updating status and adding checks if it is the valid user

---

## Day 3
- Created the models of documents and payment completed the controllers of documents section 
- Coded all three controllers and routes

### In Progress
- The payment thing is not completed yet instead I, haven't even touch it yet will come back to it later

### Issues Faced
- This part was the most difficult thing to do 
- in the whole backend process ,the toughest part
- was when I,had to link the documents with their scheduled meetings it was really a tough thing for me I,took the help from Ai in the process because I,was facing issues so that's it for now.   

---

## Day 4
- Moved to FrontEnd after completing and testing all the controllers and APIs.
- Created the SignUp and LogIn page in React and in form also added the react-hook-form validation and 
- Also implemented the showPassword eye icon and configured the cors in the backend to allow the frontend origin.
- After creating the pages integrated then with backend and call APIs and tested them.

### In Progress
- Nothing is in progress for now but there is a lot to do.

### Issues Faced
- Didn't face any issues because this was the easiest thing to do there is no rocket science in this.
---

## Day 5
- Today was really a productive day as i learn a lot of new things today
- first of all i implemented the 2FA/MFA whatever you call it after user logs in we send a verification otp to its email which user gets and then verifies 
- i added the fields in user model and created the otp controllers changed the login controller which was generating token after verifying email and password in db but now it will generate the token after verfying the otp
- I used resend library to send email to user its free and easy to use
- After this i also implemented the forgot password thing created its contollers and added its fields in user model i used crypto module for generating the token and again resend to send the reset link
- in reset controller it first verifies the token if its valid or not then proceeds
- also created the pages of otp-verification and forgot password and integrated the APIs

### In Progress
- The reset password is yet to complete, its backend is complete but still have to create its frontend page.

### Issues Faced
- There were no big issues but there was learning.
---

## Day 6
- Today I completed the remaining setup for forgot password completed its backend and the frontend page and integrated its API 
- Then i started the core part of this project the dashboard i created its left sidebar of the ui added specific icons and links

### In Progress
- The dashboard is in progress

### Issues Faced
- No issues faced for today
---

## Day 7
- Today started from where i left the dashboard yesterday.completed the main section of dashboard
- then created the context API to store the login user and use it in different pages


### In Progress
- Now i have to call different APIs on that dashboard page show the data.

### Issues Faced
- No issues
---