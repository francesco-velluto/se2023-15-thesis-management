'use strict';

const passport = require('passport');
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;

const { validationResult, body } = require('express-validator');
const { authUser, getUserById } = require('../service/authentication');


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
    login: (req, res, next) => {
        //const { username, password } = req.body;

        // Check if validation is ok
        /*const err = validationResult(req);
        const errList = [];
        if (!err.isEmpty()) {
            errList.push(...err.errors.map(e => e.msg));
            return res.status(400).json({ errors: errList });
        }*/

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
    },

    /**
     * Fetch the current user
     * @param {*} req 
     * @param {*} res 
     */
    currentUser: async (req, res) => {
        try {
            const user = await getUserById(req.user.student_id);
            return res.json(user);
        } catch (err) {
            res.status(500).json({ errors: ["Database error"] });
        }
    },

    /**
     * Logout
     */
    logout: (req, res) => {
        req.logout(() => res.end());
    },

    /**
     * Helper function to initialize passport authentication with the LocalStrategy
     * 
     * @param app express app
     */
    inializeAuthentication: (app) => {
        passport.use(new LocalStrategy((username, password, done) => {
            console.log("email: " + username);
            console.log("password: " + password);

            authUser(username, password)
                .then(user => {
                    if (user) {
                        console.log("successful");
                        done(null, user);
                    }
                    else {
                        console.log("error");
                        done({ status: 401, msg: 'Incorrect email and/or password!' }, false);
                    }
                })
                .catch(() => {
                    return done({ status: 500, msg: 'Database error' }, false);
                });
        }));

        // Serialization and deserialization of the user to and from a cookie
        passport.serializeUser((user, done) => {
            console.log("serializzazione: " + user);

            done(null, user.student_id);
        })

        passport.deserializeUser((id, done) => {
            console.log("deserializzazione: " + id);

            getUserById(id)
                .then(user => done(null, user))
                .catch(e => done(e, null));
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