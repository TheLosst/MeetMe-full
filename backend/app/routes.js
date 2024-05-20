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
          "SELECT uuid, login FROM users"
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
            "SELECT uuid, login FROM users WHERE uuid = $1",
            [uuid]
          );
          if (user.rows.length === 0) {
            res.status(404).send("Пользователь не найден");
            return;
          }
          const userData = user.rows[0];
          const response = {
            uuid: userData.uuid,
            login: userData.login,
          };
          res.status(200).json(response);
        } catch (error) {
          console.error(error);
          res.status(500).send("Произошла ошибка при получении данных пользователя");
        }
        pool.end;
      });

      router.post("/users/add", async (req, res) => {
        const { login, password } = req.body;
        try {
            const checkuser = await pool.query("SELECT uuid FROM users WHERE login = $1", [login]);
            if (checkuser.rows.length === 0) {
            const result = await pool.query(
                "INSERT INTO users (login, password) VALUES ($1, $2) RETURNING login", [login, password]
            );
            const userData = result.rows[0];
            const response = {
              uuid: userData.uuid,
              login: userData.login,
            };
            res.status(201).json(response);
            console.log(response);
            } else {
              console.error("User creation failed");
              res.status(400).send("Failed to create user"); 
            }
        } catch (error) {
            console.error(error);
            res.status(500).send("Jopa");
        }
        pool.end;
      });
    
//     .post("/add", (req, res) => {
//     const { login, password } = req.body;
//     try{
//         const result = pool.query(
//             "INSERT INTO users (login, password) VALUES ($1, $2) RETURNING uuid, login", [login, password]
//         );
//         res.status(201).json(result.rows[0]);
//     } catch (e) {
//         console.error(e);
//         res.status(500).send("Jopa");
//     }
//     })
//     // .put((req, res) => {...})
//     // .delete((req, res) => {...});

module.exports = router;