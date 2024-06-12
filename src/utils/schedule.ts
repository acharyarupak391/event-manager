import { Request } from 'express';
import schedule from 'node-schedule';
import { Event } from '../model';
import { eventNotificationParticipantTemplate, eventNotificationTemplate } from './template';
import { sendEmail } from './email';

const sendEventEmail = async (event: Event) => {
  const { text, html } = eventNotificationTemplate(event)

  try {
    sendEmail({
      name: event.userName,
      email: event.userEmail,
      subject: 'Event Started',
      text,
      html
    })

    event.participants.forEach(async (participant) => {
      const { text: t, html: h } = eventNotificationParticipantTemplate(event)
      sendEmail({
        name: participant,
        email: participant,
        subject: 'Event Started',
        text: t,
        html: h
      })
    })
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
    eventEndDate: req.body.eventEndDate,
    participants: req.body.participants,
    timezone: req.body.timezone
  }

  schedule.scheduleJob(dateObj, async () => {
    console.log(`\n-------------------------------\nEvent started\n-------------------------------\n`);
    sendEventEmail(event);
  })
}

export { scheduleAndEmail }