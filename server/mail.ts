// MAILE — wysyłka przez skrzynkę noreply na home.pl (SMTP) i treści wiadomości. Hasło nigdy nie trafia do maila.

import nodemailer from 'nodemailer'
import { AUTH, SMTP } from './config.js'

const transport = () =>
  nodemailer.createTransport({
    host: SMTP.host(),
    port: SMTP.port(),
    secure: SMTP.port() === 465, // 465 = SSL, 587 = STARTTLS
    auth: { user: SMTP.user(), pass: SMTP.password() },
  })

const layout = (title: string, body: string) => `
  <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;color:#1c1917">
    <div style="background:#22dd6a;padding:20px;border-radius:16px">
      <p style="margin:0;font-weight:800;letter-spacing:2px">GREEN SCREEN</p>
      <h1 style="margin:8px 0 0;font-size:24px">${title}</h1>
    </div>
    <div style="padding:16px 4px;font-size:15px;line-height:1.5">${body}</div>
  </div>`

const button = (href: string, label: string) =>
  `<p><a href="${href}" style="display:inline-block;background:#000;color:#fff;padding:12px 20px;border-radius:999px;text-decoration:none;font-weight:bold">${label}</a></p>`

export function sendWelcome(to: string, verifyUrl: string) {
  return transport().sendMail({
    from: SMTP.from(),
    to,
    subject: 'Witaj w Green Screen 🥦 — potwierdź adres e-mail',
    html: layout(
      'Konto gotowe!',
      `<p>Twoje dane są już bezpieczne na koncie i zobaczysz je na każdym urządzeniu.</p>
       <p><b>Login:</b> ${to}<br><b>Hasło:</b> to, które ustawiono przy rejestracji (ze względów bezpieczeństwa nie wysyłamy go mailem).</p>
       <p>Potwierdź jeszcze, że to Twój adres:</p>${button(verifyUrl, 'Potwierdzam adres')}
       <p style="color:#78716c;font-size:13px">Jedz kolorowo, nie licz kalorii. 🌈</p>`,
    ),
  })
}

export function sendPasswordReset(to: string, resetUrl: string) {
  return transport().sendMail({
    from: SMTP.from(),
    to,
    subject: 'Green Screen — ustaw nowe hasło',
    html: layout(
      'Nowe hasło',
      `<p>Ktoś (miejmy nadzieję, że Ty) poprosił o zmianę hasła do Green Screen.</p>
       ${button(resetUrl, 'Ustaw nowe hasło')}
       <p style="color:#78716c;font-size:13px">Link jest ważny ${AUTH.resetLinkHours} h. Jeśli to nie Ty, zignoruj tę wiadomość.</p>`,
    ),
  })
}
