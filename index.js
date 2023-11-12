import app from "./app.js"; //импорт из локали app.js

const PORT = process.env.PORT || 8080; //порт на котором все заускается

app.listen(PORT, () => console.log(`server work on ${PORT}`)); //запуск сервера
