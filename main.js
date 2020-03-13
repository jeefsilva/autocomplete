let text = "São";

var settings = {
	"async": true,
	"crossDomain": true,
	"url": `http://nat-advertiser-api.voxus.tv/api/v1/campaigns/autocomplete?data%5Btype%5D=1&data%5Btext%5D=${text}&auth%5Btoken%5D=${localStorage.getItem('token')}`,
	"method": "GET",
}

$.ajax(settings).done(function (result) {
  console.log(result.response.suggested);
  if (result.status) {
    localStorage.setItem('token', result.auth.token)
  }
});


