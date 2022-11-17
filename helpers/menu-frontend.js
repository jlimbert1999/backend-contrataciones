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
          { nombre: 'Grupo de trabajo', ruta: 'funcionarios', icon: 'groups' }
        ]
      }
    ]
  }
  else if (rol == 'planificacion') {
    Menu = [
      {
        modulo: "Administracion",
        submodulos: [
          { nombre: 'Tramites', ruta: 'tramites', icon: 'description' },
          { nombre: 'Bandeja entrada', ruta: 'bandeja_entrada', icon: 'mail' },
          { nombre: 'Bandeja salida', ruta: 'bandeja_salida', icon: 'drafts' },
        ]
      },
      {
        modulo: "Reportes",
        submodulos: [
          { nombre: 'Registrados', ruta: 'control', icon: 'description' },
        ]
      }

    ]
  }
  else if (rol == 'sicoes') {
    Menu = [
      {
        modulo: "Administracion",
        submodulos: [
          { nombre: 'Bandeja entrada', ruta: 'bandeja_entrada', icon: 'mail' },
          { nombre: 'Bandeja salida', ruta: 'bandeja_salida', icon: 'drafts' },
        ]
      },
      {
        modulo: "Reportes",
        submodulos: [
          { nombre: 'Registrados', ruta: 'control', icon: 'description' },
        ]
      }
    ]
  }
  else if (rol == 'jefe') {
    Menu = [
      {
        modulo: "Control",
        submodulos: [
          { nombre: 'Tramite', ruta: 'control', icon: 'description' },
        ]
      }

    ]
  }

  return Menu


}
module.exports = {
  getMenuFrontend
}