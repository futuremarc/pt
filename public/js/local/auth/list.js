$(document).ready(function() {

  console.log('get list', userName, userId);

  window.initList = function() {

    var id = window.userId

    getListData(id).then(function(friends) {
      createInterface(friends)
    })

  }

  function createInterface(friends){
    console.log('createInterface', friends);

     var html = Templates.extension.addList(friends)

    var container = $('#pt-list-container')
    container.append(html)

  }

   var getListData = function(userId) {

    return new Promise(function(resolve, reject) {

      var id = userId

      $.ajax({
        method: 'GET',
        url: '/api/users/' + id,
        success: function(data) {
          console.log(data)

          if (data.status === 'success') {

            var friends = data.data.friends
            resolve(friends);

          }
        },
        error: function(err) {
          console.log(err)
          reject(err);
        }
      })

    });

  }

    initList()


})