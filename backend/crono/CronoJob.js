/**
 * This file defines the interface that all crono jobs must implement.
 * All crono jobs must be placed in the jobs folder and implement the interface defined here.
 */
class CronoJob {
    /**
     * Flag that indicates if the job is ready to run.
     * @type {boolean}
     */
    isReady = false;

    /**
     * Create a new instance of a Crono Job.
     */
    constructor() {
        if(this.constructor === CronoJob) {
            throw new Error('CronoJob is an abstract class and cannot be instantiated directly');
        } else {
            this.isReady = true;
        }
    }

    /**
     * The schedule for the job.
     *
     * @returns {string} The schedule for the job.
     */
    get schedule() {
        throw new Error('You must implement the schedule getter');
    }

    /**
     * The function that runs the job.
     */
    async run() {
        throw new Error('You must implement the run method');
    }
}

module.exports = CronoJob;