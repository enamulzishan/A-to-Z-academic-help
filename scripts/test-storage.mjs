import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

const envPath = path.resolve(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const m = line.match(/^([A-Za-z0-9_]+)=(.*)$/);
  if (m) env[m[1]] = m[2].trim().replace(/^["']|["']$/g, '');
});

const client = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function checkStorage() {
  const { data: buckets, error } = await client.storage.listBuckets();
  if (error) {
    console.error('List buckets error:', error.message);
    return;
  }
  console.log('Existing buckets:', buckets.map(b => b.name));

  const hasImages = buckets.some(b => b.name === 'images');
  if (!hasImages) {
    console.log('Creating bucket "images"...');
    const { data, error: createErr } = await client.storage.createBucket('images', { public: true });
    if (createErr) console.error('Create bucket error:', createErr.message);
    else console.log('Created bucket "images" successfully!');
  } else {
    console.log('Bucket "images" already exists and is ready!');
  }
}

checkStorage();
