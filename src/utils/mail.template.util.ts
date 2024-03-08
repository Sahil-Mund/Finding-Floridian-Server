const getBuySellMailTemplate = (data: any) => `
<div>
    <p>Hi ${data.firstName} ${data.lastName}</p>
    <p>Your contact form has just got submitted</p>
    <p>Specifications : <strong>${data.specifications}</strong></p>
    <p>Message: </p>
    <p> ${data.message} </p>
    <p><strong>Please find below, calendly link to book a session with me to discuss further details.</strong></p>
    <a href="www.google.com">Calendly Link</a>
    <p>Thanks!</p>
</div>
`

const getHomeTourMailTemplate = (data: any) => `
<div>
    <p>Hi ${data.firstName} ${data.lastName}</p>
    <p>Your contact form has just got submitted</p>
    <p>Specifications : <strong>${data.specifications}</strong></p>
    <p><strong>Please find below, calendly link to book a session with me to discuss further details.</strong></p>
    <a href="www.google.com">Calendly Link</a>
    <p>Thanks!</p>
</div>
`

