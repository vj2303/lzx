"use client"

import React, { useEffect, useRef, useState } from 'react'
import { Provider, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import store from '../../../../../../../redux/store';
import { applyOffer } from '../../../../../../../redux/cartSlice';
import Confetti from 'react-confetti';

const OfferCard = ({ offer }) => {
  const divRef = useRef(null);
  const [divHeight, setDivHeight] = useState(0);
  const dispatch = useDispatch();
  const router = useRouter();
  const [isOfferApplied, setIsOfferApplied] = useState(false); // State to track offer application
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight }); // State for confetti size



  useEffect(() => {
    if (divRef.current) {
      // Update the height whenever the component renders
      setDivHeight(divRef.current.offsetHeight);
    }
  }, []);

  const handleApplyOffer = () => {
    dispatch(applyOffer(offer)); // Dispatch the complete offer
    setIsOfferApplied(true); // Trigger confetti animation
  
    // Redirect to the cart page after a short delay
    setTimeout(() => {
      router.push(`/partner-details/${offer.partnerId}/service-details/${offer.serviceId}/cart`);
    }, 2000); // Slight delay to ensure the confetti is visible before the redirect
  };
  

  return (
    <Provider store={store}>
       {isOfferApplied && (
        <Confetti
          width={windowSize.width}  // Ensure confetti takes up full screen width
          height={windowSize.height} // Ensure confetti takes up full screen height
          numberOfPieces={300} // Number of confetti pieces (adjust as needed)
          recycle={false} // Confetti should not repeat once completed
          gravity={0.2} // Adjust gravity for confetti fall speed
          run={isOfferApplied} // Ensure confetti only runs when offer is applied
          key={isOfferApplied ? 'confetti' : ''} // Add a key to force re-render
        />
      )}
      <div className='border p-2 m-2 rounded-r-xl ml-[50px] relative' ref={divRef}>
        <p className='-rotate-90 absolute top-[70px] left-[-110px] font-bold text-white bg-blue-300 w-full border-black text-center py-2' style={{ width: `${divHeight}px` }}>{offer.code}</p>
        <div className='flex justify-between'>
          <div>
            <h1 className='font-semibold'>{offer.title}</h1>
            {/* <p className='text-[14px] text-green-600 font-bold'>20% Discount + 10% cashback</p> */}
          </div>
          <div className='font-bold cursor-pointer text-blue-400' onClick={handleApplyOffer}>
            APPLY
          </div>
        </div>

        <p className='text-[12px]'>
          {offer.luzo_offers_validities.length === 7 ? "Valid on all days" : <>
            {"Valid on " +
              offer.luzo_offers_validities.map((ele, i) => " " + (i === (offer.luzo_offers_validities.length - 1) ? "and " : "") + ele.working_day)
            }
          </>}
        </p>
        <p className='text-[14px]'>{offer.description}</p>
        <p className='border-b border-blue-400 text-blue-400 text-[12px] font-semibold max-w-[12%] flex-1 items-start text-left'>T&C +</p>
      </div>
    </Provider>
  )
}

export default OfferCard;
