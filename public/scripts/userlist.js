axios({
  method: 'get',
  url: '/isadmin',
}).then((response) => {
  if (response.data === true) {
    axios({
      method: 'get',
      url: '/getusers',
    })
      .then((response2) => {
        response2.data.forEach((element) => {
          document.getElementById('body-users').innerHTML += `<tr>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">${element.id}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <img class="h-10 w-10 rounded-full" style="object-fit: cover" src="${
  element.photo
    ? element.photo
    : '/assets/img/defaultuser.jpg'
}" alt="">
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">
                        ${element.name}
                      </div>
                      <div class="text-sm text-gray-500">
                        ${element.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">${element.telnumber}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary white uppercase">
                    ${element.type}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <p class="text-gray-900 whitespace-no-wrap">
                <button onclick="deleteUser(${element.id})" id="user${
  element.id
}_delete"
                    type="button"
                    data-toggle="tooltip" data-placement="top" title="Deletar"><i
                        class="fa fa-trash red"></i></button>
                </p>
                </td>
              </tr>`;
        });
      })
      .catch((error) => {
        console.log(error);
      });
    axios({
      method: 'get',
      url: '/getcollaborators',
    }).then((response3) => {
      response3.data.forEach((element) => {
        document.getElementById('body-collaborators').innerHTML += `<tr>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">${element.id}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <img class="h-10 w-10 rounded-full" style="object-fit: cover" src="${
  element.photo
    ? element.photo
    : '/assets/img/defaultuser.jpg'
}" alt="">
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">
                      ${element.name}
                    </div>
                    <div class="text-sm text-gray-500">
                      ${element.email}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">${element.telnumber}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary white uppercase">
                  ${element.type}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <p class="text-gray-900 whitespace-no-wrap">
              <button onclick="deleteCollaborator(${element.id})" id="user${
  element.id
}_delete"
                  type="button"
                  data-toggle="tooltip" data-placement="top" title="Deletar"><i
                      class="fa fa-trash red"></i></button>
              </p>
              </td>
            </tr>`;
      });
    }).catch((error2) => {
      console.log(error2);
    });
  } else {
    window.location.href = '/admin';
  }
});
