import axios from "axios"
import {useEffect,useState} from "react"
import Slider from "react-slick"
import ProductCard from "../component/ProductCard"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"

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

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
      }
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      }
    }
  ]
}

return(

<div className="container mx-auto p-4">

<h1 className="text-3xl font-bold text-center mb-8">Featured Products</h1>

{products.length > 0 ? (
  <Slider {...settings}>
    {products.map(p=>(
      <div key={p._id} className="px-2">
        <ProductCard product={p} />
      </div>
    ))}
  </Slider>
) : (
  <p className="text-center">Loading products...</p>
)}

</div>

)

}

export default Home

