/* eslint-disable no-undef */

import { config } from "dotenv";

// eslint-disable-next-line no-undef
config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

export const { PORT , NODE_ENV, DB_URI, JWT_SECRET, JWT_EXPIRES_IN, TMDB_API_URL, TMDB_API_KEY } = process.env;