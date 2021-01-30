const { body } = require('express-validator');
var mongoose = require('mongoose'),
    passport = require('passport');
const Response = require('./response');
const User = mongoose.model('User');
const Admin = mongoose.model('Admin');
const Customer = mongoose.model('Customer');
const Measurment = mongoose.model('Measurment');

exports.signup = async (req, res) => {
    User.findOne({ email: req.body.email })
        .then((userExists) => {
            if (userExists) {
                return res.status(200).json(Response.create(
                    false,
                    'Email already used.',
                    null,
                    Response.ERRORS.EMAIL_ALREADY_USED
                ));
            }

            const user = new User(req.body);
            user.setPassword(req.body.password);
            return user.save()
                .then(() => {
                    return res.status(200).json(Response.create(
                        true,
                        'User created.',
                        null
                    ));
                });
        })
        .catch((err) => {
            return res.status(404).json(err);
        });
};

exports.signin = (req, res) => {
    if (!req.body.username || !req.body.hash) {
        return res.status(400).json(req.body.username);
    }

    passport.authenticate("local", (err, user, info) => {
        let token;
        if (err) {
            return res.status(500).json(Response.create(
                false,
                'There were a auth error. Please check data for further informations. (1)',
                err,
                Response.ERRORS.AUTH_ERROR
            ));
        }

        if (!user) {
            return res.status(200).json(Response.create(
                false,
                'There were a auth error. Please check data for further informations. (2)',
                info,
                Response.ERRORS.AUTH_ERROR
            ));
        } else {
            token = user.generateJwt();

            return res.status(200).json(Response.create(
                true,
                'Connected.',
                { token: token }
            ));
        }
    })(req, res);
};

exports.signout = (req, res) => {
    req.logout();

    return res.status(200).json(Response.create(
        true,
        'Disconnected.',
        null
    ));
};

exports.get = (req, res) => {
    User.findById(req.userId)
        .then(user => {
            if (!user) {
                return res.status(200).json(Response.create(
                    false,
                    'Did not find any user for the provided id.',
                    null,
                    Response.ERRORS.USER_NOT_FOUND
                ));
            }

            var userData = {
                firstname: user.firstname,
                lastname: user.lastname,
                nickname: user.nickname,
                email: user.email,
                phoneNumber: user.phoneNumber
            }

            return res.status(200).json(Response.create(
                true,
                'User data found.',
                { user: userData }
            ));
        })
        .catch((err) => {
            return res.status(500).json(Response.create(
                false,
                'There were a database error. Please check data for further informations.',
                err,
                Response.ERRORS.DB_ERROR
            ));
        });
}

exports.updatePassword = (req, res) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) {
            return res.status(500).json(Response.create(
                false,
                'There were a auth error. Please check data for further informations. (1)',
                err,
                Response.ERRORS.AUTH_ERROR
            ));
        }

        if (!user) {
            return res.status(200).json(Response.create(
                false,
                'There were a auth error. Please check data for further informations. (2)',
                info,
                Response.ERRORS.AUTH_ERROR
            ));
        }

        user.setPassword(req.body.newPassword);
        user.save()
            .then(() => {
                return res.status(200).json(Response.create(
                    true,
                    'Password was updated.',
                    null
                ));
            })
            .catch((err) => {
                return res.status(500).json(Response.create(
                    false,
                    'There were a database error. Please check data for further informations.',
                    err,
                    Response.ERRORS.DB_ERROR
                ));
            });
    })(req, res);
};

exports.updateNickname = (req, res) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(200).json(Response.create(
                    false,
                    'Did not find any user for the provided id.',
                    null,
                    Response.ERRORS.USER_NOT_FOUND
                ));
            }

            return User.findOne({ nickname: req.body.nickname })
                .then(nicknameUser => {
                    if (nicknameUser) {
                        return res.status(200).json(Response.create(
                            false,
                            'Nickname already used.',
                            null,
                            Response.ERRORS.USER_NOT_FOUND
                        ));
                    }

                    user.nickname = req.body.nickname;
                    return user.save()
                        .then(() => {
                            return res.status(200).json(Response.create(
                                true,
                                'Nickname was updated.',
                                null
                            ));
                        })
                });
        })
        .catch((err) => {
            return res.status(500).json(Response.create(
                false,
                'There were a database error. Please check data for further informations.',
                err,
                Response.ERRORS.DB_ERROR
            ));
        });
};