import {Link} from "react-router-dom"

function ProductCard({product}){

return(

<div className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">

<div className="h-48 overflow-hidden">
<img src={product.image} alt={product.name} className="w-full h-full object-cover" />
</div>

<div className="p-4">
<h2 className="text-xl font-semibold mb-2">{product.name}</h2>
<p className="text-gray-600 mb-4">${product.price}</p>
<Link to={"/product/"+product._id} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
View Details
</Link>
</div>

</div>

)

}

export default ProductCard
