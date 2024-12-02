import nodemailer from "nodemailer";
const emailSender = async (email: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
      user: "forhadairdrop@gmail.com",
      pass: "ltkbluulivurgfqw",
    },
  });

  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: 'PH-Health-Care👻" <forhadairdrop@gmail.com>', // sender address
    to: email, // list of receivers
    subject: "Reset password link", // Subject line
    // text: "Hello world?", // plain text body
    html, // html body
  });

  console.log("Message sent: %s", info.messageId);
};

export default emailSender;
