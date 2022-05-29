
 function sendEmail(ev) {

     ev.preventDefault();
     var mess=document.getElementById("message").value;
     var email_sender = document.getElementById("email_sender").value;
          alert(mess);
console.log(mess)
       Email.send({
         SecureToken: " 56aa5330-6654-4d81-9dd9-28d2b2a2303e",
         From: "shaksham@isp.com",
         To: email_sender,
         Subject: "Face Reconoginse system",
         Body: mess,
       }).then(function (message) {
         alert("Mail has been sent successfully");
       });
 }