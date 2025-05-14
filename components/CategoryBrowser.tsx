// components/CategoryBrowser.tsx
import Image from 'next/image';
import Link from 'next/link';

interface Category {
  id: number;
  name: string;
  slug: string;
  imageUrl: string;
  bookCount: number;
}

const CategoryBrowser = () => {
  // Dummy data for categories
const categories: Category[] = [
    {
      id: 1,
      name: 'Fiction',
      slug: 'fiction',
      imageUrl: 'https://picsum.photos/300/200?random=11&blur=1',
      bookCount: 1245,
    },
    {
      id: 2,
      name: 'Science Fiction',
      slug: 'science-fiction',
      imageUrl: 'https://picsum.photos/300/200?random=12&blur=2',
      bookCount: 876,
    },
    {
      id: 3,
      name: 'Mystery & Thriller',
      slug: 'mystery-thriller',
      imageUrl: 'https://picsum.photos/300/200?random=13&blur=2',
      bookCount: 765,
    },
    {
      id: 4,
      name: 'Biography',
      slug: 'biography',
      imageUrl: 'https://picsum.photos/300/200?random=14&blur=2',
      bookCount: 543,
    },
    {
      id: 5,
      name: 'History',
      slug: 'history',
      imageUrl: 'https://picsum.photos/300/200?random=15&blur=2',
      bookCount: 654,
    },
    {
      id: 6,
      name: 'Science & Technology',
      slug: 'science-technology',
      imageUrl: 'https://picsum.photos/300/200?random=16&blur=2',
      bookCount: 432,
    },
    {
      id: 7,
      name: 'Fantasy',
      slug: 'fantasy',
      imageUrl: 'https://picsum.photos/300/200?random=17&blur=2',
      bookCount: 567,
    },
    {
      id: 8,
      name: 'Romance',
      slug: 'romance',
      imageUrl: 'https://picsum.photos/300/200?random=18&blur=2',
      bookCount: 789,
    },
  ];

  return (
    <section className="mt-28">
      <div className=" mx-auto text-white">
      <h2 className="font-bebas-neue text-4xl text-light-100 mb-4">BROWSE BY CATEGORY</h2>
        
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
                />
                <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                  <h3 className="text-white text-xl font-semibold text-center px-2">
                    {category.name}
                  </h3>
                </div>
              </div>

              {/* <div className="p-4 bg-white">
                <p className="text-gray-600 text-sm">
                  {category.itemCount.toLocaleString()} items
                </p>
              </div> */}

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