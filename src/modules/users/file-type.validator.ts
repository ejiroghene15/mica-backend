// common/validators/magic-file-type.validator.ts
import {FileValidator} from '@nestjs/common';
import {fileTypeFromBuffer} from 'file-type';
import {extname} from 'path';

export interface MagicFileTypeValidatorOptions {
    allowedMimeTypes: string[];
    allowedExtensions: string[]; // e.g. ['.jpg', '.jpeg', '.png', '.webp']
}

export class MagicFileTypeValidator extends FileValidator<MagicFileTypeValidatorOptions> {
    private failureReason = '';

    buildErrorMessage(): string {
        return this.failureReason || 'File failed type validation';
    }

    async isValid(file?: Express.Multer.File): Promise<boolean> {
        if (!file?.buffer) {
            this.failureReason = 'No file provided';
            return false;
        }

        // 1. Check the claimed extension is in the allowed list at all
        const ext = extname(file.originalname).toLowerCase();
        if (!this.validationOptions.allowedExtensions.includes(ext)) {
            this.failureReason = `Extension "${ext}" is not allowed`;
            return false;
        }

        // 2. Check the actual bytes match a known image signature
        const detected = await fileTypeFromBuffer(file.buffer);
        if (!detected) {
            this.failureReason = 'File content is not a recognizable file type';
            return false;
        }
        if (!this.validationOptions.allowedMimeTypes.includes(detected.mime)) {
            this.failureReason = `Detected type "${detected.mime}" is not allowed`;
            return false;
        }

        // 3. Cross-check: does the claimed extension actually match the real content?
        // file-type returns its own canonical extension for the detected bytes (e.g. 'jpg', 'png')
        const detectedExt = `.${detected.ext}`;
        const isJpegVariant =
            (ext === '.jpg' || ext === '.jpeg') && (detectedExt === '.jpg' || detectedExt === '.jpeg');

        if (detectedExt !== ext && !isJpegVariant) {
            this.failureReason = `File extension "${ext}" does not match actual content type "${detected.ext}"`;
            return false;
        }

        return true;
    }
}