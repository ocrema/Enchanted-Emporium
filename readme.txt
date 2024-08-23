To run the server, you must install XAMMP and Node.js

1. Download XAMMP at https://www.apachefriends.org/download.html
2. Configure MySQL to use port 3307, then start apache and MySQL
3. Click admin next to MySQL to go to phpMyAdmin
4. Import the site-db.sql file in the backend folder (edit this file to properly import the images)
5. Add an account with username "testuser" and password "testuser" with all permissions
6. Open the command console and navigate to the backend folder directory
7. Run the following commands:
npm init –y
npm i express nodemon mysql cors
8. Open the newly created package.json
9. Add a comma after the existing line within "scripts" and add the line 
"start": "nodemon index.js"
10. Return to the console and enter 
npm start
11. Now go to the frontend folder and open page.html

For more detail, most of this follows this tutorial:
https://drive.google.com/file/d/17RiZO5v9b_qEvY01Xbv7loeWUyICNlfl/view?usp=sharing