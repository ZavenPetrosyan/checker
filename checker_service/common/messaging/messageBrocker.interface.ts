import { Queue, Exchange } from "amqp-ts-async";
import { MessageValues } from "./QueueTypesAndValues";

export interface IMessageBroker {
    sendRequest<Т>(code: MessageValues, body: any, queueName: string, ip?: string): Promise<Т>;
    init(): any;
    declareQueue(name: string, options?: Queue.DeclarationOptions): Queue;
    subscribe(queue: string, callback?: Function, exchange?: Exchange, ack?: boolean): void;
    callbackQueue: string;
}
