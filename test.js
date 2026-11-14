const payload = {
  service_id: "service_uiq49df",
  template_id: "template_e2pxpww",
  user_id: "FgA_6_AkuJW7B2crn",
  template_params: {
    email: "honeylanguageilu@gmail.com",
    passcode: "123456"
  }
};

fetch('https://api.emailjs.com/api/v1.0/email/send', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload)
}).then(async res => {
  console.log("Status:", res.status);
  console.log("Text:", await res.text());
});
