import { Queue, Exchange, Message } from "amqp-ts-async";
import { isNumber, toNumber } from "lodash";
import { v4 } from "uuid";
import { CONFIG } from "../../utils/utils"
import { ErrorCodes } from "./errorCodes";
import { IMessageBroker } from "./messageBrocker.interface";
import { MessageValues } from "./QueueTypesAndValues";
import * as Amqp from "amqp-ts-async";

const CONF = CONFIG();
const connectionString = process.env.MESSAGE_QUEUE || `${CONF.rabbit.url}?heartbeat=${CONF.rabbit.heartbeat}`;
const connection = new Amqp.Connection(connectionString);

export class AmqpBroker implements IMessageBroker {
    private requestPromise: any = {};
    
    declareQueue(name: string, options?: Queue.DeclarationOptions): Queue {
        return connection.declareQueue(name, options);
    }

    public callbackQueue: string;

    init() {
        return connection.completeConfiguration();
    }

    sendRequest(value: MessageValues, body: any, queueName: string, ip?: string): Promise<any> {
        return new Promise((res, rej) => {
            const reqId = v4();
            this.requestPromise[reqId] = { resolve: res, reject: rej };

            const message = new Message({ value: value, body: body, ip: ip });
            message.properties.replyTo = this.callbackQueue;
            message.properties.correlationId = reqId;

            connection.declareQueue(queueName, { noCreate: true }).send(message);
        });
    }

    async sendResponse(action: Function, body: any, message: Message, queueName: string): Promise<any> {
        const reply = await action(body).then(
            result => {
                const reply = {
                    errorCode: 0,
                    response: result
                };
                return reply;
            },
            error => {
                const reply = {
                    errorCode: -1,
                    response: error.message || error,
                    stack: error.stack
                };
                if (isNumber(reply.response)) {
                    reply.response = ErrorCodes[toNumber(reply.response)];
                }

                this.sendError(error, message.getContent(), queueName + "_exception");
                return reply;
            }
        );
        const replyMessage = new Message(reply);
        replyMessage.properties.correlationId = message.properties.correlationId;
        return replyMessage;
    }

    public sendError(error: any, body: string, queueName: string): void {
        const errorMessage = new Message({
            exception: error.message,
            stack: error.stack,
            onMessage: body,
            to: queueName,
            date: new Date().toUTCString()
        });

        const queue = connection.declareQueue(queueName);
        queue.send(errorMessage);
    }

    async subscribe(queueName: string, callback?: Function, exchange?: Exchange, ack: boolean = true) {
        let queue = connection.declareQueue(queueName, { prefetch: 1000 });
        if (exchange) {
            await queue.bind(exchange);
        }
        queue.activateConsumer(
            async message => {
                const body = message.getContent();
                const correlationId = message.properties.correlationId;
                const def = this.requestPromise[correlationId];

                if (correlationId && def) {
                    if (body.errorCode == 0) {
                        def.resolve(body.response);
                    } else {
                        def.reject(body.response);
                    }
                    delete this.requestPromise[correlationId];
                } else {
                    //if this is not reply
                    if (callback == null) {
                        return new Message();
                    } else {
                        const response = await this.sendResponse(callback, body, message, queueName);
                        if (ack) message.ack();
                        return response;
                    }
                }
            },
            { noAck: !ack }
        );
    }
}
