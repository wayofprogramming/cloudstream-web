import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import { loadPlugins } from './plugin-loader';
import searchRoutes from './routes/search';
import loadRoutes from './routes/load';
import linksRoutes from './routes/links';

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Load plugins
loadPlugins()
  .then(() => console.log('✅ Plugins loaded'))
  .catch(err => console.error('❌ Plugin load failed:', err));

// Routes
app.use('/api/search', searchRoutes);
app.use('/api/load', loadRoutes);
app.use('/api/links', linksRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
