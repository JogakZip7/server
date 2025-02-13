require('dotenv').config(); // .env 파일 로드
console.log(process.env.JWT_SECRET); // "secretkey" 출력
import 'dotenv/config';
import express from 'express';

const app = express();
app.use(express.json());

const port = process.env.PORT ?? 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
