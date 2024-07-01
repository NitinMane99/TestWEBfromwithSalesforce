const axios = require('axios');
const qs = require('qs'); // For serializing form data

// Salesforce OAuth credentials
const clientId = '3MVG94Jqh209Cp4R9VtWmeMGhRp49aSeU0I.X8p5eOW.LZ3DVOanYfOpS_zwT2iGvDoCzAAbw1SQUg2SkJDo_';
const clientSecret = '70ADEE7BC3AFFC68B8E5064809A3B6ABAFCE02C78C34935C1129F59211917092';
const username = 'nitinm025@teraita.com';
const password = 'Trailhead@123';
const securityToken = 'pNSdW6oy1fog8AlNJW2MfUh5'; // For password flow

// Salesforce OAuth endpoint
const oauthUrl = 'https://login.salesforce.com/services/oauth2/token';

// Salesforce REST API endpoint for creating Leads
const apiUrl = 'https://teraitaitspace2-dev-ed.develop.my.salesforce.com/services/data/v54.0/sobjects/Lead/';

// Function to authenticate and obtain access token
async function getAccessToken() {
    try {
        const response = await axios.post(oauthUrl, qs.stringify({
            grant_type: 'password',
            client_id: clientId,
            client_secret: clientSecret,
            username: username,
            password: password + securityToken
        }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        return response.data.access_token;
    } catch (error) {
        console.error('Error fetching access token:', error.message);
        throw error;
    }
}

// Function to create a Lead in Salesforce
async function createLead(accessToken, leadData) {
    try {
        const response = await axios.post(apiUrl, leadData, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('Lead created successfully:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error creating Lead:', error.message);
        throw error;
    }
}

// Example usage
async function main() {
    try {
        const accessToken = await getAccessToken();

        // Example lead data from your form submission
        const leadData = {
            FirstName: 'John',
            LastName: 'Doe',
            Company: 'Acme Inc',
            Email: 'john.doe@example.com',
            Phone: '1234567890'
            // Add more fields as needed based on your Salesforce Lead object schema
        };

        const createdLead = await createLead(accessToken, leadData);
    } catch (error) {
        console.error('Integration error:', error);
    }
}

// Call main function
main();


// this is code 

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

        return {
            accessToken: response.data.access_token,
            instanceUrl: response.data.instance_url
        };
    } catch (error) {
        console.error('Error fetching OAuth token:', error);
        throw error;
    }
}

app.post('/submit', async (req, res) => {
    try {
        const { name, email } = req.body;
        const { accessToken, instanceUrl } = await getAuthToken();

        const salesforceUrl = `${instanceUrl}/services/data/v51.0/sobjects/Web_Form_Submission__c`;
        await axios.post(salesforceUrl, {
            Name: name,
            Email__c: email
           
        }, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        res.status(200).send('Form submitted successfully');
    } catch (error) {
        console.error('Error submitting form:', error);
        res.status(500).send('Error submitting form1');
    }
});
 app.use(express.static(path.join(__dirname, 'public')));


app.get('/data', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
