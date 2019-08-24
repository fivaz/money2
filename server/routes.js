const Controller = require('./controllers/controller');

const isGuest = (req, res, next) => {
    if (!req.session.userId)
        res.redirect('/login');
    else
        next();
};

const isAuth = (req, res, next) => {
    if (req.session.userId)
        res.redirect('/');
    else
        next();
};

module.exports = app => {

    app.get('/', isGuest, Controller.home());

    app.get('/account/:id', isGuest, Controller.account());

    app.get('/categories', isGuest, Controller.categories());

    app.get('/login', isAuth, Controller.login());

    app.post('/login', Controller.execLogin());

    app.post('/logout', Controller.execLogout());

    // /register
};