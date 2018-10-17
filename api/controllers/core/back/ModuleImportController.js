/**
 * back/ModuleImportController
 *
 * @description :: Server-side logic for managing admin/products
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

const async = require('async');

const Promise = require('bluebird');
const pathToService = '../../../services/core/';
const CoreReadDbService = require(pathToService + 'back/CoreReadDbService');
const CoreInsertDbService = require(pathToService + '/back/CoreInsertDbService');
const pathTemplateBackCore = sails.config.globals.templatePathBackCore;
const _ = require('underscore');


module.exports = {
    import: function (req, res, idProduct) {

        console.log('ModuleController - import');

        //let idProduct = 0;

        let fs = require("fs");

        console.info('image upload');

        if (sails.config.demoMode != 1) {
            req.file('file').upload(function (err, uploadedFiles) {

                console.info('uploaded file');
                console.info(uploadedFiles);

                if (uploadedFiles[0].fd) {
                    let filePath = uploadedFiles[0].fd;

                    let dir = '.tmp/uploads/';
                    if (!fs.existsSync(dir)) {
                        fs.mkdirSync(dir);
                    }

                    let modulePathFile = "module.zip";
                    fs.createReadStream(filePath).pipe(fs.createWriteStream(dir + modulePathFile));


                    // unzip of the file
                    let fileToUnzip = dir + modulePathFile;
                    unzipModuleZip(fileToUnzip, dir);


                    // copy of the modules files
                    deployNewModule(dir);


                }
                console.log('UploadController - saveImageProduct - start');
            });

            let msg = 'import of module complete';

        }
        else {
            let msg = 'demo mode';

        }

        return res.json({
            msg: msg
        });
    }
}


// function to add the files of module in the core project


function unzipModuleZip(file, dir) {


    const cmd = require('node-cmd');

    cmd.get(
        'unzip -o ' + file + " -d " + dir,
        function (err, data, stderr) {
            console.log('ModuleImportController - operation to unzip the module - data: ', data)
        }
    );
}









function deployNewModule(dir) {

    const cmd = require('node-cmd');


    let pathFileInstallation = dir + "module/module/script_deployment/deploy.js";


    cmd.get(
        'node ' + pathFileInstallation,
        function (err, data, stderr) {
            if (!err) {
                console.log('start script installation module:', data)
            } else {
                console.log('error during script module installation', err)
            }
        }
    );


    /*cmd.get(
        'ls',
        function (err, data, stderr) {
            console.log('the current dir contains these files :\n\n', data)
        }
    );*/


}




