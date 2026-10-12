import fs from 'fs';
import path from 'path';
import { google } from 'googleapis';
import { createClient } from '@supabase/supabase-js';

// 1. Manually parse .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');

const env = {};
const lines = envContent.split('\n');
let currentKey = null;
let currentValue = '';

for (const rawLine of lines) {
  const line = rawLine.trim();
  if (!line || line.startsWith('#')) continue;

  const match = rawLine.match(/^([A-Za-z0-9_]+)=(.*)$/);
  if (match) {
    if (currentKey) {
      env[currentKey] = currentValue;
    }
    currentKey = match[1];
    currentValue = match[2];
  } else if (currentKey) {
    currentValue += '\n' + rawLine;
  }
}
if (currentKey) {
  env[currentKey] = currentValue;
}

// Clean up surrounding quotes
for (const k in env) {
  let val = env[k].trim();
  if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
    val = val.slice(1, -1);
  }
  env[k] = val;
}

console.log('\n=============================================');
console.log('🔍 RUNNING LIVE CREDENTIAL & CONNECTION TESTS');
console.log('=============================================\n');

// -------------------------------------------------------------
// TEST 1: Google Sheets Connection
// -------------------------------------------------------------
async function testGoogleSheets() {
  console.log('--- 1. Testing Google Sheets API ---');
  const sheetId = env.GOOGLE_SHEET_ID;
  const clientEmail = env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  let privateKey = env.GOOGLE_PRIVATE_KEY;

  if (!sheetId || !clientEmail || !privateKey) {
    console.error('❌ Missing Google credentials in .env.local');
    return;
  }

  // Handle newlines
  privateKey = privateKey.replace(/\\n/g, '\n');

  try {
    const auth = new google.auth.JWT({
      email: clientEmail,
      key: privateKey,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const meta = await sheets.spreadsheets.get({ spreadsheetId: sheetId });

    console.log(`✅ Google Sheets Connected Successfully!`);
    console.log(`   Spreadsheet Title: "${meta.data.properties.title}"`);

    const tabs = (meta.data.sheets || []).map((s) => s.properties.title);
    console.log(`   Tabs found:`, tabs);

    const hasContacts = tabs.some((t) => t.trim().toLowerCase() === 'contact submissions');
    const hasChecklists = tabs.some((t) => t.trim().toLowerCase() === 'checklist downloads');

    if (!hasContacts) {
      console.warn('   ⚠️ Warning: Tab "Contact Submissions" not found (exact case matters).');
    } else {
      console.log('   ✅ Tab "Contact Submissions" exists.');
      // Fetch row count
      const contactRows = await sheets.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range: `'Contact Submissions'!A1:Z5`,
      });
      console.log(`      Header row:`, contactRows.data.values?.[0]);
      console.log(`      Sample row 2:`, contactRows.data.values?.[1]);
    }

    if (!hasChecklists) {
      console.warn('   ⚠️ Warning: Tab "Checklist Downloads" not found (exact case matters).');
    } else {
      console.log('   ✅ Tab "Checklist Downloads" exists.');
      const checklistRows = await sheets.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range: `'Checklist Downloads'!A1:Z50`,
      });
      console.log(`      Row count in "Checklist Downloads": ${checklistRows.data.values?.length || 0}`);
    }
  } catch (error) {
    console.error('❌ Google Sheets Error:', error.message);
  }
}

// -------------------------------------------------------------
// TEST 2: Supabase Connection
// -------------------------------------------------------------
async function testSupabase() {
  console.log('\n--- 2. Testing Supabase Connection ---');
  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !anonKey) {
    console.error('❌ Missing Supabase URL or Anon Key');
    return;
  }

  try {
    const client = createClient(url, serviceKey || anonKey);
    const { data: team, error } = await client.from('team_members').select('id, name').limit(3);

    if (error) {
      console.error('❌ Supabase Error:', error.message);
    } else {
      console.log('✅ Supabase Connected Successfully!');
      console.log(`   Found ${team.length} seeded team member(s):`, team.map((t) => t.name).join(', '));
    }
  } catch (err) {
    console.error('❌ Supabase Connection Exception:', err.message);
  }
}

// Execute tests
async function run() {
  await testGoogleSheets();
  await testSupabase();
  console.log('\n=============================================');
}

run();
