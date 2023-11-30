"use strict";

const express = require('express');
const router = express.Router();

const config = require('../config');
const passport = require('passport');
const { isLoggedIn, currentUser } = require('../controllers/authentication');

/**
 * Authentication API routes
 * All the routes for the authentication
 */


/** Passport & SAML Routes */
router.get('/login', passport.authenticate('saml', config.saml.options), (req, res, next) => {
  return res.redirect(`http://localhost:${process.env.FRONTEND_PORT}`);
});

router.post('/login/callback', passport.authenticate('saml', config.saml.options), (req, res, next) => {
  return res.redirect(`http://localhost:${process.env.FRONTEND_PORT}`);
});

router.get('/whoami', (req, res, next) => {
  if (!req.isAuthenticated()) {
    console.log('User not authenticated');

    return res.status(401).json({ errors: ['Not authorized'] });
  } else {
    console.log('User authenticated');
    console.log(req.user);

    return res.status(200).json({ user: req.user });
  }
});

router.post("/logout", isLoggedIn, (req, res, next) => {
  res.clearCookie("connect.sid");
  req.logout(function (err) {
    console.log(err);
    req.session.destroy(function (err) {
      res.send();
    });
  });
});

/**
 * GET /api/authentication/current/user
 *
 * @params none
 * @body none
 * @returns { user: object }
 *
 * @see authenticationController.login
 */
router.get('/current/user', isLoggedIn, currentUser);


module.exports = router;