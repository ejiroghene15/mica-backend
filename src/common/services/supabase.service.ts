import {Injectable} from '@nestjs/common';
import {createClient, SupabaseClient} from '@supabase/supabase-js';
import {env} from "prisma/config";

@Injectable()
export class SupabaseService {
    private client: SupabaseClient;

    constructor() {
        this.client = createClient(
            env('SUPABASE_URL'),
            env('SUPABASE_SERVICE_ROLE_KEY')
        );
    }

    async uploadAvatar(file: Express.Multer.File, key: string): Promise<string> {
        const {error} = await this.client.storage
            .from('avatars')
            .upload(key, file.buffer, {
                contentType: file.mimetype,
                upsert: true, // overwrite if same key exists
            });


        if (error) throw error;

        const {data} = this.client.storage.from('avatars').getPublicUrl(key);
        return data.publicUrl;
    }

    async deleteAvatar(key: string) {
        await this.client.storage.from('avatars').remove([key]);
    }
}