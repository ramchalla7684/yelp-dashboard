const BASE_URL = 'http://127.0.0.1:3100';

const DataStore = (function () {
    return {
        getBusinessCategories: function () {
            return new Promise((resolve, reject) => {
                fetch(BASE_URL + '/api/v1/business_categories?top=15')
                    .then(response => response.json())
                    .then(response => resolve(response))
                    .catch(error => {
                        console.error(error);
                        reject(null);
                    });
            });
        },
        getBusinesses: function (category) {
            category = encodeURIComponent(category);
            return new Promise((resolve, reject) => {
                fetch(BASE_URL + `/api/v1/businesses?category=${category}&top=15`)
                    .then(response => response.json())
                    .then(response => resolve(response))
                    .catch(error => {
                        console.error(error);
                        reject(null);
                    });
            });
        },
        getBusinessDetails: function (businessID) {
            return new Promise((resolve, reject) => {
                fetch(BASE_URL + `/api/v1/businesses/${businessID}`)
                    .then(response => response.json())
                    .then(response => resolve(response))
                    .catch(error => {
                        console.error(error);
                        reject(null);
                    });
            });
        },
        getRatings: function (quarterData) {
            // return new Promise((resolve, reject) => {
            //     fetch(BASE_URL + 'api to be added')
            //         .then(response => response.json())
            //         .then(response => resolve(response))
            //         .catch(error => {
            //             console.error(error);
            //             reject(null);
            //         });
            // });
            return [
{ 'name': 'daily', 'data': [
{
"date": "4/1/2015",
"likes": "1.5"
},
{
"date": "4/2/2015",
"likes": "1.5"
},
{
"date": "4/3/2015",
"likes": "1.5"
},
{
"date": "4/4/2015",
"likes": "1.5"
},
{
"date": "4/5/2015",
"likes": "2.0"
},
{
"date": "4/6/2015",
"likes": "2.5"
},


{
"date": "5/1/2015",
"likes": "3.4"
},
{
"date": "5/10/2015",
"likes": "3.7"
},
{
"date": "5/11/2015",
"likes": "4.0"
},
{
"date": "5/12/2015",
"likes": "4.2"
},
{
"date": "5/13/2015",
"likes": "4.4"
},
{
"date": "5/14/2015",
"likes": "4.3"
},
{
"date": "5/15/2015",
"likes": "4.8"
},
{
"date": "5/16/2015",
"likes": "4.9"
}
]},
{ 'name': 'weekly', 'data': [ {
"date": "4/1/2015",
"likes": "3"
},
{
"date": "4/7/2015",
"likes": "4"
},
{
"date": "4/14/2015",
"likes": "1.7"
},
{
"date": "4/21/2015",
"likes": "2.8"
},
{
"date": "4/7/2015",
"likes": "4"
},
{
"date": "4/14/2015",
"likes": "1.7"
},
{
"date": "4/21/2015",
"likes": "2.8"
}
]},
{ 'name': 'monthly', 'data': [{
"date": "4/1/2015",
"likes": "4"
},
{
"date": "5/1/2015",
"likes": "4"
},
{
"date": "6/1/2015",
"likes": "4"
}] }
]
        },
    };
})();
