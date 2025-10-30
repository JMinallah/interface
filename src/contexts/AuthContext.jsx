/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from 'react'
import { account, ID } from '../lib/appwrite'

const AuthContext = createContext(null)

// Note: this file provides the AuthProvider and the useAuth hook for the app

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true
    account
      .get()
      .then((u) => {
        if (!mounted) return
        setUser(u)
      })
      .catch((err) => {
        // Log the error for debugging (e.g., 401 when there's no session)
        console.debug('Appwrite account.get() failed:', err)
        // If unauthorized (no session), clear user silently; otherwise surface error
        try {
          // Appwrite SDK errors sometimes have `code` or `response` fields
          const code = err?.code || err?.response?.status || err?.status
          if (code && Number(code) !== 401) {
            console.error('Auth error (not 401):', err)
            setError(err)
          }
        } catch {
          // ignore parsing errors
        }
        setUser(null)
      })
      .finally(() => mounted && setLoading(false))

    return () => {
      mounted = false
    }
  }, [])

  async function signUp({ name, email, password }) {
    setError(null)
    try {
      // create user with a unique id
      await account.create(ID.unique(), email, password, name)
      // create session immediately after signup (v21+ uses createEmailPasswordSession)
      await account.createEmailPasswordSession(email, password)
      const u = await account.get()
      setUser(u)
      return u
    } catch (err) {
      setError(err)
      throw err
    }
  }

  async function signIn({ email, password }) {
    setError(null)
    try {
      await account.createEmailPasswordSession(email, password)
      const u = await account.get()
      setUser(u)
      return u
    } catch (err) {
      setError(err)
      throw err
    }
  }

  async function signOut() {
    try {
      await account.deleteSession('current')
    } catch (err) {
      console.debug('Sign out error (likely no session):', err)
    }
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, error, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
