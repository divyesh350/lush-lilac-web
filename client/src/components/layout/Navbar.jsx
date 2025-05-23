import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  RiSearchLine,
  RiFlowerLine,
  RiShoppingBagLine,
  RiUserLine,
  RiMenuLine,
  RiCloseLine,
  RiLogoutBoxLine,
} from "@remixicon/react";
import { useAuthStore } from "../../store/useAuthStore";

const Navbar = () => {
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  // Pull user and logout from store
  const { user, logout , isAuthenticated} = useAuthStore();
  console.log(isAuthenticated)
  const handleLogout = async () => {
    try {
      await logout();
      setProfileOpen(false);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
      // Optionally show toast notification here
    }
  };

  // Framer motion animation variants
  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeInOut",
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.3,
        ease: "easeOut",
      },
    }),
  };

  const dropdownVariants = {
    hidden: { opacity: 0, y: -10, pointerEvents: "none" },
    visible: {
      opacity: 1,
      y: 0,
      pointerEvents: "auto",
      transition: { duration: 0.2 },
    },
  };

  return (
    <motion.nav
      className="bg-white/90 backdrop-blur-sm sticky top-0 z-50 shadow-sm"
      initial="hidden"
      animate="visible"
      variants={navVariants}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="font-pacifico text-3xl text-primary">
              Lush Lilac
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              {["Home", "Shop", "New Arrivals", "About", "Contact"].map(
                (item, i) => (
                  <motion.div key={item} custom={i} variants={itemVariants}>
                    <NavLink
                      to={
                        item === "Home"
                          ? "/"
                          : item.toLowerCase().replace(" ", "-")
                      }
                      className={({ isActive }) =>
                        `text-primary hover:text-[#D4B6D0] px-3 py-2 text-sm font-medium ${
                          isActive ? "border-b-2 border-primary" : ""
                        }`
                      }
                    >
                      {item}
                    </NavLink>
                  </motion.div>
                )
              )}
            </div>
          </div>

          {/* Desktop search and icons */}
          <div className="flex items-center space-x-6 relative">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="cute-input py-2 pl-10 pr-4 rounded-full text-sm w-40 md:w-64"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 flex items-center justify-center text-primary">
                <RiSearchLine className="w-5 h-5" />
              </div>
            </div>

            {/* Icons */}
            <motion.div
              className="flower-wishlist w-8 h-8 flex items-center justify-center text-primary"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <RiFlowerLine className="w-6 h-6" />
            </motion.div>

            <Link to="/cart">
              <motion.div
                className="w-8 h-8 flex items-center justify-center text-primary"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <RiShoppingBagLine className="w-6 h-6" />
              </motion.div>
            </Link>

            {/* Profile Dropdown */}
            <div className="relative">
              <motion.button
                className="w-8 h-8 flex items-center justify-center text-primary focus:outline-none"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setProfileOpen(!profileOpen)}
                aria-label="Profile menu"
                tabIndex={0}
              >
                <RiUserLine className="w-6 h-6" />
              </motion.button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-3 z-50 border border-[#F9F0F7]"
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={dropdownVariants}
                  >
                    {isAuthenticated ? (
                      <>
                        <div className="px-6 py-2 text-primary font-medium cursor-default">
                          Hello, {user?.name || user?.email}
                        </div>
                        <Link
                          to="/profile"
                          className="block px-6 py-2 text-primary hover:bg-[#F9F0F7] hover:text-dark-purple transition text-center"
                          onClick={() => setProfileOpen(false)}
                        >
                          Profile
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-6 py-2 text-primary hover:bg-[#F9F0F7] hover:text-dark-purple transition"
                        >
                          <div className="flex items-center justify-center gap-2">
                            <RiLogoutBoxLine /> Logout
                          </div>
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/login"
                          className="block px-6 py-2 text-primary hover:bg-[#F9F0F7] hover:text-dark-purple transition rounded-t-lg text-center font-medium"
                          onClick={() => setProfileOpen(false)}
                        >
                          Login
                        </Link>
                        <Link
                          to="/register"
                          className="block px-6 py-2 text-primary hover:bg-[#F9F0F7] hover:text-dark-purple transition rounded-b-lg text-center font-medium"
                          onClick={() => setProfileOpen(false)}
                        >
                          Register
                        </Link>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="w-8 h-8 flex items-center justify-center text-primary"
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? (
                  <RiCloseLine className="w-6 h-6" />
                ) : (
                  <RiMenuLine className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="md:hidden bg-white border-t border-gray-100"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {["Home", "Shop", "New Arrivals", "About", "Contact"].map(
                (item) => (
                  <NavLink
                    key={item}
                    to={
                      item === "Home" ? "/" : item.toLowerCase().replace(" ", "-")
                    }
                    className={({ isActive }) =>
                      `block px-3 py-2 rounded-md text-base font-medium text-primary hover:text-[#D4B6D0] ${
                        isActive ? "bg-[#F9F0F7]" : ""
                      }`
                    }
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item}
                  </NavLink>
                )
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
