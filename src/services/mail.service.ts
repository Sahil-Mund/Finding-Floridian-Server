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

export const sendContactUsEmail = async (subject: string, data: contactFormSchema) => {
  // Check if the type is a valid key

  if (data.specifications && map[data.specifications as MapKey]) {
    // let htmlString = mailer.renderTemplate(
    //   { data: data },
    //   // map[data.specifications as MapKey]
    //   "/common-template.ejs"
    // );


    let htmlString = `
    <div>
  <h2>Hi Carter,</h2>
  <p>The below User has tried to contact you with the below information.</p>

  <h4>Name :- ${data.firstName} ${data.lastName}</h4>
  <h4>Email :- ${data.email}</h4>
  <h4>Phone Number :- ${data.phoneNumber}</h4>
  <p> Selected Specification : <strong>${data.specifications}</strong></p>
  <p><strong>Here is the below message sent by the client :-</strong></p>
  <h5>${data.message}</h5>
  <p>Thanks!</p>
</div>
    `
    console.log(htmlString);


    mailer.transporter.sendMail(
      {
        from: process.env.NODEMAILER_USER_EMAIL,
        to: "sahil.mund@tryantler.com" || "USER_EMAIL_NOT_FOUND",
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


export const sendMailToAdmin = async (subject: string, data: any) => {
  // Check if the type is a valid key



  let htmlString = `
    <div>
  <h4>Hi Carter,</h4>
  <p>A new User has tried to contact you, here is the user details.</p>

  <p>First Name :- ${data.firstName} </p>
  <p>Last Name :- ${data.lastName} </p>
  <p>Email :- ${data.email}</p>
  <p>Phone Number :- ${data.phone}</p>
  <p>Thanks!</p>
</div>
    `

    console.log(htmlString);
    


 await mailer.transporter.sendMail(
    {
      from: process.env.NODEMAILER_USER_EMAIL,
      to: process.env.ADMIN_EMAIL || "USER_EMAIL_NOT_FOUND",
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

  console.log('email message sent');
  
};

