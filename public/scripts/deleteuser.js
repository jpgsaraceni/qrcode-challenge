function deleteUser(id) {
  swal({
    title: 'Tem certeza?',
    text: 'Este usuário será deletado, e não poderá ser recuperado.',
    icon: 'warning',
    buttons: ['Cancelar', 'Confirmar'],
    dangerMode: true,
  }).then((ok) => {
    if (ok) {
      axios({
        method: 'delete',
        url: `/user?id=${id}`,
      }).then(() => {
        window.location.reload();
      });
    }
  });
}
