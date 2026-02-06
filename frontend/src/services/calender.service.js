import { ApiRequest } from "./api";

export async function importCalender(calenderUrl) {
    return ApiRequest("/calender/import", {
        method: "POST",
        body: JSON.stringify({ calenderUrl }),
    });
}