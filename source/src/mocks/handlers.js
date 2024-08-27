import { http, HttpResponse } from "msw";

let requestBody;
export const handlers = [
  // Intercept "GET https://example.com/user" requests...
  http.post(
    `http://localhost:8080/api/1.0/users`,
    ({ request, params, cookies }) => {
      // ...and respond to them using this JSON response.
      requestBody = request.body;
      return HttpResponse.json({});
    }
  ),
];
