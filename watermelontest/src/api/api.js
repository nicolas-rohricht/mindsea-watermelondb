import { create } from 'apisauce'

// define the api
const api = create({
  baseURL: 'http://192.168.3.4:3000',
  headers: {
    'Content-Type': 'application/json'
  }
})

export default api

// // start making calls
// api
//   .get('/repos/skellock/apisauce/commits')
//   .then(response => response.data[0].commit.message)
//   .then(console.log)

// // customizing headers per-request
// api.post('/users', { name: 'steve' }, { headers: { 'x-gigawatts': '1.21' } })