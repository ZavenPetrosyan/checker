const csv = require('csv-parser');
const fs = require('fs');
import { Router, Response, Request } from 'express';
import { broker } from '../../common/base/baseModel';
import { MessageValues, QueueNames } from '../../common/messaging/QueueTypesAndValues';
import { CheckDomainPaths } from './enums/endpoindPaths.enum';
import * as multer from 'multer';
import { ResolvePath, RespondWithJson } from '../../utils/utils';
import { ErrorCodes, ErrorUtil } from '../../common/messaging/errorCodes';

const upload = multer({ dest: 'tmp/csv/' });

export class CheckDomainController {
  router: Router;

  constructor() {
    this.router = Router();
    this.init();
  }

  public async getAllDomains(req: Request, res: Response): Promise<any> {
    const response: Array<object> = await broker.sendRequest(
      MessageValues.GET_ALL,
      {},
      QueueNames.DOMAIN_WORKER
    );
    return RespondWithJson(res, response);
  }

  public async getDomainByName(req: Request, res: Response): Promise<any> {
    const response: object = await broker.sendRequest(
      MessageValues.GET_BY_NAME,
      { name: req.params.name },
      QueueNames.DOMAIN_WORKER
    );
    return RespondWithJson(res, response);
  }

  public async uploadFile(req: any, res: Response): Promise<any> {
    const fileRows: any = [];
    fs.createReadStream(req.file.path)
      .pipe(csv({ separator: ';' }))
      .on('data', (data) => fileRows.push(data))
      .on('end', async () => {
        for await (const data of fileRows) {
          if (!data) {
              throw ErrorUtil.newError(ErrorCodes.BAD_REQUEST);
          }
          await broker.sendRequest(
            MessageValues.UPLOAD_DOMAIN,
            data.domain,
            QueueNames.DOMAIN_WORKER
          );
        }
        res.send('successfully done!');
      });
  }

  public async getFileNames(req: Request, res: Response): Promise<any> {
    const p = ResolvePath('tmp/csv');
    const response = await new Promise((accept, reject) => {
      fs.readdir(p, function (err: ErrorCodes, filenames: unknown) {
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
    this.router.get(CheckDomainPaths.GET_ALL, this.getAllDomains);
    this.router.get(CheckDomainPaths.GET_FILES, this.getFileNames);
    this.router.get(CheckDomainPaths.GET_DOMAIN_BY_NAME, this.getDomainByName);
    this.router.post(CheckDomainPaths.UPLOAD_DOMAIN, upload.single('file'), this.uploadFile);
  }
}
