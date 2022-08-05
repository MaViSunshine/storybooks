// const GoogleStrategy = require('passport-google-oauth20').Strategy
const DiscordStrategy= require('passport-discord').Strategy
const mongoose = require('mongoose')
const User = require('../models/User')

module.exports = function (passport) {
  passport.use(
    // new GoogleStrategy(
    //   {
    //     clientID: process.env.GOOGLE_CLIENT_ID,
    //     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    //     callbackURL: '/auth/google/callback',
    //   },
    //   async (accessToken, refreshToken, profile, done) => {
    //     const newUser = {
    //       googleId: profile.id,
    //       displayName: profile.displayName,
    //       firstName: profile.name.givenName,
    //       lastName: profile.name.familyName,
    //       image: profile.photos[0].value,
    //     }

    //     try {
    //       let user = await User.findOne({ googleId: profile.id })

    //       if (user) {
    //         done(null, user)
    //       } else {
    //         user = await User.create(newUser)
    //         done(null, user)
    //       }
    //     } catch (err) {
    //       console.error(err)
    //     }
    //   }
    // ),
    new DiscordStrategy(
      {
        clientID: process.env.DISCORD_CLIENT_ID,
        clientSecret: process.env.DISCORD_CLIENT_SECRET, 
        callbackURL: '/auth/discord/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        const newUser = {
          discordId: profile.id,
          userName: profile.userName,
          displayName: profile.displayName,
          // firstName: profile.givenName,
          // lastName: profile.familyName,
          // image: profile.photos[0].value,
        }
 
        try {
          let user = await User.findOne({ discordId: profile.id })

          if (user) {
            done(null, user)
          } else {
            user = await User.create(newUser)
            done(null, user)
          }
        } catch (err) {
          console.error(err)
        }
      }
    )
  )

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => done(err, user))
  })
}
