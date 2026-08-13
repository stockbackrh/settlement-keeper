// Claims live in Supabase. The keeper reads accepted or queued claims and writes back a status
// through a function that checks the shared secret, so the anon key alone cannot settle anything.
const env = process.env;
async function supa(p, opts = {}) {
  const r = await fetch(env.SUPABASE_URL + p, { ...opts, headers: { apikey: env.SUPABASE_ANON_KEY, Authorization: 'Bearer ' + env.SUPABASE_ANON_KEY, 'Content-Type': 'application/json', ...(opts.headers || {}) } });
  const t = await r.text(); if (!r.ok) throw new Error(t); return t ? JSON.parse(t) : null;
