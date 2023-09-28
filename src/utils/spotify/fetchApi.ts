import {requestAccessToken} from "@/utils/spotify/login";

export async function fetchWebApi(endpoint, method, body) {
    const urlParams = new URLSearchParams(window.location.search);
    let code = urlParams.get('code');
    let accessToken = localStorage.getItem('access_token');
    if (!accessToken || accessToken === "undefined") {
        accessToken = await requestAccessToken(code);
    }
    const resp = await fetch(`https://api.spotify.com/${endpoint}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        method,
        body:JSON.stringify(body)
    }).then((response) => {
        if (!response.ok) {
            throw new Error(`HTTP status ${response.status}`);
        }
        return response.json();
    })
        .catch((error) => {
            console.error('Error:', error);
        });

    console.log(resp);
    return resp;
}
