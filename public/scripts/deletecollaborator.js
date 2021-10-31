function deleteCollaborator(id) {
  swal({
    title: 'Tem certeza?',
    text: 'Este Colaborador será deletado, e não poderá ser recuperado.',
    icon: 'warning',
    buttons: ['Cancelar', 'Confirmar'],
    dangerMode: true,
  }).then((ok) => {
    if (ok) {
      axios({
        method: 'delete',
        url: `/collaborator?id=${id}`,
      }).then(() => {
        window.location.reload();
      });
    }
  });
}
