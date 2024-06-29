import React, { useState } from 'react'
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom'
import Articles from './Articles'
import LoginForm from './LoginForm'
import Message from './Message'
import ArticleForm from './ArticleForm'
import Spinner from './Spinner'
import axios from 'axios'

const articlesUrl = 'http://localhost:9000/api/articles'
const loginUrl = 'http://localhost:9000/api/login'

export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [currentArticleId, setCurrentArticleId] = useState(null)
  const [spinnerOn, setSpinnerOn] = useState(false)

  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate()
  const redirectToLogin = () => { navigate('/') }
  const redirectToArticles = () => { navigate('/articles') }

  const logout = () => {
    // ✨ implement
    // If a token is in local storage it should be removed,
    // and a message saying "Goodbye!" should be set in its proper state.
    // In any case, we should redirect the browser back to the login screen,
    // using the helper above.
    localStorage.removeItem("token")
    setMessage("Goodbye!")
    redirectToLogin()
  }

  const login = async ({ username, password }) => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch a request to the proper endpoint.
    // On success, we should set the token to local storage in a 'token' key,
    // put the server success message in its proper state, and redirect
    // to the Articles screen. Don't forget to turn off the spinner!
    setMessage("")
    setSpinnerOn(true)
    try {
      const { data } = await axios.post(
        loginUrl, { username, password })
      localStorage.setItem('token', data.token)
      setMessage(data.message)
      setSpinnerOn(false)
      redirectToArticles()
    } catch (error) {
      setMessage(error.response.data.message)
      setSpinnerOn(false)
    }

  }

  const getArticles = async () => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch an authenticated request to the proper endpoint.
    // On success, we should set the articles in their proper state and
    // put the server success message in its proper state.
    // If something goes wrong, check the status of the response:
    // if it's a 401 the token might have gone bad, and we should redirect to login.
    // Don't forget to turn off the spinner!
    setMessage('')
    setSpinnerOn(true)
    const token = localStorage.getItem('token')
    try {
      const { data } = await axios.get(articlesUrl, {
        headers: { Authorization: token }
      })
      setArticles(data.articles)
      setMessage(data.message)
      setSpinnerOn(false)
    } catch (error) {
      if (error.response.status === 401) {
        redirectToLogin()
      }
      setMessage(error.response.data.message)
      setSpinnerOn(false)
    }
  }

  const postArticle = async article => {
    // ✨ implement
    // The flow is very similar to the `getArticles` function.
    // You'll know what to do! Use log statements or breakpoints
    // to inspect the response from the server.
    setMessage('')
    setSpinnerOn(true)
    const token = localStorage.getItem('token')
    try {
      const { data } = await axios.post(articlesUrl, article, {
        headers: { Authorization: token }
      })
      setArticles([...articles, data.article])
      setMessage(data.message)
      setSpinnerOn(false)
    } catch (error) {
      setMessage(error.response.data.message)
      setSpinnerOn(false)
    }
  }

  const updateArticle = async ({ article_id, article }) => {
    // ✨ implement
    // You got this!
    setMessage('')
    setSpinnerOn(true)
    const token = localStorage.getItem('token')
    try {
      const { data } = await axios.put(`${articlesUrl}/${article_id}`, article, {
        headers: { Authorization: token }
      })
      setArticles(articles.map(a => (a.article_id === article_id ? data.article : a)))
      setMessage(data.message)
      setSpinnerOn(false)
    } catch (error) {
      setMessage(error.response.data.message)
      setSpinnerOn(false)
    }
  }

  const deleteArticle = async article_id => {
    // ✨ implement
    setMessage('')
    setSpinnerOn(true)
    const token = localStorage.getItem('token')
    try {
      const { data } = await axios.delete(`${articlesUrl}/${article_id}`, {
        headers: { Authorization: token }
      })
      setArticles(articles.filter(a => a.article_id !== article_id))
      setMessage(data.message)
      setSpinnerOn(false)
    } catch (error) {
      setMessage(error.response.data.message)
      setSpinnerOn(false)
    }
  }
  const currentArticle = articles.find(article => article.article_id === currentArticleId)

  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <>
      <Spinner on={spinnerOn}/>
      <Message message={message}/>
      <button id="logout" onClick={logout}>Logout from app</button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}> {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">Login</NavLink>
          <NavLink id="articlesScreen" to="/articles">Articles</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login} />} />
          <Route path="articles" element={
            <>
              <ArticleForm postArticle={postArticle} updateArticle={updateArticle} currentArticle={currentArticle} setCurrentArticleId={setCurrentArticleId}/>
              <Articles articles={articles} getArticles={getArticles} deleteArticle={deleteArticle} setCurrentArticleId={setCurrentArticleId}/>
            </>
          } />
        </Routes>
        <footer>Bloom Institute of Technology 2024</footer>
      </div>
    </>
  )
}
