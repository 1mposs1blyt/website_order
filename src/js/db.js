import sqlite from "sqlite3";

async function get_data(query, data_query) {
  let db = new sqlite.Database("exercises.db", (err) => {
    if (err) {
      console.error(err.message);
    } else {
      // console.log("connect to db complete!");
    }
  });
  let sql_queries = {
    subjects: "SELECT * FROM subjects",
    users: `SELECT * FROM users`,
    Dashboard: `SELECT * FROM users WHERE type LIKE ?`,
    FindUser: `SELECT * FROM users WHERE id LIKE ?`,
    FindUserByType: `SELECT * FROM users 
    WHERE
    type LIKE ?
    AND
    groop LIKE ?
    ORDER BY score DESC`,
    addScore: `UPDATE users SET score = (score+?) WHERE id LIKE ?`,
    FindScore: `SELECT score FROM users WHERE id LIKE ?`,
    auth: `SELECT * FROM users WHERE login LIKE ?`,
    homeworksAdmin: `SELECT * FROM homeworks`,
    homeworks: `SELECT * FROM homeworks WHERE groop LIKE ? ORDER BY expires_in ASC`,
    homeworkComplit1: `SELECT completedhomeworks FROM users WHERE id LIKE ?`,
    homeworkComplit2: `UPDATE users SET completedhomeworks = (?) WHERE id LIKE ?`,
    // homeworkComplit1: `UPDATE users SET completedhomeworks = (?) WHERE id LIKE ?`,
    newHomework: `INSERT INTO homeworks (image,cardtitle,cardtext,href,expires_in,groop,created_at)  VALUES (?,?,?,?,?,?,datetime('now','localtime'))`,
    deleteHomework: `DELETE FROM homeworks WHERE created_at < datetime('now',  expires_in)`,
    deleteHomeworkById: `DELETE FROM homeworks WHERE id LIKE ?`,
  };
  let sql = sql_queries[query];

  //let sql = "SELECT * FROM users";

  let promise = new Promise((resolve, reject) => {
    db.all(sql, data_query, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });

  let data = await promise;
  db.close();
  return data;
}
// get_data("all", []).then((resolve) => {});

export { get_data };
