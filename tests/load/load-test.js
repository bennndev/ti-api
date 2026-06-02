// k6 load test for ti-api
//
// Usage:
//   With token:
//     k6 run -e SESSION_TOKEN="your-token-here" tests/load/load-test.js
//   Generate JSON report:
//     k6 run --out json=tests/load/results.json tests/load/load-test.js
//   Check thresholds only (no summary):
//     k6 run --quiet tests/load/load-test.js

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

const errorRate = new Rate('errors');
const duration = new Trend('request_duration');

const BASE_URL = 'http://localhost:3000/api';
const TOKEN = __ENV.SESSION_TOKEN || '';

const headers = TOKEN ? { Cookie: `better-auth.session_token=${TOKEN}` } : {};

export const options = {
  stages: [
    { duration: '2m', target: 1000 },
    { duration: '5m', target: 1000 },
    { duration: '2m', target: 5000 },
    { duration: '3m', target: 5000 },
    { duration: '1m', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<3000'],
    errors: ['rate<0.05'],
  },
};

const endpoints = [
  '/courses',
  '/users',
  '/groups',
  '/experiences',
  '/roles',
];

export default function () {
  const endpoint = endpoints[Math.floor(Math.random() * endpoints.length)];
  const res = http.get(`${BASE_URL}${endpoint}`, { headers });

  const ok = check(res, {
    'status is 200': (r) => r.status === 200,
  });

  errorRate.add(!ok);
  duration.add(res.timings.duration);

  sleep(1);
}

export function handleSummary(data) {
  console.log(`\n=== K6 TEST RESULTS ===`);
  console.log(`Requests: ${data.metrics.http_reqs?.values?.count}`);
  console.log(`Error Rate: ${(data.metrics.errors?.values?.rate * 100).toFixed(2)}%`);
  console.log(`P95 Duration: ${data.metrics.http_req_duration?.values['p(95)']?.toFixed(0)}ms`);
}
