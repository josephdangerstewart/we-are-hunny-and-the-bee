import express from 'express';
import path from 'path';

const app = express();
const publicDir = path.resolve('public/');

app.get('/', (req, response) => {
	response.sendFile(`${publicDir}/index.html`);
});

console.log(publicDir);
app.use(express.static(publicDir));

const port = process.env.NODE_ENV ?? 8080;
console.log(`Listening on ${port}`);
app.listen(port);
