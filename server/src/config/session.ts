import MongoStore from "connect-mongo";

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

export const sessionSetup = () => ({
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
