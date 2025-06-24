
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

/*
    <--------------------------------------------------------->
    <  Validates the form and checks for errors and displays  >
    <  them if found.                                         >
    <--------------------------------------------------------->
*/
// Populate dropdown_elements intially with static elements like Passport    
const feedback_elements = [
    {
        elementName: "Form",
        elementType: "Non-Activity",
        feedbackDiv: document.getElementById('form-feedback-div')
    },
    {
        elementName: "Budget",
        elementType: "Non-Activity",
        feedbackDiv: document.getElementById('budget-feedback-div')
    },
    {
        elementName: "Passport",
        elementType: "Non-Activity",
        feedbackDiv: document.getElementById('passport-feedback-div')
    },
    {
        elementName: "Visa",
        elementType: "Non-Activity",
        feedbackDiv: document.getElementById('visa-feedback-div')
    }
];


// Dynamically generate dropdown elements for all categories & populate dropdown element list 
get_categories_list().forEach(category => { 

    feedback_elements.push(
        {          
            elementName: category.name,
            elementType: "Activity",
            feedbackDiv: document.getElementById(format_category_name(category.name) + "-feedback-div")
        }
    );
});   



//  <--------------------------------------------->
//  <    FUNCTIONS TO DISPLAY FEEDBACK TO USER    >
//  <--------------------------------------------->


// Timeout display of feedback div
function timeout_feedback(element, time_ms) {
      
    setTimeout(() => {
        element.feedbackDiv.classList.add("hidden"); 
    }, time_ms); // eg. 2000ms = 2 seconds
}


function display_message(disable, element, message, message_type, timeout) {
    // display feedback based on type of message
    // types: error, success, neutral
    // disable: boolean, determines whether a message is being displayed or removed

    let nav_dropdown = find_element("navigation", element.elementName);   

    // Display for debugging
    //console.log("display_message() feedback element:", element); 
    console.log("message:", message);
    console.log("message_type:", message_type, "disabled? ", disable);

    if (disable === false) {    
    
        // Make feedback visible
        element.feedbackDiv.classList.remove("hidden");

        // Remove other message classes to prevent multiple simultaneously
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
                
                // If element is not the form feedback div
                if (element.elementName !== "Form") {

                    // Flag dropdown nagivate section as having errors                
                    nav_dropdown.hasErrors = true;
                }
            
                break;

            case "success":
                //console.log("success");

                element.feedbackDiv.classList.add("success-message");
                element.feedbackDiv.innerHTML = "<i class='fa-solid fa-circle-check fa-beat fa-lg'></i>" +
                    "<strong> Success: </strong> &nbsp;&nbsp;" + message;   

                    
                // If element is not the form feedback div
                if (element.elementName !== "Form") {

                    // Remove error flag on dropdown nagivate section              
                    nav_dropdown.hasErrors = false;
                }
            
                break;

            case "neutral":
                //console.log("neutral");
                
                element.feedbackDiv.classList.add("neutral-message");
                element.feedbackDiv.innerHTML = "<i class='fa-solid fa-circle-exclamation fa-bounce fa-lg'></i>" +
                    "<strong> Note: </strong> &nbsp;&nbsp;" + message;

                //console.log(element.feedbackDiv.innerHTML);

                // If element is not the form feedback div
                if (element.elementName !== "Form") {

                    // Remove error flag on dropdown nagivate section              
                    nav_dropdown.hasErrors = false;
                }

                break;

            default:
                console.error("Invalid message type: ", message_type);
        }
            
        //console.log("nav_dropdown:", nav_dropdown);   

        // Bring attention to feedback by scrolling it into view
        element.feedbackDiv.scrollIntoView({ behavior: "auto", block: "center" });

        if (timeout !== null) {
            
            // Timeout feedback if desired
            timeout_feedback(element, timeout);   
        }

    } else {       
        
        // Remove display of feedback div
        element.feedbackDiv.classList.add("hidden");   
    }

}




// Prevent errors when JS file tries to access DOM elements before they exist
document.addEventListener("DOMContentLoaded", () => {   

    // Make all feedback functions accessible globally

    // display_message(element, message, message_type, disable) function
    window.display_message = display_message;

});
