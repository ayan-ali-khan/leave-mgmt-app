import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { replace, useNavigate } from 'react-router-dom'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null) // { _id, role, token, name, email, leaveBalance? }
  const [loading, setLoading] = useState(true)
  const nav = useNavigate();
  
  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) {
      try { setUser(JSON.parse(stored)) } catch {}
    }
    setLoading(false)
  }, [])

  const login = async (email, password, roleHint) => {
    try {
      const res = await api.post(`/api/${roleHint}/login`, { email, password })
    
      const data = res.data
      const payload = {
        ...data.user,
        token: data.token,
        role: data.user?.role || roleHint
      }
      setUser(payload)
      localStorage.setItem('user', JSON.stringify(payload))
      return data.token;
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    }
  }

  const signup = async (fullName, email, password, department, joinDate, role) => {
    try {
      const res = await api.post(`/api/${role}/signup`, { fullName, email, password, department, joinDate })
      // console.log(res)
      // Auto-login after signup if backend returns token
      const data = res.data
      if (data?.token && data?.user) {
        toast.success(data?.message)
        const payload = { ...data.user, token: data.token, role: data.user.role || role }
        setUser(payload); localStorage.setItem('user', JSON.stringify(payload))
      }
      return res.data
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
    nav('/', {replace: true});
  }

  const value = useMemo(() => ({ user, setUser, login, signup, logout, loading }), [user, loading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
