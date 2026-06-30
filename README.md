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

## Day 7
- Started with the Authuser the login user handling 
- then included the logout api 
- then call the fetch all user api to show the investors on the entrepreneur's page


### In Progress
- The dashboard is in progress 

### Issues Faced
- I was facing the issue on dashboard because in context i was setting the loading state false initially and because of this as soon i refresh the dashboard page it push me to login page
- so fixed it by setting loading state true initially when page renders it sees loading true shows loader and when loading becomes false it checks the user and then proceed
- never call state setters in component body, call always inside functions 
---

## Day 8
- First of all i, created the complete-profile page i forgot it to create early but now its created
- then i, moved to meetings first i created the create-meeting page to request meetings with investors
- called different APIs and store them in states like meetings notifications and also filtered accedpted meetings


### In Progress
- meetings and notifications functionality

### Issues Faced
- i was facing the issue on complete profile page like when user signs up it pushes to complete-profile but it first checks if the user from context hook but at that time user is not set in the hook and so user is null it again throws me to sign up page so, i set the user after registering user when user registers set the response user coming from backend to that state of contexg
---

## Day 9
- Integrated different APIs of meeting like rejecting/accepting meeting
- make changes on dashboard interface and show real data of user
- created the seperate dashboard for investor i didn't create but claude created it according to my already created dashboard for investor which i created by myself. 


### In Progress
- Next will be notifications setup and then will move to video calls and payment integration

### Issues Faced
- Nothing serious
---

## Day 10
- First of all added the login user's authorization handling on role base and pushing them to their respective dadhboards
- setup of socket io never used it before so, it was my first time experience using it 
- integrated socket in both backend and frontend and then check its working by sending simple messages


### In Progress
- Socket io is in progress still there is lot to do with it how it will work with real users

### Issues Faced
- It was a bit confusing or boring i, can say because using socket io first time so it was a bit confusing not difficult.
---

## Day 11
- Back after a bit of absense started where left it with socket created models, controllers and routes for chat messages
- connected socket with real users and meetings
- created the chat page and called the previous messages api

### In Progress
- Socket io 

### Issues Faced
- Socket io is confusing for me!
---

## Day 11
- Completed the socket working ,it is working smoothly with real time messaging 
- 

### In Progress
- Socket io

### Issues Faced
- there were lot of issues today i, wasn't handling the errors correctly which was causing problem 
- one thing learn from this always check the whole flow how its going and where the data is breaching find the cause and detect the error
---


## Day 12
- Back to work after ages i was busy with my exams now back to coding finally completed the video call using WEBRTC
- Also implemented minor changes in investor dashboard minor but important
- added the documents uploading page with view of the uploaded documents

### In Progress
- The other dashboard is in process as the investor side is completed

### Issues Faced
- Working with socket and webRTC without understanding it was really a headache for me i, didn't know a single thing about these two
- I'm still confused how it is working the code as i took the help of AI in this webRTC thing
---

## Day 13
- Completed the other remaining sections as well 
- first of all integrated stripe for transactions 
- then implemented it in both frontEnd and backend
- showed all transactions history on dasshboard
- created the about and contact pages
- changed the otp send service from resend to nodemailer because resend wasn't working

### In Progress
- Nothing is in progress for now 

### Issues Faced
- Didn't face that many issues 
---