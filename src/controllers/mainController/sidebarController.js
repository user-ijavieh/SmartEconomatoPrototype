const toggleButton = document.getElementById('toggle-btn')
const sidebar = document.getElementById('sidebar')

// Close All SubMenus
function closeAllSubMenus() {
  Array.from(sidebar.getElementsByClassName('show')).forEach(ul => {
    ul.classList.remove('show')
    ul.previousElementSibling.classList.remove('rotate')
  })
}

// Toggle Sidebar
export function toggleSidebar() {
  closeAllSubMenus()
}

// Toggle SubMenu
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