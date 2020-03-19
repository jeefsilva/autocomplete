//setup antes da função
var typingTimer; //variável do Timer
var doneTypingInterval = 500; //tempo do intervalo
var $input = $("#myInput");
var list = document.createElement("ul");
list.classList.add("autocomplete-ul");

//quando parar de digitar começa a contagem
$input.on("keyup", function() {
  clearTimeout(typingTimer);
  typingTimer = setTimeout(doneTyping, doneTypingInterval);
});

//quando digitar, zera a contagem
$input.on("keydown", function() {
  clearTimeout(typingTimer);
});

//quando o usuário "finalizar a digitação," faça algo
function doneTyping() {
  let text = $("#myInput").val();

  var settings = {
    async: true,
    crossDomain: true,
    url: `http://nat-advertiser-api.voxus.tv/api/v1/campaigns/autocomplete?data%5Btype%5D=1&data%5Btext%5D=${text}&auth%5Btoken%5D=${localStorage.getItem(
      "token"
    )}`, //Token da API no LocalStorage
    method: "GET"
  }; //opções da API

  if ($("#myInput").val() !== "") {
    let loading = $("#loading");
    loading.removeClass("display-none");
    $.ajax(settings).done(function(result) {
      if (result.status) {
        list.innerHTML = "";
        loading.addClass("display-none");
        localStorage.setItem("token", result.auth.token); //Token atualizada da API
        for (let i = 0; i < result.response.suggested.length; i++) {
          if (result.response.suggested[i].type === "country") {
            let li = document.createElement("li");
            let node = document.createTextNode(
              `${result.response.suggested[i].country} (país)`
            );
            list.appendChild(li);
            li.classList.add("autocomplete-list");
            li.appendChild(node);
            let element = $("#autocomplete");
            element.after(list);
          } else if (result.response.suggested[i].type === "state") {
            let li = document.createElement("li");
            let node = document.createTextNode(
              `${result.response.suggested[i].state} (estado)`
            );
            list.appendChild(li);
            li.classList.add("autocomplete-list");
            li.appendChild(node);
            let element = $("#autocomplete");
            element.after(list);
          } else if (result.response.suggested[i].type === "city") {
            let li = document.createElement("li");
            let node = document.createTextNode(
              `${result.response.suggested[i].city} (cidade)`
            );
            list.appendChild(li);
            li.classList.add("autocomplete-list");
            li.appendChild(node);
            let element = $("#autocomplete");
            element.after(list);
          }
        }
      }
    });
  } else {
    list.innerHTML = "";
  }
}
