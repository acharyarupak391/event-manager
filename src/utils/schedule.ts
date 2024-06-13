import { Request } from 'express';
import schedule from 'node-schedule';
import { DBEvent, Event } from '../model';
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

const scheduleAndEmail = (date: string, req: Request, id?: number) => {
  if (!id) {
    return;
  }

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

  schedule.scheduleJob(id.toString(), dateObj, async () => {
    console.log(`\n-------------------------------\nEvent started\n-------------------------------\n`);
    sendEventEmail(event);
  })
}

const deleteSchedule = (id: number) => {
  try {
    schedule.cancelJob(id.toString());
  } catch (error) {
    console.error(`Error deleting schedule:`, error);
  }
}

const updateSchedule = (date: string, req: Request, id?: number) => {
  if (!id) {
    return;
  }

  // delete the old schedule
  deleteSchedule(id);

  // create a new schedule
  scheduleAndEmail(date, req, id);
}

export { scheduleAndEmail, deleteSchedule, updateSchedule }