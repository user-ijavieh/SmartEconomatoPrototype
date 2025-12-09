import { ROUTER } from "../../router/router.js";
import { toggleSidebar } from './sidebarController.js'
import { renderToggleSidebar, renderToggleSubMenu } from '../../view/uiMain.js'
import { AuthService } from '../../services/authService.js'
import { messageService } from '../../services/messageService.js'

// Verificar autenticación al cargar la página
if (!AuthService.isAuthenticated()) {
  console.warn('Usuario no autenticado, redirigiendo al login...');
  window.location.href = '../../login.html';
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  const toggleButton = document.getElementById('toggle-btn')
  const dropdownBtns = document.querySelectorAll('.dropdown-btn')
  const navLinks = document.querySelectorAll('[data-route]')
  const btnLogout = document.getElementById('btnLogout')

  // Logout button
  if (btnLogout) {
    btnLogout.addEventListener('click', async (e) => {
      e.preventDefault()
      const confirmed = await messageService.askConfirmation(
        '¿Estás seguro de que deseas cerrar sesión?',
        {
          title: 'Cerrar Sesión',
          confirmText: 'Sí, cerrar sesión',
          cancelText: 'Cancelar'
        }
      )
      if (confirmed) {
        AuthService.logout()
        window.location.href = '../../login.html'
      }
    })
  }

  // Toggle sidebar button
  if (toggleButton) {
    toggleButton.addEventListener('click', () => {
      toggleSidebar()
      renderToggleSidebar()
    })
  }

  // Dropdown buttons
  dropdownBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      renderToggleSubMenu(btn)
    })
  })

  // Navigation links
  navLinks.forEach(link => {
    link.addEventListener('click', async (e) => {
      e.preventDefault()
      const page = link.dataset.route

      // Cambiar estado activo del menú
      navLinks.forEach(l => {
        l.closest('li')?.classList.remove('active')
      })
      link.closest('li')?.classList.add('active')

      try {
        await ROUTER.route(page)
      } catch (error) {
        console.error('Error navegando:', error)
      }
    })
  })

  // Cargar página si hay hash en la URL
  const hash = window.location.hash.slice(1) // Remover el #
  if (hash) {
    const page = hash
    // Cambiar estado activo del menú
    navLinks.forEach(l => {
      l.closest('li')?.classList.remove('active')
    })
    const activeLink = document.querySelector(`[data-route="${page}"]`)
    if (activeLink) {
      activeLink.closest('li')?.classList.add('active')
    }

    try {
      ROUTER.route(page)
    } catch (error) {
      console.error('Error navegando:', error)
    }
  }
})

