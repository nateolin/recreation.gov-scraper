const axios = require("axios");
const cron = require("node-cron");
const nodemailer = require("nodemailer");

require("dotenv").config();

let transporter = nodemailer.createTransport({
  service: "gmail", //Edit this service if using a different service  --NOTE: if using gmail, see this link, you'll need to disable a security setting in order to send emails from it https://nodemailer.com/usage/using-gmail/
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

cron.schedule("*/15 * * * * *", () => {
  getTickets();
});

const getTickets = async () => {
  //date array that holds dates to be checked
  const dates = [
    "2022-06-24",
    "2022-06-25",
    "2022-06-26",
    "2022-06-27",
    "2022-06-28",
    "2022-06-29",
    "2022-06-30",
    "2022-07-01",
    "2022-07-02",
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
        from: process.env.EMAIL,
        to: process.env.RECIPIENT_EMAIL,
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
