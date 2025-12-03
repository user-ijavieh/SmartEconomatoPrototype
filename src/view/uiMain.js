// UI Elements
export const toggleButton = document.getElementById('toggle-btn')
export const sidebar = document.getElementById('sidebar')

// Sidebar UI Functions
export function renderToggleSidebar() {
  if (toggleButton) {
    sidebar.classList.toggle('close')
    toggleButton.classList.toggle('rotate')
  }
}

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

export function closeAllSubMenus() {
  Array.from(sidebar.getElementsByClassName('show')).forEach(ul => {
    ul.classList.remove('show')
    ul.previousElementSibling.classList.remove('rotate')
  })
}
