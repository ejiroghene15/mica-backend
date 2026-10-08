// quick throwaway script, or a temp test
import "dotenv/config";
import {AiService} from './src/common/services/ai.service';

const ai = new AiService();
(async () => {
    for await (const chunk of ai.streamReply([{role: 'user', content: 'Say hi in one sentence'}])) {
        process.stdout.write(chunk);
    }
})();