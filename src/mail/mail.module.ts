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
        MailerModule.forRoot({
            transport: {
                host: env('MAIL_HOST'),
                port: Number(env('MAIL_PORT')),
                secure: true,
                auth: {
                    user: env('MAIL_USER'),
                    pass: env('MAIL_PASSWORD'),
                },
            },

            defaults: {
                from: env('MAIL_FROM'),
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