import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const HeroCarousel = () => {
  const carouselImages = [
    {
      id: 1,
      src: "src/assets/images/front-slaughter-house-2.png",
      text: "Hero Image 1",
    },
    {
      id: 2,
      src: "src/assets/images/front-slaughter-house.jpg",
      text: "Hero Image 2",
    },
    {
      id: 3,
      src: "src/assets/images/476584250_1311233706597484_4307743186715087546_n.jpg",
      text: "Hero Image 3",
    },
  ];

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <Slider {...sliderSettings}>
      {carouselImages.map((image) => (
        <div
          key={image.id}
          className="bg-red-100 h-64 md:h-80 rounded-lg shadow-lg flex items-center justify-center"
        >
          <img
            src={image.src}
            alt={image.text}
            className="h-full w-full object-cover rounded-lg"
          />
          <p className="absolute text-white font-medium bg-black bg-opacity-50 px-2 py-1 rounded">
            {image.text}
          </p>
        </div>
      ))}
    </Slider>
  );
};

export default HeroCarousel;
