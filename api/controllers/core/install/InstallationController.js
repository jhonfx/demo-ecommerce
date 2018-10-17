/**
 * InstallationController
 *
 * @description :: Server-side logic for managing installations
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var pathToService = '../../../services/core/';


var CoreReadDbService = require(pathToService + 'back/CoreReadDbService');
var CoreInsertDbService = require(pathToService + 'back/CoreInsertDbService');
var CoreInitDbService = require(pathToService + 'back/CoreInitDbService');
var pathTemplateBackCore =  sails.config.globals.templatePathBackCore;

module.exports = {


    firstInstallation: function (req, res) { // first command execute , need to be checked if already used

        console.log('[START]: firstInstallation');


        CoreReadDbService.getStatusInstallation().then(function (data) {


            var msg = '';

            if (data == false) {

                CoreInitDbService.initTableStatus();
                CoreInitDbService.setInstallationDone();
                CoreInsertDbService.createUserAdminDefault();
                CoreInsertDbService.installCounter('order'); // create the collection order
                CoreInsertDbService.installCounter('product'); // create the collection product
                CoreInsertDbService.installCounter('category');
                CoreInsertDbService.firstInstallCoreModule('paypal');
                CoreInsertDbService.firstInstallCoreModule('stripe');
                initModule ();



                msg = 'Installation Database done + creation default admin user ( admin / admin), you can go to /admin';

            }
            else {

                msg = 'Installation already done';
            }

            console.log('[END]: firstInstallation');
            var dataView = []; //{status: msg};
            dataView.templateToInclude = 'install_installation_done';
            dataView.pathToInclude = '../../install/installation_done.ejs';
            dataView.status = msg;
            return res.view(pathTemplateBackCore + 'commun-back/main.ejs', dataView);


           // return res.view('install/installation_done.ejs', dataView);
        })
    },

    /**
     * `InstallationController.initDatabaseCounter()`
     */
    initCounterProduct: function (req, res) {
        var counterType = 'product';
        CoreInsertDbService.initCounterProduct(counterType);
        return res.json({
            todo: 'initDatabaseCounter() done'
        });
    },

    initCounterOrder: function (req, res) { //
        var counterType = 'order';
        CoreInsertDbService.initCounterOrder(counterType);

        return res.json({
            todo: 'initDatabaseCounter() done'
        });
    }
};


function initModule (){

    // create default module
    let collectionName = "module_payment";
    let nameModule = "paypal";
    let data = {
        "name" : "paypal",
        "client_id" : "EBWKjlELKMYqRNQ6sYvFo64FtaRLRR5BdHEESmha49TM",
        "client_secret" : "EO422dn3gQLgDbuwqTjzrFgFtaRLRR5BdHEESmha49TM",
        "mode" : "sandbox",
        "category" : "payment",
        "createdAt" : "2017-12-18T10:21:20.408Z",
        "updatedAt" : "2018-04-14T15:27:17.498Z",
        "isActive" : 1,
        "idModule": 0
    };

    console.log ("call to CoreInsertDbService.udpateModuleConfiguration");
    CoreInsertDbService.udpateModuleConfiguration(collectionName, nameModule, data);

    // create default module
     let collectionName3 = "module_theme";
     nameModule = "default";
     data = {
        "name" : "default",
        "category" : "theme",
        "createdAt" : "2017-12-18T10:21:20.408Z",
        "updatedAt" : "2018-04-14T15:27:17.498Z",
        "isActive" : 1,
        "idModule": 0
    };

    console.log ("call to CoreInsertDbService.udpateModuleConfiguration");
    CoreInsertDbService.udpateModuleConfiguration(collectionName3, nameModule, data);



    // create default module
    let collectionName2 = "module_deliver";
    nameModule = "default";
    data = {
        "name" : "default",
        "category" : "deliver",
        "createdAt" : "2017-12-18T10:21:20.408Z",
        "updatedAt" : "2018-04-14T15:27:17.498Z",
        "isActive" : 1,
        "idModule": 0
    };

    console.log ("call to CoreInsertDbService.udpateModuleConfiguration");
    CoreInsertDbService.udpateModuleConfiguration(collectionName2, nameModule, data);





}

