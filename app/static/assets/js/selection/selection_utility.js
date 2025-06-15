
/* 
    <------------------------------------------------------>
    <--------------- SELECTION PAGE UTILITY --------------->
    <------------------------------------------------------>        
*/

// take name from tag element
function extract_tag_name(tag) {

    //console.log(tag);

    return tag.innerHTML.slice(0, tag.innerHTML.indexOf(" <"));
}



