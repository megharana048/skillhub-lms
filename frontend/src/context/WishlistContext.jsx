import {
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";

const WishlistContext = createContext(null);

function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState(() => {
    try {
      const savedWishlist = localStorage.getItem(
        "skillhub_wishlist",
      );

      return savedWishlist
        ? JSON.parse(savedWishlist)
        : [];
    } catch {
      return [];
    }
  });

  function saveWishlist(updatedWishlist) {
    setWishlist(updatedWishlist);

    localStorage.setItem(
      "skillhub_wishlist",
      JSON.stringify(updatedWishlist),
    );
  }

  function toggleWishlist(course) {
    const alreadySaved = wishlist.some(
      (item) => item._id === course._id,
    );

    if (alreadySaved) {
      const updatedWishlist = wishlist.filter(
        (item) => item._id !== course._id,
      );

      saveWishlist(updatedWishlist);

      return false;
    }

    saveWishlist([...wishlist, course]);

    return true;
  }

  function removeFromWishlist(courseId) {
    const updatedWishlist = wishlist.filter(
      (item) => item._id !== courseId,
    );

    saveWishlist(updatedWishlist);
  }

  function isWishlisted(courseId) {
    return wishlist.some(
      (item) => item._id === courseId,
    );
  }

  const wishlistValue = useMemo(
    () => ({
      wishlist,
      toggleWishlist,
      removeFromWishlist,
      isWishlisted,
    }),
    [wishlist],
  );

  return (
    <WishlistContext.Provider value={wishlistValue}>
      {children}
    </WishlistContext.Provider>
  );
}

function useWishlist() {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error(
      "useWishlist must be used inside WishlistProvider.",
    );
  }

  return context;
}

export {
  WishlistProvider,
  useWishlist,
};