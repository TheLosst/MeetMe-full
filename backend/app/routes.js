const
    { Pool } = require("pg");
    express = require("express"),
    router = express.Router();
    pool = new Pool({
        user: "myuser",
        host: "postgres",
        database: "mydb",
        password: "mysecretpassword",
        port: 5432,
        });

    router.get("/users/getall", async (req, res) => {
      try {
        const result = await pool.query(
          "SELECT uuid, sex, username, email, withMeets, targetMeet, targetHeight, targetFat, birthDay, aboutUser, linkToIMG FROM users"
        );
          res.status(200).send(result.rows);
      } catch (error) {
        console.error(error);
        res.status(500).send("Jopa");
      }
      pool.end;
    });

    router.get("/users/get/:uuid", async (req, res) => {
        const { uuid } = req.params;
        try {
          const user = await pool.query(
            "SELECT uuid, sex, username, email, withMeets, targetMeet, targetHeight, targetFat, birthDay, aboutUser, linkToIMG FROM users WHERE uuid = $1",
            [uuid]
          );
          if (user.rows.length === 0) {
            res.status(404).send("Пользователь не найден");
            return;
          }
          res.status(200).json(user.rows[0]);
        } catch (error) {
          console.error(error);
          res.status(500).send("Произошла ошибка при получении данных пользователя");
        }
        pool.end;
    });

    router.post("/users/register", async (req, res) => {
        const { username, password, sex, email, withMeets, targetMeet, targetHeight, targetFat, birthDay } = req.body;

        try {
          // const hashedPassword = await hashPassword(password);
          const userColumns = ['username', 'password', 'sex', 'email', 'withMeets', 'targetMeet', 'targetHeight', 'targetFat', 'birthDay'];
          const placeholders = userColumns.map((_, index) => `$${index + 1}`);
          const values = [username, password, sex, email, withMeets, targetMeet, targetHeight, targetFat, birthDay];

          const insertQuery = `INSERT INTO users (${userColumns.join(', ')}) VALUES (${placeholders.join(', ')}) RETURNING uuid, username`;

          const result = await pool.query(insertQuery, values);
          const userData = result.rows[0];

          const response = {
            uuid: userData.uuid,
            username: userData.username,
          };

          res.status(201).json(response);
          console.log(response);
        } catch (error) {
          console.error(error);
          res.status(500).send("Internal Server Error");
        } finally {
          pool.end;
        }
    });
    
    router.post("/users/login", async (req, res) => {
        const { email, password } = req.body;

        try {
          const result = await pool.query(
            "SELECT uuid, sex, username, email, withMeets, targetMeet, targetHeight, targetFat, birthDay, aboutUser, liked, linkToIMG FROM users WHERE email = $1 AND password = $2", [email, password]
          );
          if (result.rows.length === 1) {
            res.status(200).json(result.rows[0])
          }else{
            res.status(401).send("Error in login or pass")
          }
        } catch (error) {
          console.error(error);
          res.status(500).send("Internal Server Error");
        }
        pool.end;
    });

    router.delete("/users/delete/:uuid", async (req, res) => {
      const { uuid } = req.params;
      try{ 
        const user = await pool.query("WITH target_users AS (DELETE FROM users WHERE uuid = $1 RETURNING uuid) DELETE FROM messages WHERE from_uuid IN (SELECT uuid FROM target_users) OR to_uuid IN (SELECT uuid FROM target_users)", [uuid])
        res.status(204).send("Removed");
      } catch (error) {
        console.error(error);
        res.status(500).send('Произошла ошибка при удалении данных');
      }
      pool.end;
    });

    router.put("/users/passchange/:uuid", async (req, res) => {
      const { uuid } = req.params;
      const { newpass } = req.body; // Assuming password is sent in the request body

      try {
        const result = await pool.query(
          "UPDATE users SET password = $1 WHERE uuid = $2",
          [newpass, uuid]
        );
    
        if (result.rowCount === 0) {
          return res.status(404).send("User not found"); // Handle user not found
        }
    
        res.status(200).send("Password changed successfully");
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
      }
      pool.end;
    });

    router.put("/users/edit/:uuid", async (req, res) => {
      const { uuid } = req.params;
      const { username, birthDate, withMeets, targetMeet, about, link, sex, targetHeight, targetFat } = req.body;
      try {
        const result = await pool.query("UPDATE users SET username = $1, birthDay = $2, withMeets = $3, targetMeet = $4, aboutUser = $5, linkToImg = $6, sex = $7, targetHeight = $8, targetFat = $9 WHERE uuid = $10", 
        [username,birthDate,withMeets,targetMeet,about,link,sex,targetHeight,targetFat,uuid]
      );
        if (result.rowCount === 0) {
          return res.status(404).send("User not found");
        }
        res.status(200).send("User information updated successfully");
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
      }
    });

module.exports = router;