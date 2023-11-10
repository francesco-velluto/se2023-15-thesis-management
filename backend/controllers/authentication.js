'use strict';

const passport = require('passport');
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;

const { validationResult } = require('express-validator');
const { authUser, getUserById } = require('../service/authentication');
const CryptoJS = require('crypto-js');


module.exports = {
    /**
    * Authenticate a user and issue a session token upon successful login.
    *
    * @function
    * @name login
    * @memberof module:authenticationController
    * @param {Object} req - Express request object
    * @param {Object} res - Express response object
    * @param {function} next - Express next middleware function
    * @returns {JSON} - User information or errors
    * @throws {JSON} - 400 Bad Request if username or password are not present,
    *                  401 Unauthorized if username or password are not valid,
    *                  500 Internal Server Error if something went wrong
    */
    login: (req, res, next) => {
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
    },

    /**
      * Fetch information about the currently authenticated user.
      *
      * @async
      * @function
      * @name currentUser
      * @memberof module:authenticationController
      * @param {Object} req - Express request object
      * @param {Object} res - Express response object
      * @returns {JSON} - Current user information
      * @throws {JSON} - 500 Internal Server Error if a database error occurs
      */
    currentUser: async (req, res) => {
        try {
            const user = await getUserById(req?.user?.id);
            return res.json(user);
        } catch (err) {
            res.status(500).json({ errors: ["Database error"] });
        }
    },

    /**
     * Fetch information about the currently authenticated user.
     *
     * @async
     * @function
     * @name currentUser
     * @memberof module:authenticationController
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {JSON} - Current user information
     * @throws {JSON} - 500 Internal Server Error if a database error occurs
     */
    logout: (req, res) => {
        req.logout(() => res.end());
    },

    /**
     * Initialize passport authentication with the LocalStrategy.
     *
     * @function
     * @name inializeAuthentication
     * @memberof module:authenticationController
     * @param {Object} app - Express app object
     * @returns {undefined}
     */
    inializeAuthentication: (app) => {
        passport.use(new LocalStrategy((username, password, done) => {
            authUser(username, password)
                .then(user => {
                    if (user) {
                        done(null, user);
                    }
                    else {
                        done({ status: 401, msg: 'Incorrect email and/or password!' }, false);
                    }
                })
                .catch(() => {
                    return done({ status: 500, msg: 'Database error' }, false);
                });
        }));

        // Serialization and deserialization of the user to and from a cookie
        passport.serializeUser((user, done) => {
            done(null, user.id);
        });

        passport.deserializeUser((id, done) => {
            getUserById(id)
                .then(user => done(null, user))
                .catch(e => done(e, null));
        });

        function generateHash(length) {
            const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            let input = '';
        
            for (let i = 0; i < length; i++) {
                const randomIndex = Math.floor(Math.random() * characters.length);
                input += characters.charAt(randomIndex);
            }
        
            return CryptoJS.SHA256(input).toString(CryptoJS.enc.Hex);
        }

        // Initialize express-session
        app.use(session({
            secret: generateHash(32),
            resave: false,
            saveUninitialized: false,
        }));

        // Initialize passport middleware
        app.use(passport.initialize());
        app.use(passport.session());
    },

    /**
     * Express middleware to check if the user is authenticated.
     * Responds with a 401 Unauthorized if they're not.
     *
     * @function
     * @name isLoggedIn
     * @memberof module:authenticationController
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {function} next - Express next middleware function
     * @returns {undefined}
     */
    isLoggedIn: (req, res, next) => {
        if (req.isAuthenticated()) return next();
        return res.status(401).json({ errors: ['Must be authenticated to make this request!'] });
    }

}