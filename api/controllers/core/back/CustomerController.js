/**
 * AdminController
 *
 * @description :: Server-side logic for managing admins
 * @help        :: See http://links.sailsjs.org/docs/controllers
 * @creator :: Fabien Thetis
 */

var async = require('async');
var pathTemplateBackCore = sails.config.globals.templatePathBackCore;
var CoreReadDbService = require('../../../services/core/back/CoreReadDbService');


module.exports = {


    edit: function (req, res) {

        console.log("CustomerController - edit ");
        var result = {};
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
        result.order = {};

        var name = req.params.idCustomer;

        CoreReadDbService.getUserItemByName(name).then(function (user) {

            console.log("CustomerController - edit - user", user);

            result.user = user;
            result.cart = req.session.cart;
            //result.orders = user.orders;
            result.templateToInclude = 'yes';
            result.pathTemplateBackCore = '../customer/edit.ejs';

            return res.view(pathTemplateBackCore + 'commun-back/main.ejs', result);
        });
    },


    item: function (req, res) {
        var result = {};
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
        result.order = {};
        // we check if the session id user is set.
        var name = req.params.idCustomer;


        CoreReadDbService.getUserItemByName(name).then(function (user) {

            result.user = user;
            result.cart = req.session.cart;
            result.orders = user.orders;

            result.templateToInclude = 'yes';
            result.pathTemplateBackCore = '../customer/item.ejs';

            return res.view(pathTemplateBackCore + 'commun-back/main.ejs', result);


        });
    },


    user: function (req, res) {
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

        CoreReadDbService.allUser().then(function (userList) {

            console.log("CustomerController - user - userList", userList);
            result.users = userList;
            result.templateToInclude = 'yes';
            result.pathToInclude = '../customer/list.ejs';

            return res.view(pathTemplateBackCore + 'commun-back/main.ejs', result);
        });
    }

}
