"use strict";

const passport = require('passport');
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;

module.exports = {
    /**
     * Login a user
     *
     * @params: none
     * @body: { username: string, password: string }
     * @returns: { token: string }
     * @error: 400 Bad Request - if username or password are not present
     * @error: 401 Unauthorized - if username or password are not valid
     * @error: 500 Internal Server Error - if something went wrong
     */
    login: (req, res) => {
        console.log("login richiesto: " + req + " " + res);
        
        const { username, password } = req.body;

        try {
            // Perform the actual authentication
            passport.authenticate("local", (err, user, info) => {
                if (err) {
                    return res.status(err.status).json({ errors: [err.msg] });
                }

                if (!user) {
                    return res.status(401).json(info);
                }

                req.login(user, err => {
                    if (err) {
                        return next(err);
                    }

                    // Send user information
                    return res.json(req.user);
                });

            });


            /*if (!username || !password) {
                res.status(400).json({ error: "Missing username or password" });
            } else if (username !== "username" || password !== "password") {
                res.status(401).json({ error: "Wrong username or password" });
            } else {
                res.status(200).json({ token: "token" });
            }*/
        } catch (err) {
            console.error("[BACKEND-SERVER] Cannot login user", err);
            res.status(500).json({ error: "Internal server error has occurred" });
        }
    },

    /**
     * Authenticate and login
     */
    /*login_2: (
        "/api/session",
        body("username", "Must be entered a valid email!").isEmail(),
        body("password", "Password can not be empty!").isString().notEmpty(),
        (req, res, next) => {
            // Check if validation is ok
            const err = validationResult(req);
            const errList = [];
            if (!err.isEmpty()) {
                errList.push(...err.errors.map(e => e.msg));
                return res.status(400).json({ errors: errList });
            }

            // Perform the actual authentication
            passport.authenticate("local", (err, user, info) => {
                if (err) {
                    return res.status(err.status).json({ errors: [err.msg] });
                }

                if (!user) {
                    return res.status(401).json(info);
                }

                req.login(user, err => {
                    if (err) {
                        return next(err);
                    }

                    // Send user information
                    return res.json(req.user);
                });

            })(req, res, next);
        }
    ),

    /**
     * Logout
     */
    /*logout: ("/api/session", isLoggedIn, (req, res) => {
      req.logout(() => res.end());
    })*/









    /**
     * Helper function to initialize passport authentication with the LocalStrategy
     * 
     * @param app express app
     */
    inializeAuthentication: (app, db) => {
        passport.use(new LocalStrategy((email, password, done) => {
            console.log("email: " + email);
            console.log("password: " + password);

            db.authUser(email, password)
                .then(user => {
                    if (user) done(null, user);
                    else done({ status: 401, msg: 'Incorrect email and/or password!' }, false);
                })
                .catch(() => done({ status: 500, msg: 'Database error' }, false));
        }));

        // Serialization and deserialization of the user to and from a cookie
        passport.serializeUser((user, done) => {
            console.log("serializzazione: " + user);

            done(null, user.student_id);
        })

        passport.deserializeUser((id, done) => {
            console.log("deserializzazione: " + id);

            /*db.getUserById(id)
                .then(user => done(null, user))
                .catch(e => done(e, null));*/
        })

        // Initialize express-session
        app.use(session({
            secret: "326e60a6eb6f34186ae167a0dea7ee1dfa4109314e8c73610671de01f9662191",
            resave: false,
            saveUninitialized: false,
        }));

        // Initialize passport middleware
        app.use(passport.initialize());
        app.use(passport.session());
    },

    /**
     * Express middleware to check if the user is authenticated.
     * Responds with a 401 Unauthorized in case they're not.
     */
    /*isLoggedIn: (req, res, next) => {
        if (req.isAuthenticated()) return next();
        return res.status(401).json({ errors: ['Must be authenticated to make this request!'] });
    }*/

}