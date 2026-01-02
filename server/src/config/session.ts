import MongoStore from "connect-mongo";
import session from "express-session";

// Helferfunktion für sichere Env-Variablen
function getEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Env-Variable ${name} fehlt!`);
  }
  return value;
}

const secret = getEnvVar("SECRET_KEY");
const mongoUrl = getEnvVar("MONGODB_URI");

export const sessionSetup = session({
  name: "connect.sid",
  secret,
  resave: false,
  store: MongoStore.create({
    mongoUrl,
    collectionName: "sessions",
  }),
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 1000 * 60 * 60,
    sameSite: "lax" as const,
  },
});

export const corsSetup = {
  origin: process.env.FRONTEND_URL ?? "http://localhost:5173",
  credentials: true,
};
