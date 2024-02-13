import { CronJob } from "cron";
import { get_data } from "./db.js";

const job = new CronJob(
  "* * * * * *", // cronTime "Sec, Min, Hour, Day of Month, Month, day of Week"
  function () {
    // console.log("deleteHomework"); //
    get_data("deleteHomework", []).then(async (resolve) => {
        // console.log(resolve);
    });
  }, // onTick
  null, // onComplete
  true, // start
  "Asia/Krasnoyarsk" // timeZone
);
export { job };
