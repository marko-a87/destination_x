/* 
    <-------------------------------------------------------------->
    <--------------- DROPDOWN NAVIGATION FUNCTIONS ---------------->
    <-------------------------------------------------------------->
*/

//function to take the currently clicked button and find the dropdown before and after
function navigate_to_dropdown(current_element, nav_to_element) { 

    // clear feedback message
    //display_message(element, message, message_type, disable);
    
    /*display_message(
        current_element,
        null,
        null,
        true
    );*/

    const this_dropdown_content = current_element.dropdownButton.nextElementSibling;
    const nav_to_dropdown_content = nav_to_element.dropdownButton.nextElementSibling;

    current_element.dropdownButton.classList.remove('active');
    this_dropdown_content.style.display = "none";
    current_element.dropdownArrow.innerHTML = "&#9662;"; // down

    nav_to_element.dropdownButton.classList.add('active');
    nav_to_dropdown_content.style.display = "block";
    nav_to_element.dropdownArrow.innerHTML = "&#9652;"; // up

}