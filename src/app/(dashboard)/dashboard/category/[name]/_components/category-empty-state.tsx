"use client"
import { Card } from "@/app/components/card"
import { client } from "@/lib/client"
import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import {Prism as SyntaxHighlighter} from "react-syntax-highlighter"
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism"

export const CategoryEmptyState = ({categoryName}:{categoryName:string}) => {
 const router = useRouter()
    const {data} = useQuery({
        queryKey:["category",categoryName,"hasEvents"],
        queryFn:async()=>{
            const res = await client.category.pollingCategory.$get({
                name:categoryName
            })
            return await res.json()
        },
        refetchInterval(query) {
            return query.state.data?.hasEvents ? false:1000
        },
    })
    const hasEvents =data?.hasEvents

    useEffect(() => {
      if(hasEvents) router.refresh()
    
    }, [hasEvents,router])

    const codeSnippet = `await fetch('https://pingpanda.io/api/v1/events', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer YOUR_API_KEY'
        },
        body: JSON.stringify({
          category: '${categoryName}',
          description:'any-description', //optional
          fields: {
            field1: 'value1', // for example: user id
            field2: 'value2' // for example: user email
          }
        })
      })`    

  return (
   <Card contentClassName="max-w-2xl flex items-center w-full flex-col p-6" className="flex-1 flex items-center justify-center ">
    <h2 className="text-xl/8 font-medium tracking-tight text-gray-950">
    Create Your first {categoryName} event
    </h2>
    <p className="text-sm/6 text-gray-600 mb-8 max-w-md text-center text-pretty">
    Get started by sending a request to our trackig API:
    </p>

    <div className="w-full max-w-3xl bg-white rounded-lg  shadow-lg overflow-hidden">
        <div className="bg-gray-800 px-4 py-2 flex justify-between items-center">
            <div className="flex space-x-3">
                <div className="rounded-full size-3 bg-red-500"/>
                <div className="rounded-full size-3 bg-yellow-500"/>
                <div className="rounded-full size-3 bg-green-500"/>
            </div>
            <span className="text-gray-400 text-sm">your-first-event.js</span>
        </div>

        <SyntaxHighlighter language="javascript" style={oneDark} customStyle={{
            borderRadius:"0px",
            margin:0,
            padding:"1rem",
            fontSize:"0.875rem",
            lineHeight:"1.5"
        }}>
{codeSnippet}
        </SyntaxHighlighter>

        
    </div>

    <div className="flex items-center  mt-8 space-x-2">
        <div className="size-4 bg-green-500 animate-pulse rounded-full"/>
        <span className="text-sm text-gray-600">Listening to incomming events...</span>
    </div>
   </Card>
  )
}
