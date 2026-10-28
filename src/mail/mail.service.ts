import {Injectable} from '@nestjs/common';
import {InjectQueue} from "@nestjs/bullmq";
import {Queue} from "bullmq";

@Injectable()
export class MailService {
    constructor(
        @InjectQueue('email') private readonly mailQueue: Queue,
    ) {
    }

    async sendWelcomeEmail({email, name, verificationUrl}) {
        await this.mailQueue.add('welcome-email', {name, email, verificationUrl})
    }

    async sendPasswordResetEmail(name: string, email: string, resetLink: string) {
        await this.mailQueue.add('password-reset-email', {name, email, resetLink})
    }

    async resendVerificationMail({email, name, verificationUrl}){
        await this.mailQueue.add('resend-verification-email', {name, email, verificationUrl})
    }
}