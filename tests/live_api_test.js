#!/usr/bin/env node

/**
 * Automated Live API Tester for Zorvyn Dashboard
 * Runs through the entire lifecycle against the production URL and logs all requests and responses.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://zorvyn.amberbisht.me';
const EMAIL = 'bishtamber0@gmail.com';
const PASSWORD = '@amber?123AMBER';

let sessionCookie = '';
const logData = [];

function appendLog(method, endpoint, reqBody, status, resBody) {
  logData.push(`### [${method}] ${endpoint}`);
  if (reqBody) {
    logData.push(`**Request Body:**\n\`\`\`json\n${JSON.stringify(reqBody, null, 2)}\n\`\`\``);
  }
  logData.push(`**Status:** ${status}`);
  logData.push(`**Response Body:**\n\`\`\`json\n${JSON.stringify(resBody, null, 2)}\n\`\`\``);
  logData.push(`---\n`);
}

async function makeRequest(method, endpoint, body = null) {
  const url = `${BASE_URL}${endpoint}`;
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Cookie': sessionCookie
    }
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  console.log(`Executing: ${method} ${endpoint}`);

  const response = await fetch(url, options);
  const status = response.status;

  // Extract Session Cookie if present
  let rawCookies = [];
  if (typeof response.headers.getSetCookie === 'function') {
    rawCookies = response.headers.getSetCookie();
  } else {
    const headerStr = response.headers.get('set-cookie');
    if (headerStr) rawCookies = [headerStr];
  }
  
  if (rawCookies.length > 0) {
    sessionCookie = rawCookies[0].split(';')[0];
    console.log(`[Extracted Cookie] ${sessionCookie}`);
  }

  let resBody;
  try {
    resBody = await response.json();
  } catch (e) {
    resBody = await response.text();
  }

  appendLog(method, endpoint, body, status, resBody);

  return { status, data: resBody };
}

async function runTests() {
  logData.push(`# Zorvyn Live API Test Results`);
  logData.push(`**Target URL:** ${BASE_URL}\n**Date:** ${new Date().toISOString()}\n\n---\n`);

  try {
    // 1. Auth Login
    const loginRes = await makeRequest('POST', '/api/auth/login', { email: EMAIL, password: PASSWORD });
    if (loginRes.status !== 200) {
      throw new Error("Failed to login as Admin. Exiting tests.");
    }

    // 2. Create Record
    const createRes = await makeRequest('POST', '/api/records', {
      amount: 4500.5,
      type: "INCOME",
      category: "Freelance",
      description: "Automated API Test Income"
    });
    const newRecordId = createRes.data?.data?.id;

    // 3. Get All Records
    await makeRequest('GET', '/api/records');

    // 4. Update the Record
    if (newRecordId) {
      await makeRequest('PUT', `/api/records/${newRecordId}`, {
        amount: 5000
      });
    }

    // 5. Dashboard Summary
    await makeRequest('GET', '/api/dashboard/summary');

    // 6. Dashboard Categories
    await makeRequest('GET', '/api/dashboard/categories?type=INCOME');

    // 7. Get All Users (Admin Action)
    const usersRes = await makeRequest('GET', '/api/users');

    // Find a non-admin user to test role/status update
    let targetUser = null;
    if (usersRes.data?.data?.length > 0) {
      targetUser = usersRes.data.data.find(u => u.email !== EMAIL);
    }

    // 8. Update User Role & Status (Admin Actions)
    if (targetUser) {
      await makeRequest('PATCH', `/api/users/${targetUser.id}/role`, { role: "ANALYST" });
      await makeRequest('PATCH', `/api/users/${targetUser.id}/status`, { status: "ACTIVE" });
    } else {
      console.log("No alternative users found to test role updates.");
    }

    // 9. Delete Record
    if (newRecordId) {
      await makeRequest('DELETE', `/api/records/${newRecordId}`);
    }

    // 10. Logout
    await makeRequest('POST', '/api/auth/logout');
    console.log(`\n✅ Testing Complete!`);

  } catch (error) {
    console.error("Test Workflow Errored:");
    console.error(error.message);
  } finally {
    // Write Output
    const docsDir = path.join(__dirname, '../docs');
    if (!fs.existsSync(docsDir)) {
      fs.mkdirSync(docsDir, { recursive: true });
    }

    const outputPath = path.join(docsDir, 'live_api_test_results.md');
    fs.writeFileSync(outputPath, logData.join('\n'));
    console.log(`Logs saved to ${outputPath}`);
  }
}

runTests();
