/**
 * UploadControllerController
 *
 * @description :: Server-side logic for managing Uploadcontrollers
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var CoreReadDbService = require('../../../services/core/back/CoreReadDbService');
var CoreInsertDbService = require('../../../services/core/back/CoreInsertDbService');
var CoreDeleteDbService = require('../../../services/core/back/CoreDeleteDbService');

module.exports = {

    /**
     * `UploadControllerController.imageProduct()`
     */
    update: function (req, res) {

        console.log('ModuleController - update');

        console.log ('req.body' , req.body);

        // update db with module status
        if (typeof req.body.isModuleChecked != "undefined" && typeof req.body.moduleName != "undefined"){


            let data = {"isActive":req.body.isModuleChecked};
            let nameModule = req.body.moduleName;
            let collectionName = "module_payment";

            console.log ("call to CoreInsertDbService.udpateModuleConfiguration");
            CoreInsertDbService.udpateModuleConfiguration(collectionName, nameModule, data);


        }


        return res.json({
            msg: "module updated"
        });

    }


};

