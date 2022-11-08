const getMenuFrontend = (rol) => {
  let Menu = []
  if (rol == 'admin') {
    Menu = [
      {
        modulo: "Configuraciones",
        submodulos: [
          { nombre: 'Instituciones', ruta: 'instituciones', icon: 'apartment' },
          { nombre: 'Dependencias', ruta: 'dependencias', icon: 'holiday_village' },
          { nombre: 'Tipos de tramite', ruta: 'tipos', icon: 'note' },
        ]

      },
      {
        modulo: "Usuarios",
        submodulos: [
          { nombre: 'Cuentas', ruta: 'cuentas', icon: 'account_circle' },
        ]
      }
    ]
  }
  if (rol == 'planificacion') {
    Menu = [
      {
        modulo: "Administracion",
        submodulos: [
          { nombre: 'Tramites', ruta: 'tramites', icon: 'description' },
        ]

      }

    ]
  }

  return Menu


}
module.exports = {
  getMenuFrontend
}