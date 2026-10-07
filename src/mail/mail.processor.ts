import {Processor, WorkerHost} from '@nestjs/bullmq';
import {Job} from 'bullmq';
import {Logger} from '@nestjs/common';
import {MailerService} from "@nestjs-modules/mailer";

@Processor('email')
export class EmailProcessor extends WorkerHost {
    private readonly logger = new Logger(EmailProcessor.name);

    constructor(private readonly mailerService: MailerService) {
        super();
    }

    async process(job: Job): Promise<void> {
        switch (job.name) {
            case 'welcome-email':
                await this.handleWelcomeEmail(job);
                break;
            default:
                this.logger.warn(`Unknown job type: ${job.name}`);
        }
    }

    private async handleWelcomeEmail(job: Job<{ name: string; email: string, verificationUrl: string }>) {
        const {name, email, verificationUrl} = job.data;
        await this.mailerService.sendMail({
            to: email,
            subject: 'Welcome to Mica',
            template: 'welcome',
            context: {
                name,
                verificationUrl,
                year: new Date().getFullYear(),
            },
        });

    }
}