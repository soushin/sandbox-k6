import {group, check, sleep} from "k6";
import {Rate} from "k6/metrics";
import http from "k6/http";

let apiAddress = "api:8080";
let authorization = "Bearer authHeader";
let headers = {
    "Authorization": authorization,
    "Content-type": "application/json",
};

export let options = {
    thresholds: {
        'http_req_duration{kind:frontApi}': ["avg<=500"],
        'http_req_duration{kind:userApi}': ["avg<=500"],
    }
};

export default function () {
    group("front api", function () {
        let params = {
            headers: headers,
            tags: {
                'kind': 'frontApi',
            }
        };
        let res = http.get(`http://${apiAddress}`, params);
        check(res, {
            "status is 200": (res) => res.status === 200,
        });
    });

    sleep(1);

    var usersRes = null;
    group("user api 1", function () {
        let params = {
            headers: headers,
            tags: {
                'kind': 'userApi',
            }
        };
        usersRes = http.get(`http://${apiAddress}/users`, params);
        check(usersRes, {
            "status is 200": (res) => res.status === 200,
        });
    });

    group("user api 2", function () {
        let params = {
            headers: headers,
            tags: {
                'kind': 'userApi',
            }
        };

        let json = usersRes.json();
        let fromId = json[0].id;

        let res = http.get(`http://${apiAddress}/users?fromId=${fromId}`, params);
        check(res, {
            "status is 200": (res) => res.status === 200,
        });
    });
};
