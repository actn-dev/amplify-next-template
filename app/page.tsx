"use client";

import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import "./../app/app.css";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
import { Authenticator } from "@aws-amplify/ui-react";

Amplify.configure(outputs);

const client = generateClient<Schema>();

export default function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  const [isCreating, setIsCreating] = useState(false)

  function listTodos() {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }

  useEffect(() => {
    listTodos();
  }, []);

  async function createTodo() {
    const content = window.prompt("Todo content")
    if (content) {
      setIsCreating(true)
      try {
        await client.models.Todo.create({
          content: content,
        })
      } catch (error) {
        console.error("Error creating todo:", error)
      } finally {
        setIsCreating(false)
      }
    }
  }



  return (
    <Authenticator>
      {({user, signOut}) => {

     
    return <main>
      <h1>My todos</h1>
      {user?.username}
      <button onClick={createTodo}>+ new</button>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>{todo.content}</li>
        ))}
      </ul>

      {isCreating ? (
          <>
            
            Creating...
          </>
        ) : (
          "+ New Todo"
        )}
      <div>
        🥳 App successfully hosted. Try creating a new todo.
        <br />
        <a href="https://docs.amplify.aws/nextjs/start/quickstart/nextjs-app-router-client-components/">
          Review next steps of this tutorial.
        </a>
      </div>
      <button onClick={signOut}>Sing Out</button>
    </main>
     }}
    </Authenticator>
  );
}
