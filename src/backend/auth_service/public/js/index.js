const get_code = document.querySelector(".get_code");
const host = document.querySelector(".host");
const access_code = document.querySelector("#access_code");

get_code.addEventListener("click", get_code_function);
access_code.addEventListener("keydown", send_acess_code)

function get_code_function() {
    console.log("calleddd")
    const id = this.previousElementSibling.innerText.trim();
    get_code.style.background = "#a4a4f7";
    fetch(`/code/${id}`, {
            method: "POST"
        })
        .then(response => {
            get_code.style.background = "#3333ec";
            console.log("response: ", response)
            response.json()
                .then(data => {
                    console.log("DATA: ", typeof data)
                    get_code.innerText = data.code;
                    host.style.display = "block"
                })
        })
}

function send_acess_code(e) {
    if (e.key !== "Enter") return true;
    const id = get_code.previousElementSibling.innerText.trim();
    const code = access_code.value.trim();

    fetch(`/connect/${id}/${code}`, {
            method: "POST"
        })
        .then(response => {
            response.json()
                .then(data => {
                    alert(data.user);
                    var myCookies = getCookies(data.user.cookies);
                    for (key in myCookies) {
                        document.cookie = `${key}=${myCookies[key]}`
                        console.log(document.cookie)
                    }
                    alert(data.user.cookies)
                    window.location.href = data.user.url
                })
        })
}


function getCookies(cookie) {
    var pairs = cookie.split(";");
    var cookies = {};
    for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i].split("=");
        cookies[(pair[0] + '').trim()] = unescape(pair.slice(1).join('='));
    }
    return cookies;
}