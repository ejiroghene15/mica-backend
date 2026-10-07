import {Global, Module} from '@nestjs/common';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {MailerModule} from '@nestjs-modules/mailer';
import {MailService} from './mail.service';
import {BullModule} from "@nestjs/bullmq";
import {EmailProcessor} from "./mail.processor";
import {HandlebarsAdapter} from '@nestjs-modules/mailer/adapters/handlebars.adapter';
import * as path from "node:path";


@Global()
@Module({
    imports: [
        MailerModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                transport: {
                    host: config.get('MAIL_HOST'),
                    port: config.get('MAIL_PORT'),
                    auth: {
                        user: config.get('MAIL_USER'),
                        pass: config.get('MAIL_PASSWORD'),
                    },
                },
                defaults: {
                    from: config.get('MAIL_FROM'),
                },

                template: {
                    dir: path.join(__dirname, 'templates').replace("src/", ""),
                    adapter: new HandlebarsAdapter(),
                    options: {
                        strict: true,
                    },
                },
            }),
        }),

        BullModule.registerQueue({
            name: 'email',
        }),
    ],

    providers: [MailService, EmailProcessor],

    exports: [MailService],
})
export class MailModule {
    constructor() {
    }
}