'use strict'

require('dotenv').config();
const { default:axios } = require('axios');
const DayJS = require('dayjs');
const DigestGeneratorHelper = require('../_helper/DigestGenerator.helper');
const SuccessFormatter = require('../_helper/SuccessFormatter.helper');
const DataResponseHandler = require('../_helper/DataResponseHandler.helper');
const SuccessLoggerHelper = require('../_helper/SuccessLogger.helper');

// KYC GET ACCESS TOKEN API
const GenerateToken = async () => {
    
    try {

        const dateNow = DayJS(new Date).format('YYYY-MM-DD');
        const apikey = process.env.SYMPH_API_KEY;
        const secret = process.env.SYMPH_SECRET_KEY;

        const signature = `${apikey}|${secret}|${dateNow}`;

        const digest = DigestGeneratorHelper(signature);

        const URL = process.env.AUTH_SERVICE_SYMPH_URL;

        const reqBody = {
            apiKey: process.env.SYMPH_API_KEY,
            signature: digest,
        };

        const response = await axios.post(URL, reqBody);

        const request = {
            url:URL,
            method: 'POST',
            query:{},
            params: {},
            body: {reqBody, signature}
        }
        const res = {
            data: response.data,
            status: response.status,
            code: response.statusText.toUpperCase(),
            message: "Token Created Successfully"

        }

        SuccessLoggerHelper(request, res);

        return response.data;

    } catch (error) {
        throw error;
    }
};

module.exports = GenerateToken;

