const axios = require('axios');
require('dotenv').config();

const apiBaseUrl = process.env.API_BASE_URL;
const apiAgileUrl = apiBaseUrl + process.env.API_AGILE_URL;
const apiUserName = process.env.API_USER_NAME;
const apiKeyValue = process.env.API_KEY_VALUE;

const auth = {
  username: apiUserName,
  password: apiKeyValue
};

async function moveIssuesToEpic(req, res) {
  try {
    const url = `${apiAgileUrl}/epic/${req.body.epicId}/issue`;
    const data = { issues: req.body.issues };
    const config = {
      headers: { 'Content-Type': 'application/json' },
      auth: auth
    };

    const response = await axios.post(url, data, config);
    return res.status(200).json(response.data);

  } catch (error) {
    console.error('Błąd podczas przenoszenia zgłoszeń do epiku:', error.response ? error.response.data : error.message);
    return res.status(error.response ? error.response.status : 500).json({
      error: error.response ? error.response.data : 'Internal Server Error'
    });
  }
}

module.exports = moveIssuesToEpic;
