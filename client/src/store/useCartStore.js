import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "../api/axios";
import { loadScript } from "../utils/loadScript";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

const useCartStore = create(
  persist(
    (set, get) => ({
      // State
      items: [],
      loading: false,
      error: null,
      paymentProcessing: false,
      userOrders: [],
      ordersLoading: false,
      ordersError: null,

      // Computed
      getTotalItems: () =>
        get().items.reduce((total, item) => total + item.quantity, 0),
      getTotalAmount: () =>
        get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        ),

      // COD availability check
      isCodAvailable: () =>
        get().items.every(
          (item) => item.productSnapshot?.codAvailable !== false
        ),

      // Cart Actions
      addToCart: (product, variant, quantity = 1) => {
        const { items } = get();

        const existingItemIndex = items.findIndex(
          (item) =>
            item.productId === product._id &&
            JSON.stringify(item.variant) === JSON.stringify(variant)
        );

        if (existingItemIndex > -1) {
          set((state) => ({
            items: state.items.map((item, idx) =>
              idx === existingItemIndex
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          }));
        } else {
          const snapshot = {
            title: product.title,
            thumbnailUrl:
              product.media.find((m) => m.type === "image")?.url || "",
            basePrice: product.basePrice,
            codAvailable: product.codAvailable,
          };

          set((state) => ({
            items: [
              ...state.items,
              {
                productId: product._id,
                variant,
                quantity,
                price: product.basePrice + (variant?.price ?? 0),
                productSnapshot: snapshot,
              },
            ],
          }));
        }
      },

      removeFromCart: (productId, variant) => {
        set((state) => ({
          items: state.items.filter(
            (item) =>
              !(
                item.productId === productId &&
                JSON.stringify(item.variant) === JSON.stringify(variant)
              )
          ),
        }));
      },

      updateQuantity: (productId, variant, quantity) => {
        if (quantity < 1) return;
        set((state) => ({
          items: state.items.map((item) =>
            item.productId === productId &&
            JSON.stringify(item.variant) === JSON.stringify(variant)
              ? { ...item, quantity }
              : item
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      // Order Actions
      fetchUserOrders: async () => {
        set({ ordersLoading: true, ordersError: null });
        const { isAuthenticated, user } = useAuthStore.getState();

        if (!isAuthenticated || !user) {
          set({ ordersLoading: false, ordersError: 'Please login to view your orders.' });
          return;
        }

        try {
          const response = await api.get('/orders/my');
          set({ userOrders: response.data, ordersLoading: false });
        } catch (err) {
          const errMsg = err.response?.data?.message || err.message || 'Failed to fetch orders.';
          set({ ordersError: errMsg, ordersLoading: false });
          toast.error(errMsg);
        }
      },

      fetchOrderById: async (orderId) => {
        set({ ordersLoading: true, ordersError: null });
        const { isAuthenticated, user } = useAuthStore.getState();

        if (!isAuthenticated || !user) {
          set({ ordersLoading: false, ordersError: "Please login to view orders." });
          throw new Error("Please login to view orders.");
        }

        try {
          const response = await api.get(`/orders/${orderId}`);
          set({ ordersLoading: false });
          return response.data;
        } catch (err) {
          const errMsg = err.response?.data?.message || err.message || "Failed to fetch order details.";
          set({ ordersError: errMsg, ordersLoading: false });
          toast.error(errMsg);
          throw new Error(errMsg);
        }
      },

      // Razorpay Checkout
      initiateCheckout: async (shippingAddress) => {
        try {
          set({ loading: true, error: null });
          const { items } = get();
          const { isAuthenticated, accessToken, user } =
            useAuthStore.getState();

          if (!isAuthenticated || !accessToken)
            throw new Error("Please login to proceed with checkout");
          if (user?.role !== "customer")
            throw new Error("Only customers can place orders");
          if (items.length === 0) throw new Error("Cart is empty");

          const res = await api.post("/orders/razorpay-order", {
            amount: get().getTotalAmount(),
            currency: "INR",
          });

          return res.data;
        } catch (error) {
          const msg =
            error.response?.data?.message ||
            error.message ||
            "Failed to initiate checkout";
          set({ error: msg, loading: false });
          toast.error(msg);
          throw error;
        }
      },

      processPayment: async (
        orderId,
        paymentId,
        signature,
        shippingAddress,
        method
      ) => {
        console.log(method);
        try {
          set({ paymentProcessing: true, error: null });
          const { items } = get();
          const { isAuthenticated, accessToken, user } =
            useAuthStore.getState();

          if (!isAuthenticated || !accessToken)
            throw new Error("Please login to proceed");
          if (user?.role !== "customer")
            throw new Error("Only customers can place orders");

          const res = await api.post("/orders", {
            razorpay_order_id: orderId,
            razorpay_payment_id: paymentId,
            razorpay_signature: signature,
            items,
            totalAmount: get().getTotalAmount(),
            paymentInfo: {
              paymentId,
              orderId,
              signature,
            },
            shippingAddress,
            paymentMethod: method,
          });
          if(res.data.success){
            set({items:[]})
          }
          // Return success status and message, don't clear cart or show toast yet
          return res.data;

        } catch (error) {
          // Just re-throw the error, handle toast and state in processOrder
          throw error;
        }
      },

      initializeRazorpay: async () => {
        try {
          const loaded = await loadScript(
            "https://checkout.razorpay.com/v1/checkout.js"
          );
          if (!loaded) throw new Error("Razorpay SDK failed to load");
          return true;
        } catch (err) {
          // Handle toast and state in processOrder or calling function
          throw err;
        }
      },

      createRazorpayOrder: async (shippingAddress, method) => {
        try {
          // State handling and toast moved to processOrder
          const isLoaded = await get().initializeRazorpay();
          if (!isLoaded) throw new Error("Razorpay SDK not loaded");

          const orderData = await get().initiateCheckout({ shippingAddress, paymentMethod: method });
          if (!orderData?.id)
            throw new Error("Failed to create Razorpay order");

          const { user } = useAuthStore.getState();

          // Return the options for the Razorpay modal. The modal handler will call processPayment.
          return {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: orderData.amount,
            currency: orderData.currency,
            name: "Lush Lilac",
            description: "Your Order Payment",
            order_id: orderData.id,
            handler: async (res) => {
              if (
                !res.razorpay_payment_id ||
                !res.razorpay_order_id ||
                !res.razorpay_signature
              ) {
                // This error will be caught by the try...catch in createRazorpayOrder
                throw new Error("Invalid payment response");
              }
              // Process the payment and return the result (handled by processOrder)
              return await get().processPayment(
                res.razorpay_order_id,
                res.razorpay_payment_id,
                res.razorpay_signature,
                shippingAddress,
                method
              );
            },
            prefill: {
              name: user?.name || "xyz",
              email: user?.email || "xyz@xyz.com",
              contact: user?.phone || "9999999999",
            },
            theme: { color: "#8B5CF6" },
            modal: {
              ondismiss: () => {
                // Handle cancellation in the calling component (Cart.jsx)
                console.log("Payment cancelled by user");
                // We don't throw here to avoid unhandled promise rejection,
                // the calling component needs to handle the modal dismissal.
              },
            },
          };

        } catch (error) {
          // Just re-throw the error, handle toast and state in processOrder
          throw error;
        }
      },

      // COD Order
      createCodOrder: async (shippingAddress, method) => {
        try {
          // State handling and toast moved to processOrder
          const { isAuthenticated, accessToken, user } =
            useAuthStore.getState();
          if (!isAuthenticated || !accessToken)
            throw new Error("Please login to proceed");
          if (user?.role !== "customer")
            throw new Error("Only customers can place orders");
          if (!get().isCodAvailable())
            throw new Error("Some items do not support COD");

          const res = await api.post("/orders/cod", {
            items: get().items,
            user: user._id,
            totalAmount: get().getTotalAmount(),
            shippingAddress,
            paymentMethod: method,
          });

          // Return success status and message, don't clear cart or show toast yet
          return res.data;
        } catch (error) {
          // Just re-throw the error, handle toast and state in processOrder
          throw error;
        }
      },

      processOrder: async (shippingAddress, method) => {
        set({ loading: true, error: null });
        return new Promise(async (resolve, reject) => {
          try {
            const { isAuthenticated, accessToken, user } =
              useAuthStore.getState();

            if (!isAuthenticated || !accessToken)
              throw new Error("Please login to proceed");
            if (user?.role !== "customer")
              throw new Error("Only customers can place orders");

            if (method === "cod") {
              try {
                const res = await get().createCodOrder(shippingAddress, method);
                resolve(res);
              } catch (error) {
                reject(error);
              }
            } else { // Razorpay
                try {
                    const options = await get().createRazorpayOrder(shippingAddress, method);
                    options.handler = async (res) => {
                        try {
                            const paymentRes = await get().processPayment(
                                res.razorpay_order_id,
                                res.razorpay_payment_id,
                                res.razorpay_signature,
                                shippingAddress,
                                method
                            );
                            resolve(paymentRes);
                        } catch (error) {
                            reject(error);
                        }
                    };
                    options.modal.ondismiss = () => {
                         toast.error("Payment cancelled");
                         reject(new Error("Payment cancelled"));
                    };
                    const rzp1 = new window.Razorpay(options);
                    rzp1.open();
                    
                } catch (error) {
                    const msg = error.response?.data?.message || error.message || "Checkout initiation failed";
                    set({ error: msg, loading: false, paymentProcessing: false });
                    toast.error(msg);
                    reject(error);
                }
            }
            set({ loading: false, error: null })
          } catch (error) {
            // Catch initial sync errors before the Promise is fully set up
            set({ error: error.message, loading: false, paymentProcessing: false });
            toast.error(error.message);
            reject(error); // Reject the promise if an error occurs early
          }
        });
      },

      // Reset loading state in case of errors caught outside the promise
      setError: (msg) => {
        set({ error: msg, loading: false, paymentProcessing: false });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "cart-storage",
      partialize: (state) => ({
        items: state.items,
      }),
    }
  )
);

export default useCartStore;
