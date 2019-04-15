import _ from 'lodash'
console.log('test main')
console.log(_)

const button = document.createElement('button')
button.innerText = 'click to login'
button.onclick = function() {
  location.href = '/login.html'
}
const app = document.getElementById('app')
app.appendChild(button)
