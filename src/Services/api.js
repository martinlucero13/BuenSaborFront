import Axios from "axios";

let urls = {
    test: process.env.DEVELOPMENT_API_URL || 'http://localhost:3000',
    development: process.env.TEST_API_URL || 'http://localhost:3000',
    production: process.env.PRODUCTION_API_URL || 'http://localhost:3000'
}

const api = Axios.create({
    baseURL: urls[process.env.NODE_ENV],
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
    maxContentLength: 100000000,
    maxBodyLength: 1000000000
});

export default api;