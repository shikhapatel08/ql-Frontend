import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

export const fetchPolls = async ({
    page = 1,
    limit = 10,
    category,
    search = "",
    time_period = "",
    last_poll_id = "",
    poll_id = "",
    webLimit = "",
    only_polls = "",
    for_reel = "",
    username = "",
    headers = {},
}) => {
    const res = await axios.post(`${BASE_URL}/polls/get-polls`, null, {
        params: {
            page,
            limit,
            category,
            search,
            time_period,
            last_poll_id,
            poll_id,
            webLimit,
            only_polls,
            for_reel,
            username
        },
        headers
    });
    return res.data;
}