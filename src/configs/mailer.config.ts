import nodemailer, { TransportOptions } from "nodemailer";
import ejs from "ejs";
import path from "path";
import "dotenv/config";

const smtpConfig = {
  service: process.env.NODEMAILER_SERVICE,
  host: process.env.NODEMAILER_HOST,
  port: process.env.NODEMAILER_PORT, // 587 port is for TLS protocol
  secure: false,
  auth: {
    user: process.env.NODEMAILER_USER_EMAIL,
    pass: process.env.NODEMAILER_USER_PASSWORD,
  },
};

let transporter = nodemailer.createTransport(smtpConfig as TransportOptions);

// defining that we are going to use ejs for mail template
let renderTemplate = (data: any, relativePath: string) => {
  let mailHTML;
  ejs.renderFile(
    path.join(__dirname, "../views", relativePath),
    data,
    function (err, template) {
      if (err) {
        console.log("error in rendering template", err);
        return;
      }

      mailHTML = template;
    }
  );

  return mailHTML;
};

const mailer = {
  transporter: transporter,
  renderTemplate: renderTemplate,
};

export default mailer;
