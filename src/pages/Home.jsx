import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="bg-white text-gray-800">
      {/* 🔹 Notification Bar */}
      <div className="text-sm bg-emerald-50 text-center py-2 px-4 text-emerald-700">
        🎉 Launching soon: Find and hire freelancers you can trust!
      </div>

      {/* 🔹 Header/Navbar */}
      <header className="flex justify-between items-center px-6 py-4 border-b">
        <h1 className="text-2xl font-bold text-emerald-600">WorkWithTrust</h1>
        <nav className="space-x-6">
          <Link to="/login" className="text-gray-600 hover:text-emerald-600">Login</Link>
          <Link
            to="/register"
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded"
          >
            Join
          </Link>
        </nav>
      </header>

      {/* 🔹 Hero Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 items-center px-6 py-20 bg-gradient-to-br from-emerald-50 to-white">
        <div>
          <h2 className="text-4xl font-bold leading-tight mb-4">
            Hire Top Talent <br />
            <span className="text-emerald-600">Build with Confidence</span>
          </h2>
          <p className="text-gray-600 mb-6">
            WorkWithTrust connects you to skilled freelancers in tech, design, and content.
          </p>
         
        </div>
        <div className="flex justify-center">
    <img
      src="Freelancer-bro.svg"
      alt="Freelancer illustration"
      className="w-[90%] max-w-[400px]"
    />
  </div>
      </section>

      {/* 🔹 Categories Filter */}
      <section className="px-6 py-10">
        <h3 className="text-2xl font-bold mb-4">Popular Categories</h3>
        <div className="flex flex-wrap gap-4">
          {[
            "Web Development",
            "Design",
            "Writing",
            "Marketing",
            "Finance",
            "AI Services"
          ].map((cat) => (
            <span
              key={cat}
              className="px-4 py-2 rounded-full border border-emerald-300 text-emerald-700 hover:bg-emerald-100 cursor-pointer text-sm"
            >
              {cat}
            </span>
          ))}
        </div>
      </section>

      {/* 🔹 Featured Freelancers (Empty State) */}
      <section className="px-6 py-20 bg-gray-50 text-center">
  <h3 className="text-2xl font-bold mb-4">Featured Freelancers</h3>
  <p className="text-gray-500 mb-6">
    No freelancers featured yet. Be the first to explore top-rated talent!
  </p>
  <img
    src="home-bg2.jpg"
    alt="No Freelancers yet"
    className="mx-auto w-full max-w-md mb-6 rounded-full"
  />

</section>
{/* 🔹 Call to Action: Become a Freelancer */}
<section className="px-6 py-20 bg-gradient-to-b from-white to-emerald-50 text-center">
  <div className="max-w-3xl mx-auto">
    <div className="flex justify-center mb-6">
      <div className="w-40 h-40 rounded-full bg-emerald-100 flex items-center justify-center shadow-inner">
        <img
          src="freelancer-icon.svg"
          alt="Freelancer Icon"
          className="w-28 h-30"
        />
      </div>
    </div>

    <h2 className="text-3xl font-bold text-emerald-700 mb-3">Are You a Freelancer?</h2>
    <p className="text-gray-700 mb-6">
      Join our platform and start offering your skills to clients across the world. Whether you're a developer, designer, writer, or marketer — there's a place for you here.
    </p>

    <Link
      to="/register"
      className="inline-block bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-full text-lg shadow transition"
    >
      Start Freelancing
    </Link>
  </div>
</section>



      {/* 🔹 Why WorkWithTrust? */}
      <section className="px-6 py-20">
        <h3 className="text-2xl font-bold text-center mb-10">Why WorkWithTrust?</h3>
        <div className="grid md:grid-cols-3 gap-6 text-center">
          <div className="p-6 rounded-lg border shadow-sm">
            <h4 className="text-lg font-semibold mb-2">Verified Talent</h4>
            <p className="text-gray-600">Only trusted and rated freelancers get featured.</p>
          </div>
          <div className="p-6 rounded-lg border shadow-sm">
            <h4 className="text-lg font-semibold mb-2">Secure Payments</h4>
            <p className="text-gray-600">We protect your payments until work is approved.</p>
          </div>
          <div className="p-6 rounded-lg border shadow-sm">
            <h4 className="text-lg font-semibold mb-2">24/7 Support</h4>
            <p className="text-gray-600">Always available to resolve issues or disputes.</p>
          </div>
        </div>
      </section>

      {/* 🔹 Footer */}
      <footer className="text-center py-6 text-sm text-gray-500 border-t">
        &copy; {new Date().getFullYear()} WorkWithTrust. All rights reserved.
        
      </footer>
    </div>
  );
};

export default Home;



































/*import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="bg-white text-gray-800">
      /* 🔹 Top Navbar 
      <div className="text-sm bg-emerald-50 text-center py-2 px-4 text-emerald-700">
        🚀 New here? Get started and hire your first freelancer with confidence.
      </div>

      /* 🔹 Header 
      <header className="flex justify-between items-center px-6 py-4 border-b">
        <h1 className="text-2xl font-bold text-emerald-600">WorkWithTrust</h1>
        <nav className="space-x-6">
          <Link to="/login" className="text-gray-600 hover:text-emerald-600">
            Login
          </Link>
          <Link
            to="/register"
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded"
          >
            Join
          </Link>
        </nav>
      </header>

      {/* 🔹 Hero Section 
      <section className="grid grid-cols-1 md:grid-cols-2 items-center px-6 py-16 bg-emerald-50">
        <div>
          <h2 className="text-4xl font-bold leading-tight mb-4">
            Hire Top Talent from Anywhere <br />
            <span className="text-emerald-600">Build with Confidence.</span>
          </h2>
          <p className="text-gray-600 mb-6">
            WorkWithTrust connects you to skilled freelancers in tech, design,
            and content. Simple hiring, secure payments.
          </p>
          <Link
            to="/create-gig"
            className="bg-emerald-500 text-white px-6 py-3 rounded shadow hover:bg-emerald-600"
          >
            Post a Gig
          </Link>
        </div>
        <div>
          <img
            src="home-bg.jpg"
            alt="Hero"
            className="w-full"
          />
        </div>
      </section>

      {/* 🔹 Categories Filter 
      <section className="px-6 py-10">
        <h3 className="text-2xl font-bold mb-4">Popular Categories</h3>
        <div className="flex flex-wrap gap-4">
          {["Web Development", "Design", "Writing", "Marketing", "Finance", "AI Services"].map(
            (cat) => (
              <span
                key={cat}
                className="px-4 py-2 rounded-full border border-emerald-300 text-emerald-700 hover:bg-emerald-100 cursor-pointer text-sm"
              >
                {cat}
              </span>
            )
          )}
        </div>
      </section>

      {/* 🔹 Freelancers/Gig Cards
      <section className="px-6 py-10 bg-gray-50">
        <h3 className="text-2xl font-bold mb-6">Featured Freelancers</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((id) => (
            <div
              key={id}
              className="bg-white p-6 rounded-xl shadow hover:shadow-md transition"
            >
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={`https://randomuser.me/api/portraits/men/${id + 20}.jpg`}
                  alt="freelancer"
                  className="w-14 h-14 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-bold text-lg">John Doe</h4>
                  <p className="text-sm text-gray-500">Full Stack Developer</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                "I build high-performance websites and web apps using MERN stack."
              </p>
              <div className="flex justify-between items-center">
                <span className="text-emerald-600 font-semibold">$40/hr</span>
                <button className="text-sm text-emerald-600 hover:underline">
                  View Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 🔹 Call to Action 
      <section className="text-center px-6 py-16 bg-emerald-100">
        <h3 className="text-2xl font-bold mb-4">Ready to Hire or Get Hired?</h3>
        <p className="text-gray-700 mb-6">
          Join WorkWithTrust and connect with reliable talent or find your next freelance job.
        </p>
        <Link
          to="/register"
          className="bg-emerald-600 text-white px-6 py-3 rounded hover:bg-emerald-700"
        >
          Join Now
        </Link>
      </section>

      {/* 🔹 Footer 
      <footer className="text-center py-6 text-sm text-gray-500 border-t">
        &copy; {new Date().getFullYear()} WorkWithTrust. All rights reserved.
        
      </footer>
    </div>
  );
};

export default Home;*/
































/*import { Link } from 'react-router-dom';

const Home = () => {
  return (
    
    <div className="min-h-screen bg-white text-gray-900">

      
      <nav className="flex items-center justify-between px-10 py-4 shadow-md">
        <h1 className="text-2xl font-bold text-emerald-600">WorkWithTrust</h1>
        <div className="space-x-6">
          <Link to="/login" className="text-gray-700 hover:text-emerald-600">Login</Link>
          <Link to="/register" className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded">
            Join
          </Link>
        </div>
      </nav>

   
      <section className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center px-10 py-20 bg-gradient-to-br from-emerald-50 to-white">
        <div>
          <h2 className="text-4xl font-bold leading-tight mb-4">
            Find the perfect <span className="text-emerald-600">freelancer</span> for your business
          </h2>
          <p className="text-gray-600 mb-6">
            WorkWithTrust helps clients connect with top-rated freelance talent across the globe. Hire smart, work efficiently.
          </p>
          <Link
            to="/create-gig"
            className="inline-block bg-emerald-500 text-white px-6 py-3 rounded shadow hover:bg-emerald-600"
          >
            Post a Gig
          </Link>
        </div>
        <div>
          <img
            src="https://cdni.iconscout.com/illustration/premium/thumb/freelancer-working-remotely-7483572-6106411.png"
            alt="Freelance Hero"
            className="w-full"
          />
        </div>
      </section>

      <section className="py-16 px-10 bg-gray-50">
        <h3 className="text-2xl font-bold text-center mb-10">Popular Categories</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {['Web Development', 'Design', 'Writing', 'Marketing'].map((cat) => (
            <div key={cat} className="bg-white shadow p-6 rounded-lg hover:shadow-md">
              <p className="font-semibold text-emerald-600">{cat}</p>
            </div>
          ))}
        </div>
        

      </section>

     
      <section className="px-10 py-16">
        <h3 className="text-2xl font-bold text-center mb-10">Why WorkWithTrust?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="p-6 rounded-lg border shadow-sm">
            <h4 className="text-lg font-semibold mb-2">Trusted Talent</h4>
            <p className="text-gray-600">We connect you with verified and reviewed freelancers.</p>
          </div>
          <div className="p-6 rounded-lg border shadow-sm">
            <h4 className="text-lg font-semibold mb-2">Secure Payments</h4>
            <p className="text-gray-600">Only pay for work you're 100% satisfied with.</p>
          </div>
          <div className="p-6 rounded-lg border shadow-sm">
            <h4 className="text-lg font-semibold mb-2">24/7 Support</h4>
            <p className="text-gray-600">Our team is always here to help you out.</p>
          </div>
        </div>
      </section>

    
      <footer className="text-center py-6 text-sm text-gray-500 border-t">
        &copy; {new Date().getFullYear()} WorkWithTrust. All rights reserved.
      </footer>
      
    </div>
    
  );
};

export default Home;
*/













/*
const Home = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden w-full max-w-4xl grid grid-cols-1 md:grid-cols-2">

        <div className="bg-gradient-to-br from-green-100 to-emerald-300 flex flex-col justify-center items-center p-6 relative">
          <h1 className="text-3xl font-bold text-white absolute top-6 left-6">WELCOME</h1>
          <img
            src="/home-bg.jpg"
            alt="Welcome Illustration"
            className="w-4/5"
          />
        </div>

        
        <div className="p-10 flex flex-col justify-center items-center bg-emerald-50">
          <h2 className="text-3xl font-bold text-emerald-700 mb-2">👋 Hello!</h2>
          <p className="text-center text-gray-700 mb-6">
            Welcome to <span className="font-semibold">WorkWithTrust</span> — your trusted freelance marketplace.
          </p>

          <a
            href="/login"
            className="bg-emerald-500 hover:bg-emerald-600 text-white py-2 px-6 rounded-full shadow-md transition-all duration-300"
          >
            Get Started
          </a>
        </div>

      </div>
    </div>
  );
};

export default Home;
*/