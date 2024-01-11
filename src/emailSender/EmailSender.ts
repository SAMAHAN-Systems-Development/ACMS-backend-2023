import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

export class EmailSender {
  sendEmail(image: string, studentEmail: string) {
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
      subject: 'Hello from Nodemailer',
      text: 'This is a test email sent using Nodemailer.',
      attachments: [
        {
          filename: 'boo.png',
          content: image,
          encoding: 'base64',
        },
      ],
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
