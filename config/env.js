import dotenv from 'dotenv';
import { config } from 'dotenv';

config({ path: `.env.${process.env.NODE_ENV || 'dev'}` })


export const { PORT, DB_URI, NODE_ENV } = process.env;
