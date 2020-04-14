function getBusinessCategories(){
// -- API:  https://github.com/ramchalla7684/yelp-backend-service/api/v1/businesses?category=Restaurants&top=10
  // python -m http.server 9000
  var url = 'http://dummy.restapiexample.com/api/v1/employees'; // dummy URL for testing
  //var url = '/api/v1/businesses?category=Restaurants&top=10';
  console.log("Inside getBusinessCategories() --")
  fetch(url, {
        method: 'GET',
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        }
    })
    .then(response => response.json())
    .then(json => {
        var businessCategories = json;
        console.log("data: "+JSON.stringify(json));
    });
}



var businessCategories = [
  {
    "business_id": "1234",
    "categories": "Restaurants"
  },
  {
    "business_id": "1235",
    "categories": "Golf Clubs"
  },
  {
    "business_id": "1236",
    "categories": "Beauty & Spas"
  },
  {
    "business_id": "1237",
    "categories": "Shopping"
  },
  {
    "business_id": "1238",
    "categories": "Fitness and Instruction"
  },
  {
    "business_id": "1239",
    "categories": "Yoga"
  }
]
var ele = document.getElementById('sel');
      for (var i = 0; i < businessCategories.length; i++) {
          // POPULATE SELECT ELEMENT WITH JSON.
          ele.innerHTML = ele.innerHTML +
              '<option value="' + businessCategories[i]['business_id'] + '">' + businessCategories[i]['categories'] + '</option>';
    }
$(".chosen").chosen();
