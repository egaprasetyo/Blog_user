import axios from "axios";

export const gorestApi = axios.create({
    baseURL: 'https://gorest.co.in/public/v2',
    headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer bda3125524ff13e25b55c05846dc86ee7daf0a82176158f75df00b89a6a55993"
    },
    timeout: 1000000,
});
