// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faArrowRight } from '@fortawesome/free-solid-svg-icons'

// function CheckOutButton({ webUrl }) {
//   return (
//     <a
//       href={webUrl}
//       aria-label="checkout-products"
//       className="bg-palette-primary text-white text-lg font-primary font-semibold pt-2 pb-1 leading-relaxed flex 
//       justify-center items-center focus:ring-1 focus:ring-palette-light focus:outline-none w-full hover:bg-palette-dark rounded-sm"
//     >
//       Check Out
//       <FontAwesomeIcon icon={faArrowRight} className="w-4 ml-2 inline-flex" />
//     </a>
//   )
// }

// export default CheckOutButton

const BASE_URL = `${process.env.NEXT_PUBLIC_DB}/orders`;
const API_KEY = process.env.NEXT_PUBLIC_SECRET_KEY

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router'; // Para redireccionar en Next.js
import { useClearCartContext } from '@/context/Store';

function CheckOutButton({ customerEmail, items, shippingAddress }) {
  const router = useRouter(); // Hook de Next.js para redireccionar
  const clearCart = useClearCartContext();
  
  const handleCheckout = async () => {

    const transformedItems = items.map((item) => ({
      handle: item.productHandle,
      variant_id: item.variantId,
      variant_title: item.variantTitle,
      quantity: item.variantQuantity,
      price: item.variantPrice,
    }));


    const payload = {
      customer_email: customerEmail,
      items: transformedItems,
      shipping_address: shippingAddress,
    };
    console.log('payload', payload)
    try {
      const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': API_KEY,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const data = await response.json();

      console.log('data', data)

      // Mostrar toast de éxito
      toast.success('Order created successfully!', {
        position: "top-right",
        autoClose: 6000, // Cierra el toast después de 3 segundos
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Vacía el carrito
      clearCart();

      // Redirigir a la página de inicio después de 3 segundos
      setTimeout(() => {
        router.push('/'); // Redirige a la página de inicio
      }, 3000);

    } catch (error) {
      console.error('Error:', error);

      // Mostrar toast de error
      toast.error('Failed to create order. Please try again.', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  return (
    <>
      <button
        onClick={handleCheckout}
        aria-label="checkout-products"
        className="bg-palette-primary text-white text-lg font-primary font-semibold pt-2 pb-1 leading-relaxed flex 
        justify-center items-center focus:ring-1 focus:ring-palette-light focus:outline-none w-full hover:bg-palette-dark rounded-sm"
      >
        Check Out
        <FontAwesomeIcon icon={faArrowRight} className="w-4 ml-2 inline-flex" />
      </button>

      {/* Contenedor de toasts */}
      <ToastContainer />
    </>
  );
}

export default CheckOutButton;