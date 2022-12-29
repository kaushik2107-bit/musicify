import { Saira } from "@next/font/google";
import Slider from "react-slick";
import Card from "./Card";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const saira = Saira({ subsets: ["latin"] });

const cardsData = [
  {
    name: "Drivers License",
    artist: "Olivia Rodrigo",
    image: "/cardsImages/drivers_license.webp",
  },
  {
    name: "Snowman",
    artist: "Sia",
    image: "/cardsImages/snowman.webp",
  },
  {
    name: "Until I found you",
    artist: "Stephen Sanchez",
    image: "/cardsImages/until_I_found_you.jpeg",
  },
  {
    name: "Moral of the story",
    artist: "Ashe",
    image: "/cardsImages/moral_of_the_story.jpeg",
  },
];

export default function TrendingMusic() {
  const settings = {
    dots: false,
    autoplay: true,
    autoplaySpeed: 5000,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: 0,
    speed: 500,
    arrows: false,
    adaptiveHeight: true,
  };

  return (
    <div className={saira.className}>
      <h4 className="mx-8 m-4 text-[20px] text-[#aaa] font-medium uppercase">
        Trending Music
      </h4>
      <div className="mx-8 m-4 relative">
        <Slider {...settings} className="absolute w-full">
          {cardsData
            .map((item, index) => (
              <Card
                key={index}
                name={item.name}
                artist={item.artist}
                image={item.image}
                index={index}
              />
            ))
            .reverse()}
        </Slider>
      </div>
    </div>
  );
}
