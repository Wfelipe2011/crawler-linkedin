import cors from 'cors';
import express from 'express';

import { apiRoutes } from './api/routes';

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(apiRoutes);

app.get('/', (req, res) => {
	res.status(200).send({
		message: 'Welcome to the API',
		version: '1.0.0',
	});
});

export { PORT };
export default app;
