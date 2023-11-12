import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import crypto from "crypto";
import morgan from "morgan";
import fs from "fs";
import authRouter from "./routes/auth.js";
import projectRouter from "./routes/project.js";
const app = express(); //создание сервера

//Для env
dotenv.config();

//Рандомная генерация токенов
const generateRandomToken = () => {
  return crypto.randomBytes(32).toString("hex");
};
const access_token_secret = generateRandomToken();
const refresh_token_secret = generateRandomToken();
const corsOption = { credential: true, origin: process.env.URL || "*" };
//Запись токинов в файл
fs.writeFileSync(
  ".env",
  `ACCESS_TOKEN_SECRET=${access_token_secret}\nREFRESH_TOKEN_SECRET=${refresh_token_secret}`
);

app.use(morgan("dev")); //В режиме 'dev', morgan предоставляет удобочитаемые логи каждого запроса к серверу, что удобно при разработке. Эти логи включают метод запроса, URL, статус ответа, время ответа и другие полезные данные.

app.use(bodyParser.urlencoded({ extended: true })); //Это подключает bodyParser, промежуточное ПО для разбора тел запросов. В данном случае, оно настроено на разбор данных, отправляемых через HTML-формы (urlencoded), позволяя извлекать и использовать эти данные в Express-приложении.
app.use(bodyParser.json()); // Это также подключение bodyParser, но настроенное на разбор JSON-данных, отправляемых клиентом. Это позволяет легко работать с JSON-данными, получаемыми в теле запросов.

app.use(cors(corsOption)); //Это подключает промежуточное ПО cors, которое позволяет вам управлять политиками CORS (Cross-Origin Resource Sharing) в вашем приложении. Это важно для разрешения или ограничения доступа к вашему серверу из скриптов, запущенных на других доменах. Без этого, браузеры по умолчанию блокируют запросы к серверам, расположенным вне исходного домена.
app.use("/api/auth", authRouter); //прослушка роута авторизации
app.use("/api", projectRouter);
export default app;
