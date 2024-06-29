// Import the Spinner component into this file and test
// that it renders what it should for the different props it can take.
import Spinner from "./Spinner"
import React from "react"
import "@testing-library/jest-dom"
import { render, screen } from'@testing-library/react'

describe('Testing spinner', () => {
  test('Shows up spinner', () => {
    render( <Spinner on/>)
    screen.getByText("Please wait...")
  })

})
