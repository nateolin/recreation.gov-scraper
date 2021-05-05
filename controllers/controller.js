const axios = require("axios");
const cron = require("node-cron");
const notifier = require("node-notifier");
const path = require("path");

cron.schedule("*/10 * * * * *", () => {
  getTickets();
});

const getTickets = async () => {
  const dates = [
    "2021-06-16",
    "2021-06-17",
    "2021-06-18",
    "2021-06-19",
    "2021-06-20",
    "2021-06-21",
    "2021-06-22",
    "2021-06-23",
    "2021-06-24",
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

  //console.log(messageArray);
  if (messageArray.length === 0) {
    console.log(new Date() + " No Tickets found");
    return "No tickets found";
  } else {
    console.log(messageArray);
    return messageArray;
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

  //console.log(ticketArray);
  return ticketArray;
};

module.exports = {
  getTickets,
};
