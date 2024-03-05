import express from "express";
import { config } from "dotenv"
import session from "express-session";
import passport from "passport";
import { OAuth2Strategy } from "passport-google-oauth";
config();


const app = express();
var authenticatedUser:any;

app.set('view engine', 'ejs');

app.use(session({
    resave: false,
    secret: 'my-super-secure-secret'
}))

app.use(passport.initialize())
app.use(passport.session())

passport.serializeUser((user: Express.User, cb)=>{
    cb(null, user);
})

passport.deserializeUser((user: Express.User, cb)=>{
    cb(null, user);
})

const {GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET} = process.env;

passport.use(new OAuth2Strategy({
    clientID: GOOGLE_CLIENT_ID || "",
    clientSecret: GOOGLE_CLIENT_SECRET || "",
    callbackURL: "http://localhost:5000/auth/google/callback"
}, function(accessToken, refreshToken, profile, cb){
    authenticatedUser = profile;
    cb(null, profile);
}))

app.get('/auth', (req, res)=>{
    res.render('pages/index');
})

app.get('/google-auth', passport.authenticate('google', { scope: ['profile', 'email']}))

app.get(
    '/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: '/error'}),
    (req, res)=>{
        res.status(200).json(authenticatedUser)
    })

app.listen(5000, ()=>{
    console.log('listening on port 5000')
})