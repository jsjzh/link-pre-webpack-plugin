import _ from 'lodash'
import '../../common/index.css'
console.log('test login')
console.log(_)

const button = document.createElement('button')
button.innerText = 'click to main'
button.onclick = function() {
  location.href = '/main.html'
}
const app = document.getElementById('app')
app.appendChild(button)
