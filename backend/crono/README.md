# Crono Module

The crono module is a module of the backend server that allows to schedule jobs to be executed at a certain time repeatedly.

The module is run in a different process from the rest of the server, so it is not affected by the rest of the server.

To mantain the isolation between the crono module and the rest of the server, the crono module also uses a dedicated database connection and SMTP connection.

This means that, if the crono module crashes for some reason, the rest of the server will continue to work correctly.

Finally, the crono module assures that the same job is executed only once at the same time.

So, if a job is scheduled to be executed every 5 minutes, and the job takes 10 minutes to be executed, it won't be executed again until the previous execution has finished.

## Create a new job

All the jobs are located in the `jobs` folder.

To create a new job, first of all, create a new javascript file in the `jobs` folder.

The name of the file will be the name of the job.

Two things must be specified for a new jon:
- The schedule of the job: The schedule is a string that specifies when the job must be executed. The format of the string is the same as the format of the cron jobs. You can find more information about the format [here](https://www.npmjs.com/package/node-cron#cron-syntax).
- The function that will be executed when the job is run.

Then, create a class that extends the `CronoJob` class.

```javascript
const CronoJob = require('../CronoJob');

class MyJob extends CronoJob {
    /**
     * This method must return the schedule of the job as a string.
     * @returns {string}
     */
    get schedule() {
        return '* * * * * *';
    }

    /**
     * This function is executed when the job is run.
     */
    async run() {
        // Do something
    }
}
```