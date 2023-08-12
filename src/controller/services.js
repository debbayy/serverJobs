const axios = require("axios");

exports.getJobs = async (req, res) => {
  try {
    console.log("masuk");
    const queryParams = {
      description: req.query.description, // Menggunakan req.query.description
      location: req.query.location, // Menggunakan req.query.location
      page: req.query.page, // Menggunakan req.query.page
    };

    const response = await axios.get(
      "http://dev3.dansmultipro.co.id/api/recruitment/positions.json",
      {
        params: queryParams,
      }
    );

    const dataFromApi = response.data;

    res.send({
      status: "success",
      data: {
        data: dataFromApi,
      },
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "Failed",
      message: "Server error",
    });
  }
};

exports.getJobDetail = async (req, res) => {
  try {
    console.log("masuk");
    const jobId = req.params.id;

    const response = await axios.get(
      `http://dev3.dansmultipro.co.id/api/recruitment/positions/${jobId}`
    );

    const jobDetail = response.data;

    console.log(jobDetail, "ini apa");

    res.send({
      status: "success",
      data: {
        jobDetail,
      },
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "Failed",
      message: "Server error",
    });
  }
};
