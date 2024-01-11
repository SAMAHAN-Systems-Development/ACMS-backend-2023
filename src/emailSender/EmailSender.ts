import * as nodemailer from 'nodemailer';

export class EmailSender {
  sendEmail(studentEmail: string) {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.CLIENT_EMAIL,
        pass: process.env.CLIENT_PASSWORD,
      },
    });
    const mailConfig = {
      from: process.env.client_EMAIL,
      to: studentEmail,
      subject: 'Kuya para po bababa na kame',
      text: 'https://www.youtube.com/watch?v=iw9WlA62VF8',
      attachments: [{
        
      }]
    };
    transporter.sendMail(mailConfig, (error, info) => {
      if (error) {
        console.error('Error sending email: ', error);
      } else {
        console.log('Email sent: ', info.response);
      }
    });
  }
}
