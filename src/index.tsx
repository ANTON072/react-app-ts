import React, { useState } from "react"
import * as ReactDOM from "react-dom"
import "reset-css"
import styled from "styled-components"

interface HelloProps {
  name: string
}

const Title = styled.h1`
  color: red;
  background: blue;
`

const Hello: React.FC<HelloProps> = ({ name }) => <Title>Hello {name}!</Title>

const App: React.FC = () => {
  const [count, setCount] = useState(0)
  return (
    <React.Fragment>
      <Hello name="hoge" />
      <h3>
        Count: {count}
        <button onClick={() => setCount(count + 1)}>Count</button>
      </h3>
    </React.Fragment>
  )
}

ReactDOM.render(<App />, document.getElementById("root"))
