import { Process, Processor } from '@nestjs/bull';
import { Inject, Logger } from '@nestjs/common';
import { Job } from 'bull';
import { TRANSCODE_QUEUE } from './constants';
import { MailerService } from '@nestjs-modules/mailer';

interface TranscodeJobData {
  to: string;
  subject: string;
  template: string;
  context:object
  // Add other properties if needed
}
@Processor(TRANSCODE_QUEUE)
export class TranscodeConsumer {
  private readonly logger = new Logger(TranscodeConsumer.name);

  constructor(private readonly mailService:MailerService) {}

  @Process()
  async transcode(job: Job<TranscodeJobData>) {

    try {
      await this.mailService.sendMail({
        to: job.data.to,
        subject: job.data.subject,
        template: job.data.template,
        context :job.data.context,
      });
      this.logger.log(`Transcoding complete for job: ${job.id}`);
    } catch (error) {
      console.error('An error occurred during transcoding:', error);
    }
  }
}