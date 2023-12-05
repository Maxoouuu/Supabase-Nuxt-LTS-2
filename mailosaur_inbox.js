import MailosaurClient from "mailosaur";
import "dotenv/config";

(async () => {
  const apiKey = process.env.MAILOSAUR_API_KEY;
  const serverId = process.env.MAILOSAUR_SERVER_ID;
  const mailosaurMail = process.env.MAILOSAUR_TEST_EMAIL;

  const mailosaur = new MailosaurClient(apiKey);

  const criteria = {
    sentTo: mailosaurMail,
  };

  const options = {
    receivedAfter: new Date(new Date().getTime() - (6 * 60 * 60 * 1000)), // 6 dernières heures
  };

  try {
    const email = await mailosaur.messages.get(serverId, criteria, options);
    console.log(`Subject: ${email.subject}`);
    
    if (email.html && email.html.links && email.html.links.length > 0) {
      const firstLink = email.html.links[0].href; 
      console.log(`First link: ${firstLink}`);
    } else {
      console.log("No links found in the email body.");
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
})();
