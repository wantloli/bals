import HomeLayout from "../components/HomeLayout";
import HeroCarousel from "../components/HeroCarousel";

function Home() {
  return (
    <HomeLayout>
      {/* Hero Section */}
      <div className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="md:flex md:items-center md:justify-between">
            <div className="md:w-1/2 text-center md:text-left mb-8 md:mb-0">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-white">
                Slaughterhouse Balayan
              </h1>
              <p className="mt-4 text-lg text-red-100">
                Discover the best services and products tailored for your needs.
              </p>
              <div className="mt-8">
                <a
                  href="#"
                  className="px-6 py-3 bg-white text-red-700 font-semibold rounded-lg shadow hover:bg-red-50 mr-4"
                >
                  Contact Us
                </a>
              </div>
            </div>
            <div className="md:w-1/2">
              <HeroCarousel />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-12">
            Facilities
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 border-t-4 border-red-600">
              <div className="mb-4">
                <img
                  src="src/assets/images/water-pump.png" // Replace with your image path
                  alt="Performance"
                  className="w-full h-60 object-cover rounded-md"
                />
              </div>
              <h3 className="text-xl font-semibold text-red-800 mb-2">
                Water Filtering
              </h3>
              <p className="text-gray-600">
                This filter the water used in the hog pen.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 border-t-4 border-red-600">
              <div className="mb-4">
                <img
                  src="src/assets/images/kural.png" // Replace with your image path
                  alt="Performance"
                  className="w-full h-60 object-cover rounded-md"
                />
              </div>
              <h3 className="text-xl font-semibold text-red-800 mb-2">
                Cleanliness
              </h3>
              <p className="text-gray-600">
                Ensure that the Facilities are clean and well-maintained.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 border-t-4 border-red-600">
              <div className="mb-4">
                <img
                  src="src/assets/images/front-slaughter-house-2.png" // Replace with your image path
                  alt="Performance"
                  className="w-full h-60 object-cover rounded-md"
                />
              </div>
              <h3 className="text-xl font-semibold text-red-800 mb-2">
                Location
              </h3>
              <p className="text-gray-600">
                Located far from the residential area to avoid noise and odor.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-red-700 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-red-100 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who have transformed their
            business with our platform.
          </p>
          <a
            href="#"
            className="inline-block px-6 py-3 bg-white text-red-700 font-semibold rounded-lg shadow hover:bg-red-50"
          >
            Sign Up Now
          </a>
        </div>
      </div>
    </HomeLayout>
  );
}

export default Home;
