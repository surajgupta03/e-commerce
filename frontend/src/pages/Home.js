import axios from "axios"
import {useEffect,useState} from "react"

const API_BASE_URL = (
  process.env.REACT_APP_API_URL ||
  "http://localhost:5000/api"
).replace(/\/$/, "")

function Home(){

const [products,setProducts] = useState([])

useEffect(()=>{

axios.get(`${API_BASE_URL}/products`)
.then(res=> setProducts(res.data))

},[])

return(

<div>

<h1>Products</h1>

{products.map(p=>(
<div key={p._id}>
<h3>{p.name}</h3>
<p>{p.price}</p>
</div>
))}

</div>

)

}

export default Home
