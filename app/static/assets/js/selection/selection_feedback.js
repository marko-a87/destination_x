
/* 
    <---------------------------------------->
    <                                        >
    <           FEEDBACK FUNCTIONS           >
    <                                        >
    <---------------------------------------->        
*/


//  <--------------------------------------------------------->
//  <     FUNCTION TO HANDLE POPULATING FEEDBACK ELEMENTS     >
//  <--------------------------------------------------------->

// Populate dropdown_elements intially with static elements like Passport
function add_static_feedbacks(feedback_element_list){    
    
    feedback_element_list.push(
        {
            elementName: "Form",
            elementType: "Non-Category",
            feedbackDiv: document.getElementById('form-feedback-div')
        },
        {
            elementName: "Budget",
            elementType: "Non-Category",
            feedbackDiv: document.getElementById('budget-feedback-div')
        },
        {
            elementName: "Passport",
            elementType: "Non-Category",
            feedbackDiv: document.getElementById('passport-feedback-div')
        },
        {
            elementName: "Visa",
            elementType: "Non-Category",
            feedbackDiv: document.getElementById('visa-feedback-div')
        }
    );

}


// Dynamically generate dropdown elements for all categories & populate dropdown element list 
function add_dynamic_feedbacks(category_list, feedback_element_list){

    category_list.forEach(category => { 

        feedback_element_list.push(
            {          
                elementName: category.name,
                elementType: "Category",
                feedbackDiv: document.getElementById(format_category_name(category.name) + "-feedback-div")
            }
        );

    });   

    //console.log(feedback_element_list);
    
}

//<-----------------------FUNCTION TO FIND FEEDBACKDIV


//  <-------------------------------------------->
//  <    FUNCTION TO DISPLAY FEEDBACK TO USER    >
//  <-------------------------------------------->

function display_message(disable, element, message, message_type) {
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
        
        //remove display of feedback div
        element.feedbackDiv.classList.add("hidden");   

    }

}



// Prevent errors when JS file tries to access DOM elements before they exist
document.addEventListener("DOMContentLoaded", () => {   

    // Make all feedback functions accessible globally

    // add_static_feedbacks(feedback_element_list) function
    window.add_static_feedbacks = add_static_feedbacks;

    // add_dynamic_feedbacks(category_list, feedback_element_list) function
    window.add_dynamic_feedbacks= add_dynamic_feedbacks;

    // display_message(element, message, message_type, disable) function
    window.display_message = display_message;

});
