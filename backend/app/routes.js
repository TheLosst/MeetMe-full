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

    router.get("/users/getall/:id", async (req, res) => {
      const { id } = req.params;
      try {
        const result = await pool.query(
          "SELECT id, sex, username, email, withMeets, targetMeet, targetHeight, targetFat, birthDay, aboutUser, linkToIMG FROM users WHERE id != $1", [id]
        );
          res.status(200).json(result.rows);
      } catch (error) {
        console.error(error);
        res.status(500).json({message: "Jopa"});
      }
      pool.end;
    });

    router.get("/users/get/:id", async (req, res) => {
        const { id } = req.params;
        try {
          const user = await pool.query(
            "SELECT id, sex, username, email, withMeets, targetMeet, targetHeight, targetFat, birthDay, aboutUser, linkToIMG FROM users WHERE id = $1",
            [id]
          );
          if (user.rows.length === 0) {
            res.status(404).json({message: "Пользователь не найден"});
            return;
          }
          res.status(200).json(user.rows[0]);
        } catch (error) {
          console.error(error);
          res.status(500).json({message: "Произошла ошибка при получении данных пользователя"});
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

          const insertQuery = `INSERT INTO users (${userColumns.join(', ')}) VALUES (${placeholders.join(', ')}) RETURNING id, username`;

          const result = await pool.query(insertQuery, values);
          const userData = result.rows[0];

          const response = {
            id: userData.id,
            username: userData.email,
            message: 'Success'
          };

          res.status(201).json(response);
          console.log(response);
        } catch (error) {
          console.error(error);
          res.status(500).json({message: "Internal Server Error"});
        } finally {
          pool.end;
        }
    });
    
    router.post("/users/login", async (req, res) => {
        const { email, password } = req.body;

        try {
          const result = await pool.query(
            "SELECT id, sex, username, email, withMeets, targetMeet, targetHeight, targetFat, birthDay, aboutUser, liked, linkToIMG FROM users WHERE email = $1 AND password = $2", [email, password]
          );
          if (result.rows.length === 1) {
            res.status(200).json(result.rows[0])
          }else{
            res.status(401).json({message: "Error in login or pass"})
          }
        } catch (error) {
          console.error(error);
          res.status(500).json({message: "Internal Server Error"});
        }
        pool.end;
    });

    router.delete("/users/delete/:id", async (req, res) => {
      const { id } = req.params;
      try{ 
        const user = await pool.query("WITH target_users AS (DELETE FROM users WHERE id = $1 RETURNING id) DELETE FROM messages WHERE from_id IN (SELECT id FROM target_users) OR to_id IN (SELECT id FROM target_users)", [id])
        console.log(user.rows);
        res.status(204).json({message: "Removed"});
      } catch (error) {
        console.error(error);
        res.status(500).json({message: "Произошла ошибка при удалении данных"});
      }
      pool.end;
    });

    router.put("/users/passchange/:id", async (req, res) => {
      const { id } = req.params;
      const { newpass } = req.body; // Assuming password is sent in the request body

      try {
        const result = await pool.query(
          "UPDATE users SET password = $1 WHERE id = $2",
          [newpass, id]
        );
    
        if (result.rowCount === 0) {
          return res.status(404).json({message: "User not found"}); // Handle user not found
        }
    
        res.status(200).json({message: "Password changed successfully"});
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
      }
      pool.end;
    });

    router.put("/users/edit/:id", async (req, res) => {
      const { id } = req.params;
      const { username, birthDate, withMeets, targetMeet, about, link, sex, targetHeight, targetFat } = req.body;
      try {
        const result = await pool.query("UPDATE users SET username = $1, birthDay = $2, withMeets = $3, targetMeet = $4, aboutUser = $5, linkToImg = $6, sex = $7, targetHeight = $8, targetFat = $9 WHERE id = $10", 
        [username,birthDate,withMeets,targetMeet,about,link,sex,targetHeight,targetFat,id]
      );
        if (result.rowCount === 0) {
          return res.status(404).json({message: "User not found"});
        }
        res.status(200).json({message: "User information updated successfully"});
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
      }
      pool.end;
    });

    router.post("/messages/send", async (req, res) => {
      const {from_id,to_id,text} = req.body;
      try {
        const checkUser = await pool.query("SELECT * FROM users WHERE id = $1", [to_id]);
        if (checkUser.rowCount === 0){
          return res.status(404).json({message: "User not found"});
        }
        if (from_id === to_id){
          return res.status(418).json({message: "NO"});
        }
        const result = await pool.query("INSERT INTO messages (from_id,to_id,text) VALUES($1,$2,$3) RETURNING mid", 
        [from_id,to_id,text]);
        res.status(200).json({message: "Message sended"});
      } catch(error){
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
      }
      pool.end;
    });

    router.get("/messages/getallforlist/:id", async (req, res) => {
      const { id } = req.params;
    
      try {
        const result = await pool.query("SELECT DISTINCT to_id AS id FROM messages WHERE (to_id = $1 or from_id = $1)", [id]);
        if (!result.rows.length) {
          // No messages found, send a specific message or empty array
          return res.status(200).json({ message: "No list of messages found for this user." });
        }
        // for (let i = 0; i < result.rows.length; i++) {
        //   if (result.rows[i].id === id) {
        //     result.rows.splice(i, 1); // Remove the current user's id from the array
        //     break; // No need to continue iterating after removing the id
        //   }
        // }
    
        res.status(200).json(result.rows);
      } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ message: "Internal server error" });
      }
      pool.end;
    }); // Возвращает список уникальных id пользователей, которые получали или отправляли сообщение активному пользователю

    router.post("/messages/getbetweenuser", async (req, res) => { //
      const {user_id,to_id} = req.body;
      try{
        const readedMessages = await pool.query("UPDATE messages SET is_read = true WHERE (from_id = $2 AND to_id = $1) RETURNING is_read", [user_id,to_id])
        const result = await pool.query("SELECT * FROM messages WHERE (from_id = $1 AND to_id = $2) OR (from_id = $2 AND to_id = $1) ORDER BY clock ASC;", 
      [user_id,to_id]);
      if (!result.rows.length) {
        return res.status(200).json({ message: "No messages found for this user." });
      }
      if(readedMessages){
        res.status(200).send(result.rows);
      } else { 
        res.status(409).json({ message: "BD приняло ислам" });
      }
      }catch(error){
        console.error("Error fetching messages:", error);
        res.status(500).json({ message: "Internal server error" });
      }
      pool.end;
    }) //Возвращает список сообщений между двумя пользователями.

module.exports = router;