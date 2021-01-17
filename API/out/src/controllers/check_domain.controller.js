"use strict";
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckDomainController = void 0;
const csv = require('csv-parser');
const fs = require('fs');
const express_1 = require("express");
const baseModel_1 = require("../../common/base/baseModel");
const QueueTypesAndValues_1 = require("../../common/messaging/QueueTypesAndValues");
const endpoindPaths_enum_1 = require("./enums/endpoindPaths.enum");
const multer = require("multer");
const utils_1 = require("../../utils/utils");
const upload = multer({ dest: 'tmp/csv/' });
class CheckDomainController {
    constructor() {
        this.router = express_1.Router();
        this.init();
    }
    async getAllDomains(req, res) {
        const response = await baseModel_1.broker.sendRequest(QueueTypesAndValues_1.MessageValues.GET_ALL, {}, QueueTypesAndValues_1.QueueNames.DOMAIN_WORKER);
        return utils_1.RespondWithJson(res, response);
    }
    async getDomainByName(req, res) {
        const response = await baseModel_1.broker.sendRequest(QueueTypesAndValues_1.MessageValues.GET_BY_NAME, { name: req.params.name }, QueueTypesAndValues_1.QueueNames.DOMAIN_WORKER);
        return utils_1.RespondWithJson(res, response);
    }
    async uploadFile(req, res) {
        const fileRows = [];
        fs.createReadStream(req.file.path)
            .pipe(csv({ separator: ';' }))
            .on('data', (data) => fileRows.push(data))
            .on('end', async () => {
            var e_1, _a;
            try {
                for (var fileRows_1 = __asyncValues(fileRows), fileRows_1_1; fileRows_1_1 = await fileRows_1.next(), !fileRows_1_1.done;) {
                    const data = fileRows_1_1.value;
                    await baseModel_1.broker.sendRequest(QueueTypesAndValues_1.MessageValues.UPLOAD_DOMAIN, data.domain, QueueTypesAndValues_1.QueueNames.DOMAIN_WORKER);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (fileRows_1_1 && !fileRows_1_1.done && (_a = fileRows_1.return)) await _a.call(fileRows_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            res.send('successfully done!');
        });
    }
    async getFileNames(req, res) {
        const p = utils_1.ResolvePath('tmp/csv');
        const response = await new Promise((accept, reject) => {
            fs.readdir(p, function (err, filenames) {
                if (err) {
                    console.log(err);
                    return reject('Something went wrong');
                }
                return accept(filenames);
            });
        });
        res.send(response);
    }
    init() {
        this.router.post(endpoindPaths_enum_1.CheckDomainPaths.UPLOAD_DOMAIN, upload.single('file'), this.uploadFile);
        this.router.get(endpoindPaths_enum_1.CheckDomainPaths.GET_FILES, this.getFileNames);
        this.router.get(endpoindPaths_enum_1.CheckDomainPaths.GET_ALL, this.getAllDomains);
        this.router.get(endpoindPaths_enum_1.CheckDomainPaths.GET_DOMAIN_BY_NAME, this.getDomainByName);
    }
}
exports.CheckDomainController = CheckDomainController;
//# sourceMappingURL=check_domain.controller.js.map