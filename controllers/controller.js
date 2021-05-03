const axios = require("axios");

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

  url = `https://www.recreation.gov/api/timedentry/availability/facility/10087086?date=`;

  let options = {
    method: "get",
    url: url,
  };

  let responseArray = [];

  try {
    dates.forEach(async (date) => {
      options.url = `${options.url}${date}`;
      const response = await axios(options);
      responseArray.push(response);
    });

    return responseArray;
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  getTickets,
};
