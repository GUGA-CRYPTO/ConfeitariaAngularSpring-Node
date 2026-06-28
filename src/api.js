import 'dotenv/config'; 
import express from 'express';
import cors from 'cors';
import adicionarRotas from './routes.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const api = express();

api.use(cors());
api.use(express.json());
api.use('/storage', express.static('storage')); // Deixa as fotos públicas

adicionarRotas(api);

const porta = process.env.PORTA;
api.listen(porta, () => console.log(`Servidor Aura ON na porta ${porta}! 🚀`));