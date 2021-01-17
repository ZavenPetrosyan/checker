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
const express_1 = require("express");
const baseModel_1 = require("../../../common/src/base/baseModel");
const QueueTypesAndValues_1 = require("../../../common/src/messaging/QueueTypesAndValues");
const endpoindPaths_enum_1 = require("./enums/endpoindPaths.enum");
const multer = require("multer");
const csv = require('csv-parser');
const fs = require("fs");
const upload = multer({ dest: 'tmp/csv/' });
class CheckDomainController {
    constructor() {
        this.router = express_1.Router();
        this.init();
    }
    async getFileNames(req, res) {
        const result = await baseModel_1.broker.sendRequest(QueueTypesAndValues_1.MessageValues.GET_FILE_NAMES, { gago: true }, QueueTypesAndValues_1.QueueNames.DOMAIN_WORKER);
        res.send(result);
    }
    async getAllDomains(req, res) {
    }
    async getDomainByName(req, res) {
    }
    async uploadFile(req, res) {
        const fileRows = [];
        console.log(req.files, req.file);
        fs.createReadStream(req.file.path)
            .pipe(csv())
            .on('data', (data) => fileRows.push(data))
            .on('end', async () => {
            var e_1, _a;
            try {
                for (var fileRows_1 = __asyncValues(fileRows), fileRows_1_1; fileRows_1_1 = await fileRows_1.next(), !fileRows_1_1.done;) {
                    const data = fileRows_1_1.value;
                    console.log(data);
                    await baseModel_1.broker.sendRequest(QueueTypesAndValues_1.MessageValues.GET_FILE_NAMES, data, QueueTypesAndValues_1.QueueNames.DOMAIN_WORKER);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (fileRows_1_1 && !fileRows_1_1.done && (_a = fileRows_1.return)) await _a.call(fileRows_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            res.send(fileRows);
        });
    }
    init() {
        this.router.post(endpoindPaths_enum_1.CheckDomainPaths.CHECK_DOMAIN, upload.single('file'), this.uploadFile.bind(this));
        this.router.get(endpoindPaths_enum_1.CheckDomainPaths.GET_FILES, this.getFileNames.bind(this));
        this.router.get(endpoindPaths_enum_1.CheckDomainPaths.GET_ALL, this.getAllDomains.bind(this));
        this.router.get(endpoindPaths_enum_1.CheckDomainPaths.GET_DOMAIN_BY_NAME, this.getDomainByName.bind(this));
    }
}
exports.CheckDomainController = CheckDomainController;
//# sourceMappingURL=check_domain.controller.js.map