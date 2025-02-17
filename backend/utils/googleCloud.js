const serviceAccount = require('./serviceAccount.json');
const config = {
  credentials: {
    client_email: serviceAccount.client_email,
    private_key: serviceAccount.private_key
  },
  projectId: serviceAccount.project_id
};

module.exports = config;