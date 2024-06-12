import { Event } from "../model";

const eventNotificationTemplate = (event: Event) => {
  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      body {
        font-family: Arial, sans-serif;
      }
      .header {
        background-color: #f8f8f8;
        padding: 20px;
        text-align: center;
      }
      .content {
        margin: 20px;
      }
    </style>
  </head>
  <body>
    <div class="header">
      <img src="https://yourwebsite.com/logo.png" alt="Logo" height="50">
    </div>
    <div class="content">
      <h1>Hello, ${event.userName}!</h1>
      <p>Your event "${event.eventName}" is happening right now!</p>
      <p>This event will end on ${new Date(event.eventEndDate).toDateString()}</p>
      <p>Event Description: ${event.eventDescription}</p>
    </div>
  </body>
  </html>
  `

  const text = `Hello, ${event.userName}!\n Your event "${event.eventName}" is happening right now!\n Event Description: ${event.eventDescription}`;

  return {
    html,
    text
  };
};

const eventNotificationParticipantTemplate = (event: Event) => {
  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      body {
        font-family: Arial, sans-serif;
      }
      .header {
        background-color: #f8f8f8;
        padding: 20px;
        text-align: center;
      }
      .content {
        margin: 20px;
      }
    </style>
  </head>
  <body>
    <div class="header">
      <img src="https://yourwebsite.com/logo.png" alt="Logo" height="50">
    </div>
    <div class="content">
      <h1>Hello, there!</h1>
      <p>Event "${event.eventName}" is happening right now!</p>
      <p>This event will end on ${new Date(event.eventEndDate).toDateString()}</p>
      <p>Event Description: ${event.eventDescription}</p>
      <p>You were invited to this event by ${event.userName}</p>
    </div>
  </body>
  </html>
  `

  const text = `Hello there!\n Event "${event.eventName}" is happening right now!\n Event Description: ${event.eventDescription}\n You were invited to this event by ${event.userName}`;

  return {
    html,
    text
  };
}

export {
  eventNotificationTemplate,
  eventNotificationParticipantTemplate
};
