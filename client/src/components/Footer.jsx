const Footer = () => {
    return (
        <footer className="w-full text-white pt-10 pb-6 bg-[#1a1a1a]">

        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-3">RentalEstate</h2>
            <p className="text-sm text-gray-400">Find your dream home, PG, or rental property easily with RentalEstate.</p>
          </div>
  
          <div>
            <h2 className="text-xl font-semibold mb-3">Quick Links</h2>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="/" className="hover:text-red-400 transition">Home</a></li>
              <li><a href="/browse" className="hover:text-red-400 transition">Browse</a></li>
              <li><a href="/dashboard" className="hover:text-red-400 transition">Dashboard</a></li>
              <li><a href="/login" className="hover:text-red-400 transition">Login</a></li>
            </ul>
          </div>
  
          <div>
            <h2 className="text-xl font-semibold mb-3">Contact</h2>
            <p className="text-sm text-gray-400">
              📧 <a href="mailto:estaterental01@gmail.com" className="hover:text-red-400">estaterental01@gmail.com</a>
            </p>
            <p className="text-sm text-gray-400 mt-2">
              📱 <a href="https://wa.me/918950704348" target="_blank" rel="noopener noreferrer" className="hover:text-red-400">+91 89507 04348 (WhatsApp)</a>
            </p>
            <p className="text-sm text-gray-400 mt-2">📍 Chandigarh, India</p>
          </div>
        </div>
  
        <div className="text-center text-gray-500 text-xs mt-8 border-t border-gray-700 pt-4">
          &copy; {new Date().getFullYear()} GharDhoondo. All rights reserved.
        </div>
      </footer>
    );
  };
  
  export default Footer;