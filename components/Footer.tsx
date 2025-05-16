const Footer = () => {
  return (
<footer className="">
  <div className="mx-auto max-w-screen-xl px-4 py-4">
     
    <div className="mt-12 border-t border-gray-100 pt-6 dark:border-gray-800">
      <div className="text-center sm:flex sm:justify-between sm:text-left">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          <span className="block sm:inline text-white">All rights reserved. </span>

          <a
            className="inline-block text-white   "
            href="#"
          >
            Terms & Conditions
          </a>

          <span>&middot;</span>

          <a
            className="inline-block text-white  "
            href="#"
          >
            Privacy Policy
          </a>
        </p>

        <p className="mt-4 text-sm text-white">
          &copy; 2025 Librify
        </p>
      </div>
    </div>
  </div>
</footer>
  )
}

export default Footer