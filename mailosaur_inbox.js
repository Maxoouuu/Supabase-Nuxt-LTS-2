import MailosaurClient from 'mailosaur';
import 'dotenv/config';

(async () => {
  const apiKey = process.env.MAILOSAUR_API_KEY;
  const serverId = process.env.MAILOSAUR_SERVER_ID;
  const mailosaurMail = process.env.MAILOSAUR_TEST_EMAIL;

  const mailosaur = new MailosaurClient(apiKey);

  const criteria = {
    sentTo: mailosaurMail
  };

  const email = await mailosaur.messages.get(serverId, criteria);
  console.log(`Subject: ${email.subject}`);
})();
