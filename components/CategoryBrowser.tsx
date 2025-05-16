// components/CategoryBrowser.tsx
import Image from 'next/image';
import Link from 'next/link';

interface Category {
  id: string;
  name: string;
  slug: string;
  imageUrl: string;
  bookCount: number;
}

const CategoryBrowser = () => {
  // Real categories from your book list with appropriate images
  const categories: Category[] = [
    {
      id: '1',
      name: 'Web Development',
      slug: 'web-development',
      imageUrl: 'https://ik.imagekit.io/pwd17k26p/books/covers/file_rzjr6TrKF.png', // Using React in Action cover
      bookCount: 3, // CSS in Depth, HTML and CSS, React in Action
    },
    {
      id: '2',
      name: 'System Design',
      slug: 'system-design',
      imageUrl: 'https://ik.imagekit.io/pwd17k26p/books/covers/file_CmVaNeXrQ.png', // System Design Interview cover
      bookCount: 1,
    },
    {
      id: '3',
      name: 'Computer Science',
      slug: 'computer-science',
      imageUrl: 'https://ik.imagekit.io/pwd17k26p/books/covers/file_W6Bz0KiBC.png', // Operating System Concepts cover
      bookCount: 4, // Computer Science Distilled, Fundamentals of DB, OS Concepts, Algorithms
    },
    {
      id: '4',
      name: 'Programming',
      slug: 'programming',
      imageUrl: 'https://ik.imagekit.io/pwd17k26p/books/covers/file_-xOn0_b32.png', // JavaScript: The Good Parts cover
      bookCount: 5, // Art of Assembly, Seriously Good, JS Good Parts, Eloquent JS, Cracking Coding Interview
    },
    {
      id: '5',
      name: 'Software',
      slug: 'software',
      imageUrl: 'https://ik.imagekit.io/pwd17k26p/books/covers/file_EE5klEyX0.png', // The Clean Coder cover
      bookCount: 2, // The Clean Coder, The Lean Startup
    },
    {
      id: '6',
      name: 'Self Help',
      slug: 'self-help',
      imageUrl: 'https://ik.imagekit.io/pwd17k26p/books/covers/file_HOCexO5Ms.png', // Atomic Habits cover
      bookCount: 1,
    },
  ];

  return (
    <section className="mt-28">
      <div className="mx-auto text-white">
        <h2 className="font-bebas-neue text-4xl text-light-100 mb-4">BROWSE BY GENRE</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link 
              key={category.id} 
              href={`/categories/${category.slug}`}
              className="group block overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="relative h-48">
                <Image
                  src={category.imageUrl}
                  alt={category.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  unoptimized // Remove if you want Next.js to optimize these images
                />
                <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                  <h3 className="text-white text-xl font-semibold text-center px-2">
                    {category.name}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link 
            href="/categories" 
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
          >
            View All Categories
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CategoryBrowser;