import Slider from "react-slick";
import { useNavigate } from "react-router-dom";

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  centerMode: true,
  centerPadding: "140px",
  autoplay: true,
  autoplaySpeed: 3200,
  pauseOnHover: true,
  adaptiveHeight: true,
  arrows: true,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        centerPadding: "60px",
      },
    },
    {
      breakpoint: 768,
      settings: {
        centerPadding: "20px",
        arrows: false,
      },
    },
    {
      breakpoint: 480,
      settings: {
        centerPadding: "0px",
        arrows: false,
      },
    },
  ],
};

export default function ProductCarousel({ products, onAdd }) {
  const navigate = useNavigate();

  return (
    <div className="hero-carousel-wrap">
      <Slider {...settings}>
        {products.map((product) => (
          <article key={product._id} className="hero-slide">
            <div className="hero-slide-image">
              <img src={product.image} alt={product.name} />
            </div>
            <div className="hero-slide-content">
              <span className="eyebrow">{product.badge || "Featured"}</span>
              <h2>{product.name}</h2>
              <p>{product.description}</p>
              <div className="hero-slide-meta">
                <span>{product.category}</span>
                <strong>{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(Number(product.price || 0))}</strong>
              </div>
              <div className="hero-slide-actions">
                <button type="button" className="primary-button" onClick={() => navigate(`/product/${product._id}`)}>
                  View details
                </button>
                <button type="button" className="secondary-button" onClick={() => onAdd(product)}>
                  Add to cart
                </button>
              </div>
            </div>
          </article>
        ))}
      </Slider>
    </div>
  );
}
