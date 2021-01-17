import { AmqpBroker } from "./AmqpBrocker";
import { IMessageBroker } from "./messageBrocker.interface";
/**
 * Created by Georgi on 3/1/2017.
 */
export class BrokerUtil {
    private static broker: IMessageBroker;

    public static getBroker(): IMessageBroker {
        if (this.broker == null) {
            this.broker = new AmqpBroker();
        }
        return this.broker;
    }
}