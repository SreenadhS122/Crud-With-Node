function imageValidation(){
    let avatar = document.getElementById("avatar").value?document.getElementById("avatar").files[0]:"";
    document.getElementById("avatarPreview").style = "display:block";
    document.getElementById("preview").src = URL.createObjectURL(document.getElementById("avatar").files[0]);
}