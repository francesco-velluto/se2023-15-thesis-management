"use strict";

const dayjs = require("dayjs");
const db = require("./db");

const formatString = "YYYY-MM-DD";

/**
 * Get the current virtual date from database
 *
 * @returns {Promise<String>} Current virtual date in ISO format "YYYY-MM-DD"
 *
 * @throws {Error} - If there was some error in the database.
 */
exports.getVirtualDate = async () => {
  try {
    const { rows } = await db.query(
      "SELECT value FROM virtual_clock WHERE name = 'virtual_date';"
    );
    return { data: dayjs(rows[0]).format(formatString) };
  } catch (err) {
    console.error(
      "[BACK-END ERROR]: Error in service function getVirtualDate.",
      err
    );
    throw err;
  }
};

/**
 * Update the current virtual date.
 * The date can only go forwards, so the function returns an error if
 * the new date is before the current one.
 *
 * @param {String | Date} newDate
 * - New virtual date
 * - Format: Date object or string in ISO format
 *
 * @returns {Promise<String>} New current virtual date in ISO format "YYYY-MM-DD"
 *
 * @throws {Error} - If there was some error in the database.
 */
exports.updateVirtualDate = async (newDate) => {
  try {
    const { rows, rowCount } = await db.query(
      "UPDATE virtual_clock SET value = $1 WHERE name = 'virtual_date' AND value < $1 RETURNING value;",
      [dayjs(newDate).format(formatString)]
    );
    if (rowCount === 0)
      throw Error("New virtual date can't be before the current one!");

    return { data: dayjs(rows[0]).format(formatString) };
  } catch (err) {
    console.error(
      "[BACK-END ERROR]: Error in service function getVirtualDate.",
      err
    );
    throw err;
  }
};
