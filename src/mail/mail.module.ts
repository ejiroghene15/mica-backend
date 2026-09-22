import {Global, Module} from '@nestjs/common';
import {MailerModule} from '@nestjs-modules/mailer';
import {HandlebarsAdapter} from '@nestjs-modules/mailer/adapters/handlebars.adapter';
import {join} from 'path';
import {MailService} from './mail.service';
import {env} from "prisma/config";
import {BullModule} from "@nestjs/bullmq";
import {EmailProcessor} from "./mail.processor";

@Global()
@Module({
    imports: [
        MailerModule.forRoot({
            transport: {
                host: env('MAIL_HOST'),
                port: Number(env('MAIL_PORT')),
                secure: env('MAIL_SECURE') === 'true',
                ignoreTLS: env('MAIL_IGNORE_TLS') === 'true',
                auth: {
                    user: env('MAIL_USER'),
                    pass: env('MAIL_PASSWORD'),
                },
            },

            defaults: {
                from: env('MAIL_FROM'),
            },

            template: {
                dir: join(__dirname, 'templates').replace("src/", ""),
                adapter: new HandlebarsAdapter(),
                options: {
                    strict: true,
                },
            },
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