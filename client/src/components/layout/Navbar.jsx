import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Badge, styled } from '@mui/material';
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
import useWishlistStore from "../../store/useWishlistStore";

// Styled Badge component
const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -3,
    top: 3,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
    backgroundColor: '#D4B6D0',
    color: '#fff',
    fontSize: '0.75rem',
    minWidth: '20px',
    height: '20px',
    borderRadius: '10px',
  },
}));

const Navbar = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Pull user and logout from store
  const { user, logout, isAuthenticated } = useAuthStore();
  const { wishlist } = useWishlistStore();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuOpen && !event.target.closest('.mobile-menu')) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [mobileMenuOpen]);

  const handleLogout = async () => {
    try {
      await logout();
      setProfileOpen(false);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
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

  const mobileMenuVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  return (
    <motion.nav
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/90 backdrop-blur-sm shadow-md" : "bg-white"
      }`}
      initial="hidden"
      animate="visible"
      variants={navVariants}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="font-pacifico text-2xl sm:text-2xl md:text-3xl text-primary">
              Lush Lilac
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden lg:block">
            <div className="ml-10 flex items-center space-x-6 xl:space-x-8">
              {["Home", "Shop", "About", "Contact"].map(
                (item, i) => (
                  <motion.div key={item} custom={i} variants={itemVariants}>
                    <NavLink
                      to={item === "Home" ? "/" : item.toLowerCase().replace(" ", "-")}
                      className={({ isActive }) =>
                        `text-primary hover:text-[#D4B6D0] px-2 xl:px-3 py-2 text-sm xl:text-base font-medium transition-colors duration-200 ${
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
          <div className="flex items-center space-x-3 sm:space-x-4 lg:space-x-6">
            {/* Search - Hidden on mobile */}
            <div className="hidden sm:block relative">
              <input
                type="text"
                placeholder="Search..."
                className="cute-input py-2 pl-10 pr-4 rounded-full text-sm w-32 sm:w-40 md:w-48 lg:w-56 xl:w-64 transition-all duration-300 focus:w-40 sm:focus:w-48 md:focus:w-56 lg:focus:w-64 xl:focus:w-72"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 flex items-center justify-center text-primary">
                <RiSearchLine className="w-5 h-5" />
              </div>
            </div>

            {/* Icons */}
            <Link to="/wishlist">
              <motion.div
                className="flower-wishlist w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-primary"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <StyledBadge badgeContent={wishlist.length} showZero>
                  <RiFlowerLine className="w-5 h-5 sm:w-6 sm:h-6" />
                </StyledBadge>
              </motion.div>
            </Link>

            <Link to="/cart">
              <motion.div
                className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-primary"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <RiShoppingBagLine className="w-5 h-5 sm:w-6 sm:h-6" />
              </motion.div>
            </Link>

            {/* Profile Dropdown */}
            <div className="relative">
              <motion.button
                className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-primary focus:outline-none"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setProfileOpen(!profileOpen)}
                aria-label="Profile menu"
                tabIndex={0}
              >
                <RiUserLine className="w-5 h-5 sm:w-6 sm:h-6" />
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
            <div className="lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-primary"
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? (
                  <RiCloseLine className="w-5 h-5 sm:w-6 sm:h-6" />
                ) : (
                  <RiMenuLine className="w-5 h-5 sm:w-6 sm:h-6" />
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
            className="lg:hidden bg-white border-t border-gray-100 mobile-menu"
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="px-4 py-3 space-y-3">
              {/* Mobile Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="cute-input w-full py-2 pl-10 pr-4 rounded-full text-sm"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 flex items-center justify-center text-primary">
                  <RiSearchLine className="w-5 h-5" />
                </div>
              </div>

              {/* Mobile Navigation Links */}
              {["Home", "Shop", "About", "Contact"].map(
                (item) => (
                  <NavLink
                    key={item}
                    to={item === "Home" ? "/" : item.toLowerCase().replace(" ", "-")}
                    className={({ isActive }) =>
                      `block px-3 py-2 rounded-md text-base font-medium text-primary hover:text-[#D4B6D0] transition-colors duration-200 ${
                        isActive ? "bg-[#F9F0F7]" : ""
                      }`
                    }
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item}
                  </NavLink>
                )
              )}

              {/* Mobile Auth Links */}
              {!isAuthenticated && (
                <div className="pt-2 space-y-2">
                  <Link
                    to="/login"
                    className="block w-full px-3 py-2 text-center rounded-md text-base font-medium text-primary bg-[#F9F0F7] hover:bg-[#D4B6D0] transition-colors duration-200"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block w-full px-3 py-2 text-center rounded-md text-base font-medium text-white bg-primary hover:bg-[#D4B6D0] transition-colors duration-200"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
