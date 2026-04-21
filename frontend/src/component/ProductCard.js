import {Link} from "react-router-dom"

function ProductCard({product}){

return(

<div className="shadow-lg p-4">

<img src={product.image} />

<h2>{product.name}</h2>

<p>{product.price}</p>

<Link to={"/product/"+product._id}>
View
</Link>

</div>

)

}

export default ProductCard
