/**
 * @fileoverview Controlador del sidebar
 * Maneja la apertura/cierre del sidebar y sus submenús
 * @module controllers/mainController/sidebarController
 */

const toggleButton = document.getElementById('toggle-btn')
const sidebar = document.getElementById('sidebar')

/**
 * Cierra todos los submenús abiertos del sidebar
 * @private
 * @returns {void}
 */
function closeAllSubMenus() {
  Array.from(sidebar.getElementsByClassName('show')).forEach(ul => {
    ul.classList.remove('show')
    ul.previousElementSibling.classList.remove('rotate')
  })
}

/**
 * Alterna la visibilidad del sidebar
 * Cierra todos los submenús abiertos
 * @returns {void}
 */
export function toggleSidebar() {
  closeAllSubMenus()
}

/**
 * Alterna la apertura/cierre de un submenú
 * @param {HTMLElement} button - Botón que dispara el submenú
 * @returns {void}
 */
export function toggleSubMenu(button) {
  if (!button.nextElementSibling.classList.contains('show')) {
    closeAllSubMenus()
  } else {
    button.nextElementSibling.classList.remove('show')
    button.classList.remove('rotate')
    return
  }

  button.nextElementSibling.classList.add('show')
  button.classList.add('rotate')

  if (sidebar.classList.contains('close')) {
    sidebar.classList.toggle('close')
    toggleButton.classList.toggle('rotate')
  }
}