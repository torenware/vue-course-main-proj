# Test users


Robs-MBP-3:main-prj-01-starting-setup rtoren$ NODE_PATH=./node_modules node backend/test/ping-api.js signup
```json
{
  name: 'yaya3',
  email: 'yaya3@yayas.org',
  id: '1625638225634',
  role: 'user',
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjE2MjU2MzgyMjU2MzQiLCJlbWFpbCI6InlheWEzQHlheWFzLm9yZyIsImV4cCI6MTYyNjI0MzAyNSwiaWF0IjoxNjI1NjM4MjI1fQ.0M0shxCvxzGuV4-uFcwx-a3WSBdN9X20Z9W28GBCe8U',
  expires: 1626243025
}
```

```javascript
fetch('/user/data', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer' + authToken
  }
})
.then(res => res.json())
.then(data => { console.log(data) })
.catch(err => { console.log(err) })
```

