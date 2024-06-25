function imageValidation(){
    let avatar = document.getElementById("avatar").value?document.getElementById("avatar").files[0]:"";
    document.getElementById("avatarPreview").style = "display:block";
    document.getElementById("preview").src = URL.createObjectURL(document.getElementById("avatar").files[0]);
}
function editImageChange(){
    let avatar = document.getElementById("editimg").value?document.getElementById("editimg").files[0]:"";
    document.getElementById("editpic").src =  URL.createObjectURL(avatar);
}