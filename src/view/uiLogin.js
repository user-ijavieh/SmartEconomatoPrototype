export const uiLogin = {

    showMessage(message, type = 'error') {
        const msgElement = document.getElementById('loginMessage');
        msgElement.textContent = message;
        msgElement.className = `login-message login-message-${type}`;
        msgElement.style.display = 'block';
    },

    hideMessage() {
        const msgElement = document.getElementById('loginMessage');
        msgElement.style.display = 'none';
    },

    clearForm() {
        document.getElementById('loginForm').reset();
    }

}