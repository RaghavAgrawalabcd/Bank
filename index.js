if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const initializePassport = require('./passport-config')
const personController = require('./controller/person')
const methodOverride = require('method-override')
const db = require('./db/db')

const users = [{
    id: '1616346504749',
    ename: 'raghav',
    email: 'raghav@gmail.com',
    password: '$2b$10$d2.PwwqAuUi0kDgh5VLu3u8t.HmKjh//9PBecNKIkTMBH5M60d2ka'
}];

app.set('view-engine', 'ejs')

app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))


initializePassport(passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
)

app.get('/', checkAuthenticated, (req, res) => {
    res.render('index.ejs', { name: (req.user.ename) })
});
app.get('/login', checkNotAuthenticated, (req, res) => {
    const s = db.select().from('employee').where('emailId', 'raghav@gmail.com')
    /*console.log(s)*/
    res.render('login.ejs')
});
app.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('register.ejs', { errr: req.err })
});

app.post('/register', checkNotAuthenticated, async (req, res) => {
    var err;
    var { id, name, email, password, cpassword } = req.body
    if (!name || !email || !password || !cpassword) {
        err = "Please fill all the fields"
        res.render('register.ejs', { errr: err })
    }
    else if (password != cpassword) {
        err = "Passwords don't match"
        res.render('register.ejs', { errr: err, ename: name, emailId: email })
    }
    else {
        try {
            const hashedPassword = await bcrypt.hash(req.body.password, 10)
            const user = { id: Date.now().toString(), name: req.body.name, email: req.body.email, password: hashedPassword }
            personController.createPerson(user)
            res.redirect('/login')
        }
        catch (err) {
            res.redirect('/register')
        }
    }
})
app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))

app.delete('/logout', (req, res) => {
    req.logOut()
    res.redirect('/login')
})

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/')
    }
    next()
}
app.listen(8001, () => console.log('server listening on port 8001'));

/*app.post('/login', async (req, res) => {
    const user = users.find(user => user.email = req.body.email)
    if (user == null) {
        res.redirect('/', { msg: "user not found" })
    }
    try {
        if (await bcrypt.compare(req.body.password, user.password)) {
            res.redirect({ msg: 'success'},'/')
        }
        else {
            res.redirect('/', { msg: "Not allowed" })
        }
    } catch {
        res.status(500).send()
    }
})*/