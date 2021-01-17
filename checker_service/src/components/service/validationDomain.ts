import * as dns from 'dns';
import { DomainModel } from '../model/domain.model';

export class ValidateDomain {
    private detectAddress(data: string): Promise<any> {
        return new Promise((accept) => {
            dns.resolve4(data, (err, res) => {
                if(err) accept([]);
                accept(res);
            })
        })
    }

    private detect(data: string): Promise<any> {
        return new Promise((accept, reject) => {
        dns.resolveSoa(data, async (err, res) => {
            const last_detected = Date.now();
            if (err) {
                accept({
                    name: data,
                    possybly_available: true,
                    last_detected
                });
            }
            const addresses = await this.detectAddress(data);
            accept({
                name: data,
                possyblyAvaliable: false,
                addresses,
                last_detected,
                ...res
            });
        })
       });
    }

    private isValid(data): boolean {
        if(!data) return false;
        return /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/.test(data);
    }


    public async detectDomain(data: string) {
        try {
            if(!this.isValid(data)) return;
            const res = await this.detect(data);
            await DomainModel.upsert(res);
            return 'done';
        } catch(e) {
            console.log(e);
        }
    }
}