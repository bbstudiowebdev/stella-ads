import type { APIRoute } from 'astro';
import { RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL } from 'astro:env/server';
import { Resend } from 'resend';
import { site } from '../../data/site';

export const prerender = false;

const clean = (v: FormDataEntryValue | null, max = 500) =>
  String(v ?? '').replace(/[\r\n]+/g, ' ').trim().slice(0, max);

export const POST: APIRoute = async ({ request, redirect, url }) => {
  // Same-origin only.
  const origin = request.headers.get('origin');
  if (origin && origin !== url.origin) return new Response('Forbidden', { status: 403 });

  let form: FormData;
  try { form = await request.formData(); } catch { return redirect('/form-error', 303); }

  // Honeypot: bots fill every field. Pretend success.
  if (clean(form.get('website'))) return redirect('/thanks', 303);

  const data = {
    name: clean(form.get('name'), 120),
    company: clean(form.get('company'), 160),
    email: clean(form.get('email'), 200),
    phone: clean(form.get('phone'), 40),
    budget: clean(form.get('budget'), 60),
    start: clean(form.get('start'), 60),
    board: clean(form.get('board'), 120),
  };
  if (!data.name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return redirect('/form-error', 303);
  const allowedBoards = new Set(site.boards.map((b) => b.name));
  if (data.board && !allowedBoards.has(data.board)) data.board = '';

  if (!RESEND_API_KEY || !CONTACT_TO_EMAIL || !CONTACT_FROM_EMAIL) {
    console.error('Contact form: Resend env vars missing');
    return redirect('/form-error', 303);
  }

  const text = [
    `New billboard enquiry from ${site.url}`,
    '',
    `Name: ${data.name}`,
    `Company: ${data.company || '-'}`,
    `Email: ${data.email}`,
    `Phone: ${data.phone || '-'}`,
    `Monthly budget: ${data.budget || '-'}`,
    `Campaign start: ${data.start || '-'}`,
    `Billboard of interest: ${data.board || 'Any site'}`,
  ].join('\n');

  try {
    const { error } = await new Resend(RESEND_API_KEY).emails.send({
      from: CONTACT_FROM_EMAIL,
      to: CONTACT_TO_EMAIL,
      replyTo: data.email,
      subject: `Billboard enquiry: ${data.board || 'Any site'} — ${data.name}`,
      text,
    });
    if (error) { console.error('Resend error', error); return redirect('/form-error', 303); }
  } catch (err) {
    console.error('Contact form send failed', err);
    return redirect('/form-error', 303);
  }
  return redirect('/thanks', 303);
};
