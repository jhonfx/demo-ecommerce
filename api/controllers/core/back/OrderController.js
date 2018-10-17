/**
 * OrderController
 *
 * @description :: Server-side logic for managing orders
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var async = require('async');
var pathTemplateBackCore = sails.config.globals.templatePathBackCore;
var pathToService = '../../../services/core/';

var CoreReadDbService = require(pathToService + 'back/CoreReadDbService');
var UserService = require(pathToService + 'user/UserService');

module.exports = {


    /**
     * `OrderController.item()`
     *
     *
     *
     * Will get the customer details + the shipping address + invoice address + product list + order item
     *
     */

    item: function (req, res, id) {


        UserService.checkBackEndLogged(req, res);


        let result = {
            admin: req.session.user
        };





        console.log('OrderController - item - req.session', req.session);


        async.waterfall([


            function (callback) {

                let orderId = id;

                //var orderId = req.params.id;
                CoreReadDbService.getOrderItem(orderId).then(function (order) {

                    console.log('OrderController - item - order', order);

                    let email = "test@test.com"

                    if (order && order[0]) {
                        result.data = order[0];
                    } else {
                        result.data = null;
                    }
                    callback(null, email);
                });

            },


            // need to add the customer informations to data
            function (arg1, callback) {


                //console.log ( ' OrderController - next ', next);

                let email = arg1 ;

                CoreReadDbService.getUserItemByEmail(email).then(function (user) {


                    console.log ( 'orderController - user ', user );

                    if ( user ){
                    result.data.user = user;
                    }
                    callback (null, email);

                })}







        ], function (err) {
            if (err) return res.serverError(err);

            console.log ( 'OrderController - result.data', result.data);

            result.templateToInclude = 'yes';
            result.pathToInclude = '../order/item.ejs';

            return res.view(pathTemplateBackCore + 'commun-back/main.ejs', result);
        });
    },

    manage: function (req, res) {

        UserService.checkBackEndLogged(req, res);


        var result = {
            admin: req.session.user
        };
        var skip = 0;
        var page = 1;

        if (req.query.hasOwnProperty('page')) {
            skip = (req.query.page - 1) * 10;
            page = req.query.page;
        }

        /*var queryOptions = {
         where: {},
         skip: skip,
         limit: 10,
         sort: 'createdAt DESC'
         };*/

        result.page = page;

        async.waterfall([

            function GetOrders(next) {

                CoreReadDbService.getOrderList().then(function (data1) {

                    console.log('back OrderController - manage - data1', data1);

                    result.orders = data1;

                    return next(null);
                });
            },

            function GetEditProduct(next) {
                if (!req.params.hasOwnProperty('id')) {
                    return next(null);
                }

                var orderId = req.params.id;
                CoreReadDbService.getOrderItem(orderId).then(function (order) {


                    //if (err) next (err);
                    result.edit = order;

                    return next(null);
                });
            }
        ], function (err) {
            if (err) return res.serverError(err);


            result.templateToInclude = 'yes';

            result.pathToInclude = '../order/list.ejs';

            return res.view(pathTemplateBackCore + 'commun-back/main.ejs', result);
        });
    },

    /**
     * `OrderController.list()`
     */
    list: function (req, res) {
        return res.json({
            todo: 'list() is not implemented yet!'
        });
    }
};

