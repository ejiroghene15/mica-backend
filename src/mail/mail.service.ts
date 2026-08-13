import {Injectable} from '@nestjs/common';
import {MailerService} from '@nestjs-modules/mailer';
import {InjectQueue} from "@nestjs/bullmq";
import {Queue} from "bullmq";

@Injectable()
export class MailService {
    constructor(
        @InjectQueue('email') private readonly mailQueue: Queue,
        private readonly mailerService: MailerService,
    ) {
    }

    async sendWelcomeEmail(email: string, name: string) {
        await this.mailQueue.add('welcome-email', {name, email})
    }
}