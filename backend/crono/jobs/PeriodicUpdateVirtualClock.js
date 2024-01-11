const CronoJob = require('../CronoJob');

const { getVirtualDate, updateVirtualDate } = require("../../service/virtualclock.service");
const dayjs = require('dayjs');


class PeriodicUpdateVirtualClock extends CronoJob {
    /**
     * The schedule for the job to run.
     * The job will run every day at midnight.
     *
     * @returns {string} The schedule for the job to run.
     */
    get schedule() {
        return '0 0 0 * * *';
    }

/**
     * The function that will be run by the job.
     
     */
    async run() {
        try{
            let newDate = dayjs().format("YYYY-MM-DD");
            const { data: virtualDate } = await updateVirtualDate(newDate);

            console.info("[CRONO-MODULE][PeriodicUpdateVirtualClock] New virtual clock date: " + newDate);

            return data;

        }catch(e) {
            console.error("[CRONO-MODULE][PeriodicUpdateVirtualClock] Error in run of the job: " + e.message);
            throw e;
        }
    }
}



module.exports = PeriodicUpdateVirtualClock;