import { Request } from 'express';
import schedule from 'node-schedule';
import { Event } from '../model';
import { eventNotificationTemplate } from './template';
import { sendEmail } from './email';

const sendEventEmail = async (event: Event) => {
  const { text, html } = eventNotificationTemplate(event)

  try {
    const { response, error } = await sendEmail({
      name: event.userName,
      email: event.userEmail,
      subject: 'Event Started',
      text,
      html
    })

    if (error) {
      console.error(`Error sending email:`, error);
    } else {
      console.log(`Email sent`);
    }
  } catch (error) {
    console.error(`Error sending email:`, error);
  }
}

const scheduleAndEmail = (date: string, req: Request) => {
  const dateObj = new Date(date);

  const event: Event = {
    userName: req.body.userName,
    userEmail: req.body.userEmail,
    eventName: req.body.eventName,
    eventDescription: req.body.eventDescription,
    eventStartDate: req.body.eventStartDate,
    eventEndDate: req.body.eventEndDate
  }

  schedule.scheduleJob(dateObj, async () => {
    console.log(`\n-------------------------------\nEvent started\n-------------------------------\n`);
    sendEventEmail(event);
  })
}

export { scheduleAndEmail }