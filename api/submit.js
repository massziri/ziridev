export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed.' });
  }

  try {
    const payload = typeof req.body === 'string'
      ? JSON.parse(req.body || '{}')
      : (req.body || {});

    const fname = String(payload.fname || '').trim();
    const lname = String(payload.lname || '').trim();
    const email = String(payload.email || '').trim();
    const company = String(payload.company || '').trim();

    if (!fname || !lname || !email || !company) {
      return res.status(400).json({
        success: false,
        message: 'Please complete the required fields before submitting your request.'
      });
    }

    const body = new URLSearchParams();
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        body.append(key, String(value));
      }
    });
    body.set('_subject', `New enquiry — Ziri Dev EN — ${fname} ${lname}`);
    body.set('_captcha', 'false');
    body.set('_template', 'table');

    const response = await fetch('https://formsubmit.co/ajax/admin@novatvhub.com', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      body: body.toString()
    });

    const text = await response.text();
    let result = {};
    try {
      result = text ? JSON.parse(text) : {};
    } catch {
      result = {};
    }

    if (response.ok) {
      return res.status(200).json({
        success: true,
        message: 'Your request has been sent. We will be in touch within 24 hours.'
      });
    }

    console.error('FormSubmit upstream error:', response.status, text);
    return res.status(502).json({
      success: false,
      message: 'We could not send your request right now. Please try again in a moment or contact us directly by email.'
    });
  } catch (error) {
    console.error('Submit API error:', error);
    return res.status(500).json({
      success: false,
      message: 'We could not send your request right now. Please try again in a moment or contact us directly by email.'
    });
  }
}
