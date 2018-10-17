var CoreReadDbService = require('../../../services/core/back/CoreReadDbService');
var CoreInsertDbService = require('../../../services/core/back/CoreInsertDbService');
var ModulePaymentPaypalService = require('../../../services/core/api/ModulePaymentPaypalService');
var pathTemplateBackCore = sails.config.globals.templatePathFrontCore;
var _ = require('underscore');


const async = require('promise-async')

module.exports = {

    test: function (req, res) {

        var data = {'data': 'test'};
        return res.ok(data);
    },

    // return a json containing all the product
    product: function (req, res) {


        CoreReadDbService.ApiGetToken().then(function (data1) {


            let tokenInput = req.param("token");

            console.log("ApiController - allParams()", req.allParams());

            console.log("ApiController - param  token()", tokenInput);


            let tokenFromDb = "";

            // check the api token key

            console.log("ApiController.js - ApiGetToken", data1);


            if (typeof data1[0] != "undefined") {

                tokenFromDb = data1[0].value;

                console.log("tokenFromDb ", tokenFromDb);
            }

            if (tokenInput == tokenFromDb) {


                CoreReadDbService.getProductList().then(function (data2) {

                    console.log('ApiController - product', data2);

                    return res.json(data2);

                });

            } else {
                console.log('ApiController - token not valid - token', tokenInput);

                let dataNotValidToken = {"status": "error", "message": "token not valid"};

                return res.json(dataNotValidToken);

            }
        })
    },


    category: function (req, res) {


        CoreReadDbService.getCategoryList().then(function (data) {

            console.log('ApiController - category ', data);

            return res.json(data);

        });


    },


}