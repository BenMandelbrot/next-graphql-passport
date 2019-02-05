import cors from "cors";
import express from "express";
import session from "express-session";
import passport from "passport";
import apolloServer from "./apolloServer";
import { redis } from "./redis";

const GithubStrategy = require("passport-github").Strategy;

const RedisStore = require("connect-redis")(session);
require("dotenv").config();

const startServer = async () => {
  const app = express();

  app.use(
    cors({
      credentials: true,
      origin: true
    })
  );

  app.use((req, _, next) => {
    const authorization = req.headers.authorization;

    if (authorization) {
      try {
        const qid = authorization.split(" ")[1];
        req.headers.cookie = `qid=${qid}`;
      } catch (_) {}
    }

    return next();
  });

  app.use(
    session({
      store: new RedisStore({
        client: redis
      }),
      name: "qid",
      secret: "asdasdada",
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
      }
    })
  );

  passport.use(
    new GithubStrategy(
      {
        clientID: process.env.GITHUB_ID,
        clientSecret: process.env.GITHUB_SECRET,
        callbackURL: "http://localhost:4000/auth/github/callback"
      },
      async (accessToken, refreshToken, profile, cb) => {
        // don't worry about registering user
        const user = {
          id: profile.id,
          username: profile.username,
          email: profile._json.email
        };

        cb(null, {
          user,
          accessToken,
          refreshToken
        });
      }
    )
  );

  app.use(passport.initialize());
  app.use(passport.session());
  app.get("/auth/github", passport.authenticate("github", { session: false }));
  app.get(
    "/auth/github/callback",
    passport.authenticate("github", { session: false }),
    (req, res) => {
      if (req.user.user.id) {
        console.log("SET REQ Session");
        req.session.userId = req.user.user.id;
        req.session.accessToken = req.user.accessToken;
        req.session.refreshToken = req.user.refreshToken;
      }
      res.redirect("http://localhost:3000/");
    }
  );

  apolloServer.applyMiddleware({ app, bodyParser: true, cors: false });

  app.listen({ port: 4000 }, () =>
    console.log(
      `🚀 Server ready at http://localhost:4000${apolloServer.graphqlPath}`
    )
  );
};
startServer();
