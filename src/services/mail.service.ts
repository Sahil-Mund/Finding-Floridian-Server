import { contactFormSchema } from "src/types/contactBody";
import mailer from "../configs/mailer.config";
import "dotenv/config";

type MapKey = "buySellHome" | "partnership" | "others" | "homeTour";

const map: Record<MapKey, string> = {
  buySellHome: "/buy-sell-contact.ejs",
  partnership: "/partnership-contact.ejs",
  homeTour: "/home-tour-contact.ejs",
  others: "/others-contact.ejs",
};

const sendContactUsEmail = async (subject: string, data: contactFormSchema) => {
  // Check if the type is a valid key

  if (data.specifications && map[data.specifications as MapKey]) {
    let htmlString = mailer.renderTemplate(
      { data: data },
      // map[data.specifications as MapKey]
      "/common-template.ejs"
    );

    mailer.transporter.sendMail(
      {
        from: process.env.NODEMAILER_USER_EMAIL,
        to:  "sahil.mund@tryantler.com" || "USER_EMAIL_NOT_FOUND",
        subject,
        html: htmlString,
      },
      (err: Error, info: any) => {
        if (err) {
          console.log("Error in sending mail", err);
          return;
        }

        console.log("Message sent", info);
        return;
      }
    );
  } else {
    // Handle the case where data.type is not valid
    throw new Error("Invalid type provided");
  }
};

export default sendContactUsEmail;
