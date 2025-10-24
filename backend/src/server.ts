
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import { loadPlugins } from './plugin-loader';
import searchRoutes from './routes/search';
import loadRoutes from './routes/load';
import linksRoutes from './routes/links';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());

loadPlugins().then(() => console.log('Plugins loaded'));

app.use('/api/search', searchRoutes);
app.use('/api/load', loadRoutes);
app.use('/api/links', linksRoutes);

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
