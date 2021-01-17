import { DomainService } from "../components/service/checkDomain";
import { MessageHandlerBase } from "../../common/messaging/MessageHandlerBase";
import { MessageValues } from "../../common/messaging/QueueTypesAndValues";

const domainService = new DomainService();

export class MessageHandler extends MessageHandlerBase {
    protected async handleMessage(message: any): Promise<{} | void> {
        const body = message.body;

        switch (message.value) {
            case MessageValues.UPLOAD_DOMAIN:
                return domainService.upload(body);
            case MessageValues.GET_ALL:
                return domainService.list();
            case MessageValues.GET_BY_NAME:
                return domainService.getByName(body.name);
        };
    }

}