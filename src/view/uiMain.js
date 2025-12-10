/**
 * @fileoverview Interfaz de usuario principal
 * Funciones para renderizar y gestionar el sidebar y sus submenús
 * @module view/uiMain
 */

/**
 * Referencias a elementos del DOM del sidebar
 * @type {HTMLElement|null}
 */
export const toggleButton = document.getElementById('toggle-btn')
export const sidebar = document.getElementById('sidebar')

/**
 * Alterna la visibilidad del sidebar
 * @returns {void}
 */
export function renderToggleSidebar() {
  if (toggleButton) {
    sidebar.classList.toggle('close')
    toggleButton.classList.toggle('rotate')
  }
}

/**
 * Alterna la visibilidad del submenú asociado a un botón
 * Cierra otros submenús abiertos
 * @param {HTMLElement} button - Botón que dispara el submenú
 * @returns {void}
 */
export function renderToggleSubMenu(button) {
  if (button.nextElementSibling.classList.contains('show')) {
    button.nextElementSibling.classList.remove('show')
    button.classList.remove('rotate')
  } else {
    closeAllSubMenus()
    button.nextElementSibling.classList.add('show')
    button.classList.add('rotate')
  }

  if (sidebar.classList.contains('close')) {
    sidebar.classList.toggle('close')
    toggleButton.classList.toggle('rotate')
  }
}

/**
 * Cierra todos los submenús abiertos
 * @returns {void}
 */
export function closeAllSubMenus() {
  Array.from(sidebar.getElementsByClassName('show')).forEach(ul => {
    ul.classList.remove('show')
    ul.previousElementSibling.classList.remove('rotate')
  })
}
