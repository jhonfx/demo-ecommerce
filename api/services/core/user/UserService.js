/* Copyright 2016 PayPal */
"use strict";
var CoreReadDbService = require('../back/CoreReadDbService');


module.exports = {


    checkBackEndLogged: function (req, res) {


        // check if user is logged

        if (req.session && req.session.admin && req.session.admin.isLogged && req.session.admin.isLogged == 1)
        {
            console.log ( 'OrderController - user logged', req.session.admin);
        }
        else{
            console.log ('OrderController - user not logged');
            let url = "/admin/login";
            return res.redirect(url);
        }
    }

}
