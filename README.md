## Instructions to student.

This repository contains the starting code for the follow-up exam to assignment one of Distributed Systems. You are required to take the following steps in preparation for this exam:

+ Clone this repository.
+ Import the project into VS Code and run the commands:
~~~bash
$ npm install
$ npm run schema
~~~
+ Create a new repository in your GitHub account called 'serverlessExam'.
+ In VS Code, type the following commands:
~~~bash
$ git remote remove origin
$ git remote add origin ...URL of your new repository...
~~~
+ Deploy the app (cdk deploy)

The app you have deployed is the REST web API you developed in the labs. However, two new DynamoDB tables are included:
MovieAwards - It stores information about awards won by a movie, e.g. Oscars, Golden Globe, etc
Movie Crew - It stores data about the crew associated with a movie, e.g. director, cameras, producer, etc

Examine these two tables in the DynamoDB management console. Then, in VS Code, examine all aspects of the code that created these tables. __Do not change the code.__

When you have fully understood the app's new features, destroy the stack.

Finally, the day before the exam, deploy the app again and leave it deployed. 
