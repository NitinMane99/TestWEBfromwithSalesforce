const express = require('express');
const path = require('path'); 
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const clientId = '3MVG94Jqh209Cp4R9VtWmeMGhRpro.FhwttJioO_FQVYRx0ACxCuYQHZWFV08qSI10Ja2jxzLHAzpUlE4wyNM';
const clientSecret = '009E07FA2B51B8F4ACD4CF955AF88A67DBB3C1FA84A3F538931A5165E07D17BD';
const username = 'nitinm025@teraita.com';
const password = 'Trailhead@123rBoayuwztEHKBhUB2p10tDB7';
const tokenUrl = 'https://login.salesforce.com/services/oauth2/token';

async function getAuthToken() {
    try {
        const response = await axios.post(tokenUrl, null, {
            params: {
                grant_type: 'password',
                client_id: clientId,
                client_secret: clientSecret,
                username: username,
                password: password
            }
        });
        console.log('OAuth Token:', response.data);
        return {
            accessToken: response.data.access_token,
            instanceUrl: response.data.instance_url
        };
    } catch (error) {
        console.error('Error fetching OAuth token:', error.response.data);
        throw error;
    }
}
app.post('/submit', async (req, res) => {
    try {
        const { name, email } = req.body;
        const { accessToken, instanceUrl } = await getAuthToken();

        const salesforceUrl = `${instanceUrl}/services/data/v51.0/sobjects/Nitin__Web_Form_Submission__c`;
        console.log('Salesforce URL:', salesforceUrl);
        await axios.post(salesforceUrl, {
            Name: name,
            Nitin__Email__c: email
        }, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        res.status(200).send('Form submitted successfully');
    } catch (error) {
        console.error('Error submitting form:', error.response ? error.response.data : error.message);
        res.status(500).send('Error submitting form');
    }
});
app.use(express.static(path.join(__dirname, 'public')));

app.get('/data', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});