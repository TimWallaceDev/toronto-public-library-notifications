# Toronto Public Library Notifications

This script is used to receive email notifications when your account has books ready for pickup, books in transit (almost ready for pickup), overdue books, or books that are due back soon. 

## Prerequisites

- You will need to have git installed, or download the file and unzip from github
- node installed
- npm installed
- a Zoho email account

## usage

1. Clone this repo with git, or download the files and unzip them. You can clone this repo in terminal by typing `git clone https://github.com/TimWallaceDev/toronto-public-library-notifications`

2. Switch into this directory. In the terminal type `cd toronto-public-library-notifications`

3. In the terminal, install the required packages. You can accomplish this by typing `npm i`

4. rename the .envSample to .env and add your credentials

5. You can select which checks you would like in the .env by changing the values from false to true. 

6. If on linux, open the crontab using `crontab -e
`

7. Add a new line to the cron tab to schedule your JavaScript script to run. You'll use Node.js to execute the script. The format for the cron job is as follows: `minute hour * * * node /path/to/your/script/index.js`

8. Save and exit the cron tab editor.

