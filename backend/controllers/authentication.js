'use strict';

const passport = require('passport');
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;

const { getUserById, getUser } = require('../service/authentication');
const Teacher = require('../model/Teacher');
const Student = require('../model/Student');

const SamlStrategy = require('passport-saml').Strategy;
const fs = require('fs');
const config = require('../config');


module.exports = {

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
            const user = await getUser(req?.user?.nameID);
            return res.json(user);
        } catch (err) {
            res.status(500).json({ errors: ["Database error"] });
        }
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
        const samlStrategy = new SamlStrategy(
            {
                issuer: `http://localhost:${process.env.FRONTEND_PORT}`,
                protocol: "http://",
                path: "/api/authentication/login/callback",
                entryPoint: config.saml.entryPoint,
                logoutUrl: config.saml.logoutUrl,
                cert: config.saml.cert,
                wantAssertionsSigned: false,
                wantAuthnResponseSigned: false
            },
            (expressUser, done) => {
                // rename of nameID property
                //expressUser.id = expressUser.nameID;
                //delete expressUser.nameID;
                return done(null, expressUser);
            }
        );
        passport.use(samlStrategy);

        // Serialization and deserialization of the user to and from a cookie
        passport.serializeUser((user, done) => {
            done(null, user.nameID);
        });

        passport.deserializeUser((id, done) => {
            getUser(id)
                .then(user => done(null, user))
                .catch(e => done(e, null));
        });

        // Initialize express-session
        app.use(session(config.session));

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
    },

    /**
     * Express middleware to check if the user is a teacher.
     * Responds with a 401 Unauthorized if they're not.
     *
     * @function
     * @name isTeacher
     * @memberof module:authenticationController
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {function} next - Express next middleware function
     * @returns {undefined}
     */
    isTeacher: (req, res, next) => {
        if (!req.isAuthenticated() || !(req.user instanceof Teacher))
            return res.status(401).json({ errors: ["Not authorized"] });
        next();
    },

    /**
     * Express middleware to check if the user is a student.
     * Responds with a 401 Unauthorized if they're not.
     *
     * @function
     * @name isStudent
     * @memberof module:authenticationController
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {function} next - Express next middleware function
     * @returns {undefined}
     */
    isStudent: (req, res, next) => {
        if (!req.isAuthenticated() || !(req.user instanceof Student))
            return res.status(401).json({ errors: ["Not authorized"] });
        next();
    },
}