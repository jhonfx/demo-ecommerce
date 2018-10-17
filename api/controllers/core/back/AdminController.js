/**
 * AdminController
 *
 * @description :: Server-side logic for managing admins
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
const CoreReadDbService = require('../../../services/core/back/CoreReadDbService');
const CoreInsertDbService = require('../../../services/core/back/CoreInsertDbService');
const CoreLoginService = require('../../../services/core/back/CoreLoginService');
const pathTemplateBackCore = sails.config.globals.templatePathBackCore;

module.exports = {

    loginValidation: function (req, res) {

        var isLogged = false;

        if (req.body && req.body.email && req.body.password) {

            let email = req.body.email;
            let password = req.body.password;
            isLogged = CoreLoginService.login(req, res, email, password);
            console.log('loginValidation - req', req.body);
            req.session.admin = {};
            req.session.admin.email = email;
            req.session.admin.isLogged = 1;

            CoreReadDbService.getUserItemByEmail(email).then(function (user) {

                console.log('AdminController - loginValidation - user ', user);

                req.session.admin.user = user;
                if (isLogged) {
                    var result = {};
                    result.templateToInclude = 'admin';
                    result.pathToInclude = '../admin';
                    return res.view(pathTemplateBackCore + 'admin/new-template.ejs', result);
                } else {
                    return res.redirect('/admin');
                }

            });


        }

    },


    logout: function (req, res) {

        //remove the token from session

        req.session.admin = {};

        CoreLoginService.logout(req, res);
        return res.redirect('/admin');
    }
    ,

    login: function (req, res) {

        console.log('login');
        var result = {};
        result.templateToInclude = 'admin';
        result.pathToInclude = '../admin';
        //var result;

        return res.view(pathTemplateBackCore + 'admin/login.ejs', result);
    },

    index: function (req, res) {
        var result = {
            admin: req.session.user
        };

        return res.view('back/admin.ejs', result);
    },


    product: function (req, res) {
        var result = {
            admin: req.session.user
        };
        var skip = 0;
        var page = 1;

        if (req.query.hasOwnProperty('page')) {
            skip = (req.query.page - 1) * 10;
            page = req.query.page;
        }

        var queryOptions = {
            where: {},
            skip: skip,
            limit: 10,
            sort: 'createdAt DESC'
        };

        result.page = page;

        async.waterfall([
            function GetTotalCount(next) {
                Product.count(function (err, num) {
                    if (err) return next(err);

                    result.pages = [];

                    for (var i = 0, count = parseInt(num / queryOptions.limit); i <= count; i++) {
                        result.pages.push(i + 1);
                    }

                    return next(null);
                });
            },

            function GetProducts(next) {
                Product.find(queryOptions, function (err, products) {
                    if (err) next(err);

                    result.products = products;

                    return next(null);
                });
            },

            function GetEditProduct(next) {
                if (!req.params.hasOwnProperty('id')) {
                    return next(null);
                    return;
                }

                Product.findOne(req.params.id, function (err, product) {
                    if (err) next(err);
                    result.edit = product;

                    return next(null);
                });
            }
        ], function (err) {
            if (err) return res.serverError(err);


            result.templateToInclude = 'list_product';


            return res.view(pathTemplateBackCore + 'commun-back/main.ejs', result);
        });
    },


    productCreate: function (req, res) {


        Product.create({name: 'Walter Jr', price: 10}, function (err, product) {
            if (err) return res.serverError(err);

            return res.redirect('/admin/product');
        });

    },


    menu: function (req, res) {


        console.log('is logged', CoreLoginService.isLogged());

        if (CoreLoginService.isLogged(req, res)) {
            var result = {};

            result.templateToInclude = 'admin';
            result.pathToInclude = '../admin';

            return res.view(pathTemplateBackCore + 'admin/new-template.ejs', result);
        }

        else {


            return res.redirect('/admin/login');


        }


    },

    newTemplate: function (req, res) {


        console.log('is logged', CoreLoginService.isLogged());

        if (CoreLoginService.isLogged(req, res)) {
            var result = {};

            result.templateToInclude = 'admin';
            result.pathToInclude = '../admin';

            return res.view(pathTemplateBackCore + 'admin/new-template.ejs', result);
        }
        else {
            return res.view(pathTemplateBackCore + 'admin/new-template.ejs', result);

        }


    },


};
