import * as nodemailer from 'nodemailer';

export class StarSearchEmailSender {
  sendEmail(
    imageSrc: string,
    qrCode: string,
    studentEmail: string,
    requires_payment: boolean,
    controlNumber: string,
    eventDate: string,
    studentName: string,
    studentYear: string,
    studentType: string,
    ticketType: string,
    ticketCost: string,
    uuid: string,
  ) {
    const venue = 'Bapa Benny Tudtud Auditorium, Ateneo de Davao University';
    const eventTitle = "UFest '24: Star Search";
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
            cid: 'qr-code-image-01',
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
      subject: 'UFest Star Search Ticket Confirmation',
      html: this.getHtmlBody(
        controlNumber,
        studentName,
        studentYear,
        studentType,
        ticketType,
        ticketCost,
        venue,
        eventDate,
        eventTitle,
        uuid,
      ),
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

  getTierUrl(tierName: string) {
    switch (tierName) {
      case 'MADAYAW TIER':
        return 'https://fjqloxpyknqccretzoyt.supabase.co/storage/v1/object/public/assets/MADAYAW%20TIER.png';
      case 'VVIP':
        return 'https://fjqloxpyknqccretzoyt.supabase.co/storage/v1/object/public/assets/VVIP.png';
      case 'Gold':
        return 'https://fjqloxpyknqccretzoyt.supabase.co/storage/v1/object/public/assets/GOLD.png';
      case 'Silver':
        return 'https://fjqloxpyknqccretzoyt.supabase.co/storage/v1/object/public/assets/SILVER.png';
      case 'Bronze':
        return 'https://fjqloxpyknqccretzoyt.supabase.co/storage/v1/object/public/assets/BRONZE.png';
      case 'Gen Ad':
        return 'https://fjqloxpyknqccretzoyt.supabase.co/storage/v1/object/public/assets/GEN%20AD.png';
      default:
        return 'https://fjqloxpyknqccretzoyt.supabase.co/storage/v1/object/public/assets/GEN%20AD.png';
    }
  }

  getHtmlBody(
    controlNumber: string,
    studentName: string,
    studentYear: string,
    studentType: string,
    ticketType: string,
    ticketCost: string,
    venue: string,
    eventDate: string,
    eventTitle: string,
    uuid: string,
  ) {
    // const tierUrl = this.getTierUrl(ticketType);
    const emailImageHeader =
      'https://fjqloxpyknqccretzoyt.supabase.co/storage/v1/object/public/assets/ss%20email%20header(1).png';
    const emailImageFooter =
      'https://fjqloxpyknqccretzoyt.supabase.co/storage/v1/object/public/assets/Footer.PNG';
    const emailImageHeaderMobile =
      'https://fjqloxpyknqccretzoyt.supabase.co/storage/v1/object/public/assets/ss%20email%20header(1).png';
    const emailImageFooterMobile =
      'https://fjqloxpyknqccretzoyt.supabase.co/storage/v1/object/public/assets/Footer.PNG';

    return `<!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
    
    <head>
      <!--[if gte mso 9]>
    <xml>
      <o:OfficeDocumentSettings>
        <o:AllowPNG/>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
    <![endif]-->
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta name="x-apple-disable-message-reformatting">
      <!--[if !mso]><!-->
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <!--<![endif]-->
      <title></title>
    
      <style type="text/css">
      @media only screen and (min-width: 620px) {
        .u-row {
          width: 600px !important;
        }
        .u-row .u-col {
          vertical-align: top;
        }
        .u-row .u-col-100 {
          width: 600px !important;
        }
      }
      
      @media (max-width: 620px) {
        .u-row-container {
          max-width: 100% !important;
          padding-left: 0px !important;
          padding-right: 0px !important;
        }
        .u-row .u-col {
          min-width: 320px !important;
          max-width: 100% !important;
          display: block !important;
        }
        .u-row {
          width: 100% !important;
        }
        .u-col {
          width: 100% !important;
        }
        .u-col>div {
          margin: 0 auto;
        }
      }
      
      body {
        margin: 0;
        padding: 0;
      }
      
      table,
      tr,
      td {
        vertical-align: top;
        border-collapse: collapse;
      }
      
      p {
        margin: 0;
      }
      
      .ie-container table,
      .mso-container table {
        table-layout: fixed;
      }
      
      * {
        line-height: inherit;
      }
      
      a[x-apple-data-detectors='true'] {
        color: inherit !important;
        text-decoration: none !important;
      }
      
      @media (min-width: 0px) {
        .hide-default__display-table {
          display: table !important;
          mso-hide: unset !important;
        }
      }
      
      @media (max-width: 480px) {
        .hide-mobile {
          max-height: 0px;
          overflow: hidden;
          display: none !important;
        }
      }
      
      @media (min-width: 481px) {
        .hide-desktop {
          max-height: 0px;
          overflow: hidden;
          display: none !important;
        }
      }
      
      table,
      td {
        color: #000000;
      }
      
      @media (max-width: 480px) {
        #u_content_image_4 .v-container-padding-padding {
          padding: 10px !important;
        }
        #u_content_image_4 .v-src-width {
          width: auto !important;
        }
        #u_content_image_4 .v-src-max-width {
          max-width: 100% !important;
        }
      }
    </style>
    
    
    
      <!--[if !mso]><!-->
      <link href="https://fonts.googleapis.com/css?family=Cabin:400,700" rel="stylesheet" type="text/css">
      <!--<![endif]-->
    
    </head>
    
    <body class="clean-body u_body" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #F9F2DF;color: #000000">
      <!--[if IE]><div class="ie-container"><![endif]-->
      <!--[if mso]><div class="mso-container"><![endif]-->
      <table style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #F9F2DF;width:100%" cellpadding="0" cellspacing="0">
        <tbody>
          <tr style="vertical-align: top">
            <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
              <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color: #F9F2DF;"><![endif]-->
    
    
    
              <div class="u-row-container" style="padding: 0px;background-color: transparent">
                <div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
                  <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                    <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: transparent;"><![endif]-->
    
                    <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
                    <div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
                      <div style="height: 100%;width: 100% !important;">
                        <!--[if (!mso)&(!IE)]><!-->
                        <div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
                          <!--<![endif]-->
    
                          <table class="hide-mobile" style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                        <tbody>
                          <tr>
                            <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:0px;font-family:'Cabin',sans-serif;" align="left">

                              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                  <td style="padding-right: 0px;padding-left: 0px;" align="center">

                                    <img align="center" border="0" src="${emailImageHeader}" alt="" title="" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 100%;max-width: 600px;"
                                      width="600" class="v-src-width v-src-max-width" />

                                  </td>
                                </tr>
                              </table>

                            </td>
                          </tr>
                        </tbody>
                      </table>
    
                          <!--[if (!mso)&(!IE)]><!-->
                        </div>
                        <!--<![endif]-->
                      </div>
                    </div>
                    <!--[if (mso)|(IE)]></td><![endif]-->
                    <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                  </div>
                </div>
              </div>
    
    
    
    
    
              <div class="u-row-container" style="padding: 0px;background-color: transparent">
                <div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #ffffff;">
                  <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                    <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #ffffff;"><![endif]-->
    
                    <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
                    <div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
                      <div style="height: 100%;width: 100% !important;">
                        <!--[if (!mso)&(!IE)]><!-->
                        <div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
                          <!--<![endif]-->
                          <!--[if !mso]><!-->
                          <table class="hide-default__display-table hide-desktop" style="display: none;mso-hide: all;font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                            <tbody>
                              <tr>
                                <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:0px;font-family:'Cabin',sans-serif;" align="left">
    
                                  <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                    <tr>
                                      <td style="padding-right: 0px;padding-left: 0px;" align="center">
    
                                        <img align="center" border="0" src="${emailImageHeaderMobile}" alt="" title="" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 100%;max-width: 600px;"
                                          width="600" class="v-src-width v-src-max-width" />
    
                                      </td>
                                    </tr>
                                  </table>
    
                                </td>
                              </tr>
                            </tbody>
                          </table>
                          <!--<![endif]-->
        
                          <table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                            <tbody>
                              <tr>
                                <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:33px 55px;font-family:'Cabin',sans-serif;" align="left">
    
                                  <div style="font-size: 14px; color: #000000; line-height: 160%; text-align: center; word-wrap: break-word;">
                                    <p style="font-size: 14px; line-height: 160%;"><span style="font-size: 22px; line-height: 35.2px;">You have secured your seat for <strong>Star Search 2024</strong>!</span></p>
                                    <p style="font-size: 14px; line-height: 160%;">Thank you for supporting your cluster participant and the cause of this event! This is to confirm receipt of your ticket purchase for Star Search 2024.</p>
                                  </div>
    
                                </td>
                              </tr>
                            </tbody>
                          </table>
    
                          <table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                            <tbody>
                              <tr>
                                <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:15px;font-family:'Cabin',sans-serif;" align="left">
    
                                  <div style="font-family: inherit; font-size: 14px; color: #78561a; line-height: 140%; text-align: left; word-wrap: break-word;">
                                    <p style="text-align: justify; line-height: 140%;"><span style="color: #000000; white-space-collapse: preserve; line-height: 19.6px;">Below are the details of your ticket purchase:</span></p>
                                    <p style="line-height: 140%;">&nbsp;</p>
                                    <p style="text-align: justify; line-height: 140%;"><span style="color: #000000; white-space-collapse: preserve; line-height: 19.6px;"><strong>Control Number: </strong>${controlNumber}</span></p>
                                    <p style="text-align: justify; line-height: 140%;"><span style="color: #000000; white-space-collapse: preserve; line-height: 19.6px;"><strong>Event:</strong> ${eventTitle}</span></p>
                                    <p style="text-align: justify; line-height: 140%;"><span style="color: #000000; white-space-collapse: preserve; line-height: 19.6px;"><strong>Date:</strong> ${eventDate}</span></p>
                                    <p style="text-align: justify; line-height: 140%;"><span style="color: #000000; white-space-collapse: preserve; line-height: 19.6px;"><strong>Venue:</strong> ${venue}</span></p>
                                    <p style="text-align: justify; line-height: 140%;"><span style="color: #000000; white-space-collapse: preserve; line-height: 19.6px;"><strong>Student Name:</strong> ${studentName}</span></p>
                                    <p style="text-align: justify; line-height: 140%;"><span style="color: #000000; white-space-collapse: preserve; line-height: 19.6px;"><strong>Student Year and Course:</strong> ${studentYear}</span></p>
                                    <p style="text-align: justify; line-height: 140%;"><span style="color: #000000; white-space-collapse: preserve; line-height: 19.6px;"><strong>Student Type:</strong> ${studentType}</span></p>
                                    <p style="text-align: justify; line-height: 140%;"><span style="color: #000000; line-height: 19.6px;"><span style="white-space-collapse: preserve; line-height: 19.6px;"><strong>Ticket Type:</strong> ${ticketType}</span><span style="white-space-collapse: preserve; line-height: 19.6px;"></span></span>
                                    </p>
                                    <p style="text-align: justify; line-height: 140%;"><span style="color: #000000; white-space-collapse: preserve; line-height: 19.6px;"><strong>Ticket cost:</strong> ${ticketCost}</span></p>
                                  </div>
    
                                </td>
                              </tr>
                            </tbody>
                          </table>
    
                          <table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                            <tbody>
                              <tr>
                                <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:15px;font-family:'Cabin',sans-serif;" align="left">
    
                                  <div style="font-size: 14px; color: #78561a; line-height: 140%; text-align: left; word-wrap: break-word;">
                                    <p style="text-align: justify; line-height: 140%;"><span style="color: #000000; white-space-collapse: preserve; line-height: 19.6px;">📌 <strong>IMPORTANT REMINDERS: </strong></span></p>
                                    <p style="line-height: 140%;">&nbsp;</p>
                                    <ol style="margin-top: 0px; margin-bottom: 0px; padding-inline-start: 48px;">
                                      <li style="color: #000000; line-height: 19.6px;">
                                        <p style="text-align: justify; line-height: 140%;"><span style="text-wrap: wrap; line-height: 19.6px;">Bringing food and drinks inside the auditorium is not allowed.</span></p>
                                      </li>
                                      <li style="color: #000000; line-height: 19.6px;">
                                        <p style="text-align: justify; line-height: 140%;"><span style="text-wrap: wrap; line-height: 19.6px;">Clusters are allowed to bring banners and props to emphasize their support to their participant but CLAYGO has to be practiced.</span></p>
                                      </li>
                                      <li style="color: #000000; line-height: 19.6px;">
                                        <p style="text-align: justify; line-height: 140%;"><span style="text-wrap: wrap; line-height: 19.6px;">Any cluster banners and props left in the venue after the event may subject the cluster to deduction.</span></p>
                                      </li>
                                      <li style="color: #000000; line-height: 19.6px;">
                                        <p style="text-align: justify; line-height: 140%;"><span style="text-wrap: wrap; line-height: 19.6px;">Jeering is strictly prohibited. Any clusters caught will be subject to deduction/disqualification.</span></p>
                                      </li>
                                    </ol>
                                    <p style="line-height: 140%;">&nbsp;</p>
                                    </p>
                                  </div>    
                                </td>
                              </tr>
                            </tbody>
                          </table>
    
                          <table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                            <tbody>
                              <tr>
                                <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:50px 10px 10px;font-family:'Cabin',sans-serif;" align="left">
    
                                  <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                    <tr>
                                      <td style="padding-right: 0px;padding-left: 0px;" align="center">
    
                                        <img align="center" border="0" src="cid:qr-code-image-01" alt="" title="" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 100%;max-width: 218px;"
                                          width="218" class="v-src-width v-src-max-width" />
    
                                      </td>
                                    </tr>
                                  </table>
    
                                </td>
                              </tr>
                            </tbody>
                          </table>
    
                          <table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                            <tbody>
                              <tr>
                                <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:0px;font-family:'Cabin',sans-serif;" align="left">
    
                                  <div style="font-size: 14px; line-height: 140%; text-align: center; word-wrap: break-word;">
                                    <p style="line-height: 140%;">${uuid}</p>
                                  </div>
    
                                </td>
                              </tr>
                            </tbody>
                          </table>
    
                          <table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                            <tbody>
                              <tr>
                                <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:30px 60px;font-family:'Cabin',sans-serif;" align="left">
    
                                  <div style="font-size: 14px; line-height: 160%; text-align: center; word-wrap: break-word;">
                                    <p style="line-height: 160%;"><span style="font-size: 14px; line-height: 22.4px; color: #000000;">Proceeds of the event will be donated to Pinaskuhan ni Iggy, SAMAHAN’s Advocacy Project to be implemented in the month of December</span></p>
                                  </div>
    
                                </td>
                              </tr>
                            </tbody>
                          </table>
    
                          <!--[if (!mso)&(!IE)]><!-->
                        </div>
                        <!--<![endif]-->
                      </div>
                    </div>
                    <!--[if (mso)|(IE)]></td><![endif]-->
                    <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                  </div>
                </div>
              </div>
    
    
    
    
    
              <div class="u-row-container" style="padding: 0px;background-color: transparent">
                <div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #e5eaf5;">
                  <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                    <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #e5eaf5;"><![endif]-->
    
                    <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
                    <div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
                      <div style="height: 100%;width: 100% !important;">
                        <!--[if (!mso)&(!IE)]><!-->
                        <div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
                          <!--<![endif]-->
    
                          <table class="hide-mobile" style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                        <tbody>
                          <tr>
                            <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:0px;font-family:'Cabin',sans-serif;" align="left">

                              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                  <td style="padding-right: 0px;padding-left: 0px;" align="center">

                                  </td>
                                </tr>
                              </table>

                            </td>
                          </tr>
                        </tbody>
                      </table>
    
                          <!--[if (!mso)&(!IE)]><!-->
                        </div>
                        <!--<![endif]-->
                      </div>
                    </div>
                    <!--[if (mso)|(IE)]></td><![endif]-->
                    <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                  </div>
                </div>
              </div>
    

              <div class="u-row-container" style="padding: 0px;background-color: transparent">
              <div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #e5eaf5;">
                <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                  <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #e5eaf5;"><![endif]-->
  
                  <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
                  <div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
                    <div style="height: 100%;width: 100% !important;">
                      <!--[if (!mso)&(!IE)]><!-->
                      <div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
                        <!--<![endif]-->
                        <!--[if !mso]><!-->
                        <table class="hide-default__display-table hide-desktop" style="display: none;mso-hide: all;font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                          <tbody>
                            <tr>
                              <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:0px;font-family:'Cabin',sans-serif;" align="left">
  
                                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                  <tr>
                                    <td style="padding-right: 0px;padding-left: 0px;" align="center">
  
  
                                    </td>
                                  </tr>
                                </table>
  
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        <!--<![endif]-->
                        <!--[if (!mso)&(!IE)]><!-->
                      </div>
                      <!--<![endif]-->
                    </div>
                  </div>
                  <!--[if (mso)|(IE)]></td><![endif]-->
                  <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                </div>
              </div>
            </div>
    
    
              <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
            </td>
          </tr>
        </tbody>
      </table>
      <!--[if mso]></div><![endif]-->
      <!--[if IE]></div><![endif]-->
    </body>
    
    </html>`;
  }
}
