// Here you can set the model you are using from Clarifai API.
const getModelId = () => {
  return "face-detection";
};

// Configuration Object for Api Call.
const getRequestOptions = (imageURL) => {
  // Uncomment the below link when in production.
  // const PAT = process.env.API_PAT;

  const PAT = process.env.API_PAT;
  const USER_ID = process.env.USER_ID;
  const APP_ID = process.env.APP_ID;
  const IMAGE_URL = imageURL;

  const raw = JSON.stringify({
    user_app_id: {
      user_id: USER_ID,
      app_id: APP_ID
    },
    inputs: [
      {
        data: {
          image: {
            url: IMAGE_URL
          }
        }
      }
    ]
  });

  const requestOptions = {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: "Key " + PAT
    },
    body: raw
  };

  return requestOptions;
};

// Here we are doing the call to Clarifay api.
const handleApiCall = (req, res) => {
  const { input } = req.body;

  // aici verifii tokenul

  fetch(
    "https://api.clarifai.com/v2/models/" + getModelId() + "/outputs",
    getRequestOptions(input)
  )
    .then((response) => response.json()) // Extract JSON data from the response
    .then((data) => {
      console.log(data);
      res.json(data); // Send the JSON data in the response
    })
    .catch((err) => {
      console.error(err);
      res.status(400).json("Unable to call the api.");
    });
};

module.exports = {
  handleApiCall
};
