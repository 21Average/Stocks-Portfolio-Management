# capstone-project-3900-w16a-stock-overflow
capstone-project-3900-w16a-stock-overflow created by GitHub Classroom

Since we do not have a deployed instance of our application, the method to use our app is to run in your environment.

After pulling our project from Github, in order to run our Application. you need to follow the following steps:

### For Database:
  **The system requires PostgreSQL installed.**
  
  * Install PostgreSQL in your local environment, and make sure the pgAdmin is selected when Install postgreSQL.
  (link for Install PostgreSQL: https://www.enterprisedb.com/downloads/postgres-postgresql-downloads)
  
  * If you are a MacOS user, Go into the ‘capstone-project-3900-w16a-stock-overflow’ folder, run psql postgres < setup_db.sql
  
  * If you are a Windows user, Please watch this video: https://www.youtube.com/watch?v=qpOTEEbwEIc
  
          * Create a user name: postgres3900 with password: 1234, Give it permission.
          * Create a database name: comp3900, and set owner to postgres3900


### For Backend Server
  * Install Python 3.8.3 in your local environment
  (Link: https://www.python.org/downloads/release/python-383/)
  
  * Go to the path: **‘capstone-project-3900-w16a-stock-overflow/backend/comp3900_stockoverflow/stocks’**, unzip the **saved_model.zip**,Make sure the save path is **‘capstone-project-3900-w16a-stock-overflow/backend/comp3900_stockoverflow/stocks’**
  
  * Go into the **‘capstone-project-3900-w16a-stock-overflow’** folder, and ```pip install -r requirements.txt ```
  
  * Go into the **‘capstone-project-3900-w16a-stock-overflow/backend/
comp3900_stockoverflow/stocks’** folder, and run '''pip install -r requirement.txt```

  * go to the path **‘backend/comp3900_stockoverflow’** , and run ```python manage.py makemigrations```
  * Run '''python manage.py migrate'''
  * Run '''python manage.py runserver'''
  * The backend will run on http://127.0.0.1:8000/


### For Frontend Server

  * Install node.js in your local environment.
    (Link: https://nodejs.org/en/)
  * Go to the path  *‘capstone-project-3900-w16a-stock-overflow/frontend’*, and first run ```npm i```, then run ```npm start```
  * the frontend will run on http://127.0.0.1:3000/






