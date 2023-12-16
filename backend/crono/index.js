const cron = require('node-cron');
const db = require("./service/db");
const dotenv = require('dotenv')
const fs = require("fs");
const path = require('path');

const cronologsService = require('./service/cronologs.service');
const CronoJob = require('./CronoJob');

const currentModulePath = __dirname;
const jobsFolderPath = path.join(currentModulePath, 'jobs');

dotenv.config({ path: '../../../.env' });

console.info('[CRONO-MODULE] Starting crono process');
console.info('[CRONO-MODULE] Connecting to Postgres database at ' + process.env.DB_HOST + ':5432');

let runningJobs = {};

db.connect()
    .then(() =>  {
        console.info('[CRONO-MODULE] Database connection established');

        // inform the main server process that the crono process is ready
        process.send('crono-ready');

        /**
         * Each job to be run by the crono process is represented by a file in the jobs' folder.
         * The file name is the job name.
         */
        console.info('[CRONO-MODULE] Setting up jobs from jobs folder');
        fs.readdir(jobsFolderPath, (err, files) => {
            if (err) {
                console.error('[CRONO-MODULE] Error reading jobs folder', err.stack);
                process.exit(1);
            }

            files.forEach(file => {
                let jobName = file.split('.')[0];
                let job = require('./jobs/' + jobName);

                console.info('[CRONO-MODULE] Setting up job ' + jobName);

                let jobInstance = new job();

                // check if it is an instance of CronoJob
                if (!(jobInstance instanceof CronoJob)) {
                    // simply skip this job without throwing an error
                    console.error('[CRONO-MODULE] Error in instantiating job ' + jobName + ': it must be an instance of CronoJob');
                } else {
                    // check if the job is ready to run
                    if (!jobInstance.isReady) {
                        // simply skip this job without throwing an error
                        console.error('[CRONO-MODULE] Error in instantiating job ' + jobName + ': it is not ready to run');
                    } else {
                        // the job is ready to run
                        runningJobs[jobName] = false;
                        console.info('[CRONO-MODULE] Job ' + jobName + ' instantiated successfully and ready to run');

                        // schedule the job
                        cron.schedule(jobInstance.schedule, async function () {
                            // check if the job is already running
                            if (runningJobs[jobName] && runningJobs[jobName] === true) {
                                console.info('[CRONO-MODULE][' + jobName + '] Job skipped: already running');
                                await cronologsService.insertNewCronoLog(jobName, "Skipped", {reason: "Job is already running"});
                                return;
                            }

                            runningJobs[jobName] = true;

                            let startDateTime = new Date();
                            console.info('[CRONO-MODULE][' + jobName + '] Job started at ' + startDateTime.toISOString());

                            await cronologsService.insertNewCronoLog(jobName, "Start", undefined);
                            try {
                                let details = await jobInstance.run();
                                await cronologsService.insertNewCronoLog(jobName, "Success", details);
                            } catch (error) {
                                console.error('[CRONO-MODULE][' + jobName + '] Error running job', error.stack);
                                await cronologsService.insertNewCronoLog(jobName, "Error", {error: error.message});
                            }

                            let endDateTime = new Date();
                            console.info('[CRONO-MODULE][' + jobName + '] Job ended at ' + endDateTime.toISOString());

                            runningJobs[jobName] = false;
                        });
                    }
                }
            });
        });
    })
    .catch(err => {
        console.error('[CRONO-MODULE] Error connecting to database', err.stack);
        process.exit(1);
    });