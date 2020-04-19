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
            return new Promise((resolve, reject) => {
                fetch(BASE_URL + `/api/v1/businesses?category=${category}`)
                    .then(response => response.json())
                    .then(response => resolve(response))
                    .catch(error => {
                        console.error(error);
                        reject(null);
                    });
            });
        },

    };
})();