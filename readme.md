# Recreation.gov Going to the Sun Road Web Scraper

### Steps to yeet this sucker

1. Clone Repo to local machine using command `git clone`
2. Open project with IDE of your choice
3. Run command `npm install` to install project dependencies
4. Copy `.sample.env` contents and create new file in base directory called `.env`
5. Modify contents in `.env` to use real values
6. Run command `npm start` to start project!
7. Sit back, relax, and wait for those tickets to pop up 

### Noteworthy items: 
- If you want to edit, remove, or add certain dates, make sure to match the date format found on lines 20-26 in controller.js
- As of right now, this project is set to hit the recreation.gov site every 10 seconds
- For more information about the 3rd party email service used, see this site: https://nodemailer.com/about/
   - If you use gmail as your sender address, you'll need to disable a security setting in your gmail account detailed here: https://nodemailer.com/usage/using-gmail/
