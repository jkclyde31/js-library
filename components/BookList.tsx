'use client'

import { useState } from "react";
import BookCard from "@/components/BookCard";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

interface Props {
  title: string;
  books: Book[];
  containerClassName?: string;
}

const BookList = ({ title, books, containerClassName }: Props) => {
  const [loaded, setLoaded] = useState(false);

  const [sliderRef, instanceRef] = useKeenSlider({
    loop: false,
    mode: "snap",
    slides: {
      perView: 6,
      spacing: 20,
    },
    breakpoints: {
      "(max-width: 1280px)": {
        slides: {
          perView: 2.5,
          spacing: 15,
        },
      },
      "(max-width: 1024px)": {
        slides: {
          perView: 2,
          spacing: 15,
        },
      },
      "(max-width: 768px)": {
        slides: {
          perView: 1.5,
          spacing: 10,
        },
      },
      "(max-width: 480px)": {
        slides: {
          perView: 1,
          spacing: 5,
        },
      },
    },
    created() {
      setLoaded(true);
    },
  });

  // Don't render if there's less than 2 books
  if (books.length < 2) return null;

  return (
    <section className={containerClassName}>
      <h2 className="font-bebas-neue text-4xl text-light-100 mb-4">{title}</h2>
      
      <div ref={sliderRef} className="keen-slider list-none">
        {books.map((book) => (
          <div key={book.title} className="keen-slider__slide">
            <BookCard {...book} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default BookList;
