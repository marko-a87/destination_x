
/* 
    <-------------------------------------------------->
    <--------------- FEEDBACK FUNCTIONS --------------->
    <-------------------------------------------------->        
*/


function display_message(element, message, message_type, disable) {
    //chnage ui elements based on type of message
    //types: error, success, neutral
    //disable: boolean, determines whether a message is being displayed or removed

    //add success-message, error-message or neutral-message to the classlist
    //change the icon present in the div to the correct one

    console.log("display_message() element:", element, "message:", message);
    console.log("message_type:", message_type, "disabled? ", disable);

    if (disable === false) {    
    
        // make feedback visible
        element.feedbackDiv.classList.remove("hidden");

        // remove other message classes
        element.feedbackDiv.classList.forEach(className => {
            if (className.includes("-message")) {
            element.feedbackDiv.classList.remove(className);
            }
        });

        switch (message_type) {
            case "error":
                //console.log("error");

                element.feedbackDiv.classList.add("error-message");
                element.feedbackDiv.innerHTML = "<i class='fa-solid fa-circle-exclamation fa-bounce fa-lg'></i>" +
                    "<strong> Error: </strong> &nbsp;&nbsp;" + message;
            
            break;

            case "success":
                //console.log("success");

                element.feedbackDiv.classList.add("success-message");
                element.feedbackDiv.innerHTML = "<i class='fa-solid fa-circle-check fa-beat fa-lg'></i>" +
                    "<strong> Success: </strong> &nbsp;&nbsp;" + message;   

            break;

            case "neutral":
                //console.log("neutral");
                
                element.feedbackDiv.classList.add("neutral-message");
                element.feedbackDiv.innerHTML = "<i class='fa-solid fa-circle-exclamation fa-bounce fa-lg'></i>" +
                    "<strong> Note: </strong> &nbsp;&nbsp;" + message;

                //console.log(element.feedbackDiv.innerHTML);

                break;

            default:
                console.error("Invalid message type: ", message_type);
        }


    } else {       
        
        element.feedbackDiv.classList.add("hidden");   

    }

    

}