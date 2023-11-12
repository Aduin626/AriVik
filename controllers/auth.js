import pool from "../db.js";
import bcrypt from "bcrypt";
import { jwtTokens } from "../utils/jwt.helpers.js";


class Controller {
  async login(req, res) {
    try {
      const { email, password } = req.body; //запрос с клиента

      //Поиска пользователя с такой почтой
      const users = await pool.query("SELECT * FROM users WHERE email = $1", [
        email,
      ]);

      //   Проверка на существование
      if (users.rows.length === 0)
        return res.status(404).json({ error: "Данный пользователь не найден" });
      // Проверка пароля
      const validPassword = await bcrypt.compare(
        password,
        users.rows[0].password_hash
      );
      if (!validPassword)
        return res.status(401).json({ error: "Неверный пароль" });
      // Создание jwt токена (1арг данные который должны вернуться клиенту, 2 арг ключ, 3 арг время жизни)
      //   const token = jwt.sign(
      //     {
      //       email: users.rows[0].email,
      //       userId: users.rows[0].user_id,
      //       userRole: users.rows[0].role_id,
      //     },
      //     keys,
      //     { expiresIn: 60 * 60 }
      //   );

      const token = jwtTokens(users.rows[0]);

      console.log(token);

      //возврат токена
      return res.json({ token: `Bearer ${token}` });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async registerPatient(req, res) {
    try {
      const { email, firstName, lastName, birthday, sex, phone, password } =
        req.body; //запрос с клиента

      const fullName = `${firstName} ${lastName}`; //полное имя

      //Проверка на регистрацию
      const userAlreadExists = await pool.query(
        "SELECT * FROM users WHERE email= $1",
        [email]
      );

      if (userAlreadExists.rows.length > 0) {
        return res
          .status(409)
          .json({ error: "Такой email уже зарегистрирован" });
      }

      //Хэширование
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      //Добавление пользователя
      const newUser = await pool.query(
        "INSERT INTO users (email,name,birthday,sex,phone, password_hash, role_id) VALUES ($1, $2, $3,$4,$5,$6,$7) RETURNING *",
        [email, fullName, birthday, sex, phone, hashedPassword, 1]
      );

      //отображение в ответе
      return res.json({ users: newUser.rows[0] });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default new Controller();
