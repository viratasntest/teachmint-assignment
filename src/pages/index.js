import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
const inter = Inter({ subsets: ['latin'] })


export default function Home() {
const router = useRouter()
const [users,setUsers] = useState([])

/**
 * To get the count of posts of each user
 */
const countPostsById = (posts,id) => {
  let count = 0;
  posts.forEach((post)=>{
    if(post.userId === id){
      count++
    }
  })
  return count
} 

const fetchUsersAndPosts = async() => {
 let usersResponse = await axios.get('https://jsonplaceholder.typicode.com/users')
 let postsResponse = await axios.get('https://jsonplaceholder.typicode.com/posts')
 let userData = [];
 userData = usersResponse?.data.map((usr)=>{
  return {name:usr.name,id:usr.id,posts:countPostsById(postsResponse.data,usr.id)}
 })
 setUsers(userData)
}

useEffect(()=>{
  fetchUsersAndPosts()
},[])

return (
  <div className={styles.main}>
    <p className={styles.textCenter}>Directory</p>
    {users.map((item,index)=>(
      <div key={index} onClick={()=>router.push(`posts/${item.id}`)} className={styles.userCard} >
        <p>Name:{item.name}</p>
        <p>Posts:{item.posts}</p>
      </div>
    ))}
  </div>
) 
}
