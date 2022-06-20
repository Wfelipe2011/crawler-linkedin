import cors from 'cors';
import express from 'express';
import swaggerUi from 'swagger-ui-express';

import swaggerDocument from '../swagger.config.json';
import { apiRoutes } from './api/routes';
import config from './config/configuration';

const app = express();
const PORT = config.server.port || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(apiRoutes);

app.use(
	'/api-docs',
	swaggerUi.serve,
	swaggerUi.setup(swaggerDocument)
);

app.get('/', (req, res) => {
	console.log(config.database.url);
	res.status(200).send({
		message: 'Welcome to the API',
		version: '1.0.0',
	});
});

export { PORT };
export default app;
