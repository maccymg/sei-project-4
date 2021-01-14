import React from 'react'
import { loginUser } from '../../lib/api'
import { useHistory } from 'react-router-dom'
import { setToken } from '../../lib/auth'


function Login() {
  const history = useHistory()
  const [formdata, setFormdata] = React.useState({
    email: '',
    password: ''
  })

  const handleChange = event => {
    setFormdata({ ...formdata, [event.target.name]: event.target.value })
  }


  const handleSubmit = async event => {
    event.preventDefault()
    try {
      if (formdata !== '') {
        const { data } = await loginUser(formdata)
        setToken(data.token)
        history.push('/teams/new')
      } else {
        throw new Error
      }
    } catch (err) {
      console.log(err)
      window.alert('Fill in the form correctly')
    }
  }

  return (
    <section className="base-container">
      <div className="header">Login</div>
      <div className="content">
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label className="label">
              <input
                className="input"
                placeholder="Email"
                onChange={handleChange}
                name="email"
                value={formdata.email}
              />
            </label>
          </div>
          <div className="form-group">
            <label className="label">
              <input
                type="password"
                className="input"
                placeholder="Password"
                onChange={handleChange}
                name="password"
                value={formdata.password}
              />
            </label>
          </div>
          <div className="footer">
            <button type="submit" className="button">Log Me In</button>
          </div>
        </form>
      </div>
    </section>
  )
}

export default Login