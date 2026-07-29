const MOCK_USERS_KEY = 'safelens_users'
const SESSION_KEY = 'safelens_session'

// Default mock users to begin with
const defaultUsers = [
  {
    name: 'Kofi Mensah',
    email: 'kofi@example.com',
    phone: '0551234567',
    password: 'password123',
    registeredAt: '2026-07-01',
  },
]

const loadUsers = () => {
  try {
    const stored = localStorage.getItem(MOCK_USERS_KEY)
    if (!stored) {
      localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(defaultUsers))
      return defaultUsers
    }
    return JSON.parse(stored)
  } catch {
    return defaultUsers
  }
}

export const authService = {
  getCurrentUser() {
    try {
      const session = localStorage.getItem(SESSION_KEY)
      return session ? JSON.parse(session) : null
    } catch {
      return null
    }
  },

  register({ name, email, phone, password }) {
    const users = loadUsers()
    const emailLower = email.trim().toLowerCase()

    const exists = users.some((u) => u.email.toLowerCase() === emailLower)
    if (exists) {
      throw new Error('An account with this email already exists.')
    }

    const newUser = {
      name: name.trim(),
      email: emailLower,
      phone: phone.trim(),
      password, // In a real app, this would be salted & hashed on the server
      registeredAt: new Date().toISOString().slice(0, 10),
    }

    users.push(newUser)
    localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users))

    // Automatically log user in upon registration
    const sessionUser = { ...newUser }
    delete sessionUser.password
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser))

    return sessionUser
  },

  login({ email, password }) {
    const users = loadUsers()
    const emailLower = email.trim().toLowerCase()

    const user = users.find((u) => u.email.toLowerCase() === emailLower && u.password === password)
    if (!user) {
      throw new Error('Invalid email or password.')
    }

    const sessionUser = { ...user }
    delete sessionUser.password
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser))

    return sessionUser
  },

  logout() {
    localStorage.removeItem(SESSION_KEY)
  },

  updateProfile({ name, phone }) {
    const session = this.getCurrentUser()
    if (!session) throw new Error('No active user session found.')

    const users = loadUsers()
    const updatedUsers = users.map((u) => {
      if (u.email.toLowerCase() === session.email.toLowerCase()) {
        return {
          ...u,
          name: name.trim(),
          phone: phone.trim(),
        }
      }
      return u
    })

    localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(updatedUsers))

    const updatedSession = {
      ...session,
      name: name.trim(),
      phone: phone.trim(),
    }
    localStorage.setItem(SESSION_KEY, JSON.stringify(updatedSession))

    return updatedSession
  },
}
