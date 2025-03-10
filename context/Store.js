// import { createContext, useContext, useState, useEffect } from 'react'
// import { createShopifyCheckout, updateShopifyCheckout, setLocalData, saveLocalData } from '@/utils/helpers'

// const CartContext = createContext()
// const AddToCartContext = createContext()
// const UpdateCartQuantityContext = createContext()

// export function useCartContext() {
//   return useContext(CartContext)
// }

// export function useAddToCartContext() {
//   return useContext(AddToCartContext)
// }

// export function useUpdateCartQuantityContext() {
//   return useContext(UpdateCartQuantityContext)
// }

// export function CartProvider({ children }) {
//   const [cart, setCart] = useState([])
//   const [checkoutId, setCheckoutId] = useState('')
//   const [checkoutUrl, setCheckoutUrl] = useState('')
//   const [isLoading, setisLoading] = useState(false)

//   useEffect(() => {
//     setLocalData(setCart, setCheckoutId, setCheckoutUrl)
//   }, [])

//   useEffect(() => {
//     // do this to make sure multiple tabs are always in sync
//     const onReceiveMessage = (e) => {
//       setLocalData(setCart, setCheckoutId, setCheckoutUrl)
//     }

//     window.addEventListener("storage", onReceiveMessage);
//     return () => {
//       window.removeEventListener("storage", onReceiveMessage);
//     }
//   }, [])

//   async function addToCart(newItem) {
//     setisLoading(true)
//     // empty cart
//     if (cart.length === 0) {
//       setCart([
//         ...cart,
//         newItem
//       ])

//       const response = await createShopifyCheckout(newItem)
//       setCheckoutId(response.id)
//       setCheckoutUrl(response.webUrl)
//       saveLocalData(newItem, response.id, response.webUrl)

//     } else {
//       let newCart = [...cart]
//       let itemAdded = false
//       // loop through all cart items to check if variant
//       // already exists and update quantity
//       newCart.map(item => {
//         if (item.variantId === newItem.variantId) {
//           item.variantQuantity += newItem.variantQuantity
//           itemAdded = true
//         }
//       })

//       let newCartWithItem = [...newCart]
//       if (itemAdded) {
//       } else {
//         // if its a new item than add it to the end
//         newCartWithItem = [...newCart, newItem]
//       }

//       setCart(newCartWithItem)
//       await updateShopifyCheckout(newCartWithItem, checkoutId)
//       saveLocalData(newCartWithItem, checkoutId, checkoutUrl)
//     }
//     setisLoading(false)
//   }

//   async function updateCartItemQuantity(id, quantity) {
//     setisLoading(true)
//     let newQuantity = Math.floor(quantity)
//     if (quantity === '') {
//       newQuantity = ''
//     }
//     let newCart = [...cart]
//     newCart.forEach(item => {
//       if (item.variantId === id) {
//         item.variantQuantity = newQuantity
//       }
//     })

//     // take out zeroes items
//     newCart = newCart.filter(i => i.variantQuantity !== 0)
//     setCart(newCart)

//     await updateShopifyCheckout(newCart, checkoutId)
//     saveLocalData(newCart, checkoutId, checkoutUrl)
//     setisLoading(false)
//   }

//   return (
//     <CartContext.Provider value={[cart, checkoutUrl, isLoading]}>
//       <AddToCartContext.Provider value={addToCart}>
//         <UpdateCartQuantityContext.Provider value={updateCartItemQuantity}>
//           {children}
//         </UpdateCartQuantityContext.Provider>
//       </AddToCartContext.Provider>
//     </CartContext.Provider>
//   )
// }
import { createContext, useContext, useState, useEffect } from 'react';
import { createShopifyCheckout, updateShopifyCheckout, setLocalData, saveLocalData } from '@/utils/helpers';

const CartContext = createContext();
const AddToCartContext = createContext();
const UpdateCartQuantityContext = createContext();
const ClearCartContext = createContext(); // Nuevo contexto para clearCart

export function useCartContext() {
  return useContext(CartContext);
}

export function useAddToCartContext() {
  return useContext(AddToCartContext);
}

export function useUpdateCartQuantityContext() {
  return useContext(UpdateCartQuantityContext);
}

export function useClearCartContext() {
  return useContext(ClearCartContext); // Hook para usar clearCart
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [checkoutId, setCheckoutId] = useState('');
  const [checkoutUrl, setCheckoutUrl] = useState('');
  const [isLoading, setisLoading] = useState(false);

  useEffect(() => {
    setLocalData(setCart, setCheckoutId, setCheckoutUrl);
  }, []);

  useEffect(() => {
    // do this to make sure multiple tabs are always in sync
    const onReceiveMessage = (e) => {
      setLocalData(setCart, setCheckoutId, setCheckoutUrl);
    };

    window.addEventListener('storage', onReceiveMessage);
    return () => {
      window.removeEventListener('storage', onReceiveMessage);
    };
  }, []);

  async function addToCart(newItem) {
    setisLoading(true);
    // empty cart
    if (cart.length === 0) {
      setCart([...cart, newItem]);

      const response = await createShopifyCheckout(newItem);
      setCheckoutId(response.id);
      setCheckoutUrl(response.webUrl);
      saveLocalData(newItem, response.id, response.webUrl);
    } else {
      let newCart = [...cart];
      let itemAdded = false;
      // loop through all cart items to check if variant
      // already exists and update quantity
      newCart.map((item) => {
        if (item.variantId === newItem.variantId) {
          item.variantQuantity += newItem.variantQuantity;
          itemAdded = true;
        }
      });

      let newCartWithItem = [...newCart];
      if (itemAdded) {
      } else {
        // if its a new item than add it to the end
        newCartWithItem = [...newCart, newItem];
      }

      setCart(newCartWithItem);
      await updateShopifyCheckout(newCartWithItem, checkoutId);
      saveLocalData(newCartWithItem, checkoutId, checkoutUrl);
    }
    setisLoading(false);
  }

  async function updateCartItemQuantity(id, quantity) {
    setisLoading(true);
    let newQuantity = Math.floor(quantity);
    if (quantity === '') {
      newQuantity = '';
    }
    let newCart = [...cart];
    newCart.forEach((item) => {
      if (item.variantId === id) {
        item.variantQuantity = newQuantity;
      }
    });

    // take out zeroes items
    newCart = newCart.filter((i) => i.variantQuantity !== 0);
    setCart(newCart);

    await updateShopifyCheckout(newCart, checkoutId);
    saveLocalData(newCart, checkoutId, checkoutUrl);
    setisLoading(false);
  }

  // Función para vaciar el carrito
  function clearCart() {
    setCart([]); // Vacía el carrito
    setCheckoutId(''); // Reinicia el checkoutId
    setCheckoutUrl(''); // Reinicia el checkoutUrl
    saveLocalData([], '', ''); // Guarda los cambios en el almacenamiento local
  }

  return (
    <CartContext.Provider value={[cart, checkoutUrl, isLoading]}>
      <AddToCartContext.Provider value={addToCart}>
        <UpdateCartQuantityContext.Provider value={updateCartItemQuantity}>
          <ClearCartContext.Provider value={clearCart}> {/* Provee clearCart */}
            {children}
          </ClearCartContext.Provider>
        </UpdateCartQuantityContext.Provider>
      </AddToCartContext.Provider>
    </CartContext.Provider>
  );
}