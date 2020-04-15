//setup antes da função
var typingTimer; //variável do Timer
var doneTypingInterval = 500; //tempo do intervalo
var $input = document.querySelector("#myInput");
var list = document.createElement("ul");
list.classList.add("autocomplete-ul");

var ignoreIds = [];
var valIgnoreIds = "";
var keyAC = 0;

//quando parar de digitar começa a contagem
$input.addEventListener("keyup", function () {
  clearTimeout(typingTimer);
  typingTimer = setTimeout(doneTyping, doneTypingInterval);
});

//quando digitar, zera a contagem
$input.addEventListener("keydown", function () {
  clearTimeout(typingTimer);
});

//quando o usuário "finalizar a digitação," faça algo
function doneTyping() {
  let text = $input.value;
  var settings = {
    async: true,
    crossDomain: true,
    url: `http://nat-advertiser-api.voxus.tv/api/v1/campaigns/autocomplete?data[type]=1&data[text]=${text}&auth[token]=${localStorage.getItem(
      "token"
    )}&${valIgnoreIds}`, //Token da API no LocalStorage
    method: "GET",
  }; //opções da API

  if ($input.value !== "") {
    let loading = $("#loading");
    loading.removeClass("display-none");
    // Recebendo dados via API
    $.ajax(settings).done(function (result) {
      if (result.status) {
        list.innerHTML = "";
        loading.addClass("display-none");
        localStorage.setItem("token", result.auth.token); //Token atualizada da API
        // Verificação de tipo do resultado
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
            li.setAttribute("id", result.response.suggested[i].id);
            li.setAttribute("type", result.response.suggested[i].type);
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
            li.setAttribute("id", result.response.suggested[i].id);
            li.setAttribute("type", result.response.suggested[i].type);
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
            li.setAttribute("id", result.response.suggested[i].id);
            li.setAttribute("type", result.response.suggested[i].type);
          }
        }
      }
      let names = [];
      let autocompleteList = document.querySelectorAll(".autocomplete-list");

      for (const autocompleteItem of autocompleteList) {
        // Adicionando item da lista
        autocompleteItem.addEventListener("click", function () {
          let value = this.innerHTML;
          list.innerHTML = "";
          // Verificando se o item já foi adicionado
          if (names.indexOf(value) === -1) {
            names.push(value);

            let data = {
              id: parseInt(this.id),
              type: this.type,
            };
            valIgnoreIds = {
              data: {
                filter: {
                  ignoreIds: ignoreIds,
                },
              },
            };
            ignoreIds.push(data);
            keyAC = 0;
            valIgnoreIds = toQueryString(valIgnoreIds);

            let div = document.createElement("div");
            div.classList.add("ac-sugestion");
            let sugestionNameElement = document.createElement("label");
            sugestionNameElement.classList.add("sugestion-name");
            let sugestionName = document.createTextNode(value);
            let sugestionCloseElement = document.createElement("label");
            sugestionCloseElement.classList.add("close-icon");
            let sugestionClose = document.createTextNode("x");
            sugestionNameElement.appendChild(sugestionName);
            sugestionCloseElement.appendChild(sugestionClose);
            div.appendChild(sugestionNameElement);
            div.appendChild(sugestionCloseElement);
            let element = document.getElementById("sugestion-field");
            element.appendChild(div);
            let sugestion = $(".ac-sugestion");
            // Removendo item da lista
            sugestion.click(function () {
              names.splice(names.indexOf(value), 1);
              this.remove();
            });
          }
        });
      }
    });
  } else {
    list.innerHTML = "";
  }
}

function toQueryString(params = {}, prefix) {
  const query = Object.keys(params).map((k) => {
    let key = k;
    var value = params[key];

    if (!value && (value === null || value === undefined || isNaN(value))) {
      value = "";
    }

    switch (params.constructor) {
      case Array:
        key = `${prefix}[${keyAC}]`;
        keyAC = keyAC + 1;
        console.log(keyAC)
        break;
      case Object:
        key = prefix ? `${prefix}[${key}]` : key;
        break;
    }

    if (typeof value === "object") {
      return toQueryString(value, key); // for nested objects
    }

    return `${key}=${encodeURIComponent(value)}`;
  });

  return query.join("&");
}
