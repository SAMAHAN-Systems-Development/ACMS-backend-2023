import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

export class EmailSender {
  sendEmail(
    imageSrc: string,
    qrCode: string,
    studentEmail: string,
    requires_payment: boolean,
  ) {
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
    const attachments = requires_payment
      ? [
          {
            filename: 'receipt.png',
            path: imageSrc,
          },
          {
            filename: 'qr-code',
            path: qrCode,
          },
        ]
      : [
          {
            filename: 'qr-code',
            path: qrCode,
          },
        ];

    const mailConfig = {
      from: process.env.CLIENT_EMAIL,
      to: studentEmail,
      subject: 'Hello from Nodemailer',
      text: 'This is a test email sent using Nodemailer.',
      attachments: attachments,
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
