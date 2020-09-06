document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  

// fetch query here
  document.querySelector('#submit').addEventListener('click', function (){
    var recipients = document.querySelector('#compose-recipients').value;
    var subject = document.querySelector('#compose-subject').value;
    var body = document.querySelector('#compose-body').value;
    // alert(recipients + subject + body);
    fetch('/emails', {
      method: 'POST',
      body: JSON.stringify({
          recipients: recipients,
          subject: subject,
          body: body
      })
    })
    .then(response => response.json())
    .then(result => {
        // Print result
        console.log(result);
        load_mailbox('sent');

        
    });

    
//     

});

  // By default, load the inbox
  load_mailbox('inbox');
  console.log("CONNECTED");
});





function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';


}





function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
 if(mailbox == "sent"){
      var status = true;
                }
//make fetch request to spacific mailbox
  fetch(`emails/${mailbox}`)
  .then(response => response.json())
  .then(emails =>{
    // console.log(emails);
    emails.forEach(e => {
        // console.log(e)
        const element = document.createElement('div');
        element.innerHTML = `<span class="sender">${e.sender}</span> <span class="body"> ${e.body} </span> <span class="sub"> ${e.timestamp} </span> `;
        // element.style.border = "1px solid black";
        document.querySelector('#compose-view').style.display = 'none';
        document.querySelector('#emails-view').append(element);
        if(e.read){
            element.style.backgroundColor = "gray";
          }else{
            element.style.backgroundColor = "white"
          }
          element.classList.add("e");
          //make click events
        element.addEventListener('click', function() {
            console.log('This element has been clicked!');
            //make email read when click 
            fetch(`/emails/${e.id}`, {
                  method: 'PUT',
                  body: JSON.stringify({
                      read: true
                  })
                });
            //load email details
             fetch(`/emails/${e.id}`)
            .then(response => response.json())
            .then(email => {
                // Print email
                // console.log(email);
               
                const archivebtn = document.createElement('input');
                archivebtn.type = "submit"
                if(email.archived){archivebtn.value = 'unArchive'}else{archivebtn.value = 'Archive'}
                // archivebtn.value = "Archive";
                const replaybtn = document.createElement('input');
                replaybtn.type = "submit"
                replaybtn.value = "Reply";
                const details = document.createElement('div');
                details.innerHTML = "<p>From: " + email.sender + "</p><p> To:   " + e.recipients + " </p><p>  Subject:  " + e.subject + " </p><p> Timestamp: " + e.timestamp +"</p>"
                // details.style.border = "1px solid black";
                const nav = document.createElement('nav');

                const emailbody = document.createElement('div');
                emailbody.innerHTML = `<p>Body: ${email.body}</p>`
                emailbody.classList.add("emailbody");
                details.classList.add("details");
                archivebtn.classList.add("buttons");
                replaybtn.classList.add("buttons");
        
                document.querySelector('#compose-view').style.display = 'none';
                document.querySelector('#emails-view').innerHTML = " ";
                document.querySelector('#emails-view').append(nav);
                nav.append(archivebtn);
                nav.append(replaybtn);
                document.querySelector('#emails-view').append(details);
                document.querySelector('#emails-view').append(emailbody);
                if(status){archivebtn.style.display = "none";}
                //Archive function
                archivebtn.addEventListener("click", function(){
                  console.log(archivebtn.value);
                  if(email.archived == false){
                      fetch(`/emails/${email.id}`, {
                          method: 'PUT',
                          body: JSON.stringify({
                              archived: true
                          })
                        });
                        archivebtn.value = "unArchive";
                        load_mailbox("inbox");
                  }

                  else if(email.archived == true){
                    fetch(`/emails/${email.id}`, {
                      method: 'PUT',
                      body: JSON.stringify({
                          archived: false
                      })
                    });
                    archivebtn.value = "Archive";
                    load_mailbox("inbox");

                  }

                });//end archive button event listener

                //Reply button
             replaybtn.addEventListener("click", function(){
              
              console.log("Reply");
              console.log(email);
              document.querySelector('#compose-recipients').value = email.recipients;
              if (email.subject){document.querySelector('#compose-subject').value = `Re: ${email.subject}`;  }
              else{document.querySelector('#compose-subject').value = email.subject;};
              document.querySelector('#compose-body').value = `On ${email.timestamp} ${email.sender} wrote: ` + email.body;
              document.querySelector('#emails-view').style.display = 'none';
              document.querySelector('#compose-view').style.display = 'block';
              
            });

                 });
        });

    });//end forEach

  });










}

