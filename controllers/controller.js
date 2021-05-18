const axios = require("axios");
const cron = require("node-cron");
const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  service: "gmail", //Edit this service if using a different service  --NOTE: if using gmail, see this link, you'll need to disable a security setting in order to send emails from it https://nodemailer.com/usage/using-gmail/
  auth: {
    user: "email", //Input username (or email) for the email address you want to send emails from
    pass: "pass", //Input password
  },
});

cron.schedule("*/10 * * * * *", () => {
  getTickets();
});

const getTickets = async () => {
  //date array that holds dates to be checked
  const dates = [
    "2021-06-11",
    "2021-06-12",
    "2021-06-13",
    "2021-06-14",
    "2021-06-15",
    "2021-06-16",
    "2021-06-17",
  ];

  let responseArray = [];

  for (date of dates) {
    let url = `https://www.recreation.gov/api/timedentry/availability/facility/10087086?date=${date}`;

    let options = {
      method: "get",
      url: url,
    };

    const response = await axios(options);
    responseArray.push(response.data[0]);
  }

  let ticketResponse = getTicketCount(responseArray);

  let message;
  let messageArray = [];
  ticketResponse.forEach((date) => {
    if (date.ticketsRemaining > 0) {
      message = `There are ${date.ticketsRemaining} ticket(s) avalible for ${date.date}`;
      messageArray.push(message);
    }
  });

  if (messageArray.length !== 0) {
    console.log(messageArray);
    transporter.sendMail(
      {
        from: "email", //Input sender email address here
        to: "email", //Input recipient email address here
        subject: "ALERT - GTTSR Entry Tickets Avalible",
        text: messageArray.toString(),
      },
      (error, info) => {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      }
    );
    return messageArray;
  } else {
    console.log(new Date() + " No Tickets found");
    return "No tickets found";
  }
};

const getTicketCount = (responseArray) => {
  let ticketArray = [];

  responseArray.forEach((response) => {
    let totalTickets = response.inventory_count.ANY;
    let ticketsClaimed = response.reservation_count.ANY;

    let date = response.tour_date_start_timestamp;

    let ticketsRemaining = totalTickets - ticketsClaimed;

    let dateTicketsRemaining = {
      date: date,
      ticketsRemaining: ticketsRemaining,
    };

    ticketArray.push(dateTicketsRemaining);
  });

  return ticketArray;
};

module.exports = {
  getTickets,
};
